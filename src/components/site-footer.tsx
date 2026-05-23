'use client';

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-1 px-5 py-8 text-center text-sm text-stone-600 md:px-8">
        <p className="font-semibold text-stone-800">MyWineType - 나의 취향을 이해하는 첫잔</p>
        <p>모든 저작권은 Storynut 에 있습니다</p>
        <p className="text-xs uppercase tracking-[0.24em] text-stone-500">since 2026</p>
      </div>
    </footer>
  );
}
