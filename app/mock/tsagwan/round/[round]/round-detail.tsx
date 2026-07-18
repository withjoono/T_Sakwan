"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import {
  MOCK_ROUNDS,
  PAYMENT_ENABLED,
  isGrantedEmail,
  isRoundOpen,
  loadPaid,
  loadRoundScore,
  type MockRound,
  type PaidState,
} from "@/lib/sakwan/mock-products"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react"

const CHECKOUT = "/mock/tsagwan/checkout?plan=package"

function dday(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(iso + "T00:00:00")
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export default function RoundDetail({ round }: { round: number }) {
  const r: MockRound | undefined = MOCK_ROUNDS.find((x) => x.round === round)

  const { user } = useAuth()
  const granted = isGrantedEmail(user?.email)

  const [ready, setReady] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [paid, setPaid] = useState<PaidState | null>(null)
  const [scored, setScored] = useState(false)

  useEffect(() => {
    if (!r) return
    setDateOpen(isRoundOpen(r))
    setPaid(loadPaid())
    setScored(!!loadRoundScore(r.round))
    setReady(true)
  }, [r])

  if (!r) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="mx-auto max-w-md px-6 py-24 text-center text-gray-500">회차를 찾을 수 없습니다.</div>
      </div>
    )
  }

  // 전체개방 계정(granted)은 결제·오픈일 게이트를 모두 통과
  const open = dateOpen || granted
  const isPaid = !PAYMENT_ENABLED || granted || !!paid?.rounds?.includes(r.round)
  const d = dday(r.openIso)
  const prev = MOCK_ROUNDS.find((x) => x.round === r.round - 1)
  const next = MOCK_ROUNDS.find((x) => x.round === r.round + 1)

  // 다운로드 버튼: 미오픈→잠금 / 미결제→결제창 / 결제→실제 다운로드
  const QuestionButton = ({ subject, href }: { subject: string; href: string }) => {
    if (!open) {
      return (
        <Button disabled className="w-full bg-gray-200 font-bold text-gray-400">
          <Lock className="mr-1.5 h-4 w-4" /> {subject}
        </Button>
      )
    }
    if (!isPaid) {
      return (
        <Link href={CHECKOUT}>
          <Button className="w-full bg-amber-500 font-bold text-white hover:bg-amber-600">
            <Lock className="mr-1.5 h-4 w-4" /> {subject} 문제지
          </Button>
        </Link>
      )
    }
    return (
      <a href={href} download>
        <Button className="w-full bg-amber-500 font-bold text-white hover:bg-amber-600">
          <Download className="mr-1.5 h-4 w-4" /> {subject} 문제지
        </Button>
      </a>
    )
  }

  const SolutionButton = ({ subject, href }: { subject: string; href: string }) => {
    if (!isPaid) {
      return (
        <Link href={CHECKOUT}>
          <Button variant="outline" className="w-full border-gray-300 font-bold text-gray-500">
            <Lock className="mr-1.5 h-4 w-4" /> {subject}
          </Button>
        </Link>
      )
    }
    if (!scored) {
      return (
        <Button disabled variant="outline" className="w-full border-gray-200 font-bold text-gray-400">
          <Lock className="mr-1.5 h-4 w-4" /> {subject}
        </Button>
      )
    }
    return (
      <a href={href} download>
        <Button variant="outline" className="w-full border-amber-300 font-bold text-amber-700 hover:bg-amber-50">
          <Download className="mr-1.5 h-4 w-4" /> {subject}
        </Button>
      </a>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-900 py-12">
        <div className="container mx-auto max-w-4xl px-6">
          <Link href="/mock/tsagwan" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-orange-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> T사관 모의고사
          </Link>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">2027 대비 · T사관 모의고사</span>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{r.label} 모의고사</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold text-white">
              <CalendarClock className="h-4 w-4 text-amber-200" />
              시행 {r.date}({r.dow})
            </span>
            {ready && (
              open ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 font-bold text-white">
                  <CheckCircle2 className="h-4 w-4" /> 오픈됨 · 다운로드 가능
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 font-bold text-white">
                  <Lock className="h-4 w-4" /> {r.openIso.replace(/-/g, ".")} 오픈 {d > 0 ? `· D-${d}` : ""}
                </span>
              )
            )}
          </div>
          <p className="mt-3 text-sm text-orange-100">국어 30 · 영어 30 · 수학 30(공통 22 + 선택 8) · 300점 만점</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto max-w-4xl space-y-6 px-6">
          {/* 미오픈 배너 */}
          {ready && !open && (
            <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              <CalendarClock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <strong>{r.openIso.replace(/-/g, ".")}({r.dow})에 오픈됩니다.</strong> 오픈일 이후 문제지·답지·해설서를 다운로드할 수 있어요.
                {d > 0 && <> (D-{d})</>}
              </div>
            </div>
          )}

          {/* 무료/결제 안내 */}
          {ready && open && !isPaid && (
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2 text-sm text-amber-900">
                <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>내용은 누구나 볼 수 있어요. <strong>다운로드하려면 결제</strong>가 필요하며, 결제 시 <strong>1~5회 전체</strong>가 열립니다.</span>
              </div>
              <Link href={CHECKOUT}>
                <Button className="whitespace-nowrap bg-amber-500 font-bold text-white hover:bg-amber-600">
                  7월 5회 패키지 결제
                </Button>
              </Link>
            </div>
          )}

          {/* STEP 1 · 문제집 */}
          <Card className="border-2 border-amber-200">
            <CardContent className="p-6">
              <div className="mb-1 flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-bold text-gray-900">STEP 1 · 문제집 다운로드</h2>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                {open ? "국어·수학·영어 문제지를 받아 실제 시험처럼 풀어보세요." : `${r.openIso.replace(/-/g, ".")} 오픈 예정입니다.`}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {r.questions.map((f) => (
                  <QuestionButton key={f.subject} subject={f.subject} href={f.href} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* STEP 2 · 채점 */}
          <Card className="border-2 border-red-200">
            <CardContent className="p-6">
              <div className="mb-1 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">STEP 2 · 플랫폼에서 채점</h2>
              </div>
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                <span>
                  <strong>채점은 반드시 플랫폼에서.</strong> 답을 OMR에 입력하면 실채점되고 성적분석·취약분석·학교별 예측까지 자동 제공됩니다.
                  <strong> 정답 입력(채점)을 마쳐야 답지·해설서 다운로드가 열립니다.</strong>
                </span>
              </div>
              {open ? (
                <Link href={`/mock/exam?type=tsagwan&round=${r.round}`}>
                  <Button className="bg-red-700 font-bold text-white hover:bg-red-800">
                    <ClipboardCheck className="mr-1.5 h-4 w-4" /> {scored ? "다시 채점하기" : "OMR 채점하러 가기"} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button disabled className="bg-gray-200 font-bold text-gray-400">
                  <Lock className="mr-1.5 h-4 w-4" /> 오픈 후 채점 가능
                </Button>
              )}
              {ready && open && scored && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> 채점 완료 — 아래 답지·해설서가 열렸어요
                </p>
              )}
            </CardContent>
          </Card>

          {/* STEP 3 · 답지·해설서 */}
          <Card className="border-2 border-amber-200">
            <CardContent className="p-6">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-gray-900">STEP 3 · 답지 · 해설서</h2>
                </div>
                {ready && open && isPaid && !scored && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400">
                    <Lock className="h-3 w-3" /> 정답 입력 후 열림
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-gray-500">
                답지·해설서는 <strong className="text-gray-700">플랫폼에 정답을 입력(채점)한 뒤</strong> 다운로드할 수 있어요.
              </p>

              {!open ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
                  🔒 {r.openIso.replace(/-/g, ".")} 오픈 후 이용할 수 있습니다.
                </div>
              ) : !isPaid ? (
                <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
                  <span className="text-sm text-amber-900">결제 후 채점을 완료하면 답지·해설서가 열립니다.</span>
                  <Link href={CHECKOUT}>
                    <Button className="whitespace-nowrap bg-amber-500 font-bold text-white hover:bg-amber-600">결제하고 이용</Button>
                  </Link>
                </div>
              ) : !scored ? (
                <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center">
                  <span className="text-sm text-gray-600">아직 채점 전이에요. STEP 2에서 정답을 입력하면 열립니다.</span>
                  <Link href={`/mock/exam?type=tsagwan&round=${r.round}`}>
                    <Button variant="outline" className="whitespace-nowrap border-amber-300 font-bold text-amber-700 hover:bg-amber-50">
                      채점하러 가기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="mb-2 text-xs font-bold text-gray-500">답지</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {r.answers.map((f) => (
                        <SolutionButton key={f.subject} subject={`${f.subject} 답지`} href={f.href} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="mb-2 text-xs font-bold text-gray-500">해설서</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {r.solutions.map((f) => (
                        <SolutionButton key={f.subject} subject={`${f.subject} 해설서`} href={f.href} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 회차 네비 */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {prev ? (
              <Link href={`/mock/tsagwan/round/${prev.round}`} className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> {prev.label}
              </Link>
            ) : <span />}
            <Link href="/mock/tsagwan" className="text-sm font-semibold text-amber-700 hover:text-amber-800">전체 회차</Link>
            {next ? (
              <Link href={`/mock/tsagwan/round/${next.round}`} className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                {next.label} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : <span />}
          </div>
        </div>
      </section>
    </div>
  )
}
