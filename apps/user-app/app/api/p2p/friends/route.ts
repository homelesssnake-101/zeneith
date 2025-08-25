import { NextRequest, NextResponse } from "next/server";
import { getFriends } from "../../../../actions/p2p";

export async function GET(request: NextRequest) {
    
    const friends = await getFriends();
    return NextResponse.json(friends);
}