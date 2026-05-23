'use client';

import { checkNicknameAvailability } from '@/features/auth/api';
import {
  NICKNAME_PATTERN,
  type SignupFormValues,
} from '@/features/auth/constants/signup-schema';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type NicknameAvailabilityState =
  | 'idle'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'invalid';

export const useNicknameAvailability = (nickname: string) => {
  const trimmedNickname = nickname.trim();
  const isValidFormat = NICKNAME_PATTERN.test(trimmedNickname);

  const query = useQuery({
    queryKey: ['nickname-availability', trimmedNickname],
    queryFn: () => checkNicknameAvailability(trimmedNickname),
    enabled: isValidFormat,
    staleTime: 30_000,
    retry: false,
  });

  const status: NicknameAvailabilityState = useMemo(() => {
    if (!trimmedNickname) {
      return 'idle';
    }

    if (!isValidFormat) {
      return 'invalid';
    }

    if (query.isFetching) {
      return 'checking';
    }

    if (query.isError) {
      return 'invalid';
    }

    if (query.data?.available) {
      return 'available';
    }

    if (query.data && !query.data.available) {
      return 'unavailable';
    }

    return 'idle';
  }, [
    trimmedNickname,
    isValidFormat,
    query.isFetching,
    query.isError,
    query.data,
  ]);

  return {
    status,
    isChecking: query.isFetching,
    refetch: query.refetch,
  };
};

export const isNicknameReadyForSubmit = (
  nickname: SignupFormValues['nickname'],
  status: NicknameAvailabilityState,
) => {
  return NICKNAME_PATTERN.test(nickname.trim()) && status === 'available';
};
