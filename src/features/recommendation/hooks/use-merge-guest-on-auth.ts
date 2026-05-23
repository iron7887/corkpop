'use client';

import { clearAnonUserId, getAnonUserId } from '@/lib/anon-user';
import { mergeGuestHistoryOnAuth } from '@/features/recommendation/lib/recommendation-api';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export const useMergeGuestOnAuth = () => {
  const { status } = useSession();
  const hasMergedRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || hasMergedRef.current) {
      return;
    }

    const anonId = getAnonUserId();
    if (!anonId) {
      return;
    }

    hasMergedRef.current = true;

    const runMerge = async () => {
      const merged = await mergeGuestHistoryOnAuth(anonId);
      if (merged) {
        clearAnonUserId();
      }
    };

    void runMerge();
  }, [status]);
};
