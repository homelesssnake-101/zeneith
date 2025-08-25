
"use server";
import {PrismaClient} from "@repo/prisma/client";
import { nanoid } from "nanoid";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();
 export async function onrampHandler(amount:number,provider: string){
    try{  
        const session:any = await getServerSession(authOptions as any);
        const user=session.user as any;
        if(!session){
            console.log("unauthorized");
            return "unauthorized";
        }
        const transfer = await prisma.onRampTransaction.create({
            data:{
                status: "Processing",
                token: nanoid().toString(),
                provider: provider,
                amount: amount,
                startTime: new Date(),
                userNumber:user.number,
            }
        })
        console.log("success");
        return "success";
    }catch(error){
        console.log("error");
        return "error";
    }
    
 }

 export async function getRampTransactions(){
    try{
        const session:any = await getServerSession(authOptions as any);
        const user=session.user as any;
        if(!session){
            console.log("unauthorized");
            return "unauthorized";
        }
        const rampTransactions = await prisma.onRampTransaction.findMany({
            where:{
                userNumber:user.number,
            },
            orderBy:{
                startTime:"desc"
            }
        })
        console.log("success");
        return rampTransactions;
    }catch(error){
        console.log("error");
        return "error";
    }
    
 }
 export async function getBalance(){
    try{
        const session:any = await getServerSession(authOptions as any);
        const user=session.user as any;
        if(!session){
            console.log("unauthorized");
            return "unauthorized";
        }
        const balance = await prisma.balance.findUnique({
            where:{
                userNumber: String(user.number),
            }
        })
        console.log("success");
        return balance;
    }catch(error){
        console.log("error");
        return "error";
    }
    
 }