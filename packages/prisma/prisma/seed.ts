import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// Helper to generate a realistic 10-digit Indian mobile number
function randomIndianNumber(): string {
  const firstDigit = String(Math.floor(Math.random() * 4) + 6); // Starts with 6, 7, 8, or 9
  const rest = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return firstDigit + rest;
}

// Helper to generate a specified count of unique numbers
async function generateUniqueNumbers(count: number): Promise<string[]> {
  const numbers = new Set<string>();
  while (numbers.size < count) {
    numbers.add(randomIndianNumber());
  }
  return Array.from(numbers);
}

// Helper to format the current time as a string (e.g., "11:30 AM")
function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Clean up existing data to ensure a fresh start
  console.log("🧹 Clearing old data...");
  await prisma.chats.deleteMany({});
  await prisma.p2PTransaction.deleteMany({});
  await prisma.onRampTransaction.deleteMany({});
  await prisma.balance.deleteMany({});
  await prisma.merchant.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create users
  const userCount = 10;
  const numbers = await generateUniqueNumbers(userCount);
  const seedPassword = "Password123!";
  const hashedPassword = await bcrypt.hash(seedPassword, 10);

  const createdUsers = await Promise.all(
    numbers.map((number, i) =>
      prisma.user.create({
        data: {
          number,
          email: `user${i + 1}@example.com`,
          name: `User ${i + 1}`,
          password: hashedPassword,
          imageUrl: `https://i.pravatar.cc/150?u=${number}`,
        },
      })
    )
  );
  console.log(`👤 Created ${createdUsers.length} users.`);

  // 3. Create a balance for each user
  await Promise.all(
    createdUsers.map((user) =>
      prisma.balance.create({
        data: {
          userNumber: user.number,
          amount: Math.floor(Math.random() * 90000) + 10000, // 10k to 100k
          locked: 0,
        },
      })
    )
  );
  console.log("💰 Created balances for all users.");

  // 4. Create chat conversations
  console.log("💬 Seeding chat conversations...");
  if (createdUsers.length >= 4) {
    const [user1, user2, user3, user4] = createdUsers;

    if (!user1 || !user2 || !user3 || !user4) {
        console.error("Not enough users were created to seed chats.");
        return;
    }

    // Conversation 1: Between User 1 and User 2
    await prisma.chats.createMany({
      data: [
        {
          id: nanoid(),
          fromPhone: user1.number,
          toPhone: user2.number,
          message: "Hey, how have you been?",
          status: "seen",
          type: "text",
          time: formatTime(new Date(Date.now() - 10 * 60 * 1000)), // 10 mins ago
        },
        {
          id: nanoid(),
          fromPhone: user2.number,
          toPhone: user1.number,
          message: "I'm doing great, thanks! Busy with the new project. You?",
          status: "seen",
          type: "text",
          time: formatTime(new Date(Date.now() - 8 * 60 * 1000)), // 8 mins ago
        },
        {
          id: nanoid(),
          fromPhone: user1.number,
          toPhone: user2.number,
          message: "Same here. It's challenging but exciting. Coffee soon!",
          status: "delivered",
          type: "text",
          time: formatTime(new Date(Date.now() - 5 * 60 * 1000)), // 5 mins ago
        },
      ],
    });

    // Conversation 2: Between User 3 and User 4
    await prisma.chats.createMany({
      data: [
        {
          id: nanoid(),
          fromPhone: user3.number,
          toPhone: user4.number,
          message: "Did you review the document I sent?",
          status: "seen",
          type: "text",
          time: formatTime(new Date(Date.now() - 20 * 60 * 1000)), // 20 mins ago
        },
        {
          id: nanoid(),
          fromPhone: user4.number,
          toPhone: user3.number,
          message: "Yes, just finished. Left a few comments for you.",
          status: "pending", // Simulates an offline message
          type: "text",
          time: formatTime(new Date()), // Now
        },
      ],
    });
  }
  console.log("✅ Chat conversations created.");
  console.log(`✨ Seeding finished successfully! Default password: ${seedPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
