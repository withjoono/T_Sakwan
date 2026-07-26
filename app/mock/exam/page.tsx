"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { ANSWER_KEY_AVAILABLE, type Answer, type ElectiveKey } from "@/lib/sakwan/answer-keys"
import {
  gradeSubject,
  gradeSubmission,
  type SectionResult,
  type SubjectName,
  type Submission,
} from "@/lib/sakwan/scoring"
import { saveScore } from "@/lib/sakwan/scores-store"
import { syncSaagwanResultToMogo } from "@/lib/sakwan/mogo"
import {
  gradeTsagwanSubject,
  syncTsagwanWrongAnswers,
  type Elective,
} from "@/lib/sakwan/tsagwan-grade"
import { saveRoundScore } from "@/lib/sakwan/mock-products"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Eraser,
  Pencil,
  Save,
  Trash2,
  XCircle,
} from "lucide-react"

type Track = "saagwan" | "police"

interface ShortAnswerRange {
  start: number
  end: number
}

interface SectionDef {
  name: string
  count: number
  electives?: ElectiveKey[]
  electiveStart?: number       // 선택과목 시작 번호 (사관 수학: 23)
  shortAnswerRanges?: ShortAnswerRange[]  // 주관식 구간 목록
}

/** 사관학교 수학: 1-15 공통객관, 16-22 공통주관, 23-28 선택객관, 29-30 선택주관 */
const SAAGWAN_SECTIONS: SectionDef[] = [
  { name: "국어", count: 30 },
  { name: "영어", count: 30 },
  {
    name: "수학",
    count: 30,
    electives: ["확률과 통계", "미적분", "기하"],
    electiveStart: 23,
    shortAnswerRanges: [
      { start: 16, end: 22 },
      { start: 29, end: 30 },
    ],
  },
]

const POLICE_SECTIONS: SectionDef[] = [
  { name: "국어", count: 45 },
  { name: "영어", count: 45 },
  { name: "수학", count: 25 },
]

/** 수학 OMR 구간 정의 (레이블 삽입용) */
interface MathGroup {
  label: string
  start: number
  end: number
  type: "objective" | "short"
  elective: boolean
  labelColor: string
  bgColor: string
}

const SAAGWAN_MATH_GROUPS: MathGroup[] = [
  { label: "공통  객관식", start: 1,  end: 15, type: "objective", elective: false, labelColor: "text-gray-600",   bgColor: "bg-gray-50" },
  { label: "공통  주관식", start: 16, end: 22, type: "short",     elective: false, labelColor: "text-blue-700",   bgColor: "bg-blue-50/60" },
  { label: "선택과목  객관식", start: 23, end: 28, type: "objective", elective: true,  labelColor: "text-purple-700", bgColor: "bg-purple-50/60" },
  { label: "선택과목  주관식", start: 29, end: 30, type: "short",     elective: true,  labelColor: "text-purple-700", bgColor: "bg-purple-50/60" },
]

function isShortAnswer(sec: SectionDef, num: number): boolean {
  if (!sec.shortAnswerRanges) return false
  return sec.shortAnswerRanges.some(({ start, end }) => num >= start && num <= end)
}

function getGroupForNum(num: number): MathGroup | undefined {
  return SAAGWAN_MATH_GROUPS.find((g) => num >= g.start && num <= g.end)
}

const STORAGE_KEY = "sakwan_omr_draft_v1"

/** 채점 결과에서 문항번호→상세 로 빠르게 접근하기 위한 맵 */
type GradeMap = Record<number, { correct: Answer; isCorrect: boolean }>
function toGradeMap(sec: SectionResult): GradeMap {
  const m: GradeMap = {}
  sec.detail.forEach((d) => { m[d.num] = { correct: d.correct, isCorrect: d.isCorrect } })
  return m
}

/* ── 구간 라벨 컴포넌트 ── */
function GroupDivider({ label, color, range }: { label: string; color: string; range: string }) {
  return (
    <div className={`col-span-full mt-2 flex items-center gap-2 rounded-lg px-3 py-1.5 ${color}`}>
      <span className="text-xs font-bold">{label}</span>
      <span className="text-[10px] opacity-70">{range}</span>
    </div>
  )
}

