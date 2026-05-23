'use client';

import { MergeGuestOnAuth } from '@/components/auth/merge-guest-on-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MergeGuestOnAuth />
      {children}
    </SessionProvider>
  );
}
