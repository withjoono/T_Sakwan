"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// 허브(거북스쿨) 소유 자산·정책 페이지. geobuk-shared 공용 Footer 와 동일 출처.
const HUB = "https://www.tskool.kr"

// geobuk-shared 공용 Footer 에서 좌측 "로고" 열은 빼고, 중간(사업자정보+정책) + 우측(소셜)만 옮긴 푸터.
export function SiteFooter() {
  const pathname = usePathname()
  // 프로모(/promo)는 자체 푸터가 있으므로 전역 푸터를 생략(중복 방지).
  if (pathname.startsWith("/promo")) return null

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10">
          {/* 좌측: 헤더 메뉴와 동일한 로고 + T사관 */}
          <Link href="/" className="flex items-center justify-center gap-2 sm:justify-start">
            <img src="/ts-logo.png" alt="T사관" className="h-10 w-10 object-contain" />
            <span className="text-lg font-bold text-gray-900">T사관</span>
          </Link>

          {/* 중간: 사업자 정보 + 정책 링크 */}
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div className="flex flex-col gap-1 text-xs text-gray-500 sm:text-sm">
              <span>사업체명 (주)거북스쿨 | 대표 강준호</span>
              <span>사업자등록번호 772-87-02782 | 연락처 010-2518-7139 / 042-484-3356</span>
              <span>서울시 성북구 화랑로 211 성북구 기술창업센터 105호</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-1 text-sm font-medium sm:justify-start">
              <a
                href={`${HUB}/explain/service`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                이용약관
              </a>
              <a
                href={`${HUB}/explain/refund`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                환불규정
              </a>
              <a
                href={`${HUB}/explain/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-900 hover:underline"
              >
                개인정보처리방침
              </a>
            </div>
          </div>

          {/* 우측: 소셜 채널 */}
          <div className="flex items-center justify-center gap-4 sm:justify-end">
            <a
              href="https://www.youtube.com/@turtleschool_official"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
              aria-label="YouTube"
            >
              <img className="h-10 w-10 rounded-lg" src={`${HUB}/icons/youtube.png`} alt="YouTube" />
            </a>
            <a
              href="https://cafe.naver.com/turtlecorp"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
              aria-label="네이버 카페"
            >
              <img className="h-10 w-10 rounded-lg" src={`${HUB}/icons/naver-cafe.png`} alt="네이버 카페" />
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-3 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} (주)거북스쿨. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
