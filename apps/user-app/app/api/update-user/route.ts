import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@repo/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../..//lib/auth";
const prisma = new PrismaClient();



export async function POST(request: NextRequest) {
    try{
    const session:any= await getServerSession(authOptions as any);

    const body = await request.json();
    const { name, email, password, image } = body;
    const user = await prisma.user.update({
        where: {
            id: session?.user?.id,
        },
        data: {
            name,
            email,
            password,
            imageUrl:image,
        },
    });
    return NextResponse.json(user);
    }catch(error){
        console.log(error);
        return NextResponse.json({error:error});
    }
}
