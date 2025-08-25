import { NextResponse , NextRequest} from "next/server";
import { PrismaClient } from "@repo/prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
    const body = await request.json();
   
    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });
    
    return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json(error);
    }
}
