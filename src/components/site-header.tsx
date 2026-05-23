'use client';

import { Button } from '@/components/ui/button';
import { LogoutSuccessAlert } from '@/features/auth/components/logout-success-alert';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const navLinkClass =
  'text-sm font-semibold text-muted-foreground transition-colors hover:text-primary';

const authEntryButtonClass =
  'h-9 rounded-full border-2 border-primary/40 bg-card px-3 text-xs font-semibold text-primary shadow-none transition-colors hover:border-primary hover:bg-accent hover:text-primary sm:px-4 sm:text-sm';

const authMenuClass =
  'flex h-9 items-stretch overflow-hidden rounded-full border-2 border-primary/40 bg-card text-xs font-semibold shadow-none sm:text-sm';

const authMenuProfileLinkClass =
  'flex items-center px-3 text-primary transition-colors hover:bg-accent hover:text-primary sm:px-4';

const authMenuLogoutButtonClass =
  'border-l border-primary/30 px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 sm:px-4';

const getAuthEntryLabel = (
  status: 'authenticated' | 'loading' | 'unauthenticated',
  nickname: string | null | undefined,
) => {
  if (status === 'loading') {
    return '로그인/회원가입';
  }

  if (status === 'authenticated') {
    return nickname?.trim() || '회원';
  }

  return '로그인/회원가입';
};

export function SiteHeader() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const authEntryLabel = getAuthEntryLabel(status, session?.user?.name);

  const handleLogout = async () => {
    if (status !== 'authenticated' || isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await signOut({ redirect: false });
      setLogoutAlertOpen(true);
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/90 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-3 px-5 md:gap-4 md:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center transition-opacity hover:opacity-90"
        >
          <img
            src="/myimg/small-logo.png"
            alt="CorkPop"
            className="h-12 w-auto shrink-0 object-contain"
          />
        </Link>
        <nav
          aria-label="주요 메뉴"
          className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4"
        >
          <Link href="/wine" className={navLinkClass}>
            와인이란
          </Link>
          <Link href="/survey" className={navLinkClass}>
            취향찾기
          </Link>
          <Link href="/my-wine" className={navLinkClass}>
            나의와인
          </Link>
          {status === 'authenticated' ? (
            <div className={authMenuClass} role="group" aria-label="계정 메뉴">
              <Link href="/my-wine#profile" className={authMenuProfileLinkClass}>
                {authEntryLabel} 님
              </Link>
              <button
                type="button"
                className={authMenuLogoutButtonClass}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className={authEntryButtonClass}>
              <Link href="/login">{authEntryLabel}</Link>
            </Button>
          )}
        </nav>
      </div>
      <LogoutSuccessAlert open={logoutAlertOpen} onOpenChange={setLogoutAlertOpen} />
    </header>
  );
}
