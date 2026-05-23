'use client';

import { Button } from '@/components/ui/button';
import {
  WITHDRAW_ERROR_MESSAGE,
  withdrawAccount,
} from '@/features/my-wine/api';
import {
  WithdrawAccountDialog,
  WithdrawAccountErrorDialog,
} from '@/features/my-wine/components/withdraw-account-dialog';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function WithdrawAccountSection() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawConfirm = async () => {
    if (isWithdrawing) {
      return;
    }

    setIsWithdrawing(true);

    try {
      await withdrawAccount();
      setConfirmOpen(false);
      await signOut({ redirect: false });
      router.push('/');
      router.refresh();
    } catch {
      setConfirmOpen(false);
      setErrorOpen(true);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <>
      <section
        aria-label="회원 탈퇴"
        className="flex flex-col items-center border-t border-border pt-section-10"
      >
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-muted-foreground underline-offset-4 hover:bg-transparent hover:text-primary hover:underline"
          onClick={() => setConfirmOpen(true)}
        >
          탈퇴하기
        </Button>
      </section>

      <WithdrawAccountDialog
        open={confirmOpen}
        isWithdrawing={isWithdrawing}
        onOpenChange={setConfirmOpen}
        onConfirm={() => void handleWithdrawConfirm()}
      />

      <WithdrawAccountErrorDialog
        open={errorOpen}
        message={WITHDRAW_ERROR_MESSAGE}
        onOpenChange={setErrorOpen}
      />
    </>
  );
}
