'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WithdrawAccountSection } from '@/features/my-wine/components/withdraw-account-section';
import { useRecommendationDisplayName } from '@/features/recommendation/hooks/use-recommendation-user-id';
import { Grape, History, Settings2, UserRound, Wine } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

const scrollToProfileSection = () => {
  const profileSection = document.getElementById('profile');
  profileSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function MyWinePage() {
  const { data: session, status } = useSession();
  const displayName = useRecommendationDisplayName();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const profileName = displayName?.trim() || '회원';
  const profileEmail = session?.user?.email ?? null;

  useEffect(() => {
    if (window.location.hash !== '#profile') {
      return;
    }

    scrollToProfileSection();
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-5 pt-section-12 pb-section-gap text-foreground md:px-8">
        <div className="mx-auto w-full max-w-page">
          <p className="text-sm text-muted-foreground">나의 와인 화면을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background px-5 pt-section-12 pb-section-gap text-foreground md:px-8">
        <div className="mx-auto flex w-full max-w-page flex-col items-center text-center">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-primary">나의 와인</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              프로필 설정과 와인 기록을 관리하려면 로그인이 필요합니다.
            </p>
            <Button asChild className="mt-8 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/login">로그인/회원가입</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full text-muted-foreground">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 pt-section-10 pb-section-gap text-foreground md:px-8 md:pt-section-12">
      <div className="mx-auto w-full max-w-page space-y-section-gap">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">나의 와인</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {profileName}님의 프로필과 와인 기록을 한곳에서 관리할 수 있습니다.
          </p>
        </header>

        <section id="profile" className="scroll-mt-24">
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg text-primary">나의 와인 관리</CardTitle>
                <Badge variant="secondary" className="bg-secondary text-primary hover:bg-secondary">
                  준비 중
                </Badge>
              </div>
              <CardDescription>
                프로필 설정과 와인 기록 기능이 곧 이 화면에서 제공됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-base font-semibold text-primary">
                  <Settings2 className="h-4 w-4" aria-hidden />
                  프로필 설정
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      닉네임
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-base font-semibold text-foreground">
                      <UserRound className="h-4 w-4 text-primary" aria-hidden />
                      {profileName}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      이메일
                    </p>
                    <p className="mt-1 break-all text-base font-semibold text-foreground">
                      {profileEmail ?? '등록된 이메일 없음'}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  회원가입 시 입력한 정보가 표시됩니다. 닉네임·이메일 변경 기능은 곧 제공될
                  예정입니다.
                </p>
              </div>

              <div className="border-t border-border pt-8">
                <h2
                  id="my-wine-records-title"
                  className="flex items-center gap-2 text-base font-semibold text-primary"
                >
                  <Wine className="h-4 w-4" aria-hidden />
                  마신 와인 기록
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  마셔본 와인을 기록하고 메모를 남기는 기능은 곧 제공될 예정입니다.
                </p>
                <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-accent/50 p-6 text-center">
                  <Grape className="mx-auto h-8 w-8 text-primary/50" aria-hidden />
                  <p className="mt-3 text-sm text-muted-foreground">
                    품종, 평점, 테이스팅 노트를 저장하는 나만의 와인 셀러가 준비되고 있습니다.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h2 id="my-wine-links-title" className="text-base font-semibold text-primary">
                  바로가기
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto justify-start rounded-2xl border-primary/30 px-4 py-4 text-left hover:bg-accent"
                  >
                    <Link href="/survey" className="flex flex-col items-start gap-1">
                      <span className="flex items-center gap-2 font-semibold text-primary">
                        <Grape className="h-4 w-4" aria-hidden />
                        취향 찾기
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        새로운 와인 추천을 받아보세요.
                      </span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto justify-start rounded-2xl border-primary/30 px-4 py-4 text-left hover:bg-accent"
                  >
                    <Link href="/history" className="flex flex-col items-start gap-1">
                      <span className="flex items-center gap-2 font-semibold text-primary">
                        <History className="h-4 w-4" aria-hidden />
                        이전 추천 기록
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        저장된 추천 결과를 다시 확인하세요.
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <WithdrawAccountSection />
      </div>
    </main>
  );
}
