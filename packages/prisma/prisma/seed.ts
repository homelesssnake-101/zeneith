// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function randomIndianNumber(): string {
  // realistic 10-digit Indian mobile starting with 6-9
  const first = String(Math.floor(Math.random() * 4) + 6); // 6..9
  let rest = "";
  for (let i = 0; i < 9; i++) rest += Math.floor(Math.random() * 10).toString();
  return first + rest;
}

async function generateUniqueNumbers(count: number) {
  const set = new Set<string>();
  while (set.size < count) {
    set.add(randomIndianNumber());
  }
  return Array.from(set);
}

async function main() {
  console.log("Seeding DB...");

  await prisma.p2PTransaction.deleteMany({});
  await prisma.onRampTransaction.deleteMany({});
  await prisma.balance.deleteMany({});
  await prisma.merchant.deleteMany({});
  await prisma.user.deleteMany({});

  // 1) Generate 10 unique realistic Indian numbers
  const numbers = await generateUniqueNumbers(10);
  console.log("Numbers:", numbers);

  // 2) Create users with hashed password
  const seedPassword = "Password123!";
  const hashed = await bcrypt.hash(seedPassword, 10);

  const users: { id: number; number: string }[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    if (!num) continue; // satisfy TS when noUncheckedIndexedAccess is enabled
    const data = {
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
      number: num,
      password: hashed,
    };

    const u = await prisma.user.create({ data });
    users.push({ id: u.id, number: u.number });
  }
  console.log("Created users:", users.length);

  // 3) Create balances for each user
  for (const u of users) {
    const amount = Math.floor(Math.random() * 19001) + 1000; // 1k..20k
    await prisma.balance.create({
      data: {
        userNumber: u.number,
        amount,
        locked: 0,
      },
    });
  }
  console.log("Balances created");

  // 4) Create merchants
  await prisma.merchant.createMany({
    data: [
      { email: "merchant1@example.com", name: "Merchant One", auth_type: "Google" },
      { email: "merchant2@example.com", name: "Merchant Two", auth_type: "Github" },
    ],
  });

  // 5) Create some on-ramp transactions
  for (let i = 0; i < Math.min(3, users.length); i++) {
    const u = users[i];
    if (!u) continue;
    await prisma.onRampTransaction.create({
      data: {
        status: "Success",
        token: `onramp-${Date.now()}-${i}`,
        provider: "Razorpay",
        amount: Math.floor(Math.random() * 10000) + 500,
        startTime: new Date(),
        userNumber: u.number,
      },
    });
  }
  console.log("OnRamp created");

  // 6) Create P2P transactions and adjust balances inside transaction to avoid partial updates
  // We'll create 6 p2p transfers using safe interactive transaction logic
  for (let i = 0; i < 6; i++) {
    // pick distinct sender and receiver
    const fromIdx = Math.floor(Math.random() * users.length);
    let toIdx = Math.floor(Math.random() * users.length);
    while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * users.length);

    const from = users[fromIdx];
    const to = users[toIdx];
    if (!from || !to) continue;
    const fromNum = from.number;
    const toNum = to.number;

    // fetch current balance to pick a safe transfer amount (<= 30% of balance)
    const fromBal = await prisma.balance.findUnique({ where: { userNumber: fromNum } });
    const safeMax = Math.max(1, Math.floor(((fromBal?.amount ?? 1000) * 0.3)));
    const amount = Math.floor(Math.random() * safeMax) + 1;

    // interactive transaction with FOR UPDATE locking to avoid race in real scenarios
    await prisma.$transaction(async (tx) => {
      // Lock rows in deterministic order (by userNumber string) to avoid deadlocks
      const lockFirst = fromNum < toNum ? fromNum : toNum;
      const lockSecond = fromNum < toNum ? toNum : fromNum;

      // parameterized raw queries (safe from injection because we use template tags)
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userNumber" = ${lockFirst} FOR UPDATE`;
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userNumber" = ${lockSecond} FOR UPDATE`;

      // re-read balances inside tx
      const sender = await tx.balance.findUnique({ where: { userNumber: fromNum } });
      if (!sender || sender.amount < amount) {
        // bail out early - throw to rollback
        throw new Error("Insufficient funds in seed P2P creation");
      }

      await tx.balance.update({
        where: { userNumber: fromNum },
        data: { amount: { decrement: amount } },
      });

      await tx.balance.update({
        where: { userNumber: toNum },
        data: { amount: { increment: amount } },
      });

      await tx.p2PTransaction.create({
        data: {
          status: "Success",
          token: `p2p-${Date.now()}-${i}-${Math.floor(Math.random() * 10000)}`,
          amount,
          startTime: new Date(),
          sentuserNumber: fromNum,
          receiveduserNumber: toNum,
        },
      });
    });
  }

  console.log("Created P2P transactions and updated balances");

  console.log("Seeding finished. Seeded password (plaintext):", seedPassword);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
