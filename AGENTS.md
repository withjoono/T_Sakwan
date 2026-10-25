# AGENTS.md — Sakwan (T사관)

> Codex가 이 파일을 자동으로 읽는다. **여기 적힌 것은 링크가 아니라 규칙이다.**
> 세부 배경은 `docs/context/` 에 있고, 아래 색인에서 필요한 것만 열어 본다.

## 이 리포는 무엇인가

**T사관** — 육사·해사·공사·국간사·경찰대(`army`/`navy`/`airforce`/`nursing`/`police`) 입시 앱.
세 특화대학 앱 중 **유일하게 "앱"** 이다 — 정보 페이지 위에 **모의고사 응시·채점·1차 합불예측** 기능이 얹혀 있다.

- **Next.js 15.2.4 App Router + React 19 + Tailwind v4 + shadcn/ui**, `output: 'export'` **정적 사이트**
- **자체 백엔드가 없다.** 인증은 Hub SSO, 서버 계산은 **mogo-backend**, 결제·라이선스는 **Hub 백엔드**가 담당한다.
- Firebase Hosting site `sakwan-front` (프로젝트 `ts-front-479305`) → 프로덕션 **https://tsakwan.kr**
- 로컬 개발 포트 **3022**
- 패키지 매니저 **pnpm**. `@withjoono/geobuk-shared` 가 **GitHub Packages 비공개 패키지**라 토큰 없이는 `install` 이 401로 깨진다.
- 형제 앱: `Kwakiwon`(T과기원)·`T_Medi`(T메디). 같은 v0 템플릿에서 복제됐다 — `docs/context/sibling-apps-drift.md` 참조.

## 🚨 생태계 공통 규칙 (읽지 않고 작업 금지)

이 5개는 링크가 아니라 본문이다. 전 리포 공통이며, 위반 시 프로덕션 데이터가 깨진다.

### 1. DB 접속 직후 신원 게이트 — 생략 금지

**"접속 성공"은 prod에 붙었다는 증거가 전혀 아니다.** 로컬에도 `geobukschool_prod` 라는 **같은 이름의 DB**가 있고 `tsuser` 자격증명까지 통과하므로, 포트·DB명·유저·비밀번호가 **전 단계 모두 통과**하면서도 엉뚱한 DB를 보게 된다.

> 실제 사고 (2026-08-19): `cloud-sql-proxy --port 5433` 이 로컬 postgres의 5433 점유로 기동 실패했는데 `netstat` LISTENING만 보고 떴다고 오인. prod를 "환산식 0행 / susi_unit 없음"으로 보고했으나 실제 prod는 formula 1,267행·susi_unit 33,770행으로 정상 가동 중이었다. 멀쩡한 작업 메모를 거짓으로 판정할 뻔했다.

접속 직후 **무조건** 이 쿼리부터 실행한다:

```sql
SELECT current_database(), inet_server_port(), version();
--  prod  = "PostgreSQL 14.x on x86_64-pc-linux-gnu"
--  로컬  = "PostgreSQL 18.x on x86_64-windows"   ← 즉시 중단

SELECT count(*) FROM susi.susi_calculation_formula;  -- prod ≈ 1,267 (year 2027)
SELECT count(*) FROM susi.susi_unit;                 -- prod ≈ 33,770
```

행 수가 기대치와 다르면 **그건 prod가 아니다.** 스키마 존재 여부만으로 판정하지 말 것 — 로컬에도 같은 스키마가 있다.

- **5433을 프록시 포트로 쓰지 말 것.** 로컬 Windows postgres 상시 점유 대역이다. 15432·15433 등 비어 있는 포트를 쓴다.
- 프록시는 **분리 실행**하고 기동 성공을 프로세스/로그로 확인한다. `netstat` LISTENING은 근거가 안 된다(누가 듣고 있는지 알 수 없음).
- `app.yaml` 은 Secret에서 재생성되므로 그 파일의 접속 정보를 신뢰하지 말 것.
- 메모에 "prod 실측 확인"이라 적을 때는 **위 게이트 출력을 함께 붙인다.** 출력이 없으면 미확인으로 취급한다.
- 저장된 메모와 실측이 충돌하면 **메모보다 접속 대상을 먼저 의심한다.**

### 2. 척도 3컬럼 — `max_score` / `real_max_score` / `score_scale`

`susi.susi_calculation_formula` 의 세 컬럼은 서로 다른 척도다. 혼동하면 환산점수가 통째로 틀린다.

