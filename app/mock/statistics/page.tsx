"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { loadScores, type StoredScore } from "@/lib/sakwan/scores-store"
import {
  fetchMogoTrend,
  fetchMogoCumulative,
  isSaagwanExam,
  type MogoTrendPoint,
  type MogoCumulativeStat,
} from "@/lib/sakwan/mogo-analysis"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  LineChart as LineChartIcon,
  ListChecks,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"

/* ───────────── 정규화된 회차 데이터 ───────────── */
type RoundRow = {
  label: string
  date: string
  track?: string
  year?: number
  total: number
  korean: number | null
  english: number | null
  math: number | null
}

const SUBJECTS: { key: "korean" | "english" | "math"; name: string; color: string }[] = [
  { key: "korean", name: "국어", color: "#dc2626" },
  { key: "english", name: "영어", color: "#2563eb" },
  { key: "math", name: "수학", color: "#d97706" },
]

/* 저장된 성적이 2개 미만일 때 항상 추이가 렌더되도록 하는 예시 시리즈 */
const EXAMPLE_ROUNDS: RoundRow[] = [
  { label: "1회", date: "예시", total: 240, korean: 78, english: 80, math: 82 },
  { label: "2회", date: "예시", total: 248, korean: 80, english: 82, math: 86 },
  { label: "3회", date: "예시", total: 255, korean: 84, english: 83, math: 88 },
  { label: "4회", date: "예시", total: 262, korean: 86, english: 85, math: 91 },
  { label: "5회", date: "예시", total: 268, korean: 88, english: 87, math: 93 },
]

function sectionScore(s: StoredScore, name: string): number | null {
  const sec = s.sections?.find((x) => x.name === name)
  return sec ? Math.round(sec.rawScore) : null
}

function toRows(scores: StoredScore[]): RoundRow[] {
  // scores 는 newest-first → 시간순(오름차순)으로 뒤집는다
  const chrono = [...scores].reverse()
  return chrono.map((s, i) => {
    const iso = s.gradedAt || s.createdAt || ""
    const d = iso ? new Date(iso) : null
    const date = d && !isNaN(d.getTime())
      ? `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
      : "-"
    return {
      label: `${i + 1}회`,
      date,
      track: s.track,
      year: s.year,
      total: s.totalScore,
      korean: sectionScore(s, "국어"),
      english: sectionScore(s, "영어"),
      math: sectionScore(s, "수학"),
    }
  })
}

const trackLabel = (t?: string) => (t === "police" ? "경찰대" : t === "saagwan" ? "사관학교" : "-")

/* ───────────── Mogo 성적 추이 → 페이지 뷰모델 매핑 ─────────────
 * Mogo 백엔드의 trend 포인트를 페이지의 RoundRow 형태로 변환한다.
 * mockExam 정보가 실려 있으면 사관 회차만 우선 필터하고, 결과가 비면 전체를 쓴다(best-effort).
 */
function mapMogoTrend(trend: MogoTrendPoint[]): RoundRow[] {
  const withExam = trend.filter((p) =>
    (p as { mockExam?: { type?: string; code?: string } }).mockExam
      ? isSaagwanExam(p as { mockExam?: { type?: string; code?: string } })
      : true,
  )
  const used = withExam.length > 0 ? withExam : trend
  return used.map((p, i) => {
    const iso = p.date || ""
    const d = iso ? new Date(iso) : null
    const date =
      d && !isNaN(d.getTime())
        ? `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
        : "-"
    return {
      label: p.examName || `${i + 1}회`,
      date,
      total: p.totalStandardSum ?? 0,
      korean: p.koreanStandard ?? null,
      english: p.englishGrade ?? null,
      math: p.mathStandard ?? null,
    }
  })
}

