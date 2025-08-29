"use server";
import { PrismaClient } from "@repo/prisma/client";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();
export async function getChats(personNumber:string){
    const session = await getServerSession(authOptions as any);
    if(!session){
        return [];
    }
    const user:any = (session as any).user as any;
    return await prisma.chats.findMany({
        where: {
            OR: [
                { fromPhone: user.number, toPhone: personNumber },
                { fromPhone: personNumber, toPhone: user.number },
            ],
        },
        orderBy: {
            timestamp: "asc",
        },
    });
}
