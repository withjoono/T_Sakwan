---
name: sibling-apps-drift
description: Kwakiwon·Sakwan·T_Medi 세 특화대학 앱의 공통 템플릿 구조와 이미 갈라진 지점
type: reference
---

# 형제 앱 — 공통 구조와 드리프트

`Kwakiwon`(T과기원) · `Sakwan`(T사관) · `T_Medi`(T메디) 는 **같은 v0 템플릿에서 복제된 형제 앱**이다.
세 리포의 `package.json` `name` 이 전부 `my-v0-project` 이고, `next.config.mjs` 는 **바이트 단위로 동일**하며, `lib/auth.ts`(76~77행)·`lib/use-auth.ts`(62~69행)는 앱 이름만 다른 사실상 같은 파일이다.

> **한 앱에서 고친 버그는 나머지 둘에도 거의 확실히 있다.** 공통 파일을 수정했다면 세 리포를 모두 확인할 것.

## 완전히 공통인 것

- Next.js 15.2.4 App Router / React 19 / Tailwind v4 / shadcn/ui(Radix) / lucide-react / `components/ui/`
- `next.config.mjs` — `output: 'export'`, `images.unoptimized`, `ignoreBuildErrors`, `ignoreDuringBuilds` (**세 앱 동일**)
- `.firebaserc` — `projects.default = ts-front-479305`, `targets` 매핑 없음 (**세 앱 동일**)
- `firebase.json` — hosting 블록 1개 + `"site"` 키. 배포는 반드시 `--only hosting:<자기 site>`
- Hub SSO 위임 방식 — `POST {HUB_API}/auth/sso/verify-code` → `GET {HUB_API}/auth/me`
- `.gitignore` — `/out/`, `.env*` 제외. **CI 빌드에 `NEXT_PUBLIC_*` 이 주입되지 않으므로 코드의 기본값이 프로덕션 값이다.**
- 자체 백엔드 없음. Cloud SQL `geobukschool_prod` 에 직접 붙지 않는다.

## 앱별로 다른 것 (복사 시 반드시 바꿀 것)

| | Kwakiwon | Sakwan | T_Medi |
|---|---|---|---|
| GitHub | `withjoono/kwakiwon` | `withjoono/T_Sakwan` | `withjoono/T_medical` |
| Firebase site | `kwakiwon-front` | `sakwan-front` | `medical-front` |
| URL | tgwagiwon.kr | tsakwan.kr | tmedi.kr |
| 개발 포트 | 3021 | 3022 | 3023 |
| SSO `serviceId` | `kwakiwon` | `sakwan` | `medical` |
| localStorage 키 | `kwakiwon_token`/`_user` | `sakwan_token`/`_user` | `medical_token`/`_user` |
| `dev` 스크립트 포트 | ❌ 없음 (3000 으로 뜸) | ✅ `-p 3022` | ❌ 없음 (3000 으로 뜸) |
| `geobuk-shared` | ✅ | ✅ | ❌ 미도입 |
| CI 워크플로 | Firebase action | `--only hosting` (⚠️) | ❌ 없음(수동 배포) |

## 이미 갈라진 지점 — 한쪽만 고쳐진 것들

### 1. hydration mismatch 수정이 Sakwan 에만 있다

`lib/auth.ts` 의 `getLoginUrl()` 은 `window.location.origin` 을 읽는다. **Sakwan 만** `forceServer` 인자를 받아 첫 렌더에서 `window` 를 쓰지 않고, `lib/use-auth.ts` 가 `useState(() => getLoginUrl(undefined, true))` 로 시작해 mount 후 `useEffect` 로 실제 URL 로 교체한다.

**Kwakiwon 과 T_Medi 는 `loginUrl: getLoginUrl()` 을 그대로 반환**한다 → 서버·클라이언트 HTML 불일치 가능성이 남아 있다. Sakwan 의 수정을 이식할 가치가 있다.

### 2. 도메인 리다이렉트 구현이 다르다

- Kwakiwon: `app/layout.tsx` `<head>` **인라인 스크립트**(렌더 전 실행, 깜빡임 없음) — `kwakiwon.kr` → `tgwagiwon.kr`
- Sakwan: `app/domain-redirect.tsx` **클라이언트 컴포넌트 + `useEffect`**(mount 후) — `sakwan-front.web.app`/`.firebaseapp.com` → `tsakwan.kr`
- T_Medi: **없음**

### 3. `firebase.json` 세부 옵션이 제각각

- Kwakiwon: `cleanUrls`
- Sakwan: `cleanUrls`, `trailingSlash: false`
- T_Medi: `cleanUrls`, `trailingSlash: false`, `/promo` → `/` 301 redirect, **`**` → `/index.html` rewrite**(정적 export 에 SPA 폴백을 얹은 형태 — 없는 경로가 404 대신 홈을 보여준다)

### 4. 규모·성격이 다르다

- **Kwakiwon** — 정보/컨설팅 사이트. 라우트 20여 개, 전형 데이터 TS 파일. 로그인은 네비게이션 표시용.
- **Sakwan** — 유일한 "앱". `/mock/*` 모의고사·채점·1차 합불예측이 있고 **mogo-backend API 를 호출**한다. Firestore(옵션)·Hub 결제 라이선스 연동까지 있다.
- **T_Medi** — 가장 작다(≈2,300행). 사실상 `/` + `/promo/*` 프로모 사이트.

## 브랜드 자산 (세 앱 공통 규칙)

Hub 의 `brand/` 가 SSOT 지만, **Next 앱에서는 `brand/sync_brand.py` 가 자산 파일(`public/logo.png`·`favicon.ico`·`og-image.png`)만 복사**한다.
**메타데이터(title·description·OG·twitter)는 각 앱 `app/layout.tsx` 의 `export const metadata` 에서 수동 관리**한다 — Vite 앱의 `index.html` 마커 블록 자동 치환과 다르다.
세 앱 모두 캐시 무효화용 `?v=2` 쿼리를 자산 URL 에 붙여 놓았다.
