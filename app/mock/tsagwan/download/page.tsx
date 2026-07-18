"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MOCK_ROUNDS,
  PAST_EXAM_LINKS,
  isRoundOpen,
  loadPaid,
  loadRoundScore,
  type MockRound,
  type PaidState,
} from "@/lib/sakwan/mock-products"
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react"

type Tab = "mock" | "past"

export default function DownloadPage() {
  const [tab, setTab] = useState<Tab>("mock")
  const [paid, setPaid] = useState<PaidState | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setPaid(loadPaid())
    setReady(true)
  }, [])

  const unlocked = new Set(paid?.rounds ?? [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-orange-900 py-12">
        <div className="container mx-auto max-w-4xl px-6">
          <Link href="/mock/tsagwan" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-orange-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> T사관 모의고사
          </Link>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <Download className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">문제지 다운로드</span>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">문제지 다운로드 센터</h1>
          <p className="mt-2 text-orange-100">
            T사관 모의고사 회차별 문제지와 사관학교 기출문제를 한 곳에서.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto max-w-4xl px-6">
          {/* 탭 */}
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTab("mock")}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${tab === "mock" ? "bg-white text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              ✨ T사관 모의고사
            </button>
            <button
              onClick={() => setTab("past")}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${tab === "past" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              🎖 기출문제
            </button>
          </div>

          {/* ───────── T사관 모의고사 탭 ───────── */}
          {tab === "mock" && (
            <div className="mt-6">
              {ready && !paid && (
                <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-2 text-sm text-amber-900">
                    <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>아직 결제 내역이 없어요. 응시 신청 후 회차별 문제지를 다운로드할 수 있습니다.</span>
                  </div>
                  <Link href="/mock/tsagwan/checkout?plan=package">
                    <Button className="whitespace-nowrap bg-amber-500 font-bold text-white hover:bg-amber-600">
                      신청하러 가기
                    </Button>
                  </Link>
                </div>
              )}

              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-bold text-gray-900">T사관 모의고사 · 회차별 자료</h2>
              </div>

              <div className="grid gap-4">
                {MOCK_ROUNDS.map((r) => (
                  <RoundCard key={r.round} round={r} unlocked={unlocked.has(r.round)} />
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                ※ 결제한 회차만 다운로드가 열립니다. 7월 5회 패키지 결제 시 1~5회 전체가 열려요.
              </p>
            </div>
          )}

          {/* ───────── 기출문제 탭 ───────── */}
          {tab === "past" && (
            <div className="mt-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">사관학교 기출문제 다운로드</h2>
              </div>
              <p className="mb-5 text-sm text-gray-500">
                기출문제는 사관학교 공식 사이트에서 무료로 제공됩니다. 아래 링크에서 국어·영어·수학 문제지와 정답을 받으세요.
              </p>

              <div className="grid gap-3">
                {PAST_EXAM_LINKS.map((l) => (
                  <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer">
                    <Card className="border-2 border-gray-200 transition-all hover:border-red-300 hover:shadow-sm">
                      <CardContent className="flex items-center justify-between gap-4 p-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                            {l.icon}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{l.name}</div>
                            <div className="text-sm text-gray-500">{l.desc}</div>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-red-700 px-4 py-2.5 text-sm font-bold text-white">
                          기출 받기 <ExternalLink className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                💡 육사 기출은 사관학교 공통 1차시험 문제로, 공군·해군사관학교 지원자도 동일하게 활용할 수 있어요.
                받은 기출은 <Link href="/mock/past" className="font-bold underline">역대 기출 실전 채점</Link>에서 OMR로 바로 채점해 볼 수 있습니다.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/* ───────────── 회차 카드 (문제지 → 채점 안내 → 점수 입력 → 답지·해설) ───────────── */
function RoundCard({ round, unlocked }: { round: MockRound; unlocked: boolean }) {
  const hasFiles = round.questions.length > 0
  // 채점 완료 여부 — 플랫폼 OMR 채점(/mock/exam) 완료 시 저장되는 회차 점수로 판정
  const [scored, setScored] = useState<{ korean: number; math: number; english: number } | null>(null)
  // 오픈 여부 — 지정 날짜(openIso) 이후부터 다운로드 개방. 마운트 후 클라이언트 시각으로 판정.
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isRoundOpen(round))
    const saved = loadRoundScore(round.round)
    if (saved) setScored({ korean: saved.korean, math: saved.math, english: saved.english })
  }, [round])

  // 오픈일 이전: 날짜 잠금 (결제 여부와 무관)
  if (!open) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const d = Math.round((new Date(round.openIso + "T00:00:00").getTime() - today.getTime()) / 86400000)
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900">T사관 모의고사 {round.label}</div>
              <div className="text-sm text-gray-500">{round.date}({round.dow}) 시행 · 국어·수학·영어</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
            <CalendarClock className="h-4 w-4" /> {round.openIso.replace(/-/g, ".")} 오픈{d > 0 ? ` · D-${d}` : ""}
          </span>
        </CardContent>
      </Card>
    )
  }

  // 결제 전: 신청 유도
  if (!unlocked) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900">T사관 모의고사 {round.label}</div>
              <div className="text-sm text-gray-500">
                {round.date}({round.dow}) 시행 {hasFiles ? "· 국어·수학·영어" : "· 문제지 준비중"}
              </div>
            </div>
          </div>
          <Link href="/mock/tsagwan/checkout?plan=package">
            <Button variant="outline" className="whitespace-nowrap border-gray-300 font-bold text-gray-500">
              <Lock className="mr-1.5 h-4 w-4" /> 신청 필요
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-amber-200">
      <CardContent className="p-5">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-gray-900">T사관 모의고사 {round.label}</div>
            <div className="text-sm text-gray-500">{round.date}({round.dow}) 시행</div>
          </div>
        </div>

        {!hasFiles ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
            📦 문제지 준비 중입니다. 시행일에 맞춰 업로드됩니다.
          </div>
        ) : (
          <>
            {/* 1) 문제지 다운로드 */}
            <div className="mt-4">
              <div className="mb-2 text-xs font-bold text-amber-700">STEP 1 · 문제지 다운로드</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {round.questions.map((f) => (
                  <a key={f.subject} href={f.href} download>
                    <Button className="w-full bg-amber-500 font-bold text-white hover:bg-amber-600">
                      <Download className="mr-1.5 h-4 w-4" /> {f.subject} 문제지
                    </Button>
                  </a>
                ))}
              </div>
            </div>

            {/* 채점 안내 (강조) */}
            <div className="mt-4 flex items-start gap-2 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <strong>채점은 반드시 T사관 플랫폼에서 하세요.</strong> 답지로 혼자 채점하지 말고,
                아래 <strong>OMR 채점</strong>으로 답을 입력하면 플랫폼이 실채점하고
                성적분석·취약분석·학교별 예측까지 자동으로 제공합니다.
              </div>
            </div>

            {/* 2) 플랫폼 OMR 채점 */}
            <div className="mt-4">
              <div className="mb-2 text-xs font-bold text-amber-700">STEP 2 · 플랫폼에서 OMR 채점</div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                {scored ? (
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> 채점 완료 (총 {scored.korean + scored.math + scored.english}/300) — 답지·해설서가 열렸어요
                    </span>
                    <Link href={`/mock/exam?type=tsagwan&round=${round.round}`}>
                      <Button variant="outline" className="whitespace-nowrap border-amber-300 font-bold text-amber-700 hover:bg-amber-50">
                        다시 채점
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    <span className="text-sm text-gray-600">
                      문제를 푼 뒤 답을 OMR에 입력하면 플랫폼이 실채점합니다. (채점 완료 시 답지·해설 자동 해제)
                    </span>
                    <Link href={`/mock/exam?type=tsagwan&round=${round.round}`}>
                      <Button className="whitespace-nowrap bg-amber-500 font-bold text-white hover:bg-amber-600">
                        <ClipboardCheck className="mr-1.5 h-4 w-4" /> OMR 채점하러 가기
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* 3) 답지·해설서 (점수 입력 후 해제) */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700">STEP 3 · 답지 · 해설서 다운로드</span>
                {!scored && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400">
                    <Lock className="h-3 w-3" /> 점수 입력 후 열림
                  </span>
                )}
              </div>

              {scored ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <BookOpen className="h-3.5 w-3.5" /> 답지
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {round.answers.map((f) => (
                        <a key={f.subject} href={f.href} download>
                          <Button variant="outline" className="w-full border-amber-300 font-bold text-amber-700 hover:bg-amber-50">
                            <Download className="mr-1.5 h-4 w-4" /> {f.subject} 답지
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <BookOpen className="h-3.5 w-3.5" /> 해설서
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {round.solutions.map((f) => (
                        <a key={f.subject} href={f.href} download>
                          <Button variant="outline" className="w-full border-amber-300 font-bold text-amber-700 hover:bg-amber-50">
                            <Download className="mr-1.5 h-4 w-4" /> {f.subject} 해설서
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                  <Link href="/mock/score-analysis">
                    <Button variant="outline" className="w-full border-gray-300 font-bold text-gray-700 hover:bg-gray-50">
                      <BarChart3 className="mr-1.5 h-4 w-4" /> 내 성적분석 보러가기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
                  🔒 STEP 2에서 과목별 점수를 입력하면 답지와 해설서 다운로드가 열립니다.
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
