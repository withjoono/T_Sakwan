"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://tskool.kr"

type NavItem = { label: string; href: string }

const mainMenu: NavItem[] = [
  { label: "메인", href: "/" },
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
        <nav className="hidden lg:flex items-center space-x-7">
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
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
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
