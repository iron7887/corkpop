'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type LogoutSuccessAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LogoutSuccessAlert({ open, onOpenChange }: LogoutSuccessAlertProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoHome = () => {
    onOpenChange(false);
    router.push('/');
    router.refresh();
  };

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="logout-alert-title"
      aria-describedby="logout-alert-description"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h2 id="logout-alert-title" className="text-center text-lg font-bold text-primary">
          로그아웃 되었습니다.
        </h2>
        <p id="logout-alert-description" className="sr-only">
          로그아웃이 완료되었습니다.
        </p>
        <Button
          type="button"
          className="mt-6 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleGoHome}
        >
          홈으로
        </Button>
      </div>
    </div>,
    document.body,
  );
}
