---
name: mock-and-onecha
description: T사관 모의고사·채점·1차 합불예측의 계산 경계(클라이언트 vs mogo-backend)와 lib/sakwan 데이터 SSOT
type: project
---

# 모의고사 · 채점 · 1차 합불예측

Sakwan 을 형제 앱과 구분 짓는 부분이다. `Kwakiwon`·`T_Medi` 에는 이 영역이 없다.

## 계산 경계 — 무엇이 서버에 있고 왜 그런가

**환산·판정은 mogo-backend(`src/onecha`)가 갖는다. 클라이언트로 되돌리지 말 것.**
`lib/sakwan/onecha-store.ts` 헤더에 이유가 명시돼 있다:

1. 표준점수 환산의 **모수(평균·표준편차)가 전체 제출 분포에서 나온다** → 클라이언트는 알 수 없다.
2. **합격선(컷)을 내려보내면 노출·조작된다.** 이 앱은 정적 export 라 클라이언트에 둔 값은 전부 읽힌다.

그래서 `lib/sakwan/predict1cha.ts` 에는 **라벨·포맷터·`SEGMENT_META`(pass/borderline/risk) 만** 남아 있다.
클라이언트는 익명 ID(`localStorage: onecha_anon_id`)와 마지막 입력(`onecha_last_input_v2`)·해금 상태(`onecha_unlocked`)만 관리한다.

호출 베이스: `const BASE = ${MOGO_API_URL}/api/tsagwan/1cha` — POST 계열이며 응답은 `{ success, data }` 봉투다.

## 외부 API 호출 지점 (2026-09-03 실측 전량)

| 파일 | 호출 |
|---|---|
| `lib/sakwan/onecha-store.ts` | `${MOGO_API_URL}/api/tsagwan/1cha/*`, `/summary` |
| `lib/sakwan/mogo.ts` | `/api/scores/student/{studentId}`, `/api/mock-exams/code/{code}`, `/api/wrong-answers/grade` |
| `lib/sakwan/tsagwan-grade.ts` | `/api/mock-exams/code/{code}`, `/api/mock-exams/grade`, `/api/wrong-answers/grade` |
| `lib/sakwan/mogo-analysis.ts` | `${MOGO_API_URL}` + 임의 path (취약 분석) |
| `lib/auth.ts` | Hub `POST /auth/sso/verify-code`, `GET /auth/me` |
| `lib/sakwan/licensed-download.ts` | Hub `GET /subscription/download/assets?appId=sakwan` |

`MOGO_API_URL` 기본값 `https://mogo-backend-dot-ts-back-nest-479305.du.r.appspot.com`, `MOGO_URL` 기본값 `https://mogomogo.kr`.

## Mogo 연동 이력 — 설계서보다 코드를 믿을 것

`lib/sakwan/mogo.ts` 헤더:

> 조회(`fetchMogoScores`)는 Mogo 운영본을 그대로 활용한다. 사관 응시 결과 동기화(`syncSaagwanResultToMogo`)는 **mogo-backend 에 사관 5개 회차용 ExamAnswer/CORS 를 추가한 뒤(2026-07-06)** 취약분석 연동을 위해 새로 붙인 write 경로다.
> **설계서 `Mogo_연동_설계서.md` 의 "Mogo 무수정" 원칙은 이 write 경로로 갱신됐다.**

→ 리포 루트의 설계서 문서를 코드보다 우선하지 말 것.

`buildMogoInputLink()` 는 `{MOGO_URL}/main/input/form?year&grade&month` 딥링크를 만든다. 사관·경찰 회차가 Mogo 에 별도 추가되기 전까지는 **가장 가까운 일반 모의고사로 진입**하며, `type=saagwan|police` 파라미터는 Phase 3 예정(미완).

## 데이터 SSOT (`lib/sakwan/`)

| 파일 | 내용 | 주의 |
|---|---|---|
| `answer-keys.ts` | `SAAGWAN_ANSWER_KEYS`·`SAAGWAN_SCORE_KEYS`·`POLICE_ANSWER_KEYS`·`SCORING_RULES` | 정답표 원본 |
| `exam-format.ts` | 사관·경찰 시험 형식(섹션·문항 범위·객관/주관) | **Mogo 의 수능 형식과 다르다.** Mogo 에 사관 전용 입력 폼이 생기기 전까지 여기가 SSOT |
| `scoring.ts` | OMR 채점. 국어/영어/수학 각 1–30, 수학 23–30 은 선택과목 분기 | |
| `cutoffs.ts` | `SCHOOL_META`(army/airforce/navy/nursing/police) + 1차 합격선 | 헤더에 **"예시 데이터, 실 데이터는 추후 보강"** — **실측값으로 취급 금지** |
| `cohort.ts` | 동기 집단 내 위치 | |
| `tsagwan-grade.ts` | T사관 자체 회차 채점 (회차 코드 생성 포함) | |
| `mogo-analysis.ts` | 취약 분석 (mogo-backend 위임) | |
| `scores-store.ts` | 결과 저장 — Firestore 또는 localStorage | 아래 참조 |
| `mock-products.ts` | 상품 정의. 현재 `package` 1종("7월 5회 패키지", 180,000원, 1~5회) | 결제·다운로드 페이지 공용 |

## 저장소 — Firestore 는 선택 의존성

`lib/sakwan/firebase.ts` 는 `NEXT_PUBLIC_FIREBASE_*` 6개가 모두 있을 때만 `sakwan_scores` 컬렉션을 쓴다(`isFirebaseConfigured()`).
**현재 `.env.local` 에 이 값들이 없고, `.env*` 는 `.gitignore` 대상이라 CI 프로덕션 빌드에도 주입되지 않는다**(2026-09-03 확인) → 실제 동작은 `scores-store.ts` 의 **localStorage 폴백(단말기 단위 저장)** 이다.

→ "Firestore 에 저장돼 있다"를 전제한 기능(랭킹·교차분석)을 만들지 말 것. `isFirebaseConfigured()` 분기를 항상 유지한다.

## 관련 라우트

`/mock`(홈) · `/mock/exam` · `/mock/grade` · `/mock/past` · `/mock/result` · `/mock/prediction` · `/mock/score-analysis` · `/mock/statistics` · `/mock/weakness` · `/mock/wrong-answers` · `/mock/tsagwan`(+ `/checkout`, `/download`, `/round/[round]`) · `/1cha`
이 중 대부분이 `useAuth()` 를 쓴다(로그인 필요). 정보 페이지(`/class/[slug]`, `/planner`, `/sanggibu`, `/mentoring`, `/promo/*`)는 로그인과 무관하다.