| 컬럼 | 의미 |
|---|---|
| `max_score` | **환산식 내부 만점.** 대학마다 제각각(1·10·100·125·400·720…). 시드 JSON 유래. |
| `real_max_score` | **대학별 실제 환산 만점**(유웨이 크롤값). `rescale-formulas.py` 의 `UW_MAXSCORE` 딕셔너리가 원본. |
| `score_scale` | `real_max_score / max_score`. 엔진 raw 점수를 **입결 척도로 올리는 배율**. |

적용 지점:

- **저장** — 엔진 원점수(raw) 그대로 저장한다. 척도 보정을 하지 않는다.
- **조회** — `convertedScore = raw × score_scale`. **조회 시점 적용**이므로 값을 바꿔도 `susi_user_factor_score` 재계산·캐시 무효화가 필요 없다.
- **백분율 분모** — `real_max_score` 우선, 없으면 `max_score` 폴백. 내 환산점수와 예상컷(환산 50컷/70컷)이 **둘 다 입결 척도**이므로 분모도 입결 척도여야 한다.
- 엔진이 실척도를 직접 산출하는 경우 `score_scale` 은 **반드시 1** — 이중 보정 금지.

### 3. 권위 테이블은 `susi.susi_unit`

- `susi.susi_unit` — **2027 모집단위 권위 테이블** (prod 33,770행). `conversion_factor_id` 가 이미 붙어 있다.
- `hub.susi_kyokwa_recruitment` — **비어 있는 레거시.** 개념 중복이 아니라 그냥 빈 테이블이다.

→ `susi_unit` 생성·적재·크로스워크 작업은 **전부 불필요하다.** 이 테이블을 "만들어야 한다"고 판단했다면 잘못된 DB를 보고 있는 것이다(규칙 1로 돌아갈 것).

### 4. DRY-RUN 기본, 쓰기는 `--apply` 명시

DB를 수정하는 모든 스크립트는 **인자 없이 실행하면 DRY-RUN**이어야 한다.

- 기본 동작: 변경 대상과 before/after를 출력만 하고 **커밋하지 않는다**(`conn.rollback()`).
- 실제 쓰기: `--apply` 를 **명시적으로** 붙였을 때만. `conn.autocommit = False` + 명시적 `commit()`.
- 출력에 현재 접속 대상(규칙 1의 게이트 출력)과 영향 행 수를 반드시 찍는다.
- 기존 스크립트에 이 플래그가 없다면 **먼저 추가하고 나서** 실행한다. 예외 없다.

### 5. 어디가 대조 베이스라인 50.2% — 떨어지면 즉시 롤백

환산 엔진 관련 변경은 반드시 **어디가 대조를 재실행**해서 검증한다.

- 현재 베이스라인: **일치 + 근사 50.2%** (화이트리스트 대학 기준).
- 변경 후 이 수치보다 **올라가야 정상**이다. 떨어지면 **즉시 롤백**한다.
- 나머지 절반은 엔진을 켜면 틀린 환산점수를 노출하므로 **화이트리스트 대학만** 엔진을 적용한다.
- 배율이 큰 대학(가톨릭대 10배)·하향 조정 대학(건국대)은 자동 수치만 믿지 말고 **개별 육안 확인**한다.


---

## 🔒 Sakwan 고유 규칙

### ⚠️ Firebase 배포는 항상 `hosting:sakwan-front` target 명시 — 2026-05-16 사고 재발 방지

`.github/workflows/deploy-frontend.yml` 은 2026-09-13부터 `--only hosting:sakwan-front` 로 고정돼 있다(2026-10-25 확인).
target 없는 `--only hosting` 단독 배포가 **2026-05-16 Hub site(`www.tskool.kr`) 덮어쓰기 사고**를 일으킨 형태다.

- 워크플로·수동 배포 모두 **`--only hosting:sakwan-front` 를 유지**할 것. 단독 `--only hosting` 으로 되돌리지 말 것.
- `firebase.json` 의 **hosting 블록을 늘리지 말고, `site` 키를 지우거나 바꾸지 말 것.**
- 수동 배포: `npx firebase-tools deploy --only hosting:sakwan-front --project ts-front-479305`
- `.firebaserc` 에는 `projects.default` 만 있고 `targets` 매핑이 없다 → `hosting:` 뒤에는 **site 이름**을 쓴다.

