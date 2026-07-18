"use client"

import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  FlaskConical,
  Sparkles,
  Trophy,
} from "lucide-react"

/* ───────── 2027 대비 T사관 모의고사 일정 (7월 5회) + 전형일 ───────── */
type CalEvent = { label: string; type: "mock" | "exam" }
type TrailingDay = { text: string; label: string; type: "mock" | "exam" }

const JULY_EVENTS: Record<number, CalEvent> = {
  11: { label: "1회", type: "mock" },
  18: { label: "2회", type: "mock" },
  21: { label: "3회", type: "mock" },
  25: { label: "4회", type: "mock" },
  28: { label: "5회", type: "mock" },
}
const JULY_TRAILING: TrailingDay[] = [{ text: "8/1", label: "전형일", type: "exam" }]

type Round = { round: string; date: string; dow: string; iso: string; status: "open" | "soon" }
const ROUNDS: Round[] = [
  { round: "1회", date: "7/11", dow: "토", iso: "2026-07-11", status: "open" },
  { round: "2회", date: "7/18", dow: "토", iso: "2026-07-18", status: "soon" },
  { round: "3회", date: "7/21", dow: "화", iso: "2026-07-21", status: "soon" },
  { round: "4회", date: "7/25", dow: "토", iso: "2026-07-25", status: "soon" },
  { round: "5회", date: "7/28", dow: "화", iso: "2026-07-28", status: "soon" },
]

const STRENGTHS = [
  { icon: FlaskConical, title: "신유형 자체 출제", desc: "최신 출제 경향을 반영한 T사관 오리지널 문항. 기출을 다 본 학생을 위한 새 문제." },
  { icon: Trophy, title: "전국 석차·백분위", desc: "같은 회차 전국 응시자 기준 내 위치. 표준점수·백분위·등급까지 제공." },
  { icon: BarChart3, title: "취약 리포트", desc: "단원별 정답률과 취약 유형 TOP3를 응시 직후 자동 분석." },
]

