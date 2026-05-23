'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/constants/login-schema';
import { mergeGuestHistoryOnAuth } from '@/features/recommendation/lib/recommendation-api';
import { clearAnonUserId, getAnonUserId } from '@/lib/anon-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const DEFAULT_CALLBACK_URL = '/';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') ?? DEFAULT_CALLBACK_URL;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.ok) {
        const anonId = getAnonUserId();
        if (anonId) {
          const merged = await mergeGuestHistoryOnAuth(anonId);
          if (merged) {
            clearAnonUserId();
          }
        }

        router.push(callbackUrl);
        router.refresh();
        return;
      }

      setSubmitError(
        '이메일 또는 비밀번호가 올바르지 않거나, 이메일 인증이 완료되지 않았습니다.',
      );
    } catch {
      setSubmitError('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
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
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력해 주세요"
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
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?{' '}
          <Link
            href="/signup"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </Form>
  );
}
