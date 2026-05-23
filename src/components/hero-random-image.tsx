'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  {
    src: '/myimg/land-main.png',
    alt: '드론으로 내려다본 광활한 포도밭 전경',
  },
  {
    src: '/myimg/hero-img-2.png',
    alt: '와인과 포도밭을 담은 코르크팝 히어로 이미지',
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
