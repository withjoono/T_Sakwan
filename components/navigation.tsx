"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/use-auth"

const STUDYPLANNER_URL = process.env.NEXT_PUBLIC_STUDYPLANNER_URL || "https://studyplanner.tskool.kr"
const SANGGIBOOK_URL = process.env.NEXT_PUBLIC_SANGGIBOOK_URL || "https://sanggibook.tskool.kr"
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://tskool.kr"

export default function Navigation() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, loginUrl } = useAuth()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">사관</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TS 사관</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            className={`transition-colors text-sm font-medium ${
              pathname === "/" ? "text-red-700" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            홈
          </a>
          <div className="relative group">
            <button className="transition-colors flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
              사관학교 정보
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <a href="/army" className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 first:rounded-t-lg">🟢 육군사관학교</a>
              <a href="/navy" className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">🔵 해군사관학교</a>
              <a href="/airforce" className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">🔷 공군사관학교</a>
              <a href="/nursing" className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 last:rounded-b-lg">🏥 국군간호사관학교</a>
            </div>
          </div>
          <div className="relative group">
            <button className="transition-colors flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
              전형 대비
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <a href="/written-exam" className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 first:rounded-t-lg">1차 필기시험 대비</a>
              <a href="/fitness" className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">체력검정 대비</a>
              <a href="/interview-prep" className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 last:rounded-b-lg">면접 대비</a>
            </div>
          </div>
          <a href="/consulting" className="transition-colors text-sm font-medium text-gray-600 hover:text-gray-900">컨설팅</a>
          <a href="/success-cases" className="transition-colors text-sm font-medium text-gray-600 hover:text-gray-900">합격사례</a>

          {/* 플랫폼 서비스 */}
          <div className="relative group">
            <button className="transition-colors flex items-center text-sm font-medium text-red-700 hover:text-red-800 font-bold">
              플랫폼
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <a href={SANGGIBOOK_URL} className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 first:rounded-t-lg">🎖️ My 생기부 사관 AI 진단</a>
              <a href={STUDYPLANNER_URL} className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">📅 사관학교 맞춤 Planner</a>
              <a href={`${HUB_URL}/dashboard`} className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 last:rounded-b-lg">🏠 T Skool 전체 서비스</a>
            </div>
          </div>
        </nav>

        {/* 로그인/로그아웃 */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.userName}님</span>
              <button onClick={() => { logout(); window.location.href = HUB_URL; }} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">로그아웃</button>
            </div>
          ) : (
            <a href={loginUrl} className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 text-sm font-semibold rounded-lg transition-colors">로그인</a>
          )}
        </div>
      </div>
    </header>
  )
}