/* ── 객관식 버튼 열 ── */
function ObjButtons({
  val,
  onChange,
  graded,
}: {
  val: Answer | null
  onChange: (v: Answer) => void
  graded?: { correct: Answer; isCorrect: boolean }
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {[1, 2, 3, 4, 5].map((c) => {
        let cls: string
        if (graded) {
          const isAns = graded.correct === c
          const isPick = val === c
          if (isAns) {
            // 정답 — 항상 초록으로 강조
            cls = "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
          } else if (isPick) {
            // 내가 고른 오답 — 빨강
            cls = "bg-red-600 text-white shadow-sm"
          } else {
            cls = "bg-gray-100 text-gray-400"
          }
        } else {
          cls = val === c
            ? "bg-red-600 text-white shadow-sm"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }
        return (
          <button
            key={c}
            disabled={!!graded}
            onClick={() => onChange(c)}
            className={`h-7 w-7 rounded-full text-xs font-bold transition-all ${graded ? "cursor-default" : ""} ${cls}`}
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}

/* ── 주관식 입력 ── */
function ShortInput({
  val,
  onChange,
  graded,
}: {
  val: Answer | null
  onChange: (v: Answer | null) => void
  graded?: { correct: Answer; isCorrect: boolean }
}) {
  if (graded) {
    const ok = graded.isCorrect
    return (
      <div
        className={`mt-1 flex items-center justify-between gap-1 rounded-md border px-2 py-1.5 text-sm font-bold ${
          ok ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"
        }`}
      >
        <span className="flex items-center gap-1">
          {ok ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          {val !== null ? val : <span className="text-gray-400">미표기</span>}
        </span>
        {!ok && <span className="text-[11px] font-bold text-emerald-700">정답 {graded.correct}</span>}
      </div>
    )
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={3}
      value={val !== null ? String(val) : ""}
      placeholder="0~999"
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "")
        if (raw === "") { onChange(null); return }
        const n = parseInt(raw, 10)
        if (!isNaN(n) && n >= 0 && n <= 999) onChange(n)
      }}
      className="mt-1 w-full rounded-md border border-blue-300 bg-white px-2 py-1.5 text-center text-sm font-bold text-blue-800 placeholder:text-blue-300 focus:border-blue-500 focus:outline-none"
    />
  )
}

/* ────────────────────────────── 메인 페이지 ────────────────────────────── */
function ExamPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, isAuthenticated, loginUrl } = useAuth()

  const track = (params.get("track") || "saagwan") as Track
  const year = Number(params.get("year") || new Date().getFullYear())

  // T사관 모의고사 채점 모드 — 정답이 Mogo 백엔드에 있으므로 채점을 API로 위임한다.
  const tsagwanRound = Number(params.get("round") || 0)
  const isTsagwan = params.get("type") === "tsagwan" && tsagwanRound >= 1 && tsagwanRound <= 5
  // 임시저장 키 — T사관 모의는 회차로 분리(같은 연도 기출과 충돌 방지)
  const draftKey = isTsagwan ? `${STORAGE_KEY}_tsagwan_${tsagwanRound}` : `${STORAGE_KEY}_${track}_${year}`

  const sections = track === "saagwan" ? SAAGWAN_SECTIONS : POLICE_SECTIONS
  const [sectionIdx, setSectionIdx] = useState(0)
  const currentSection = sections[sectionIdx]

  const [elective, setElective] = useState<ElectiveKey>("미적분")
  const [answers, setAnswers] = useState<Record<string, Record<number, Answer | null>>>(() => {
    const init: Record<string, Record<number, Answer | null>> = {}
    sections.forEach((s) => {
      init[s.name] = Object.fromEntries(
        Array.from({ length: s.count }, (_, i) => [i + 1, null]),
      )
    })
    return init
  })
  const [seconds, setSeconds] = useState(0)

  /** 과목별 채점 결과 (null = 미채점) */
  const [graded, setGraded] = useState<Record<string, SectionResult | null>>({})
  /** 저장(확정)된 과목 결과 — 3과목 모두 채워지면 전체 저장 */
  const [savedNames, setSavedNames] = useState<string[]>([])
  const [finalSavedId, setFinalSavedId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  /* ─── localStorage 임시저장 / 복원 ─── */
  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(draftKey)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed.answers) setAnswers(parsed.answers)
        if (parsed.elective) setElective(parsed.elective)
        if (parsed.seconds) setSeconds(parsed.seconds)
        if (parsed.graded) setGraded(parsed.graded)
        if (parsed.savedNames) setSavedNames(parsed.savedNames)
      } catch { /* ignore */ }
    }
  }, [draftKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(
      draftKey,
      JSON.stringify({ answers, elective, seconds, graded, savedNames }),
    )
  }, [answers, elective, seconds, graded, savedNames, draftKey])

  /* ─── 타이머 ─── */
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = Math.floor(seconds / 3600)
  const mm = Math.floor((seconds % 3600) / 60)
  const ss = seconds % 60
  const timer = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`

  const setAnswer = (sectionName: string, num: number, val: Answer | null) => {
    setAnswers((prev) => ({
      ...prev,
      [sectionName]: { ...prev[sectionName], [num]: val },
    }))
  }

  const progress = useMemo(() => {
    const total = sections.reduce((s, x) => s + x.count, 0)
    const done = sections.reduce(
      (s, x) => s + Object.values(answers[x.name] || {}).filter((v) => v !== null).length,
      0,
    )
    return { total, done, pct: Math.round((done / total) * 100) }
  }, [answers, sections])

  const currentName = currentSection.name
  const currentGraded = graded[currentName] ?? null
  const currentGradeMap = useMemo(
    () => (currentGraded ? toGradeMap(currentGraded) : null),
    [currentGraded],
  )
  const isSaved = savedNames.includes(currentName)

  /* ─── 현재 과목 채점 ─── */
  const handleGrade = async () => {
    try {
      if (isTsagwan) {
        // T사관 모의 — Mogo 백엔드로 채점 (정답 DB가 백엔드에 있음)
        setBusy(true)
        const res = await gradeTsagwanSubject(
          tsagwanRound,
          currentName as "국어" | "영어" | "수학",
          answers[currentName],
          elective as Elective,
        )
        if (!res) {
          window.alert("채점 서버에 연결할 수 없습니다. 로그인/네트워크 상태를 확인해 주세요.")
          return
        }
        setGraded((prev) => ({ ...prev, [currentName]: res as SectionResult }))
        return
      }
      const res = gradeSubject(
        track,
        year,
        currentName as SubjectName,
        answers[currentName],
        elective,
      )
      setGraded((prev) => ({ ...prev, [currentName]: res }))
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "채점 실패")
    } finally {
      if (isTsagwan) setBusy(false)
    }
  }

  /* ─── 수정: 채점 해제 → 다시 마킹 가능 ─── */
  const handleEdit = () => {
    setGraded((prev) => ({ ...prev, [currentName]: null }))
    setSavedNames((prev) => prev.filter((n) => n !== currentName))
    setFinalSavedId(null)
  }

  /* ─── 전체 취소: 현재 과목 답안 전부 초기화 ─── */
  const handleClearAll = () => {
    if (!window.confirm(`${currentName} 과목의 마킹을 모두 지울까요?`)) return
    setAnswers((prev) => ({
      ...prev,
      [currentName]: Object.fromEntries(
        Array.from({ length: currentSection.count }, (_, i) => [i + 1, null]),
      ),
    }))
    setGraded((prev) => ({ ...prev, [currentName]: null }))
    setSavedNames((prev) => prev.filter((n) => n !== currentName))
    setFinalSavedId(null)
  }

  /* ─── 3과목 모두 저장되면 전체 결과 확정 저장 + 모고앱 동기화 ─── */
  const finalizeSave = async () => {
    if (!user) return

    if (isTsagwan) {
      // T사관 모의 — 채점은 이미 Mogo API로 완료(graded)됨. 그 결과로 최종 결과를 조립·저장한다.
      const secs = sections
        .map((s) => graded[s.name])
        .filter((r): r is SectionResult => !!r)
      const totalScore = Math.round(secs.reduce((a, r) => a + r.rawScore, 0))
      const result = {
        track: "saagwan" as const,
        year,
        round: tsagwanRound,
        elective,
        sections: secs,
        totalCorrect: secs.reduce((a, r) => a + r.correct, 0),
        totalQuestions: secs.reduce((a, r) => a + r.totalQuestions, 0),
        totalScore,
        gradedAt: new Date().toISOString(),
      }
      const stored = await saveScore(String(user.id), result)
      window.localStorage.setItem("sakwan_last_result", JSON.stringify(stored))
      // 다운로드 페이지 STEP 3(답지·해설) 해제용 회차 점수 저장
      saveRoundScore(tsagwanRound, {
        korean: Math.round(graded["국어"]?.rawScore ?? 0),
        math: Math.round(graded["수학"]?.rawScore ?? 0),
        english: Math.round(graded["영어"]?.rawScore ?? 0),
      })
      // 취약분석(모고앱) 적재 — 베스트에포트
      syncTsagwanWrongAnswers(user.id, {
        round: tsagwanRound,
        elective: elective as Elective,
        korean: answers["국어"],
        english: answers["영어"],
        math: answers["수학"],
      }).catch(() => {})
      setFinalSavedId(stored.id || "")
      return
    }

    let submission: Submission
    if (track === "saagwan") {
      submission = { track: "saagwan", year, elective, korean: answers["국어"], english: answers["영어"], math: answers["수학"] }
    } else {
      submission = { track: "police", year, korean: answers["국어"], english: answers["영어"], math: answers["수학"] }
    }
    const result = gradeSubmission(submission)
    const stored = await saveScore(String(user.id), result)
    window.localStorage.setItem("sakwan_last_result", JSON.stringify(stored))
    if (submission.track === "saagwan") {
      // 취약분석(모고앱) 연동용 베스트에포트 동기화 — 실패해도 결과 표시를 막지 않음
      syncSaagwanResultToMogo(user.id, submission).catch(() => {})
    }
    setFinalSavedId(stored.id || "")
  }

  /* ─── 현재 과목 결과 저장 ─── */
  const handleSave = async () => {
    if (!user) {
      window.alert("저장하려면 로그인이 필요합니다.")
      window.location.href = loginUrl
      return
    }
    if (!currentGraded) return
    setBusy(true)
    try {
      const nextSaved = savedNames.includes(currentName) ? savedNames : [...savedNames, currentName]
      setSavedNames(nextSaved)
      // 3과목 모두 저장되면 전체 결과를 Firestore/모고앱에 확정 반영
      const allSaved = sections.every((s) => nextSaved.includes(s.name))
      if (allSaved) await finalizeSave()
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "저장 실패")
    } finally {
      setBusy(false)
    }
  }

  const isMathSaagwan = track === "saagwan" && currentSection.name === "수학"
  const allSaved = sections.every((s) => savedNames.includes(s.name))

  /* 채점 요약 수치 */
  const summary = currentGraded
    ? {
        correct: currentGraded.correct,
        wrong: currentGraded.attempted - currentGraded.correct,
        blank: currentGraded.totalQuestions - currentGraded.attempted,
        total: currentGraded.totalQuestions,
        score: Math.round(currentGraded.rawScore),
      }
    : null

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-amber-600" />
          <h1 className="mb-2 text-2xl font-bold">로그인이 필요합니다</h1>
          <p className="mb-6 text-gray-600">응시 결과를 저장하려면 Hub SSO 로그인이 필요해요.</p>
          <a href={loginUrl}>
            <Button className="bg-red-700 text-white hover:bg-red-800">로그인</Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* 상단 진행바 */}
      <div className="sticky top-[60px] z-40 border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/mock" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" /> 종료
            </Link>
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-gray-900">
                {isTsagwan
                  ? `✨ T사관 모의 ${tsagwanRound}회`
                  : `${track === "saagwan" ? "🎖 사관" : "👮 경찰대"} ${year}년 기출`}
              </span>
              <span className="text-xs text-gray-500">{progress.done} / {progress.total} 마킹</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-red-700">
              <Clock className="h-4 w-4" /> {timer}
            </div>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      </div>

      {/* placeholder 경고 (T사관 모의는 Mogo 백엔드 실채점이라 해당 없음) */}
      {!isTsagwan && !ANSWER_KEY_AVAILABLE[`${track}-${year}`] && (
        <div className="container mx-auto max-w-5xl px-4 pt-4">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
            <div>
              <strong>{year}년 정답표 미입력</strong> — 현재 placeholder(임시값)로 채점됩니다. 실제 점수와 다를 수 있어요.
            </div>
          </div>
        </div>
      )}

      {/* 전체 저장 완료 배너 */}
      {allSaved && finalSavedId !== null && (
        <div className="container mx-auto max-w-5xl px-4 pt-4">
          <div className="flex flex-col items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-700" />
              <span><strong>3과목 채점·저장 완료</strong> — 결과가 저장되고 취약분석(모고앱)에 동기화됐어요.</span>
            </div>
            <Link href={`/mock/result?id=${encodeURIComponent(finalSavedId)}`}>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                전체 결과·합격선 분석 보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-5xl px-4 py-6">
        {/* 과목 탭 */}
        <div className="mb-5 flex flex-wrap gap-2 border-b border-gray-200">
          {sections.map((s, i) => {
            const done = Object.values(answers[s.name] || {}).filter((v) => v !== null).length
            const sGraded = !!graded[s.name]
            const sSaved = savedNames.includes(s.name)
            return (
              <button
                key={s.name}
                onClick={() => setSectionIdx(i)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
                  sectionIdx === i
                    ? "border-red-600 text-red-700"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {s.name}
                {sSaved ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">저장됨</span>
                ) : sGraded ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">채점됨</span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">
                    {done}/{s.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* 수학 선택과목 토글 (채점 전에만 변경 가능) */}
        {track === "saagwan" && currentSection.name === "수학" && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 p-3 text-sm">
            <span className="font-bold text-purple-700">선택과목:</span>
            {(["확률과 통계", "미적분", "기하"] as ElectiveKey[]).map((e) => (
              <button
                key={e}
                disabled={!!currentGraded}
                onClick={() => setElective(e)}
                className={`rounded-lg border-2 px-3 py-1 text-xs font-bold transition-all disabled:opacity-50 ${
                  elective === e
                    ? "border-purple-500 bg-white text-purple-700"
                    : "border-transparent bg-white/60 text-gray-600 hover:border-purple-200"
                }`}
              >
                {e}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-purple-700">
              23-28번 선택객관 · 29-30번 선택주관
            </span>
          </div>
        )}

        {/* OMR 그리드 */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-base">
              <span>{currentSection.name} OMR</span>
              {currentGraded && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  <CheckCircle className="h-3 w-3" /> 채점 완료
                </span>
              )}
              {isMathSaagwan && !currentGraded && (
                <div className="flex items-center gap-2 text-xs font-normal text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-full bg-gray-200" /> 객관식(1-5)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded bg-blue-300" /> 주관식(숫자입력)
                  </span>
                </div>
              )}
              {currentGraded && (
                <div className="flex items-center gap-2 text-xs font-normal text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-full bg-emerald-600" /> 정답
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-full bg-red-600" /> 내 오답
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: currentSection.count }, (_, i) => i + 1).flatMap((num) => {
                const val = answers[currentSection.name]?.[num] ?? null
                const isSubj = isShortAnswer(currentSection, num)
                const group = isMathSaagwan ? getGroupForNum(num) : undefined
                const isGroupStart = isMathSaagwan && group && group.start === num
                const g = currentGradeMap ? currentGradeMap[num] : undefined

                const items: React.ReactNode[] = []

                /* 구간 시작에 라벨 삽입 */
                if (isGroupStart && group) {
                  items.push(
                    <GroupDivider
                      key={`label-${num}`}
                      label={group.label}
                      range={`${group.start}-${group.end}번`}
                      color={
                        group.type === "short"
                          ? group.elective
                            ? "border border-purple-200 bg-purple-50 text-purple-700"
                            : "border border-blue-200 bg-blue-50 text-blue-700"
                          : group.elective
                          ? "border border-purple-200 bg-purple-50/40 text-purple-600"
                          : "border border-gray-200 bg-gray-50 text-gray-600"
                      }
                    />,
                  )
                }

                /* 문항 카드 배경 — 채점되면 정/오답 색상 우선 */
                const cardBg = g
                  ? g.isCorrect
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-red-300 bg-red-50/50"
                  : isSubj
                  ? "border-blue-300 bg-blue-50/50"
                  : val !== null
                  ? "border-red-300 bg-red-50/40"
                  : "border-gray-200 bg-white"

                items.push(
                  <div
                    key={num}
                    className={`rounded-lg border-2 p-2 transition-colors ${cardBg}`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-700">{num}번</span>
                        {isSubj && !g && (
                          <span className="rounded bg-blue-200 px-1 py-0.5 text-[9px] font-bold text-blue-800">
                            주관
                          </span>
                        )}
                        {g && (
                          g.isCorrect
                            ? <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            : <XCircle className="h-3.5 w-3.5 text-red-600" />
                        )}
                      </div>
                      {!currentGraded && (
                        <button
                          onClick={() => setAnswer(currentSection.name, num, null)}
                          className="text-[10px] text-gray-400 hover:text-red-600"
                          title="지우기"
                        >
                          <Eraser className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {isSubj ? (
                      <ShortInput
                        val={val}
                        graded={g}
                        onChange={(v) => setAnswer(currentSection.name, num, v)}
                      />
                    ) : (
                      <ObjButtons
                        val={val}
                        graded={g}
                        onChange={(v) => setAnswer(currentSection.name, num, v)}
                      />
                    )}
                  </div>,
                )

                return items
              })}
            </div>
          </CardContent>
        </Card>

        {/* 채점 요약 — OMR 바로 아래 */}
        {summary && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
              <div className="text-2xl font-black text-emerald-700">{summary.correct}</div>
              <div className="text-xs font-medium text-emerald-800">맞은 개수</div>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
              <div className="text-2xl font-black text-red-700">{summary.wrong}</div>
              <div className="text-xs font-medium text-red-800">틀린 개수</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
              <div className="text-2xl font-black text-gray-500">{summary.blank}</div>
              <div className="text-xs font-medium text-gray-600">미표기</div>
            </div>
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-center">
              <div className="text-2xl font-black text-amber-700">
                {summary.score}
                <span className="ml-0.5 text-sm font-bold text-amber-500">점</span>
              </div>
              <div className="text-xs font-medium text-amber-800">
                {currentName} 점수 · {summary.correct}/{summary.total}
              </div>
            </div>
          </div>
        )}

        {/* 하단 액션 */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {!currentGraded ? (
            <>
              <div className="text-xs text-gray-500">
                <Save className="mr-1 inline h-3 w-3" /> 답안은 자동 임시저장됩니다.
              </div>
              <Button
                className="bg-red-700 text-white hover:bg-red-800"
                onClick={handleGrade}
              >
                <CheckCircle className="mr-1 h-4 w-4" /> {currentName} 채점하기
              </Button>
            </>
          ) : (
            <>
              {/* 좌측: 저장 / 수정 / 전체 취소 */}
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  onClick={handleSave}
                  disabled={busy || isSaved}
                >
                  <Save className="mr-1 h-4 w-4" /> {isSaved ? "저장됨" : busy ? "저장 중..." : "저장"}
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  <Pencil className="mr-1 h-4 w-4" /> 수정
                </Button>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleClearAll}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> 전체 취소
                </Button>
              </div>

              {/* 우측: 다른 과목 채점 화살표 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
                  disabled={sectionIdx === 0}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> 이전 과목
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSectionIdx((i) => Math.min(sections.length - 1, i + 1))}
                  disabled={sectionIdx === sections.length - 1}
                >
                  다음 과목 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">로딩 중...</div>}>
      <ExamPageInner />
    </Suspense>
  )
}
