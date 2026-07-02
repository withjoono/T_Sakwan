import Link from "next/link";
import { ArrowRight, Home, Sparkles, BookOpenCheck, Newspaper } from "lucide-react";

const NAV_ITEMS = [
  { href: "/promo", label: "홈", icon: Home, exact: true },
  { href: "/promo", label: "기능 소개", icon: Sparkles },
  { href: "/promo/guide", label: "사용법", icon: BookOpenCheck },
  { href: "/promo/blog", label: "블로그", icon: Newspaper },
];

export default function PromoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="min-h-screen bg-background"
      style={
        {
          // T 사관(사관·경찰) 브랜드: 딥 네이비 계열로 promo 페이지에만 스코프.
          // Sakwan globals.css 는 색상을 공백 구분 RGB 채널로 정의하므로 동일 포맷 사용.
          "--primary": "30 58 95",
          "--primary-foreground": "255 255 255",
        } as React.CSSProperties
      }
    >
      {/* ===== TOP NAV ===== */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/promo" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              사
            </div>
            <span className="text-base font-semibold text-foreground">T 사관</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            시작하기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* feature tabs */}
        <nav className="border-t bg-card/50">
          <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
            <ul className="flex min-w-max items-center gap-1 py-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {children}

      <footer className="border-t bg-card py-8 text-center text-xs text-muted-foreground">
        © 거북스쿨 · T 사관 (육·해·공군 사관학교 · 국군간호사관학교 · 경찰대 진학 전문) ·{" "}
        <a
          href="https://www.tskool.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          tskool.kr
        </a>
      </footer>
    </div>
  );
}
