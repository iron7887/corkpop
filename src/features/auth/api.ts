import type { SignupFormValues } from '@/features/auth/constants/signup-schema';

type AvailabilityResponse = {
  available: boolean;
};

type SignupResponse = {
  message: string;
  email: string;
};

type ApiErrorResponse = {
  error: string;
};

const parseErrorMessage = async (response: Response) => {
  const payload = (await response.json().catch(() => null)) as ApiErrorResponse | null;
  return payload?.error ?? '요청 처리 중 오류가 발생했습니다.';
};

export const checkNicknameAvailability = async (nickname: string) => {
  const params = new URLSearchParams({ nickname });
  const response = await fetch(`/api/auth/check-nickname?${params.toString()}`);

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as AvailabilityResponse;
};

export const checkEmailAvailability = async (email: string) => {
  const params = new URLSearchParams({ email });
  const response = await fetch(`/api/auth/check-email?${params.toString()}`);

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as AvailabilityResponse;
};

export const signUpWithEmail = async (
  payload: SignupFormValues,
  options?: { anonId?: string },
) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      nickname: payload.nickname,
      password: payload.password,
      ...(options?.anonId ? { anonId: options.anonId } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as SignupResponse;
};
