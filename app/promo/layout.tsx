import Navigation from "@/components/navigation"
import PromoTabs from "./promo-tabs"
import "./promo.css"

// /promo · /promo/guide · /promo/blog 공용 레이아웃.
// 2026-10: 크림슨 색 변수 덮어쓰기를 걷어내고 홈 리디자인(네이비·아이보리) 톤과 공통 헤더로 통일.
// 루트 SiteFooter 는 /promo 에서 숨겨지므로 여기서 푸터를 그린다.
export default function PromoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="pm-root min-h-screen">
      <Navigation />
      <PromoTabs />
      {children}
      <footer className="pm-footer">
        © 거북스쿨 · T사관 — 육·해·공군 사관학교 · 국군간호사관학교 · 경찰대 입시 준비
        <br />
        T스쿨 공통 계정으로 이용합니다 ·{" "}
        <a href="https://tskool.kr" target="_blank" rel="noopener noreferrer">
          tskool.kr
        </a>
      </footer>
    </div>
  )
}
