"use server";
import { PrismaClient } from "@repo/prisma/client";
const prisma = new PrismaClient();
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import axios from "axios";


export async function p2pHandler(amount: number, to: string,note?:string|null) {
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
      
      const [firstLockId, secondLockId] = from < toNumber ? [from, toNumber] : [toNumber, from];

      
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
    
    console.error( String(err?.message) ?? String(err));
  
    return (String(err?.message)) ?? String(err);
  }
}



export const search = async (query: string) => {

    
}





export const getFriends = async () => {

  try{
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      console.log("unauthorized");
      return [];
    }
    const user= (session.user as any);
    const founduser = await prisma.user.findUnique({
      where: {
        number : String(user.number),
        
    
      },include:{
        friends:true,
        
      }
    });
    if(founduser?.friends.length===0){
    
      return [];
    }
const isfrendfriends = founduser?.friends.map((friend:any)=>{
    return {
        ...friend,
        isFriend: true,
    };
})


    return isfrendfriends;
  }catch(error){
    console.log("error");
    return [];
  }
}


export const addFriend = async (to: string) => {
  try{
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      console.log("unauthorized");
      return "error";
    }
    
    const usernumber:string= (session?.user?.number as string);

    if(usernumber===to){
      console.log("cannot add self");
      return "error";
    }
    await prisma.user.update({
      where: { number: usernumber },
      data: {
        friends: {
          connect: { number: to }
          
        }
      }
    })


    console.log("success");
    return "success";
  }catch(error){
    console.log("error");
    return "error";
  }

    
}

export const getTransactions = async () => {
  try{
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      console.log("unauthorized");
      return [];
    }
    const user= (session?.user as any);
    const founduser = await prisma.user.findUnique({
      where: {
        number : String(user.number),
        
      },include:{
        friends:true,
        sentP2PTransactions:{
          include:{
            receiveduser: {
              select:{
                number:true,
                name:true,
                imageUrl:true,
              }
            },
          }

        },
        receivedP2PTransactions:{
          include:{
            sentuser: {
              select:{
                number:true,
                name:true,
                imageUrl:true,
              }
            },
          }
        },
        
      }
    });


    const transactions : any[] = [...founduser?.sentP2PTransactions as any[],...founduser?.receivedP2PTransactions as any[]];
    transactions.sort((a:any,b:any)=>{
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

  
    return transactions;
  }catch(error){
    console.log("error");
    return [];
  }
    
}

