"use client"

/**
 * 사관 1차 합불 예측 (/1cha)
 *
 * 8/1 사관 1차 시험 직후 유입 → 2차 면접반 / 멘토링반 전환용 랜딩.
 *
 * 1차 합격자 선발은 원점수가 아니라 환산점수(표준점수) 기준이고, 모집단위(계열 × 성별)별로
 * 따로 이뤄진다. 그래서 학교·계열·성별·과목별 원점수·수학 선택과목까지 모두 받아야 한다.
 * 총점만으로는 환산이 불가능하다.
 *
 * 환산·판정은 mogo-backend(`src/onecha`)가 수행한다 — 설계서: 사관_1차_환산점수_예측_설계서.md
 */

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MATH_SELECT_BY_TRACK,
  RAW_MAX,
  SCHOOLS,
  SCHOOL_SHORT,
  estimateScores,
  fetchSummary,
  isUnlocked,
  loadLastInput,
  submitLead,
  submitScores,
  type Estimate,
  type Gender,
  type MathSelect,
  type OnechaInput,
  type School,
  type SchoolVerdict,
  type SummaryData,
  type Track,
} from "@/lib/sakwan/onecha-store"
import {
  CONFIDENCE_LABEL,
  SCALE_LABEL,
  SEGMENT_META,
  clamp,
  formatDiff,
  formatScore,
  toBins,
  verdictOf,
  type Segment,
} from "@/lib/sakwan/predict1cha"
import {
  ArrowRight,
  BarChart3,
  Info,
  Loader2,
  Lock,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"

const EXAM_DATE = new Date("2026-08-01T00:00:00+09:00")
const THIS_YEAR = 2027

const TONE = {
  emerald: { badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-700", bar: "bg-emerald-500", ring: "ring-emerald-200 border-emerald-400" },
  amber: { badge: "bg-amber-100 text-amber-700", text: "text-amber-700", bar: "bg-amber-500", ring: "ring-amber-200 border-amber-400" },
  red: { badge: "bg-red-100 text-red-700", text: "text-red-700", bar: "bg-red-500", ring: "ring-red-200 border-red-400" },
} as const

export default function OneChaPage() {
  const [target, setTarget] = useState<School>("육군사관학교")
  const [track, setTrack] = useState<Track>("인문")
  const [gender, setGender] = useState<Gender>("남")
  const [kor, setKor] = useState(60)
  const [eng, setEng] = useState(60)
  const [mathCom, setMathCom] = useState(44)
  const [mathSelName, setMathSelName] = useState<MathSelect>("확률과통계")
  const [mathSel, setMathSel] = useState(14)

  const [result, setResult] = useState<Estimate | null>(null)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [unlocked, setUnlockedState] = useState(false)
  const [dday, setDday] = useState<number | null>(null)

  useEffect(() => {
    setUnlockedState(isUnlocked())
    setDday(Math.ceil((EXAM_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    const last = loadLastInput()
    if (last) {
      setTarget(last.targetSchool)
      setTrack(last.track)
      setGender(last.gender)
      setKor(last.korRaw)
      setEng(last.engRaw)
      setMathCom(last.mathComRaw)
      setMathSelName(last.mathSelName)
      setMathSel(last.mathSelRaw)
    }
  }, [])

  // 자연계열은 확률과통계를 선택할 수 없다 (모집요강)
  const mathOptions = MATH_SELECT_BY_TRACK[track]
  useEffect(() => {
    if (!mathOptions.includes(mathSelName)) setMathSelName(mathOptions[0])
  }, [mathOptions, mathSelName])

  const input: OnechaInput = {
    track,
    gender,
    targetSchool: target,
    korRaw: kor,
    engRaw: eng,
    mathComRaw: mathCom,
    mathSelName,
    mathSelRaw: mathSel,
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")
    try {
      const data = await submitScores(input)
      setResult(data)
      setSummary(await fetchSummary(track, gender))
    } catch (e) {
      setError(e instanceof Error ? e.message : "예측에 실패했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setLoading(false)
    }
  }

  /** 지망 학교만 바꿔 다시 볼 때는 저장 없이 재계산 */
  async function reestimate(next: School) {
    setTarget(next)
    if (!result) return
    try {
      setResult(await estimateScores({ ...input, targetSchool: next }))
    } catch {
      /* 재계산 실패는 무시 — 기존 결과 유지 */
    }
  }

  const mine = result ? verdictOf(result.schools, target) : undefined
  const segMeta = mine?.segment ? SEGMENT_META[mine.segment as Segment] : null
  const tone = segMeta ? TONE[segMeta.tone] : TONE.amber

  const bins = useMemo(() => {
    if (!result || !summary) return []
    return toBins(summary, result.standard.sum, mine?.cut ?? null, mine?.scale ?? "standard_sum")
  }, [result, summary, mine])
  const maxCount = Math.max(...bins.map((b) => b.count), 1)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-slate-900 py-16">
        <div className="container relative mx-auto max-w-5xl px-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <Target className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">
              {THIS_YEAR} 사관 1차 합불 예측
              {dday !== null && dday > 0 ? ` · 시험 D-${dday}` : dday === 0 ? " · 오늘 시험" : " · 채점 중"}
            </span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            내 점수로,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
              올해 합격할 수 있을까?
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-red-100">
            1차 합격은 원점수가 아니라 <b className="text-white">환산점수(표준점수)</b>로 갈립니다. 가채점 원점수를
            넣으면 모집요강 산식 그대로 환산해, 지원 모집단위의 예상 합격선까지 몇 점 남았는지 알려드립니다.
          </p>
        </div>
      </section>

      {/* STEP 1 · 입력 */}
      <section className="border-b border-gray-100 bg-gray-50 py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
            <Sparkles className="h-4 w-4 text-red-700" />
            <span className="text-xs font-bold text-red-700">STEP 1 · 가채점 입력</span>
          </div>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">모집단위와 과목별 원점수를 넣어주세요</h2>

          <Card className="border-gray-200">
            <CardContent className="space-y-6 p-6">
              {/* 지망 학교 */}
              <Field label="지망 학교">
                <div className="flex flex-wrap gap-2">
                  {SCHOOLS.map((s) => (
                    <Chip key={s} active={target === s} onClick={() => reestimate(s)}>
                      {SCHOOL_SHORT[s].icon} {SCHOOL_SHORT[s].short}
                    </Chip>
                  ))}
                </div>
              </Field>

              {/* 모집단위 — 계열 × 성별. 선발이 이 단위로 나뉘므로 컷도 달라진다 */}
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="계열" hint="수학 선택과목 범위가 달라집니다">
                  <div className="flex gap-2">
                    {(["인문", "자연"] as Track[]).map((t) => (
                      <Chip key={t} active={track === t} onClick={() => setTrack(t)}>
                        {t}계열
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="성별" hint="모집단위·선발배수가 다릅니다">
                  <div className="flex gap-2">
                    {(["남", "여"] as Gender[]).map((g) => (
                      <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
                        {g}자
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>

              {/* 과목별 원점수 */}
              <Field label="과목별 원점수" hint="가채점 기준">
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberInput label="국어" value={kor} max={RAW_MAX.kor} onChange={setKor} />
                  <NumberInput label="영어" value={eng} max={RAW_MAX.eng} onChange={setEng} />
                  <NumberInput
                    label="수학 공통 (수학Ⅰ·Ⅱ)"
                    value={mathCom}
                    max={RAW_MAX.mathCommon}
                    onChange={setMathCom}
                  />
                  <div>
                    <div className="mb-1 text-xs font-bold text-gray-500">수학 선택과목</div>
                    <div className="flex gap-2">
                      <select
                        value={mathSelName}
                        onChange={(e) => setMathSelName(e.target.value as MathSelect)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                      >
                        {mathOptions.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={0}
                        max={RAW_MAX.mathSelect}
                        value={mathSel}
                        onChange={(e) => setMathSel(clamp(Number(e.target.value), 0, RAW_MAX.mathSelect))}
                        className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400">/ {RAW_MAX.mathSelect}점</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  수학 100점은 공통 {RAW_MAX.mathCommon}점 + 선택 {RAW_MAX.mathSelect}점으로 나뉩니다. 선택과목은
                  조정점수 산식에 쓰이므로 반드시 실제 응시 과목을 골라주세요.
                </p>
              </Field>

              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  size="lg"
                  className="w-full bg-red-700 py-6 text-lg font-bold text-white hover:bg-red-800"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 환산하는 중…
                    </>
                  ) : (
                    <>
                      올해 합격 가능성 확인하기 <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                {error && <p className="mt-2 text-center text-sm font-semibold text-red-600">{error}</p>}
                <p className="mt-2 text-center text-[11px] text-gray-400">
                  입력한 점수는 익명으로 저장되며, 올해 응시생 분포 추정에만 사용됩니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* STEP 2 · 결과 */}
      {result && mine && segMeta && (
        <section className="bg-white py-12">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
              <BarChart3 className="h-4 w-4 text-red-700" />
              <span className="text-xs font-bold text-red-700">STEP 2 · 올해 합불 판정</span>
            </div>

            <Card className={`border-2 ${tone.ring} ring-1`}>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone.badge}`}>
                      {segMeta.emoji} {segMeta.label}
                    </span>
                    <h3 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">{segMeta.headline}</h3>
                    <p className="mt-2 text-gray-500">{segMeta.sub}</p>
                    <p className="mt-3 text-sm text-gray-600">
                      {SCHOOL_SHORT[target].icon} {target} · {track}계열 {gender}자 · {THIS_YEAR} 예상 합격선{" "}
                      <b>{mine.cut !== null ? formatScore(mine.cut, mine.scale) : "—"}</b> 대비{" "}
                      <b className={tone.text}>
                        {mine.diff !== null
                          ? `${formatDiff(mine.diff, mine.scale)}점 ${mine.diff >= 0 ? "(통과)" : "부족"}`
                          : "—"}
                      </b>
                    </p>
                  </div>

                  <div className="shrink-0 text-center md:w-48">
                    <div className="text-xs font-bold text-gray-500">올해 1차 합격 가능성</div>
                    <div className={`text-6xl font-black ${tone.text}`}>
                      {mine.prob ?? "—"}
                      <span className="text-2xl font-bold text-gray-400">%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${mine.prob ?? 0}%` }} />
                    </div>
                    <div className="mt-2 text-[11px] text-gray-400">
                      {CONFIDENCE_LABEL[result.confidence]}
                    </div>
                  </div>
                </div>

                {/* 근거 지표 */}
                <div className="mt-6 grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50 py-4 text-center">
                  <Stat
                    label="내 환산점수"
                    value={formatScore(mine.myScore, mine.scale)}
                    sub={SCALE_LABEL[mine.scale]}
                  />
                  <Stat
                    label={`${THIS_YEAR} 예상 합격선`}
                    value={mine.cut !== null ? formatScore(mine.cut, mine.scale) : "—"}
                    sub={mine.note ?? "추정치"}
                  />
                  <Stat
                    label="모집단위 내 내 위치"
                    value={`상위 ${result.topPercent}%`}
                    sub={
                      result.unitRespondents > 0
                        ? `${result.unitRespondents.toLocaleString()}명 제출`
                        : "제출 누적 중"
                    }
                    icon={<Users className="h-3 w-3" />}
                  />
                </div>

                {/* 원점수 → 표준점수 변환 내역 */}
                <div className="mt-4 rounded-xl border border-gray-100 p-4">
                  <div className="mb-2 text-xs font-bold text-gray-500">원점수 → 표준점수 환산 내역</div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <Conv label="국어" raw={kor} std={result.standard.kor} />
                    <Conv label="영어" raw={eng} std={result.standard.eng} />
                    <Conv label={`수학 (${mathSelName})`} raw={mathCom + mathSel} std={result.standard.math} />
                  </div>
                  <div className="mt-3 border-t border-gray-100 pt-2 text-right text-sm">
                    원점수 합 <b>{result.rawTotal}</b> · 표준점수 합{" "}
                    <b className="text-red-700">{result.standard.sum.toFixed(1)}</b>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const text = `사관 1차 가채점 — 올해 ${SCHOOL_SHORT[target].short} 합격 가능성 ${mine.prob}%래! 너도 해봐 👉`
                    const url = typeof window !== "undefined" ? window.location.href : ""
                    if (typeof navigator !== "undefined" && navigator.share) {
                      void navigator.share({ title: "사관 1차 합불 예측", text, url })
                    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                      void navigator.clipboard.writeText(`${text} ${url}`)
                    }
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
                >
                  <Share2 className="h-4 w-4" /> 결과 공유하기
                </button>
              </CardContent>
            </Card>

            {/* 분포 */}
            {summary && summary.total > 0 && (
              <div className="mt-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                  <TrendingUp className="h-4 w-4 text-blue-700" />
                  <span className="text-xs font-bold text-blue-700">
                    {track}계열 {gender}자 표준점수 합산 분포
                  </span>
                </div>
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex h-40 items-end gap-[2px]">
                      {bins.map((b) => (
                        <div
                          key={b.score}
                          // h-full 필수 — 없으면 자식 막대의 height:% 가 0으로 계산돼 그래프가 사라짐
                          className="group relative flex h-full flex-1 flex-col justify-end"
                          title={`${b.score}~${b.score + summary.bucketSize - 1}점 · ${b.count}명`}
                        >
                          {b.isMine && (
                            <span className="mb-0.5 whitespace-nowrap text-center text-[10px] font-bold text-red-700">
                              나
                            </span>
                          )}
                          <div
                            className={`w-full rounded-t ${
                              b.isMine ? "bg-red-600" : b.aboveCut ? "bg-emerald-200" : "bg-gray-200"
                            }`}
                            style={{ height: `${Math.max((b.count / maxCount) * 100, 1)}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
                      <Legend color="bg-red-600" text={`내 표준점수 합 ${result.standard.sum.toFixed(1)}`} />
                      {mine.scale === "standard_sum" && mine.cut !== null && (
                        <Legend color="bg-emerald-200" text={`합격권 (${mine.cut.toFixed(1)} 이상)`} />
                      )}
                      <Legend color="bg-gray-200" text="합격선 미만" />
                    </div>
                    {mine.scale === "kma_50" && (
                      <p className="mt-2 text-[11px] text-gray-400">
                        육사는 반영 기본점수(50점 만점) 척도로 선발하므로, 이 분포에는 합격선을 표시하지 않습니다.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 3 · 학교별 상세 */}
            <div className="mt-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
                <Lock className="h-4 w-4 text-red-700" />
                <span className="text-xs font-bold text-red-700">STEP 3 · 학교별 상세 예측 + 2차 로드맵</span>
              </div>
              {unlocked ? (
                <DetailResult schools={result.schools} />
              ) : (
                <LeadGate
                  schools={result.schools}
                  target={target}
                  segment={mine.segment ?? ""}
                  onUnlock={() => setUnlockedState(true)}
                />
              )}
            </div>

            {/* 면책 */}
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <div>
                본 결과는 <b>모의 추정치</b>입니다. 각 사관학교는 본인 1차 성적은 공개하지만{" "}
                <b>합격 커트라인은 공식 발표하지 않습니다.</b> 표시된 합격선은 입시 기사·업계 추정을 취합한 값입니다.
                또한 표준점수 산식의 평균·표준편차는 올해 전체 응시생 통계라 가채점 시점엔 확정할 수 없어, 누적된
                익명 제출로 추정합니다 — 제출이 쌓일수록 정확해집니다. 실제 합격은 2차(체력·면접·신체검사)와 수능
                최저·모집정원에 따라 달라집니다.
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/* ── 프레젠테이션 조각 ───────────────────────────────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-xs font-bold text-gray-500">{label}</span>
        {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-4 py-2 text-sm font-bold transition-all ${
        active ? "border-red-700 bg-red-700 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-red-300"
      }`}
    >
      {children}
    </button>
  )
}

function NumberInput({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-bold text-gray-500">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value), 0, max))}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
        />
        <span className="whitespace-nowrap text-[11px] text-gray-400">/ {max}점</span>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: string
  sub?: string
  icon?: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-500">
        {icon}
        {label}
      </div>
      <div className="text-xl font-black text-gray-900">{value}</div>
      {sub && <div className="px-1 text-[10px] text-gray-400">{sub}</div>}
    </div>
  )
}

function Conv({ label, raw, std }: { label: string; raw: number; std: number }) {
  return (
    <div className="rounded-lg bg-gray-50 py-2">
      <div className="text-[11px] font-bold text-gray-500">{label}</div>
      <div className="text-gray-400">
        {raw} <span className="text-gray-300">→</span>{" "}
        <b className="text-gray-900">{std.toFixed(1)}</b>
      </div>
    </div>
  )
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i className={`inline-block h-2.5 w-2.5 rounded-sm ${color}`} /> {text}
    </span>
  )
}

/* ── 학교별 상세 ─────────────────────────────────────────────── */

function DetailResult({ schools }: { schools: SchoolVerdict[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {schools.map((s) => {
        const meta = s.segment ? SEGMENT_META[s.segment as Segment] : null
        const t = meta ? TONE[meta.tone] : TONE.amber
        return (
          <Card key={s.school} className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {SCHOOL_SHORT[s.school].icon} {s.school}
                  </div>
                  <div className="text-xs text-gray-400">
                    {SCALE_LABEL[s.scale]} · 내 점수 {formatScore(s.myScore, s.scale)}
                  </div>
                </div>
                {meta && <span className={`rounded-full px-3 py-1 text-xs font-bold ${t.badge}`}>{meta.label}</span>}
              </div>

              {s.cut === null ? (
                <p className="text-sm text-gray-400">{s.note ?? "합격선 데이터가 없습니다"}</p>
              ) : (
                <>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-gray-500">합격 가능성</span>
                    <span className={`text-3xl font-black ${t.text}`}>
                      {s.prob}
                      <span className="text-base font-normal text-gray-400">%</span>
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      (s.diff ?? 0) >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {(s.diff ?? 0) >= 0
                      ? `✓ 합격선 ${formatDiff(s.diff ?? 0, s.scale)}점`
                      : `✗ 합격선까지 ${formatScore(Math.abs(s.diff ?? 0), s.scale)}점 부족`}
                  </span>
                </>
              )}
            </CardContent>
          </Card>
        )
      })}

      <div className="md:col-span-2">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900">이제 다음 단계로</h3>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/interview">
                <Button size="lg" className="bg-red-700 px-8 py-6 text-lg font-bold text-white hover:bg-red-800">
                  2차 면접반 알아보기 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/mentoring">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-red-200 px-8 py-6 text-lg font-bold text-red-700 hover:bg-white"
                >
                  1차 이후 멘토링반
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ── 리드 게이트 ─────────────────────────────────────────────── */

function LeadGate({
  schools,
  target,
  segment,
  onUnlock,
}: {
  schools: SchoolVerdict[]
  target: School
  segment: string
  onUnlock: () => void
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  async function handle() {
    if (!name.trim() || phone.replace(/\D/g, "").length < 9) {
      setError("이름과 연락처를 정확히 입력해 주세요.")
      return
    }
    if (!consent) {
      setError("개인정보 수집·이용에 동의해 주세요.")
      return
    }
    setError("")
    setSending(true)
    try {
      await submitLead({ name, phone, target, segment, consent: true })
      onUnlock()
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200">
      <div className="pointer-events-none select-none blur-sm">
        <DetailResult schools={schools} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
        <Card className="w-full max-w-md border-2 border-red-200 shadow-xl">
          <CardContent className="p-6">
            <div className="mb-1 flex items-center gap-2 text-red-700">
              <Lock className="h-5 w-5" />
              <span className="font-bold">학교별 상세 예측 + 2차 로드맵</span>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              연락처를 남기면 육·해·공·국간사 학교별 상세 합불 예측과 맞춤 2차 로드맵을 바로 열어드려요.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락처 (예: 01012345678)"
              inputMode="numeric"
              className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <label className="mb-3 flex items-start gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-red-700"
              />
              <span>2차·멘토링 안내 목적의 개인정보 수집·이용에 동의합니다. (동의 철회 가능)</span>
            </label>
            {error && <p className="mb-2 text-xs font-semibold text-red-600">{error}</p>}
            <Button
              onClick={handle}
              disabled={sending}
              className="w-full bg-red-700 py-5 font-bold text-white hover:bg-red-800"
            >
              {sending ? "여는 중…" : "상세 결과 열기"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