### 정적 내보내기(`output: 'export'`) — 서버 기능이 아예 없다

- **Route Handler(`app/api/**`)·Server Action·미들웨어·ISR/`revalidate`·`cookies()`/`headers()` 사용 불가.**
- 동적 라우트는 **`generateStaticParams()` 필수**. 현재 `app/class/[slug]`·`app/mock/tsagwan/round/[round]` 두 곳에 있다.
- `images.unoptimized: true` — `next/image` 최적화 없음.
- `out/` 이 산출물이며 `.gitignore` 대상이다. 커밋 금지.
- **서버가 없으니 비밀값을 둘 곳도 없다.** 모든 `NEXT_PUBLIC_*` 은 번들에 그대로 박힌다. 합격선·환산 모수 같은 값을 클라이언트에 두지 말 것(→ 아래 1차 예측 규칙).

### 빌드에 타입·린트 게이트가 없다

`next.config.mjs` 에 `typescript.ignoreBuildErrors: true` / `eslint.ignoreDuringBuilds: true` 가 켜져 있다.
**타입 에러가 있어도 빌드는 성공한다.** 검증은 `npx tsc --noEmit` 로 따로 한다.

### 1차 합불예측·T사관 모의고사 채점은 **서버(mogo-backend)** 가 계산한다 — 클라이언트로 되돌리지 말 것

`lib/sakwan/onecha-store.ts` 주석에 이유가 명시돼 있다:

- 표준점수 환산의 **모수(평균·표준편차)가 전체 제출 분포에서 나온다** → 서버만 알 수 있다.
- **합격선(컷)을 클라이언트로 내려보내면 노출·조작된다.**

따라서 `lib/sakwan/predict1cha.ts` 에는 **라벨·포맷터만** 남아 있다. 환산·판정 로직을 이 파일로 다시 옮기지 말 것.
호출 대상은 `${MOGO_API_URL}/api/tsagwan/1cha/*` (기본 `https://mogo-backend-dot-ts-back-nest-479305.du.r.appspot.com`).

### 자체 백엔드가 없다 — 외부 호출 대상은 딱 셋

2026-09-03 실측 기준, 이 앱이 부르는 서버는 다음뿐이다.

| 대상 | 엔드포인트 | 용도 |
|---|---|---|
| **Hub 백엔드** | `POST /auth/sso/verify-code` (`serviceId: "sakwan"`), `GET /auth/me` | SSO 로그인 |
| **Hub 백엔드** | `GET /subscription/download/assets?appId=sakwan` | 결제한 모의고사 회차 라이선스 조회 |
| **mogo-backend** | `/api/tsagwan/1cha/*`, `/api/mock-exams/*`, `/api/scores/student/*`, `/api/wrong-answers/grade` | 1차 예측·채점·성적/오답 분석 |

**여기에 새 백엔드를 추가하지 말 것.** 서버 로직이 필요하면 mogo-backend 또는 Hub 백엔드에 붙인다.

### 인증은 Hub에 위임 — 자체 로그인 금지

- `lib/auth.ts` → `HUB_URL`(기본 `https://tskool.kr`)의 `/auth/login?redirect=` 로 보내고, `?sso_code=` 를 Hub 백엔드에서 교환한다.
- 토큰은 `localStorage` 의 **`sakwan_token` / `sakwan_user`**. 형제 앱과 키가 다르다.
- `getLoginUrl(redirectPath, forceServer)` 의 **`forceServer` 인자와 `use-auth.ts` 의 `useState`+`useEffect` 2단 처리는 hydration mismatch 방지용**이다. 지우지 말 것. (형제 앱 두 곳에는 아직 이 수정이 없다.)

### Firestore 는 **선택 의존성** — 미설정이 정상 경로다

`lib/sakwan/firebase.ts` 는 `NEXT_PUBLIC_FIREBASE_*` 6개가 있을 때만 Firestore(`sakwan_scores` 컬렉션)를 초기화한다.
**현재 `.env.local` 에 이 값들이 없다**(2026-09-03 확인) → `lib/sakwan/scores-store.ts` 의 **localStorage 폴백**으로 동작한다. `.env*` 는 `.gitignore` 대상이라 **CI 프로덕션 빌드에도 주입되지 않는다.**
→ "Firestore 에 저장된다"고 전제한 코드를 쓰지 말 것. `isFirebaseConfigured()` 분기를 항상 유지한다.

