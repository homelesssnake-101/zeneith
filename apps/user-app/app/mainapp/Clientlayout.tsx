

"use client";
import {Appbar} from "@repo/ui/Appbar";
import { useSession } from "next-auth/react";
import {Sidebar} from "@repo/ui/Sidebar";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

export default function Clientlayout({children}: {children: React.ReactNode}) {
const {data:session} = useSession(); 
const user=session?.user as any;
const [open, setOpen] = useState(false); 
  
  
  return <>
<Appbar user={user} open={open} onSignin={() => {signIn()}} onSignout={() => {signOut()}} />
<Sidebar open={open} onClose={() => {setOpen(prev => !prev)}} />
{children}
  </>;
 

  
}