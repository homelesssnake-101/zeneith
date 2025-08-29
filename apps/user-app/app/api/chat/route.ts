import { NextRequest, NextResponse } from "next/server";
import { getChats } from "../../../actions/chat";


export async function GET(request: NextRequest) {
    const personNumber = request.nextUrl.searchParams.get("personNumber");
    if(!personNumber){
        return NextResponse.json({error: "No person number"}, {status: 400});
    }
    const chats = await getChats(personNumber);
    return NextResponse.json(chats);
}

