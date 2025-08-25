import { PrismaClient } from "@repo/prisma/client";

import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();
export default async function getuser() {
    const session:any = await getServerSession(authOptions as any);
    const userid=session?.user.id as any;
    if(!session){
        console.log("unauthorized");
        return "unauthorized";
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userid,
        },
    });
    return user;
}