"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import CohortPosition from "@/components/cohort-position"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { matchAll, SCHOOL_META, type SchoolKey } from "@/lib/sakwan/cutoffs"
import { loadScores, type StoredScore } from "@/lib/sakwan/scores-store"
import { isFirebaseConfigured } from "@/lib/sakwan/firebase"
import { Award, BarChart3, CheckCircle, History, RotateCcw, XCircle } from "lucide-react"

function ResultPageInner() {
  const { user, isAuthenticated, loginUrl } = useAuth()
  const [result, setResult] = useState<StoredScore | null>(null)
  const [history, setHistory] = useState<StoredScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1) localStorage에서 방금 채점한 결과 우선 로드
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("sakwan_last_result")
      if (raw) {
        try {
          setResult(JSON.parse(raw))
        } catch {
          /* ignore */
        }
      }
    }
    // 2) 히스토리 로드
    if (user?.id) {
      void loadScores(String(user.id)).then((arr) => {
        setHistory(arr)
        if (!result && arr[0]) setResult(arr[0])
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="mb-2 text-2xl font-bold">로그인 필요</h1>
          <a href={loginUrl}>
            <Button className="bg-red-700 text-white hover:bg-red-800">로그인</Button>
          </a>
        </div>
      </div>
    )
  }

  if (loading && !result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-10 text-center text-gray-500">결과 불러오는 중...</div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="mb-2 text-2xl font-bold">응시 기록이 없습니다</h1>
          <Link href="/mock">
            <Button className="bg-red-700 text-white hover:bg-red-800">첫 모의고사 응시</Button>
          </Link>
        </div>
      </div>
    )
  }

  const matched = matchAll(result.totalScore).filter((m) =>
    result.track === "saagwan" ? m.meta.track === "saagwan" : m.meta.track === "police",
  )
  const usingFirebase = isFirebaseConfigured()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero — 총점 */}
      <section className="bg-gradient-to-br from-red-700 via-red-800 to-slate-900 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-1.5">
            <Award className="h-4 w-4 text-amber-200" />
            <span className="text-xs font-bold text-amber-100">
              {result.track === "saagwan" ? "사관학교" : "경찰대"} {result.year}년 기출 — 채점 완료
            </span>
          </div>
          <h1 className="mb-2 text-5xl font-black text-white md:text-6xl">
            {result.totalScore}
            <span className="ml-2 text-2xl font-bold text-red-200">/ 300점</span>
          </h1>
          <p className="text-sm text-red-100">
            {result.totalCorrect} / {result.totalQuestions} 정답
            {result.elective ? <> · 선택과목 {result.elective}</> : null}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href={`/mock/exam?track=${result.track}&year=${result.year}`}>
              <Button variant="outline" className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10">
                <RotateCcw className="mr-1 h-4 w-4" /> 같은 회차 재응시
              </Button>
            </Link>
            <Link href="/mock">
              <Button className="bg-amber-500 text-white hover:bg-amber-600">다른 회차 응시</Button>
            </Link>
          </div>
          {!usingFirebase && (
            <p className="mt-4 text-[10px] text-red-200/70">
              ※ Firebase 미설정 — 결과는 이 단말기에만 저장됩니다.
            </p>
          )}
        </div>
      </section>

      {/* 과목별 점수 */}
      <section className="bg-white py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">과목별 점수</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {result.sections.map((s) => (
              <Card key={s.name} className="border-2 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-baseline justify-between">
                    <span>{s.name}</span>
                    <span className="text-3xl font-black text-red-700">{Math.round(s.rawScore)}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {s.correct} / {s.totalQuestions} 정답 · 응시 {s.attempted}문항
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${(s.correct / s.totalQuestions) * 100}%` }} />
                  </div>
                  <div className="mt-3 grid grid-cols-10 gap-1 text-[9px] text-gray-400">
                    {s.detail.slice(0, 30).map((d) => (
                      <span
                        key={d.num}
                        className={`flex h-5 items-center justify-center rounded ${
                          d.userAnswer === null
                            ? "bg-gray-100"
                            : d.isCorrect
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                        }`}
                        title={`${d.num}번 — 정답 ${d.correct}, 내 답 ${d.userAnswer ?? "-"}`}
                      >
                        {d.num}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 회차 내 내 위치 — T사관 모의고사 응시(회차 기록이 있는 결과)에만 노출 */}
      {result.round ? (
        <section className="bg-gray-50 pt-12">
          <div className="container mx-auto max-w-5xl px-6">
            <CohortPosition round={result.round} score={result.totalScore} />
          </div>
        </section>
      ) : null}

      {/* 합격선 매칭 */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-red-700" />
            <h2 className="text-2xl font-bold text-gray-900">합격선 매칭 (2025 기준)</h2>
          </div>
          <Card>
            <CardContent className="space-y-4 p-6">
              {matched.map((m) => (
                <div key={m.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      {m.meta.icon} {m.meta.name}{" "}
                      <span className="text-xs text-gray-400">(컷 {m.cut})</span>
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        m.pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {m.pass ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {m.message}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 응시 히스토리 */}
      {history.length > 1 && (
        <section className="bg-white py-12">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">응시 히스토리</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                    <th className="py-2">일시</th>
                    <th className="py-2">시험</th>
                    <th className="py-2">총점</th>
                    <th className="py-2">국어</th>
                    <th className="py-2">영어</th>
                    <th className="py-2">수학</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-gray-100 text-sm">
                      <td className="py-2 text-xs text-gray-500">{(h.createdAt || "").slice(0, 16).replace("T", " ")}</td>
                      <td className="py-2 font-medium">
                        {h.track === "saagwan" ? "🎖" : "👮"} {h.year}
                      </td>
                      <td className="py-2 font-bold text-red-700">{h.totalScore}</td>
                      {h.sections.map((s) => (
                        <td key={s.name} className="py-2 text-gray-700">
                          {Math.round(s.rawScore)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">로딩 중...</div>}>
      <ResultPageInner />
    </Suspense>
  )
}
