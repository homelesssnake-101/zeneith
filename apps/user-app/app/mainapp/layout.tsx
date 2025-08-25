

"use client";
import Clientlayout from "./Clientlayout";
import {AppProvider} from "@repo/ui/provider";
import {SessionProvider} from "next-auth/react";









export default function mainappLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
   
      <div className={ " bg-white relative overflow-y-scroll h-screen"}>
        <SessionProvider session={session}>
        <AppProvider>
        
        <Clientlayout> <div className=""> {children}</div></Clientlayout>


        </AppProvider>
        </SessionProvider>
        
      </div>
    
  );
}
