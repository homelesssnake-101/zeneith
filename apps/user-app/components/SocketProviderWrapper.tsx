'use client';

import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@repo/ui/Socketcontext';

export default function SocketProviderWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <SocketProvider>
        {children}
      </SocketProvider>
    </SessionProvider>
  );
}
