import "@repo/ui/styles.css";
import "./globals.css";

import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "venmo it!",
  description: "make secure payments",


};

export default function RootLayout({
  children,

}: {
  children: React.ReactNode;

}) {
  return <html lang="en" className="overflow-hidden h-screen ">
    <body className={`${inter.className} overflow-hidden h-screen `} >
    
    {children}</body></html>;
}
