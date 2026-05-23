'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  beginnerSteps,
  fortifiedGrapes,
  labelBasics,
  labelTerms,
  navItems,
  newWorldCountries,
  newWorldTraits,
  oldWorldCountries,
  oldWorldTraits,
  redGrapeProfiles,
  roseGrapes,
  sparklingGrapes,
  whiteGrapeProfiles,
  wineKinds,
} from '@/features/wine-guide/constants/guide-data';
import { cn } from '@/lib/utils';
import { BookOpen, Grape, ListOrdered, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const PLACEHOLDER_HERO =
  'https://picsum.photos/seed/corkpop-wine-guide-hero/960/360';

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground md:text-[15px]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function GuideTable({
  headers,
  rows,
  minWidthClass = 'min-w-[520px]',
  embedded = false,
}: {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  minWidthClass?: string;
  embedded?: boolean;
}) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-border bg-card shadow-sm',
        embedded ? 'mt-0 border-border shadow-none' : 'mt-4',
      )}
    >
      <table className={cn('w-full border-collapse text-left text-sm', minWidthClass)}>
        <thead>
          <tr className="border-b border-border bg-muted/80">
            {headers.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 font-semibold text-primary first:rounded-tl-xl last:rounded-tr-xl"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-0 odd:bg-card even:bg-accent/60"
            >
              {cells.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({
  id,
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="scroll-mt-24">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h2
            id={id}
            className="mt-1 text-2xl font-extrabold tracking-tight text-primary md:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
        </div>
      </div>
    </header>
  );
}

export function WineGuidePageContent() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-page px-5 pt-section-4 md:px-8 md:pt-section-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">가이드</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
          와인 기초 가이드
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          포도를 발효시켜서 만든 와인은 생산국·품종·양조 방식에 따라 향과 질감이 달라집니다. 아래 내용은
          초보자도 흐름을 잡을 수 있도록 생산국, 스타일, 품종, 레이블까지 한 번에 정리했습니다.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <img
            src={PLACEHOLDER_HERO}
            alt=""
            width={960}
            height={360}
            className="h-44 w-full object-cover sm:h-52"
          />
        </div>

        <nav
          aria-label="가이드 목차"
          className="sticky top-14 z-40 -mx-5 mt-section-8 border-y border-border/90 bg-background/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:-mx-8 md:px-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="shrink-0 rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-accent md:text-sm"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section className="mt-section-gap space-y-section-12 pb-section-gap" aria-labelledby="wine-regions">
          <SectionHeading
            id="wine-regions"
            icon={MapPin}
            eyebrow="1. 와인 생산국"
            title="구대륙과 신대륙"
            description="전통적인 유럽 생산국(구대륙)과 그 외 지역(신대륙)은 레이블·스타일·음식과의 관계에서 흔히 다른 접근을 보입니다."
          />

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-bold text-primary">구대륙 와인 (Old World)</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              전통적인 와인 생산 역사를 가진 유럽 중심 국가들입니다. 테루아(기후·토양·지역성)와 전통
              양조 방식을 중요하게 여깁니다.
            </p>
            <GuideTable
              headers={['국가', '특징', '대표 지역']}
              rows={oldWorldCountries.map((r) => [r.country, r.trait, r.region])}
            />
            <h4 className="mt-8 text-sm font-bold text-foreground">구대륙 특징</h4>
            <BulletList items={oldWorldTraits} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-bold text-primary">신대륙 와인 (New World)</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              유럽 외 지역에서 발전한 와인 생산국입니다. 과일 풍미와 현대적인 양조 기술이 특징입니다.
            </p>
            <GuideTable
              headers={['국가', '특징', '대표 지역']}
              rows={newWorldCountries.map((r) => [r.country, r.trait, r.region])}
            />
            <h4 className="mt-8 text-sm font-bold text-foreground">신대륙 특징</h4>
            <BulletList items={newWorldTraits} />
          </div>
        </section>

        <Separator className="bg-border" />

        <section className="space-y-section-10 pb-section-gap" aria-labelledby="wine-types">
          <SectionHeading
            id="wine-types"
            icon={BookOpen}
            eyebrow="2. 와인 종류"
            title="스타일별 특징"
            description="색과 발효 방식에 따라 레드·화이트·로제·스파클링·주정강화로 나눌 수 있습니다."
          />
          <div className="grid grid-cols-1 gap-4">
            {wineKinds.map((kind) => (
              <Card
                key={kind.id}
                className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">{kind.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{kind.lead}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {kind.traitHeading}
                    </p>
                    <BulletList items={kind.traits} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {kind.aromaHeading}
                    </p>
                    <BulletList items={kind.aromas} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="bg-border" />

        <section className="space-y-section-10 pb-section-gap" aria-labelledby="grape-varieties">
          <SectionHeading
            id="grape-varieties"
            icon={Grape}
            eyebrow="3. 대표 포도 품종"
            title="색과 스타일별 품종"
            description="같은 품종이라도 기후와 양조에 따라 향이 크게 달라질 수 있습니다. 아래는 흔히 마주치는 대표 예시입니다."
          />

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary">레드 와인 대표 품종</h3>
            <div className="grid grid-cols-1 gap-4">
              {redGrapeProfiles.map((g) => (
                <Card key={g.name} className="border-border bg-card shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-primary">{g.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <GuideTable
                      headers={['항목', '내용']}
                      rows={g.rows.map((r) => [r.label, r.value])}
                      minWidthClass="min-w-0 w-full"
                      embedded
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary">화이트 와인 대표 품종</h3>
            <div className="grid grid-cols-1 gap-4">
              {whiteGrapeProfiles.map((g) => (
                <Card key={g.name} className="border-border bg-card shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-primary">{g.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <GuideTable
                      headers={['항목', '내용']}
                      rows={g.rows.map((r) => [r.label, r.value])}
                      minWidthClass="min-w-0 w-full"
                      embedded
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-bold text-primary">스파클링 와인 대표 품종</h3>
            <GuideTable
              headers={['품종', '대표 국가', '특징']}
              rows={sparklingGrapes.map((r) => [r.variety, r.country, r.trait])}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-bold text-primary">로제 와인 대표 품종</h3>
            <GuideTable
              headers={['품종', '대표 국가', '특징']}
              rows={roseGrapes.map((r) => [r.variety, r.country, r.trait])}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-bold text-primary">주정강화 와인 대표 품종</h3>
            <GuideTable
              headers={['품종', '대표 국가', '특징']}
              rows={fortifiedGrapes.map((r) => [r.variety, r.country, r.trait])}
            />
          </div>
        </section>

        <Separator className="bg-border" />

        <section className="space-y-section-10 pb-section-gap" aria-labelledby="wine-labels">
          <SectionHeading
            id="wine-labels"
            icon={Tag}
            eyebrow="4. 와인 레이블 읽는 법"
            title="라벨에서 무엇을 보나요?"
            description="생산자·지역·빈티지·품종·도수 등 기본 요소를 읽으면 선택이 훨씬 수월해집니다."
          />

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-bold text-primary">기본 구성 요소</h3>
            <GuideTable
              headers={['항목', '의미']}
              rows={labelBasics.map((r) => [r.term, r.meaning])}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h3 className="text-lg font-bold text-primary">구대륙 레이블 특징</h3>
              <h4 className="mt-4 text-sm font-bold text-foreground">예시</h4>
              <BulletList items={['Bordeaux', 'Bourgogne', 'Chianti']} />
              <h4 className="mt-6 text-sm font-bold text-foreground">특징</h4>
              <BulletList
                items={[
                  '지역명이 크게 표시됨',
                  '품종 표기가 없는 경우 많음',
                  '원산지 규정 중요',
                ]}
              />
              <h4 className="mt-6 text-sm font-bold text-foreground">예시 해석</h4>
              <BulletList
                items={[
                  'Bordeaux → 보르도 지역 와인',
                  'Chablis → 샤르도네 와인 가능성 높음',
                ]}
              />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h3 className="text-lg font-bold text-primary">신대륙 레이블 특징</h3>
              <h4 className="mt-4 text-sm font-bold text-foreground">예시</h4>
              <BulletList items={['Cabernet Sauvignon', 'Chardonnay', 'Pinot Noir']} />
              <h4 className="mt-6 text-sm font-bold text-foreground">특징</h4>
              <BulletList items={['품종명이 크게 표시됨', '이해하기 쉬움', '브랜드 중심 마케팅']} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-bold text-primary">레이블에서 자주 보는 용어</h3>
            <GuideTable
              headers={['용어', '의미']}
              rows={labelTerms.map((r) => [r.term, r.meaning])}
            />
          </div>
        </section>

        <Separator className="bg-border" />

        <section
          className="scroll-mt-24 rounded-2xl border border-primary/30 bg-accent/50 p-6 shadow-sm md:p-8"
          aria-labelledby="beginner-path"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <ListOrdered className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2
                id="beginner-path"
                className="text-xl font-extrabold tracking-tight text-primary md:text-2xl"
              >
                초보자 추천 접근 순서
              </h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-foreground md:text-[15px]">
                {beginnerSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div className="mt-section-gap flex flex-wrap gap-3 pb-section-gap">
          <Button asChild className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/survey">취향 찾기 시작하기</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-primary/40">
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
