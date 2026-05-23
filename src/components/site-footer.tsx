'use client';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-page flex-col items-center gap-1 px-5 py-section-8 text-center text-sm text-muted-foreground md:px-8">
        <p className="font-semibold text-foreground">CorkPop - 나의 취향을 이해하는 첫잔</p>
        <p>모든 저작권은 Storynut 에 있습니다</p>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">since 2026</p>
      </div>
    </footer>
  );
}