### 유료 자료 라이선스는 Hub 가 권위, 로컬 게이트는 폴백일 뿐

`lib/sakwan/licensed-download.ts` — 결제는 Hub 주문 페이지(Iamport)에서 일어나고 Hub 가 `hub_app_subscriptions` 에 `mock.round.N` / `mock.all` feature 를 부여한다.
미로그인·네트워크 오류·백엔드 미배포 시 `null` 을 반환해 **호출측이 로컬 게이트(`GRANTED_EMAILS`/localStorage)로 graceful 폴백**한다. 이 폴백을 "정상 권한"으로 승격시키지 말 것.
`NEXT_PUBLIC_SAKWAN_MOCK_PRODUCT_ID` 가 있으면 `{HUB}/order/<id>` 로 직행, 없으면 `/products` 목록으로 폴백한다.

### 데이터 SSOT 파일 (`lib/sakwan/`)

| 파일 | 역할 |
|---|---|
| `answer-keys.ts` | 사관·경찰 정답표와 `SCORING_RULES` |
| `exam-format.ts` | 사관·경찰 시험 형식. **Mogo 의 수능 형식과 다르므로 여기가 SSOT** |
| `scoring.ts` | OMR 채점 로직 |
| `cutoffs.ts` | 학교별 1차 합격선. 헤더에 **"예시 데이터, 실 데이터는 추후 보강"** 이라고 적혀 있다 — 실측값으로 취급하지 말 것 |
| `cohort.ts` · `tsagwan-grade.ts` · `mogo-analysis.ts` | 동기 집단 위치·T사관 회차 채점·취약 분석 |
| `mock-products.ts` | 모의고사 상품(가격·회차) 정의. 결제/다운로드 페이지 공용 |

### 브랜드 자산은 Hub `brand/` 가 SSOT, **메타데이터는 여기서 수동 관리**

- `brand/sync_brand.py` 는 **자산 파일(`public/logo.png`·`favicon.ico`·`og-image.png`)만 복사**한다.
- **title·description·OG·twitter 는 `app/layout.tsx` 의 `export const metadata` 에서 손으로 관리**한다(Vite 앱의 `index.html` 마커 블록 자동 치환과 다르다).
- 자산 교체는 Hub `brand/apps.json` 수정 → `python brand/sync_brand.py sakwan`. `public/` 을 직접 갈아끼우지 말 것. 캐시 무효화 `?v=2` 쿼리를 함께 올린다.
- `public/ts-logo.png` 는 Hub 공용 자산과 별개로 이 리포에만 있다(용도 **확인 필요**).

### 개발 포트 3022 — 전역 레지스트리, 변경 금지

`package.json` 의 `"dev": "next dev -p 3022"` 에 이미 박혀 있다(형제 앱 두 곳은 빠져 있다). 이 인자를 지우지 말 것.

---

## 📇 파일 색인 — `docs/context/`

**전체 색인은 `docs/context/README.md`** (기술·운영 / 제품·콘텐츠 결정 / 입시정보 페이지). 필요한 문서만 열어 본다.

리포 루트의 기획·설계 문서(`T사관_앱_컨셉_기획서.md`, `페이지별_기획서.md`, `Mogo_연동_설계서.md`, `사관_1차_환산점수_예측_설계서.md`, `사관_OMR_사용_가이드.md`)도 배경 자료다.
단, **`Mogo_연동_설계서.md` 의 "Mogo 무수정" 원칙은 2026-07-06 write 경로 추가로 폐기됐다**(`lib/sakwan/mogo.ts` 헤더 주석). 설계서를 코드보다 우선하지 말 것.

---

## 명령어

```bash
# 최초 1회 — geobuk-shared(비공개 GitHub Packages) 토큰을 user-level 에 등록
pnpm config set "//npm.pkg.github.com/:_authToken" <read:packages 권한 PAT>

pnpm install
pnpm dev                 # :3022 (package.json 에 -p 3022 포함)
pnpm build               # next build → out/ (타입/린트 게이트 없음)
npx tsc --noEmit         # 타입 검사는 따로

# 배포 — target 을 반드시 명시. `--only hosting` 단독 금지.
npx firebase-tools deploy --only hosting:sakwan-front --project ts-front-479305
# main push 시 .github/workflows/deploy-frontend.yml 이 자동 배포한다 (hosting:sakwan-front 고정)
```

**포트는 생태계 전역 레지스트리다.** 사관학교 3022 고정 — 변경 금지.