/* ───────────── 인라인 SVG 라인 차트 ───────────── */
function LineChart({
  data,
  labels,
  color = "#d97706",
  yMin,
  yMax,
  unit = "",
  height = 220,
}: {
  data: (number | null)[]
  labels: string[]
  color?: string
  yMin: number
  yMax: number
  unit?: string
  height?: number
}) {
  const W = 640
  const H = height
  const PX = 46
  const PY = 28
  const innerW = W - PX * 2
  const innerH = H - PY * 2
  const range = yMax - yMin || 1

  const toX = (i: number) =>
    PX + (labels.length > 1 ? (i / (labels.length - 1)) * innerW : innerW / 2)
  const toY = (v: number) => PY + innerH - ((v - yMin) / range) * innerH

  const points = data.map((v, i) => (v != null ? { x: toX(i), y: toY(v), v, i } : null))
  const valid = points.filter(Boolean) as { x: number; y: number; v: number; i: number }[]
  const pathD = valid.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaD =
    valid.length > 0
      ? `${pathD} L ${valid[valid.length - 1].x} ${PY + innerH} L ${valid[0].x} ${PY + innerH} Z`
      : ""
  const gid = `grad-${color.replace("#", "")}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: `${H}px` }} role="img">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 가로 그리드 + y 라벨 */}
      {[0, 0.25, 0.5, 0.75, 1].map((r) => {
        const y = PY + r * innerH
        const val = yMax - r * range
        return (
          <g key={r}>
            <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PX - 8} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize="11">
              {Math.round(val)}
              {unit}
            </text>
          </g>
        )
      })}

      {/* x 라벨 */}
      {labels.map((l, i) => (
        <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fill="#6b7280" fontSize="11">
          {l}
        </text>
      ))}

      {areaD && <path d={areaD} fill={`url(#${gid})`} />}
      {pathD && <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" />}

      {valid.map((p) => (
        <g key={p.i}>
          <circle cx={p.x} cy={p.y} r="5" fill={color} stroke="white" strokeWidth="2" />
          <text
            x={p.x}
            y={p.y - 11}
            textAnchor="middle"
            fill={color}
            fontSize="11"
            fontWeight="bold"
          >
            {p.v}
            {unit}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ───────────── 미니 과목 차트 (small multiple) ───────────── */
function MiniChart({
  data,
  labels,
  color,
}: {
  data: (number | null)[]
  labels: string[]
  color: string
}) {
  const W = 300
  const H = 120
  const PX = 10
  const PY = 16
  const innerW = W - PX * 2
  const innerH = H - PY * 2
  const yMin = 0
  const yMax = 100
  const toX = (i: number) =>
    PX + (labels.length > 1 ? (i / (labels.length - 1)) * innerW : innerW / 2)
  const toY = (v: number) => PY + innerH - ((v - yMin) / (yMax - yMin)) * innerH
  const pts = data
    .map((v, i) => (v != null ? { x: toX(i), y: toY(v), v } : null))
    .filter(Boolean) as { x: number; y: number; v: number }[]
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <line x1={PX} y1={PY + innerH} x2={W - PX} y2={PY + innerH} stroke="#e5e7eb" strokeWidth="1" />
      {pathD && <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" />}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={color} stroke="white" strokeWidth="1.5" />
          <text x={p.x} y={p.y - 7} textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">
            {p.v}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ───────────── 요약 타일 ───────────── */
function SummaryTile({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Trophy
  label: string
  value: string
  sub?: string
  accent: string
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <Icon className={`h-4 w-4 ${accent}`} />
          <span className="text-xs font-semibold text-gray-500">{label}</span>
        </div>
        <div className="text-2xl font-black text-gray-900">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-gray-500">{sub}</div>}
      </CardContent>
    </Card>
  )
}

/* ───────────── 메인 페이지 ───────────── */
export default function StatisticsPage() {
  const { user, isAuthenticated } = useAuth()
  const [scores, setScores] = useState<StoredScore[]>([])
  const [loading, setLoading] = useState(true)
  const [mogoRows, setMogoRows] = useState<RoundRow[] | null>(null)
  const [mogoStat, setMogoStat] = useState<MogoCumulativeStat | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    let alive = true
    setLoading(true)
    const sid = String(user.id)

    // 1) 먼저 Mogo 백엔드 연동을 시도한다 (추이 + 누적 병렬).
    Promise.all([fetchMogoTrend(sid), fetchMogoCumulative(sid)])
      .then(([trend, cumulative]) => {
        if (!alive) return
        const mapped = mapMogoTrend(trend)
        if (mapped.length > 0) {
          // 실데이터 확보 → Mogo 연동 소스 사용
          setMogoRows(mapped)
          setMogoStat(cumulative)
          setLoading(false)
          return
        }
        // 2) Mogo 추이가 비면 기존 로컬 성적 동작으로 폴백(예시 포함).
        return loadScores(sid).then((arr) => {
          if (alive) setScores(arr)
        })
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [user?.id])

  const realRows = useMemo(() => toRows(scores), [scores])
  const isMogo = (mogoRows?.length ?? 0) > 0
  const isExample = !isMogo && realRows.length < 2
  const rows = isMogo ? (mogoRows as RoundRow[]) : isExample ? EXAMPLE_ROUNDS : realRows

  const labels = rows.map((r) => r.label)
  const totals = rows.map((r) => r.total)

  const derivedCount = rows.length
  const derivedBest = Math.max(...totals)
  const derivedAvg = Math.round(totals.reduce((s, v) => s + v, 0) / derivedCount)
  const derivedDelta = derivedCount >= 2 ? totals[derivedCount - 1] - totals[derivedCount - 2] : 0

  // Mogo 누적분석이 있으면 타일 값은 백엔드 계약을 우선 사용, 없으면 추이 배열에서 산출.
  const count = isMogo && mogoStat?.examCount != null ? mogoStat.examCount : derivedCount
  const best = isMogo && mogoStat?.bestTotal != null ? mogoStat.bestTotal : derivedBest
  const avg = isMogo && mogoStat?.avgTotal != null ? mogoStat.avgTotal : derivedAvg
  const delta = isMogo && mogoStat?.recentDelta != null ? mogoStat.recentDelta : derivedDelta

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-orange-900 py-16">
        <div className="container relative mx-auto max-w-5xl px-6">
          <Link
            href="/mock"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-orange-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> 모의고사 홈
          </Link>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <BarChart3 className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">누적분석</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            회차를 거듭할수록,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              내 성적이 어디로 향하는가.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-orange-100">
            T사관에서 응시한 모든 회차를 모아 총점·과목별 추이를 한눈에. 최고 점수, 평균, 최근 상승폭까지 자동 분석.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 py-14">
        {isMogo && (
          <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            실데이터 · 모고 연동
          </div>
        )}
        {isExample && (
          <div className="mb-8 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <span>
              {!isAuthenticated
                ? "로그인 후 응시하면 실제 회차별 추이가 표시됩니다. 아래는 "
                : loading
                  ? "성적을 불러오는 중입니다. 아래는 "
                  : "저장된 응시 결과가 2회 미만이라 아래는 "}
              <strong className="font-bold">예시</strong> 데이터입니다. 회차를 2회 이상 응시하면 내 실제 추이로
              바뀝니다.
            </span>
          </div>
        )}

        {/* 요약 타일 */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryTile
            icon={ListChecks}
            label="응시 회차 수"
            value={`${count}회`}
            sub={isExample ? "예시" : "누적 응시"}
            accent="text-slate-600"
          />
          <SummaryTile
            icon={Trophy}
            label="최고 총점"
            value={`${best}`}
            sub="/ 300점"
            accent="text-amber-600"
          />
          <SummaryTile
            icon={BarChart3}
            label="평균 총점"
            value={`${avg}`}
            sub="/ 300점"
            accent="text-orange-600"
          />
          <SummaryTile
            icon={delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus}
            label="최근 대비 상승폭"
            value={delta > 0 ? `+${delta}` : `${delta}`}
            sub={delta > 0 ? "상승 중" : delta < 0 ? "하락" : "유지"}
            accent={delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-gray-500"}
          />
        </div>

        {/* 회차별 총점 추이 */}
        <section className="mb-10">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
            <LineChartIcon className="h-4 w-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-700">회차별 총점 추이</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">총점은 어떻게 움직였나</h2>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <LineChart data={totals} labels={labels} color="#d97706" yMin={0} yMax={300} />
            </CardContent>
          </Card>
        </section>

        {/* 과목별 추이 (small multiples) */}
        <section className="mb-10">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
            <BarChart3 className="h-4 w-4 text-red-700" />
            <span className="text-xs font-bold text-red-700">과목별 추이</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">국어 · 영어 · 수학 (각 100점 만점)</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {SUBJECTS.map((subj) => {
              const series = rows.map((r) => r[subj.key])
              const nums = series.filter((v): v is number => v != null)
              const sAvg = nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0
              const sBest = nums.length ? Math.max(...nums) : 0
              return (
                <Card key={subj.key} className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-bold text-gray-900">
                        <span
                          className="inline-block h-3 w-3 rounded-sm"
                          style={{ backgroundColor: subj.color }}
                        />
                        {subj.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        평균 <strong className="text-gray-900">{sAvg}</strong> · 최고{" "}
                        <strong className="text-gray-900">{sBest}</strong>
                      </span>
                    </div>
                    <MiniChart data={series} labels={labels} color={subj.color} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* 회차별 상세 표 */}
        <section className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <ListChecks className="h-4 w-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-700">회차별 상세</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">응시 기록 전체 보기</h2>
          <Card className="overflow-hidden border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-4 py-3 text-left font-semibold">회차</th>
                    <th className="px-4 py-3 text-left font-semibold">날짜</th>
                    <th className="px-4 py-3 text-left font-semibold">시험</th>
                    <th className="px-4 py-3 text-right font-semibold">국어</th>
                    <th className="px-4 py-3 text-right font-semibold">영어</th>
                    <th className="px-4 py-3 text-right font-semibold">수학</th>
                    <th className="px-4 py-3 text-right font-semibold">총점</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const prev = i > 0 ? rows[i - 1].total : null
                    const d = prev != null ? r.total - prev : null
                    return (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-bold text-gray-900">{r.label}</td>
                        <td className="px-4 py-3 text-gray-500">{r.date}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {isExample ? "예시" : `${trackLabel(r.track)} ${r.year ?? ""}`}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.korean ?? "-"}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.english ?? "-"}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-gray-700">{r.math ?? "-"}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-black text-gray-900 tabular-nums">{r.total}</span>
                          {d != null && d !== 0 && (
                            <span
                              className={`ml-1.5 text-xs font-bold ${d > 0 ? "text-emerald-600" : "text-red-600"}`}
                            >
                              {d > 0 ? `▲${d}` : `▼${Math.abs(d)}`}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-center text-sm text-gray-500">
            더 많은 회차를 응시할수록 추이 분석이 정확해집니다.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/mock/tsagwan">
              <Button size="lg" className="bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                T사관 모의 응시 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/mock/past">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 px-8 py-6 text-lg font-bold text-gray-700 hover:bg-gray-50"
              >
                역대 기출 풀기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
