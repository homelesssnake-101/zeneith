import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import {getFriends} from "../../../../actions/p2p";
import { PrismaClient } from "@repo/prisma/client";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
     const query = request.nextUrl.searchParams.get("query") as string;
     console.log(query);

    try{
        
        const session: any = await getServerSession(authOptions as any);
        if (!session) {
          console.log();
          return NextResponse.json([]);
        }
        const user= (session.user as any);

        
        const foundusers = await prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: String(query) } },
              { number: { contains: String(query) } },
            ],
            
          },take:8
        });
        if(foundusers.length===0){
        
          return NextResponse.json([]);
        }

    const friends : any = await getFriends();
    const finalusers = foundusers.map((user:any)=>{
        return {
            ...user,
            isFriend: friends.some((friend:any)=>friend.number===user.number),
        }
    })


        return NextResponse.json(finalusers);
      }catch(error){
        console.log("error");
        return NextResponse.json({error:error});
      }




}