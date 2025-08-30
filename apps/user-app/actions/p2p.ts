"use server";
import { PrismaClient } from "@repo/prisma/client";
const prisma = new PrismaClient();
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import axios from "axios";

export async function p2pHandler(
  amount: number,
  to: string,
  note?: string | null
) {
  try {
    const session: any = await getServerSession(authOptions as any);

    if (!session) {
      console.log("unauthorized");
      return "unauthorized";
    }

    const from = (session.user as any).number;
    const toNumber = to;

    if (from === toNumber) {
      console.log("cannot transfer to self");
      return "cannot transfer to self";
    }

    await prisma.$transaction(async (tx) => {
      const [firstLockId, secondLockId] =
        from < toNumber ? [from, toNumber] : [toNumber, from];

      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userNumber" = ${firstLockId} FOR UPDATE`;

      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userNumber" = ${secondLockId} FOR UPDATE`;

      const fromBalance = await tx.balance.findUnique({
        where: { userNumber: from },
      });

      if (!fromBalance) {
        throw new Error("Sender balance not found");
      }

      if (fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      await tx.balance.update({
        where: { userNumber: from },
        data: {
          amount: { decrement: amount },
        },
      });

      await tx.balance.update({
        where: { userNumber: toNumber },
        data: {
          amount: { increment: amount },
        },
      });

      await tx.p2PTransaction.create({
        data: {
          status: "Success",
          token: nanoid(),
          amount,
          startTime: new Date(),
          sentuserNumber: from,
          receiveduserNumber: toNumber,
          note,
        },
      });
    });

    console.log("success");
    return "success";
  } catch (err: any) {
    console.error(String(err?.message) ?? String(err));

    return String(err?.message) ?? String(err);
  }
}

export const search = async (query: string) => {};

// homelesssnake-101/zeneith/zeneith-ff3578375ef927d7288c8e52e5b851600bd105d6/apps/user-app/actions/p2p.ts
export const getFriends = async () => {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      console.log("unauthorized");
      return [];
    }
    const user = session.user as any;

    // 1. Fetch the user and their friends
    const founduser = await prisma.user.findUnique({
      where: {
        number: String(user.number),
      },
      include: {
        friends: true,
      },
    });

    if (!founduser || founduser.friends.length === 0) {
      return [];
    }

    // 2. Fetch all chats involving the user
    const chats = await prisma.chats.findMany({
      where: {
        OR: [{ fromPhone: user.number }, { toPhone: user.number }],
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // 3. Create a map of the latest chat timestamp for each person
    const lastMessageTimestamps = new Map<string, {time: Date,message: string}>();
    for (const chat of chats) {
      const otherUserNumber =
        chat.fromPhone === user.number ? chat.toPhone : chat.fromPhone;
      if (!lastMessageTimestamps.has(otherUserNumber)) {
        lastMessageTimestamps.set(otherUserNumber, {time: chat.timestamp,message: chat.message ?? ""});
      }
    }

    // 4. Combine friends and their last message timestamp
    const combinedList = founduser.friends.map((friend) => ({
      ...friend,
      isFriend: true,
      lastMessageTimestamp: lastMessageTimestamps.get(friend.number)?.time || new Date(0),
      lastMessage: lastMessageTimestamps.get(friend.number)?.message ?? "",
    }));

    // 5. Sort the final list
    const sortedContacts = combinedList.sort(
      (a, b) =>
        new Date(b.lastMessageTimestamp).getTime() -
        new Date(a.lastMessageTimestamp).getTime()
    );

    return sortedContacts;

  } catch (error) {
    console.log("error", error);
    return [];
  }
};

export const addFriend = async (to: string) => {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      console.log("unauthorized");
      return "error";
    }

    const usernumber: string = session?.user?.number as string;

    if (usernumber === to) {
      console.log("cannot add self");
      return "error";
    }
    await prisma.user.update({
      where: { number: usernumber },
      data: {
        friends: {
          connect: { number: to },
        },
      },
    });

    console.log("success");
    return "success";
  } catch (error) {
    console.log("error");
    return "error";
  }
};

export const getTransactions = async () => {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      console.log("unauthorized");
      return [];
    }
    const user = session?.user as any;
    const founduser = await prisma.user.findUnique({
      where: {
        number: String(user.number),
      },
      include: {
        friends: true,
        sentP2PTransactions: {
          include: {
            receiveduser: {
              select: {
                number: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        receivedP2PTransactions: {
          include: {
            sentuser: {
              select: {
                number: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const transactions: any[] = [
      ...(founduser?.sentP2PTransactions as any[]),
      ...(founduser?.receivedP2PTransactions as any[]),
    ];
    transactions.sort((a: any, b: any) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

    return transactions;
  } catch (error) {
    console.log("error");
    return [];
  }
};
