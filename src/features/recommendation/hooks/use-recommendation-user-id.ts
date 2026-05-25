'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export const useRecommendationUserKey = () => {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === 'authenticated' && session?.user?.id) {
      return `session:${session.user.id}`;
    }

    return null;
  }, [session?.user?.id, status]);
};

export const useRecommendationDisplayName = () => {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === 'authenticated' && session?.user?.name) {
      return session.user.name;
    }

    return null;
  }, [session?.user?.name, status]);
};
