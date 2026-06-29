"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { Bell, ChevronDown, Compass, CreditCard, Home, LayoutGrid, Users } from "lucide-react"

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://tskool.kr"

// 허브(tskool.kr) 기능 — 최종 경로는 허브 작업장에서 연결.
// geobuk-shared 아이콘 세트로 교체 시 아래 아이콘만 바꾸면 됩니다.
const HUB_LINKS = {
  allApps: HUB_URL,
  payment: `${HUB_URL}/payment`,
  notifications: `${HUB_URL}/notifications`,
  accountShare: `${HUB_URL}/account/share`,
}

type NavItem = { label: string; href: string }

const mainMenu: NavItem[] = [
  { label: "사관/경찰 모의", href: "/mock" },
  { label: "플래너", href: "/planner" },
  { label: "생기부 관리", href: "/sanggibu" },
  { label: "멘토링", href: "/mentoring" },
]

const classMenu: NavItem[] = [
  { label: "🟢 육사반", href: "/class/army" },
  { label: "🔷 공사반", href: "/class/airforce" },
  { label: "🔵 해사반", href: "/class/navy" },
  { label: "🏥 국간사반", href: "/class/nursing" },
  { label: "👮 경찰대반", href: "/class/police" },
]

// 인트로 = 사관 전체 프로모 페이지 모음
const promoCore: NavItem[] = [
  { label: "메인", href: "/" },
  { label: "사관/경찰 모의", href: "/mock" },
  { label: "플래너", href: "/planner" },
  { label: "생기부 관리", href: "/sanggibu" },
  { label: "멘토링", href: "/mentoring" },
  { label: "2차면접", href: "/interview" },
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, loginUrl } = useAuth()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const isClassActive = pathname.startsWith("/class/")

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">사관</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TS 사관</span>
        </Link>

        {/* 메인 메뉴 */}
        <nav className="hidden lg:flex items-center space-x-5">
          {/* T스쿨 전체 앱 */}
          <a
            href={HUB_LINKS.allApps}
            title="T스쿨 전체 앱"
            aria-label="T스쿨 전체 앱"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LayoutGrid className="h-5 w-5" />
          </a>

          {/* 인트로 — 사관 전체 프로모 페이지 드롭다운 */}
          <div className="relative group">
            <button
              title="인트로 — 전체 프로모"
              aria-label="인트로 — 전체 프로모 페이지"
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Compass className="h-5 w-5" />
              <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                사관 프로모
              </div>
              {promoCore.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-1 border-t border-gray-100 px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                클래스
              </div>
              {classMenu.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${
                    idx === classMenu.length - 1 ? "rounded-b-lg" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 홈 (기존 메인) */}
          <Link
            href="/"
            title="홈"
            aria-label="홈"
            className={`transition-colors ${isActive("/") ? "text-red-700" : "text-gray-500 hover:text-gray-900"}`}
          >
            <Home className="h-5 w-5" />
          </Link>

          {/* 구분선 */}
          <span className="h-5 w-px bg-gray-200" aria-hidden="true" />

          {mainMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors text-sm font-medium ${
                isActive(item.href) ? "text-red-700" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* 클래스 드롭다운 */}
          <div className="relative group">
            <button
              className={`transition-colors flex items-center text-sm font-medium ${
                isClassActive ? "text-red-700" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              클래스
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {classMenu.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${
                    idx === 0 ? "rounded-t-lg" : ""
                  } ${idx === classMenu.length - 1 ? "rounded-b-lg" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/interview"
            className={`transition-colors text-sm font-medium ${
              isActive("/interview") ? "text-red-700" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            2차면접
          </Link>

          {/* 구분선 */}
          <span className="h-5 w-px bg-gray-200" aria-hidden="true" />

          {/* 허브 기능 — 결제 / 알림 / 계정공유 */}
          <a
            href={HUB_LINKS.payment}
            title="결제"
            aria-label="결제"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <CreditCard className="h-5 w-5" />
          </a>
          <a
            href={HUB_LINKS.notifications}
            title="알림"
            aria-label="알림"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Bell className="h-5 w-5" />
          </a>
          <a
            href={HUB_LINKS.accountShare}
            title="계정공유"
            aria-label="계정공유"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Users className="h-5 w-5" />
          </a>
        </nav>

        {/* 로그인/로그아웃 */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.userName}님</span>
              <button
                onClick={() => {
                  logout()
                  window.location.href = HUB_URL
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <a
              href={loginUrl}
              className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            >
              로그인
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
