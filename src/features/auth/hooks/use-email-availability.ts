'use client';

import { checkEmailAvailability } from '@/features/auth/api';
import type { SignupFormValues } from '@/features/auth/constants/signup-schema';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { z } from 'zod';

type EmailAvailabilityState =
  | 'idle'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'invalid';

const emailFormatSchema = z.string().trim().email();

export const useEmailAvailability = (email: string) => {
  const trimmedEmail = email.trim();
  const isValidFormat = emailFormatSchema.safeParse(trimmedEmail).success;

  const query = useQuery({
    queryKey: ['email-availability', trimmedEmail],
    queryFn: () => checkEmailAvailability(trimmedEmail),
    enabled: isValidFormat,
    staleTime: 30_000,
    retry: false,
  });

  const status: EmailAvailabilityState = useMemo(() => {
    if (!trimmedEmail) {
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
  }, [trimmedEmail, isValidFormat, query.isFetching, query.isError, query.data]);

  return {
    status,
    isChecking: query.isFetching,
    refetch: query.refetch,
  };
};

export const isEmailReadyForSubmit = (
  email: SignupFormValues['email'],
  status: EmailAvailabilityState,
) => {
  return emailFormatSchema.safeParse(email.trim()).success && status === 'available';
};
