'use client';

import { Button } from '@/components/ui/button';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type AccountDialogShellProps = {
  titleId: string;
  descriptionId: string;
  children: ReactNode;
  onBackdropClick: () => void;
};

function AccountDialogShell({
  titleId,
  descriptionId,
  children,
  onBackdropClick,
}: AccountDialogShellProps) {
  return (
    <DialogBackdrop onClose={onBackdropClick}>
      <DialogPanel titleId={titleId} descriptionId={descriptionId}>
        {children}
      </DialogPanel>
    </DialogBackdrop>
  );
}

type WithdrawAccountDialogProps = {
  open: boolean;
  isWithdrawing: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function WithdrawAccountDialog({
  open,
  isWithdrawing,
  onOpenChange,
  onConfirm,
}: WithdrawAccountDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackdropClick = () => {
    if (isWithdrawing) {
      return;
    }

    onOpenChange(false);
  };

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <AccountDialogShell
      titleId="withdraw-confirm-title"
      descriptionId="withdraw-confirm-description"
      onBackdropClick={handleBackdropClick}
    >
      <h2 id="withdraw-confirm-title" className="text-center text-lg font-bold text-primary">
        회원 탈퇴
      </h2>
      <p
        id="withdraw-confirm-description"
        className="mt-3 text-center text-sm leading-relaxed text-muted-foreground"
      >
        회원님의 모든 정보가 삭제됩니다. 탈퇴하시겠습니까?
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl border-border"
          disabled={isWithdrawing}
          onClick={() => onOpenChange(false)}
        >
          취소
        </Button>
        <Button
          type="button"
          className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isWithdrawing}
          onClick={onConfirm}
        >
          {isWithdrawing ? '처리 중...' : '정말탈퇴'}
        </Button>
      </div>
    </AccountDialogShell>,
    document.body,
  );
}

type WithdrawAccountErrorDialogProps = {
  open: boolean;
  message: string;
  onOpenChange: (open: boolean) => void;
};

export function WithdrawAccountErrorDialog({
  open,
  message,
  onOpenChange,
}: WithdrawAccountErrorDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <AccountDialogShell
      titleId="withdraw-error-title"
      descriptionId="withdraw-error-description"
      onBackdropClick={() => onOpenChange(false)}
    >
      <h2 id="withdraw-error-title" className="text-center text-lg font-bold text-primary">
        탈퇴 실패
      </h2>
      <p
        id="withdraw-error-description"
        className="mt-3 text-center text-sm leading-relaxed text-muted-foreground"
      >
        {message}
      </p>
      <Button
        type="button"
        className="mt-6 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => onOpenChange(false)}
      >
        확인
      </Button>
    </AccountDialogShell>,
    document.body,
  );
}

function DialogBackdrop({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      {children}
    </div>
  );
}

function DialogPanel({
  titleId,
  descriptionId,
  children,
}: {
  titleId: string;
  descriptionId: string;
  children: ReactNode;
}) {
  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}
