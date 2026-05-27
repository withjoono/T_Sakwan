# Sakwan ↔ Mogo 연동 설계서

> 사관·경찰 모의고사를 Mogo 앱을 재사용해 제공하기 위한 설계
> 작성일: 2026-05-28
> 원칙: **Mogo 운영본은 단 한 줄도 수정하지 않는다.** Sakwan-front만 수정.

---

## 1. 큰 그림

```
                        [Hub (tskool.kr)]
                              │ SSO 로그인 (Bearer token)
              ┌───────────────┼───────────────┐
              ▼                               ▼
   [Sakwan-front (이 앱)]            [Mogo (mogomogo.kr)]
   - 사관·경찰 관문 / 마케팅          - 모의고사 응시 입력
   - 합격선 매칭 분석                 - 채점 / 점수 저장
   - 멘토링·생기부·면접               - 점수 조회 API
              │                               ▲
              │  deep-link (응시 시작)         │
              ├──────────────────────────────►│
              │                               │
              │  점수 조회 (mogo-backend API) │
              ◄──────────────────────────────┘
```

핵심: **응시·채점은 Mogo에 위임**, **사관·경찰 특화 분석은 Sakwan이 자체 처리**

---

## 2. Mogo 측 현황 (읽기만으로 파악)

### 2.1 URL 패턴

| 기능 | URL |
|---|---|
| 대시보드 | `https://mogomogo.kr/main` |
| 모의고사 선택 | `https://mogomogo.kr/main/input` |
| 모의고사 입력 폼 | `https://mogomogo.kr/main/input/form?year={YYYY}&grade={고1/고2/고3}&month={M}` |
| 점수 분석 | `https://mogomogo.kr/main/score-analysis` |
| 취약 분석 | `https://mogomogo.kr/main/weakness-analysis` |
| 목표대학 | `https://mogomogo.kr/main/target-university` |

→ **Sakwan에서 deep-link로 보낼 수 있는 진입점**: `/main/input/form?year=...&grade=...&month=...`

### 2.2 데이터 모델 (lib/api/types.ts)

```ts
interface MockExam {
  id: number;
  code: string;
  name: string;
  grade?: string;       // "고1" | "고2" | "고3"
  year?: number;
  month?: number;
  type?: string;        // 자유 문자열 — 여기에 'saagwan' | 'police' 추가 가능
  createdAt: string;
}

interface StudentScore {
  id: number;
  studentId: number;
  mockExamId: number;
  // 국어/수학/영어/탐구1/탐구2/한국사/제2외국어 (수능 기반)
  koreanRaw/koreanStandard/koreanPercentile/koreanGrade
  mathRaw/...
  totalStandardSum?: number;
  totalPercentileSum?: number;
  ...
}
```

### 2.3 백엔드 API

- Base: `https://mogo-backend-dot-ts-back-nest-479305.du.r.appspot.com`
- 인증: `Authorization: Bearer {token}` (Hub SSO 토큰)
- 핵심 엔드포인트:
  - `GET /api/scores/student/{studentId}` — 학생 점수 목록
  - `GET /api/mock-exams` — 전체 모의고사 목록
  - `GET /api/mock-exams/search?year&grade&month` — 모의고사 검색

→ **Sakwan에서 동일한 SSO 토큰으로 호출 가능** (CORS 허용된 경우)

---

## 3. Sakwan에서 이번에 구현할 것

### 3.1 /mock 페이지 변경
- "응시 신청" 버튼 → Mogo deep-link로 변경
- "내 점수 조회" 영역 추가 → mogo-backend `/api/scores/student/{userId}` 호출
- "과거 합격선 매칭 분석" → Sakwan 자체 DB(상수 파일)와 매칭해 표시

### 3.2 데이터 흐름

```
1. 사용자가 Sakwan /mock에서 "사관 모의 응시" 클릭
   ↓
2. Sakwan은 Mogo의 가장 최근 회차로 deep-link
   → https://mogomogo.kr/main/input/form?year=2026&grade=고3&month=현재월
   (Mogo 측에 사관 카테고리 추가 전이라도 일단 일반 모의고사로 진입 가능)
   ↓
3. 사용자가 Mogo에서 응시 + 점수 입력 + 저장
   ↓
4. 사용자가 Sakwan으로 복귀 (탭 전환 또는 nav)
   ↓
5. Sakwan은 mogo-backend `/api/scores/student/{userId}` 호출
   → 최신 점수 가져옴
   ↓
6. Sakwan은 자체 보유한 사관·경찰 합격선 DB와 매칭
   → "이 점수면 작년 공사 합격" 메시지 표시
```

### 3.3 사관·경찰 합격선 DB (Sakwan 자체 관리)

```ts
// lib/sakwan/cutoffs.ts (신규 생성 예정)
export const SAAGWAN_CUTOFFS = {
  army:     { 2021: 248, 2022: 252, 2023: 250, 2024: 256, 2025: 254 },
  airforce: { 2021: 261, 2022: 264, 2023: 263, 2024: 270, 2025: 268 },
  navy:     { 2021: 254, 2022: 258, 2023: 256, 2024: 262, 2025: 260 },
  nursing:  { 2021: 246, 2022: 250, 2023: 248, 2024: 253, 2025: 251 },
  police:   { 2021: 265, 2022: 270, 2023: 268, 2024: 274, 2025: 272 },
}
```

(현재는 페이지에 하드코딩되어 있음 → 공용 모듈로 추출하여 매칭 로직과 공유)

### 3.4 합격 가능성 계산 함수

