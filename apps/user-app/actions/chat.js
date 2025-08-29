"use server";
import { PrismaClient } from "@repo/prisma/client";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();
export async function getChats(personNumber) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return [];
    }
    const user = session.user;
    return await prisma.chats.findMany({
        where: {
            OR: [
                { fromPhone: user.number, toPhone: personNumber },
                { fromPhone: personNumber, toPhone: user.number },
            ],
        },
        orderBy: {
            timestamp: "desc",
        },
    });
}
