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

export async function delivered(toPhone:string){
   const updatedChats =  await prisma.$transaction(async (tx) => {
              
              const pending = await tx.chats.findMany({
                where: { toPhone: toPhone, status: "pending" },
              });
              
          
              if (pending.length > 0) {
                await tx.chats.updateMany({
                  where: { id: { in: pending.map((m) => m.id) } },
                  data: { status: "delivered" },
                });
              }

              console.log(pending + "pending chats");
          
              return pending.map((m) => ({ ...m, status: "delivered" }));
            });

    return updatedChats;
}
