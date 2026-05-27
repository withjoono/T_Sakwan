/**
 * 사관·경찰대 1차 합격선 DB
 *
 * 출처: 각 학교 모집요강 (예시 데이터, 실 데이터는 추후 보강)
 * 점수 단위: 1차 필기 표준점수 합산 (300점 만점 기준 가정)
 */

export type SchoolKey = "army" | "airforce" | "navy" | "nursing" | "police"

export const SCHOOL_META: Record<
  SchoolKey,
  { name: string; short: string; icon: string; color: string; track: "saagwan" | "police" }
> = {
  army:     { name: "육군사관학교",       short: "육사",   icon: "🟢", color: "emerald", track: "saagwan" },
  airforce: { name: "공군사관학교",       short: "공사",   icon: "🔷", color: "sky",     track: "saagwan" },
  navy:     { name: "해군사관학교",       short: "해사",   icon: "🔵", color: "blue",    track: "saagwan" },
  nursing:  { name: "국군간호사관학교",   short: "국간사", icon: "🏥", color: "pink",    track: "saagwan" },
  police:   { name: "경찰대학교",         short: "경찰대", icon: "👮", color: "indigo",  track: "police"  },
}

export const SAAGWAN_CUTOFFS: Record<SchoolKey, Record<number, number>> = {
  army:     { 2021: 248, 2022: 252, 2023: 250, 2024: 256, 2025: 254 },
  airforce: { 2021: 261, 2022: 264, 2023: 263, 2024: 270, 2025: 268 },
  navy:     { 2021: 254, 2022: 258, 2023: 256, 2024: 262, 2025: 260 },
  nursing:  { 2021: 246, 2022: 250, 2023: 248, 2024: 253, 2025: 251 },
  police:   { 2021: 265, 2022: 270, 2023: 268, 2024: 274, 2025: 272 },
}

export const SAAGWAN_AVG: Record<SchoolKey, Record<number, number>> = {
  army:     { 2025: 232 },
  airforce: { 2025: 245 },
  navy:     { 2025: 238 },
  nursing:  { 2025: 230 },
  police:   { 2025: 250 },
}

/**
 * 합격 가능성 매칭
 */
export function matchCutoff(totalScore: number, school: SchoolKey, year: number = 2025) {
  const cut = SAAGWAN_CUTOFFS[school][year]
  if (cut === undefined) {
    return { pass: false, diff: 0, cut: 0, message: "데이터 없음" }
  }
  const diff = totalScore - cut
  const pass = diff >= 0
  return {
    pass,
    diff,
    cut,
    message: pass ? `합격선 +${diff}점` : `합격선 -${Math.abs(diff)}점`,
  }
}

/**
 * 한 점수로 5개 학교 전체 매칭
 */
export function matchAll(totalScore: number, year: number = 2025) {
  return (Object.keys(SCHOOL_META) as SchoolKey[]).map((key) => ({
    key,
    meta: SCHOOL_META[key],
    ...matchCutoff(totalScore, key, year),
  }))
}
