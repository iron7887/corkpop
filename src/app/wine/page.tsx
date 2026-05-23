'use client';

import { WineGuidePageContent } from '@/features/wine-guide/components/wine-guide-page';
import { use } from 'react';

export default function WineGuidePage({
  params,
}: {
  params: Promise<Record<string, string | string[] | undefined>>;
}) {
  use(params);
  return <WineGuidePageContent />;
}
