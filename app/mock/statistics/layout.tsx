import type React from "react"
import type { Metadata } from "next"

// 로그인 이후에만 의미 있는 앱 화면. 색인 대상이 아니다.
// robots.txt 로 막지 않고 noindex 로 처리한다 — 크롤링을 막으면 크롤러가
// 이 noindex 를 읽지 못해 오히려 색인에서 빠지지 않는다.
export const metadata: Metadata = {
  title: "누적 분석 | T사관",
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
