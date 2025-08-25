import { NextRequest, NextResponse } from "next/server";
import { p2pHandler } from "../../../../actions/p2p";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
export async function POST(request: NextRequest) {
    const session:any= await getServerSession(authOptions as any);
    const body = await request.json();
    const { amount, to,note} = body;

    console.log(amount,to,note);

    const result = await p2pHandler(amount, to,note===""?null:note);

    return NextResponse.json({ result });
}