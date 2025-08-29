// In apps/user-app/app/api/delivered/route.ts
import { NextResponse } from "next/server";
import { delivered } from "../../../actions/chat";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST() {
    const session:any = await getServerSession(authOptions as any);
    try {
        if (!session?.user) {
            return NextResponse.json([]);
        }
        
        const user = session.user as { number?: string };
        const toPhone = user.number;
        
        if (!toPhone) {
            return NextResponse.json([]);
        }
        
        const updatedChats = await delivered(toPhone);
        return NextResponse.json(updatedChats ?? []);
    } catch (error) {
        console.error("Error in delivered API:", error);
        return NextResponse.json([]);
    }
}