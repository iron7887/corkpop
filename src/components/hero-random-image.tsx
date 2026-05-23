'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  {
    src: '/myimg/hero-main-01.png',
    alt: '코르크팝 히어로 이미지 1',
  },
  {
    src: '/myimg/hero-main-02.png',
    alt: '코르크팝 히어로 이미지 2',
  },
  {
    src: '/myimg/hero-main-03.png',
    alt: '코르크팝 히어로 이미지 3',
  },
] as const;

type HeroImage = (typeof HERO_IMAGES)[number];

function pickRandomHeroImage(): HeroImage {
  const index = Math.floor(Math.random() * HERO_IMAGES.length);
  return HERO_IMAGES[index] ?? HERO_IMAGES[0];
}

export function HeroRandomImage({ className }: { className?: string }) {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);

  useEffect(() => {
    setHeroImage(pickRandomHeroImage());
  }, []);

  if (!heroImage) {
    return (
      <div
        className={cn(
          'aspect-[160/63] min-h-[154px] w-full animate-pulse bg-muted sm:aspect-[210/63]',
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={heroImage.src}
      alt={heroImage.alt}
      className={cn(
        'aspect-[160/63] min-h-[154px] w-full object-cover sm:aspect-[210/63]',
        className,
      )}
      draggable={false}
    />
  );
}
