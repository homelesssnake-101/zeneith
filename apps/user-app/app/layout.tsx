import "@repo/ui/styles.css";
import "./globals.css";

import { Inter } from "next/font/google";
import { Metadata } from "next";
import SocketProviderWrapper from "../components/SocketProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "venmo!",
  description: "make secure payments",
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en" className="overflow-hidden h-screen">
      <body className={`${inter.className} overflow-hidden h-screen`} suppressHydrationWarning>
        <SocketProviderWrapper session={session}>
          {children}
        </SocketProviderWrapper>
      </body>
    </html>
  );
}