function daysUntil(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(iso + "T00:00:00")
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export default function TsagwanMockPage() {
  const { isAuthenticated } = useAuth()

  // 다가오는 첫 회차 D-day
  const upcoming = ROUNDS.find((r) => daysUntil(r.iso) >= 0) ?? ROUNDS[0]
  const dday = daysUntil(upcoming.iso)
  const ddayLabel = dday === 0 ? "D-DAY" : dday > 0 ? `D-${dday}` : "종료"

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-orange-900 py-16">
        <div className="container relative mx-auto max-w-5xl px-6">
          <Link href="/mock" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-orange-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> 모의고사 홈
          </Link>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <Sparkles className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">T사관 자체 제작</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            실제 시험처럼,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              전국에서 나의 위치를.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-orange-100">
            T사관이 직접 출제한 신유형 실전 모의고사. 7월 총 5회 · 정해진 시간에 응시 · 전국 석차와 취약 리포트까지.
          </p>
          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-4 py-2 text-sm font-bold text-white">
              🔥 {upcoming.round} {upcoming.date}({upcoming.dow}) · {ddayLabel} · 지금 신청 가능
            </span>
          </div>
        </div>
      </section>

      {/* 7월 일정 캘린더 */}
      <section className="border-b border-gray-100 bg-white py-14">
        <div className="container mx-auto max-w-5xl px-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2">
            <Calendar className="h-4 w-4 text-red-700" />
            <span className="text-sm font-semibold text-red-700">7월 일정</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">7월, 총 5회 시행</h2>
          <p className="text-gray-600">
            7월 5회(7/11·18·21·25·28) 시행. 경찰대·사관학교 전형일은{" "}
            <strong className="text-red-700">8월 1일(토)</strong> — 달력 끝에 표시.
          </p>

          <div className="mx-auto mt-8 max-w-lg">
            <MonthCalendar label="2026년 7월" firstDow={3} daysInMonth={31} events={JULY_EVENTS} trailing={JULY_TRAILING} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded bg-amber-100 ring-1 ring-amber-300" /> 모의고사 (1~5회)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded bg-red-600" /> 경찰대·사관 전형일
            </span>
          </div>
        </div>
      </section>

      {/* 회차별 신청 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
            <Calendar className="h-4 w-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-700">회차별 신청</span>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">응시할 회차를 선택하세요</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ROUNDS.map((r, i) => {
              const isOpen = r.status === "open"
              return (
                <Link
                  key={r.round}
                  href={`/mock/tsagwan/round/${i + 1}`}
                  className={`rounded-2xl border-2 p-4 text-center transition-all hover:shadow-sm ${
                    isOpen ? "border-amber-300 bg-amber-50 hover:border-amber-400" : "border-gray-200 bg-white hover:border-amber-200"
                  }`}
                >
                  <div className={`text-xs font-bold ${isOpen ? "text-amber-700" : "text-gray-500"}`}>{r.round}</div>
                  <div className="mt-0.5 text-xl font-black text-gray-900">{r.date}</div>
                  <div className="text-xs text-gray-500">({r.dow})</div>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isOpen ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isOpen ? "바로가기" : "예정"}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/mock/tsagwan/checkout?plan=package">
              <Button size="lg" className="bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                7월 5회 패키지 신청 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="max-w-md text-center text-sm text-gray-500">
              5회 패키지 하나로 <strong className="text-amber-700">기출까지 풀며 현재 위치를 파악</strong>하고,
              회차마다 취약 유형까지 분석받을 수 있어요.
            </p>
            {!isAuthenticated && <span className="text-xs text-gray-500">※ 신청·결과 저장에는 로그인이 필요합니다</span>}
          </div>
        </div>
      </section>

      {/* 왜 T사관 모의인가 */}
      <section className="border-b border-gray-100 bg-white py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1">
            <Sparkles className="h-4 w-4 text-purple-700" />
            <span className="text-xs font-bold text-purple-700">왜 T사관 모의인가</span>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">기출과 다른 3가지</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {STRENGTHS.map((s) => (
              <Card key={s.title} className="border-gray-200">
                <CardContent className="p-6">
                  <s.icon className="mb-3 h-6 w-6 text-purple-600" />
                  <div className="font-bold text-gray-900">{s.title}</div>
                  <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 응시 후 리포트 미리보기 */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
            <Award className="h-4 w-4 text-red-700" />
            <span className="text-xs font-bold text-red-700">응시 후 리포트 미리보기</span>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">이런 성적표를 받아요</h2>

          <Card className="border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-500">T사관 모의 1회 · 사관 종합 <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">예시</span></div>
                  <div className="text-5xl font-black text-red-700">
                    262<span className="text-lg font-bold text-gray-400">/300</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">전국 석차</div>
                  <div className="text-2xl font-black text-purple-700">상위 12%</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {[
                  { v: "92", l: "국어", c: "text-red-700" },
                  { v: "85", l: "영어", c: "text-red-700" },
                  { v: "85", l: "수학", c: "text-red-700" },
                  { v: "2등급", l: "종합", c: "text-emerald-600" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-gray-200 p-3 text-center">
                    <div className={`text-xl font-black ${s.c}`}>{s.v}</div>
                    <div className="text-[11px] text-gray-500">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                💡
                <span>
                  취약 유형: 수학 미적분-극한(정답률 32%), 국어 비문학-사회(41%). 다음 회차 전 집중 보완을 추천해요.
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/mock/tsagwan/checkout?plan=package">
              <Button size="lg" className="bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                7월 5회 패키지 신청 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ───────────── 달력 컴포넌트 (8/1 전형일을 7월 끝에 이어붙임) ───────────── */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]
type CalCell = { text: string; event?: CalEvent; nextMonth?: boolean }

function MonthCalendar({
  label,
  firstDow,
  daysInMonth,
  events,
  trailing = [],
}: {
  label: string
  firstDow: number
  daysInMonth: number
  events: Record<number, CalEvent>
  trailing?: TrailingDay[]
}) {
  const cells: (CalCell | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push({ text: String(d), event: events[d] })
  for (const t of trailing) cells.push({ text: t.text, event: { label: t.label, type: t.type }, nextMonth: true })
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-center text-lg font-bold text-gray-900">{label}</div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`pb-2 text-xs font-bold ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-400"}`}
          >
            {w}
          </div>
        ))}
        {cells.map((c, i) => {
          if (c === null) return <div key={i} className="aspect-square" />
          const ev = c.event
          const dow = i % 7
          const base = "flex aspect-square flex-col items-center justify-center rounded-lg text-sm"
          const tone =
            ev?.type === "exam"
              ? "bg-red-600 font-bold text-white shadow-sm"
              : ev?.type === "mock"
                ? "bg-amber-100 font-bold text-amber-800 ring-1 ring-amber-300"
                : c.nextMonth
                  ? "text-gray-300"
                  : dow === 0
                    ? "text-red-400"
                    : dow === 6
                      ? "text-blue-400"
                      : "text-gray-700"
          return (
            <div key={i} className={`${base} ${tone}`}>
              <span className={c.nextMonth && !ev ? "opacity-40" : ""}>{c.text}</span>
              {ev ? <span className="mt-0.5 text-[9px] font-bold leading-none">{ev.label}</span> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