```ts
// lib/sakwan/match.ts
export function matchCutoff(
  totalScore: number,
  school: keyof typeof SAAGWAN_CUTOFFS,
  year: number = 2025
) {
  const cut = SAAGWAN_CUTOFFS[school][year]
  const diff = totalScore - cut
  const pass = diff >= 0
  return { pass, diff, cut, message:
    pass ? `합격선 +${diff}점` : `합격선 -${Math.abs(diff)}점` }
}
```

---

## 4. ⚠️ 사관 모의는 수능과 시험 형식이 다르다 (2026-05-28 추가)

사용자 제공 정보:
- **국어** 30문항 (모두 객관식)
- **영어** 30문항 (모두 객관식)
- **수학** 30문항
  - 공통 객관식 1–15
  - 공통 주관식 16–22
  - 선택과목(확통/미적/기하) 객관식 23–28
  - 선택과목 주관식 29–30

→ Mogo의 현행 수능 폼(국어 45·수학 30 분리·탐구1/2·한국사·제2외국어)으로는 사관 모의 점수를 정확히 입력할 수 없습니다.

**Sakwan 측 대응 (이미 반영):**
- `lib/sakwan/exam-format.ts`에 사관·경찰 시험 형식을 SSOT로 정의
- /mock 페이지에 "시험 형식 안내" 섹션 추가 — 응시 전 미리 보기
- 안내 박스로 "Mogo는 아직 수능 폼이라 사관 점수 입력이 부정확할 수 있다"고 경고

**Mogo 측에서 결국 필요해질 작업 (Phase 3로 격상):**
- 사관·경찰 전용 입력 폼 (현재 수능 폼과 별개 라우트로)
- 또는 기존 폼에 `type=saagwan` 분기 + 공간능력·선택과목 필드 동적 노출

---

## 5. Mogo 측에 향후 추가 필요한 항목 (이번 세션 작업 ✕)

**아래 항목은 Junho님이 별도로 Mogo 작업 시 진행하시면 됩니다.**

| 우선순위 | 항목 | 위치 | 설명 |
|---|---|---|---|
| **P0** | mogo-backend CORS에 sakwan-front 도메인 추가 | mogo-backend | 1줄 추가. 없으면 Sakwan에서 점수 조회 불가 |
| **P1** | MockExam.type에 'saagwan', 'police' 값 사용 | mogo-backend DB | 사관·경찰 회차를 별도로 분류하기 위함 |
| **P1** | 사관·경찰 회차 데이터 시드 | mogo-backend | 매월 모의고사를 별도 회차로 등록 |
| **P1** | **사관·경찰 전용 입력 폼** | mogo-frontend | 국30/영30/수30(공통+선택) 형식 + 경찰대 형식 — *시험 형식이 다르므로 P1으로 격상* |
| **P2** | 공간능력 과목 추가 | mogo-backend + frontend | 사관학교 일부 과목, 미래 도입 시 |
| **P3** | 사관학교/경찰대를 University 테이블에 추가 | mogo-backend | 목표대학 기능 재사용 |
| **P3** | 사관·경찰 합격선 DB를 Mogo로 이관 | mogo-backend | 현재 Sakwan에서 관리 중 |

→ P0(CORS) 추가되면 점수 자동 동기화 활성화 가능.
→ P1 모두 추가되면 사관·경찰 응시 → 점수 정확 입력 → 매칭 분석까지 완결.

---

## 6. 환경변수 추가 (Sakwan)

`.env.local`에 추가 필요:

```env
NEXT_PUBLIC_MOGO_URL=https://mogomogo.kr
NEXT_PUBLIC_MOGO_API_URL=https://mogo-backend-dot-ts-back-nest-479305.du.r.appspot.com
```

기본값은 코드에 fallback 설정 — 환경변수 없어도 동작.

---

## 7. CORS / 인증 고려사항

- Sakwan(sakwan-front.web.app)에서 mogo-backend API를 호출하려면 mogo-backend CORS 허용 목록에 sakwan-front 도메인이 있어야 함
- **확인 필요**: mogo-backend가 `*` 또는 모든 *.web.app, tskool.kr 계열 도메인을 허용하는지
- 만약 차단된다면 Mogo 측에 CORS 추가 작업 1줄 필요 (이것은 P0 — 안 되면 점수 조회 불가)

대안:
- 또는 Hub(tskool.kr)를 거치는 BFF(Backend For Frontend) 패턴
- 또는 Sakwan-front도 같은 tskool.kr 서브도메인으로 호스팅

---

## 8. 점진적 도입 시나리오

**Phase 1 (이번 세션)** — Mogo 변경 0
- Sakwan /mock 응시 버튼 → Mogo 일반 모의고사 입력으로 deep-link
- 점수 조회 영역 UI만 추가 (실 API 호출은 placeholder 또는 try/catch로 실패 시 안내)
- 사관·경찰 합격선 매칭 분석 로직 추가

**Phase 2 (다음 작업)** — Mogo 최소 변경
- mogo-backend CORS에 sakwan-front 도메인 추가 (1줄)
- 점수 조회 API 실제 호출 활성화

**Phase 3 (이후)** — Mogo 본격 확장
- MockExam.type에 'saagwan', 'police' 값 도입
- 공간능력 과목 + 입력 폼 분기
- 사관학교/경찰대 university 데이터 시드

---

*Mogo 운영본에 영향을 주는 변경은 모두 Phase 2 이상에서만 발생합니다. Phase 1은 Sakwan-front 단독 작업이라 롤백 위험 0.*
