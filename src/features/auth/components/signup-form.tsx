'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUpWithEmail } from '@/features/auth/api';
import {
  signupSchema,
  type SignupFormValues,
} from '@/features/auth/constants/signup-schema';
import {
  isEmailReadyForSubmit,
  useEmailAvailability,
} from '@/features/auth/hooks/use-email-availability';
import {
  isNicknameReadyForSubmit,
  useNicknameAvailability,
} from '@/features/auth/hooks/use-nickname-availability';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { match } from 'ts-pattern';

type AvailabilityStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'invalid';

const emailHelperText = (status: AvailabilityStatus) =>
  match(status)
    .with('idle', () => '가입 후 입력하신 이메일로 인증 메일이 발송됩니다.')
    .with('checking', () => '이메일 중복 여부를 확인하고 있습니다...')
    .with('available', () => '사용 가능한 이메일입니다.')
    .with('unavailable', () => '이미 가입된 이메일입니다. 로그인하거나 다른 이메일을 사용해 주세요.')
    .with('invalid', () => '올바른 이메일 형식으로 입력해 주세요.')
    .exhaustive();

const nicknameHelperText = (status: AvailabilityStatus) =>
  match(status)
    .with('idle', () => '한글, 영문, 숫자 조합으로 2~20자까지 사용할 수 있습니다.')
    .with('checking', () => '닉네임 중복 여부를 확인하고 있습니다...')
    .with('available', () => '사용 가능한 닉네임입니다.')
    .with('unavailable', () => '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.')
    .with('invalid', () => '한글, 영문, 숫자만 2~20자로 입력해 주세요.')
    .exhaustive();

const availabilityHelperClassName = (status: AvailabilityStatus) => {
  if (status === 'available') {
    return 'text-primary';
  }

  if (status === 'unavailable') {
    return 'text-primary';
  }

  return 'text-muted-foreground';
};

const DEFAULT_CALLBACK_URL = '/';

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? DEFAULT_CALLBACK_URL;
  const loginHref =
    callbackUrl === DEFAULT_CALLBACK_URL
      ? '/login'
      : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [debouncedNickname, setDebouncedNickname] = useState('');

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const emailValue = form.watch('email');
  const nicknameValue = form.watch('nickname');

  useDebounce(
    () => {
      setDebouncedEmail(emailValue);
    },
    400,
    [emailValue],
  );

  useDebounce(
    () => {
      setDebouncedNickname(nicknameValue);
    },
    400,
    [nicknameValue],
  );

  const { status: emailStatus } = useEmailAvailability(debouncedEmail);
  const { status: nicknameStatus } = useNicknameAvailability(debouncedNickname);

  const isSubmitDisabled =
    isSubmitting || emailStatus === 'unavailable' || nicknameStatus === 'unavailable';

  const onSubmit = async (values: SignupFormValues) => {
    setSubmitError(null);

    if (!isEmailReadyForSubmit(values.email, emailStatus)) {
      form.setError('email', {
        message: '사용 가능한 이메일인지 확인해 주세요.',
      });
      return;
    }

    if (!isNicknameReadyForSubmit(values.nickname, nicknameStatus)) {
      form.setError('nickname', {
        message: '사용 가능한 닉네임인지 확인해 주세요.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await signUpWithEmail(values);
      router.push(`/signup/complete?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 text-left"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">이메일</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="rounded-xl border-border bg-card"
                />
              </FormControl>
              <FormDescription className={availabilityHelperClassName(emailStatus)}>
                {emailHelperText(emailStatus)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">닉네임</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="nickname"
                  placeholder="와인러버42"
                  className="rounded-xl border-border bg-card"
                />
              </FormControl>
              <FormDescription className={availabilityHelperClassName(nicknameStatus)}>
                {nicknameHelperText(nicknameStatus)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">비밀번호</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="8자 이상, 숫자·특수문자 포함"
                  className="rounded-xl border-border bg-card"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                최소 8자, 숫자와 특수문자를 각각 1개 이상 포함해야 합니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="비밀번호를 다시 입력해 주세요"
                  className="rounded-xl border-border bg-card"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError ? (
          <p className="rounded-xl bg-accent px-4 py-3 text-sm text-primary" role="alert">
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              가입 처리 중...
            </>
          ) : (
            '회원가입'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link
            href={loginHref}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </p>
      </form>
    </Form>
  );
}
