"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { matchAll, matchCutoff, SCHOOL_META, type SchoolKey } from "@/lib/sakwan/cutoffs"
import { getExamFormat } from "@/lib/sakwan/exam-format"
import { loadScores } from "@/lib/sakwan/scores-store"
import { ANSWER_KEY_AVAILABLE } from "@/lib/sakwan/answer-keys"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"

type ExamTrack = "saagwan" | "police"
type ExamSource = "past" | "mock"

const PAST_YEARS = [2026, 2025, 2024, 2023, 2022] as const
const MOCK_OPEN_DATE = "2026년 6월 중"

const WEAK_TOPICS = [
  { name: "수학 미적분 — 극한", rate: 32 },
  { name: "국어 비문학 — 사회", rate: 41 },
  { name: "수학 선택 — 기하 회전체", rate: 48 },
]

export default function MockPage() {
  const [track, setTrack] = useState<ExamTrack>("saagwan")
  const [source, setSource] = useState<ExamSource>("past")
  const [pastYear, setPastYear] = useState<number>(2026)
  const [crossStream, setCrossStream] = useState<"humanities" | "science">("science")
  const [manualScore, setManualScore] = useState<number>(258)
  const { user, isAuthenticated } = useAuth()

  // Sakwan 자체 저장소(Firestore/localStorage)에서 최근 점수 로드
  const [latestScore, setLatestScore] = useState<number | null>(null)
  const [latestMeta, setLatestMeta] = useState<{ year: number; track: ExamTrack } | null>(null)

  useEffect(() => {
    if (!user?.id) return
    void loadScores(String(user.id)).then((arr) => {
      if (arr[0]) {
        setLatestScore(arr[0].totalScore)
        setLatestMeta({ year: arr[0].year, track: arr[0].track as ExamTrack })
      }
    })
  }, [user?.id])

  const myScore = latestScore ?? manualScore
  const scoreSource = latestScore !== null ? "exam" : "manual"

  const matchedSchools = matchAll(myScore)
  const visibleSchools = matchedSchools.filter((m) =>
    track === "saagwan" ? m.meta.track === "saagwan" : m.meta.track === "police",
  )
  const examFormat = getExamFormat(track)

  const examLink = `/mock/exam?track=${track}&year=${pastYear}`
  const sourceEnabled = source === "past"
  const keyAvailable = ANSWER_KEY_AVAILABLE[`${track}-${pastYear}`]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-slate-900 py-20">
        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <Trophy className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">TS 사관 모의고사</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            사관·경찰 전용 OMR로 응시,
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
              바로 합격선 매칭.
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-red-100">
            기출 2022~2026은 지금 응시 가능. 모의문제는 6월 오픈 예정.
          </p>
        </div>
      </section>

      {/* 트랙 탭 */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto flex max-w-md rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTrack("saagwan")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${track === "saagwan" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              사관학교 모의
            </button>
            <button
              onClick={() => setTrack("police")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${track === "police" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              경찰대 모의
            </button>
          </div>
        </div>
      </section>

      {/* 응시 선택 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
              <FileText className="h-4 w-4 text-red-700" />
              <span className="text-xs font-bold text-red-700">응시할 시험 선택</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {track === "saagwan" ? "사관학교" : "경찰대"} — 기출 또는 모의문제
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* 기출문제 카드 */}
            <Card className={`border-2 transition-all ${source === "past" ? "border-red-400 shadow-md" : "border-gray-200 hover:border-red-200"}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">📚 기출문제</CardTitle>
                    <CardDescription>2022~2026 연도별 OMR 응시</CardDescription>
                  </div>
                  <button
                    onClick={() => setSource("past")}
                    className={`h-5 w-5 rounded-full border-2 transition-all ${source === "past" ? "border-red-600 bg-red-600" : "border-gray-300 bg-white"}`}
                    aria-label="기출문제 선택"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <label className="mb-2 block text-xs font-bold text-gray-500">연도 선택</label>
                <div className="flex flex-wrap gap-2">
                  {PAST_YEARS.map((y) => {
                    const available = ANSWER_KEY_AVAILABLE[`${track}-${y}`]
                    return (
                      <button
                        key={y}
                        onClick={() => {
                          setSource("past")
                          setPastYear(y)
                        }}
                        className={`flex items-center gap-1 rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-all ${
                          source === "past" && pastYear === y
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-red-200"
                        }`}
                      >
                        {y}년
                        {!available ? <span className="text-[9px] text-amber-600">·정답 미입력</span> : null}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  선택한 연도의 1차 기출 그대로 OMR로 응시
                </div>
              </CardContent>
            </Card>

            {/* 모의문제 카드 */}
            <Card className={`border-2 transition-all ${source === "mock" ? "border-amber-400 shadow-md" : "border-gray-200"} opacity-75`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      ✨ 모의문제 <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">곧 오픈</span>
                    </CardTitle>
                    <CardDescription>TS 사관 자체 제작 신규 모의문제</CardDescription>
                  </div>
                  <button
                    onClick={() => setSource("mock")}
                    className={`h-5 w-5 rounded-full border-2 transition-all ${source === "mock" ? "border-amber-600 bg-amber-600" : "border-gray-300 bg-white"}`}
                    aria-label="모의문제 선택"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                    <div>
                      <div className="text-sm font-bold text-amber-900">{MOCK_OPEN_DATE} 오픈 예정</div>
                      <div className="mt-1 text-xs text-amber-800">
                        매월 신규 회차를 제작·공개합니다. 기출과 동일한 형식·난이도.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {sourceEnabled ? (
              <Link href={examLink}>
                <Button size="lg" className="rounded-lg bg-red-700 px-8 py-6 text-lg font-bold text-white hover:bg-red-800">
                  {pastYear}년 {track === "saagwan" ? "사관" : "경찰대"} 응시 시작 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" disabled className="rounded-lg bg-gray-300 px-8 py-6 text-lg font-bold text-gray-500">
                {MOCK_OPEN_DATE} 오픈 예정
              </Button>
            )}
            {!isAuthenticated && (
              <span className="text-xs text-gray-500">※ 응시 결과 저장에는 로그인이 필요합니다</span>
            )}
          </div>
          {sourceEnabled && !keyAvailable && (
            <p className="mt-3 text-center text-xs text-amber-700">
              ⚠ {pastYear}년 정답표 미입력 — 응시는 가능하나 채점은 placeholder 기준 (실제 점수와 다를 수 있음)
            </p>
          )}
        </div>
      </section>

      {/* 점수 소스 카드 */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto max-w-5xl px-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-1 text-xs font-bold text-gray-500">분석 기준 점수</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-red-700">{myScore}</span>
                    <span className="text-sm font-bold text-gray-500">/ 300점</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        scoreSource === "exam"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {scoreSource === "exam" ? (
                        <>실제 응시 ({latestMeta?.year}년)</>
                      ) : (
                        "임시 입력값"
                      )}
                    </span>
                  </div>
                  {latestMeta && (
                    <Link href="/mock/result" className="mt-1 inline-block text-xs text-blue-600 hover:underline">
                      최근 결과 자세히 보기 →
                    </Link>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={300}
                    value={manualScore}
                    onChange={(e) => {
                      setManualScore(Number(e.target.value))
                      setLatestScore(null)
                    }}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <span className="text-xs text-gray-500">또는 실제 응시 →</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 시험 형식 안내 */}
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              <BookOpen className="h-4 w-4 text-blue-700" />
              <span className="text-xs font-bold text-blue-700">
                {track === "saagwan" ? "사관학교" : "경찰대"} 1차 시험 형식
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">시험 구성</h2>
            <p className="mt-2 text-sm text-gray-500">
              {track === "saagwan"
                ? "수능과 다른 사관학교 전용 형식. Sakwan OMR도 이 형식 그대로 구현."
                : "경찰대 1차 형식 (확인 중)."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {examFormat.sections.map((sec) => (
              <Card key={sec.name} className="border-2 border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-baseline justify-between text-lg">
                    <span>{sec.name}</span>
                    <span className="text-2xl font-black text-red-700">{sec.totalQuestions}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    총 {sec.totalQuestions}문항{sec.rawMaxScore ? ` · ${sec.rawMaxScore}점` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sec.parts.map((p, i) => (
                      <li key={i} className="flex items-start justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs">
                        <div>
                          <div className="font-bold text-gray-900">{p.label}</div>
                          {p.note ? <div className="mt-0.5 text-[10px] text-gray-500">{p.note}</div> : null}
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[11px] text-gray-700">{p.range[0]}–{p.range[1]}</div>
                          <div className="text-[10px] text-gray-500">{p.type}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {sec.electives ? (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <div className="text-[10px] font-bold text-gray-500">선택과목</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {sec.electives.map((e) => (
                          <span key={e} className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">{e}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
            <div>
              <strong>OMR 응시 방식:</strong> 문제지(PDF/종이)를 보면서 Sakwan에서 답안만 입력 → 자동 채점 → 합격선 매칭까지 즉시.
              문제 본문은 별도 제공(추후 PDF 다운로드 예정).
            </div>
          </div>
        </div>
      </section>

      {/* 과거 합격 분석 */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
              <BarChart3 className="h-4 w-4 text-red-700" />
              <span className="text-xs font-bold text-red-700">과거 합격 분석</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">내 점수 vs 작년 합격선</h2>
          </div>

          <Card className="border-gray-200">
            <CardContent className="space-y-6 p-8">
              {visibleSchools.map(({ key, meta, pass, diff, cut }) => {
                const max = 300
                const myPct = (myScore / max) * 100
                const cutPct = (cut / max) * 100
                return (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {meta.icon} {meta.name}{" "}
                        <span className="text-xs text-gray-400">(2025 합격컷 {cut})</span>
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {pass ? `✓ 합격선 +${diff}` : `✗ 합격선 ${diff}`}
                      </span>
                    </div>
                    <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                      <div className={`absolute top-0 h-full ${pass ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${myPct}%` }} />
                      <div className="absolute top-0 h-full w-[2px] bg-gray-900" style={{ left: `${cutPct}%` }} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">나 {myScore}점</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 사관 선택 분석 */}
      {track === "saagwan" ? (
        <section className="bg-white py-16">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-8">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                <Target className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-bold text-blue-700">모의지원 — 사관 선택 분석</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">공사·육사·해사, 어디가 유리?</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {(["airforce", "army", "navy"] as SchoolKey[]).map((k) => {
                const m = matchCutoff(myScore, k)
                const prob = clamp(50 + m.diff * 3, 5, 99)
                return (
                  <Card key={k} className="border-2 border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-baseline justify-between">
                        <span>{SCHOOL_META[k].icon} {SCHOOL_META[k].short}</span>
                        <span className="text-3xl font-black">{prob}<span className="text-base font-normal text-gray-500">%</span></span>
                      </CardTitle>
                      <CardDescription>{m.message}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full ${m.pass ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${prob}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* 교차지원 분석 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-purple-700" />
              <span className="text-xs font-bold text-purple-700">교차지원 시뮬레이션</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">문과 ↔ 이과</h2>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">현재 트랙</span>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button onClick={() => setCrossStream("humanities")} className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${crossStream === "humanities" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"}`}>문과</button>
                  <button onClick={() => setCrossStream("science")} className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${crossStream === "science" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"}`}>이과</button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-xs font-semibold text-gray-500">현재 ({crossStream === "science" ? "이과" : "문과"})</div>
                  <div className="my-1 text-3xl font-black text-gray-900">{crossStream === "science" ? "72%" : "58%"}</div>
                </div>
                <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-5">
                  <div className="text-xs font-semibold text-purple-600">전환 시 ({crossStream === "science" ? "문과" : "이과"})</div>
                  <div className="my-1 text-3xl font-black text-purple-700">{crossStream === "science" ? "65%" : "75%"}</div>
                  <div className="text-xs text-purple-600">{crossStream === "science" ? "표준점수 보정 -7%p" : "수학 가산점 +17%p"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 오답·취약 분석 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">오답·취약 분석</h2>
            <p className="mt-2 text-gray-600">응시 결과 기반 — 데이터 누적 후 자동 분석.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {WEAK_TOPICS.map((t, i) => (
              <Card key={t.name} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="mb-1 text-xs font-bold text-red-600">취약 #{i + 1}</div>
                  <div className="mb-3 text-base font-bold text-gray-900">{t.name}</div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">정답률</span>
                    <span className="font-bold text-red-700">{t.rate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${t.rate}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-red-950 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold text-white">기출 응시는 지금, 모의문제는 6월</h2>
          <p className="mb-8 text-lg text-red-100">Sakwan에서 응시 → 즉시 채점 → 합격선 매칭까지 한 화면.</p>
          {sourceEnabled ? (
            <Link href={examLink}>
              <Button size="lg" className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                {pastYear}년 기출 응시 시작 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" disabled className="rounded-lg bg-gray-400 px-8 py-6 text-lg font-bold text-white">{MOCK_OPEN_DATE} 오픈</Button>
          )}
          <ul className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-red-100">
            <li className="flex items-center gap-1"><CheckCircle className="h-4 w-4" />기출 2022~2026</li>
            <li className="flex items-center gap-1"><CheckCircle className="h-4 w-4" />자동 채점·매칭</li>
            <li className="flex items-center gap-1"><CheckCircle className="h-4 w-4" />Firestore 영구 저장</li>
          </ul>
        </div>
      </section>

      {!isAuthenticated && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 shadow-lg">
          <AlertCircle className="mr-1 inline h-3 w-3" /> 응시 결과를 영구 저장하려면 로그인 필요
        </div>
      )}
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
