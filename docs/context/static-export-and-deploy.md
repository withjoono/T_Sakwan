---
name: static-export-and-deploy
description: Sakwan 의 Next.js 정적 내보내기 제약과 Firebase Hosting(sakwan-front) 배포 경로, CI 소유확인 코드 주입
type: project
---

# 정적 내보내기와 배포

## 빌드 형태

`next.config.mjs` (2026-09-03 확인, 형제 앱 3개와 바이트 단위로 동일):

```js
{ eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  output: 'export' }
```

`pnpm build` → **`out/`** 에 순수 정적 파일. `out/` 은 `.gitignore` 대상(커밋 금지).

## 쓸 수 없는 것

Route Handler(`app/api/**`) · Server Action · `middleware.ts` · ISR/`revalidate` · `cookies()`/`headers()` · `next.config` 의 `redirects()`/`rewrites()` — **전부 정적 export 에서 동작하지 않는다.**

동적 라우트는 `generateStaticParams()` 없이 빌드되지 않는다. 현재 두 곳:

- `app/class/[slug]/page.tsx` — 육사/해사/공사/국간사/경찰대 반 페이지
- `app/mock/tsagwan/round/[round]/page.tsx` — T사관 모의고사 회차

**서버가 없다 = 비밀값을 둘 곳이 없다.** 모든 `NEXT_PUBLIC_*` 은 번들에 문자열로 박힌다. 합격선·환산 모수처럼 노출되면 안 되는 값은 반드시 mogo-backend 에 둔다(→ `mock-and-onecha.md`).

## 타입·린트 게이트 없음

`ignoreBuildErrors` + `ignoreDuringBuilds`. **타입 에러로 빌드가 깨지지 않는다.** `npx tsc --noEmit` 을 따로 돌린다(리포에 `type-check` 스크립트는 없다).

## Firebase Hosting

`firebase.json`:

```json
{ "hosting": { "site": "sakwan-front", "public": "out",
               "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
               "cleanUrls": true, "trailingSlash": false } }
```

`.firebaserc` 는 `projects.default = ts-front-479305` 만 있고 **`targets` 매핑이 없다** → 배포 명령의 `hosting:` 뒤에는 **site 이름 `sakwan-front`** 를 그대로 쓴다.

```bash
npx firebase-tools deploy --only hosting:sakwan-front --project ts-front-479305
```

## CI 배포 대상 고정

`.github/workflows/deploy-frontend.yml` (main push 트리거):

```yaml
- name: Deploy to Firebase Hosting
  run: npx firebase-tools deploy --only hosting:sakwan-front --project=ts-front-479305 --token "${{ secrets.FIREBASE_TOKEN }}"
```

**target 미지정 = 2026-05-16 사고와 같은 형태다.** 그때는 생기북 앱의 `firebase.json` 에 Hub 의 `ts-front-479305` site 를 가리키는 `default` hosting 블록이 섞여 있었고, target 없는 배포가 **`www.tskool.kr` 을 생기북 빌드로 덮었다.**

2026-09-13 워크플로의 배포 대상을 `hosting:sakwan-front`로 명시했다. 다음 제약을 유지한다:

- hosting 블록을 **추가하지 말 것**(특히 `site` 없는 블록·`default` 블록).
- `site` 키를 **지우거나 바꾸지 말 것.**
- 수동·CI 배포 모두 **`--only hosting:sakwan-front`를 유지할 것.**

응급 복구(덮인 경우): `gh workflow run "Deploy Hub Frontend" -R withjoono/Hub` — 단, 원인이 된 위성앱 설정을 고치지 않으면 다음 push 에 다시 덮인다.

## CI 기타

- pnpm 10 / Node 20.
- `@withjoono/geobuk-shared` 는 GitHub Packages 비공개 패키지. 워크플로가 `secrets.NODE_AUTH_TOKEN` 을 `~/.npmrc` 에 기록한다 — **pnpm 10 은 프로젝트 `.npmrc` 의 registry 자격증명을 환경변수로 확장하지 않기 때문**이다. 로컬은 `pnpm config set "//npm.pkg.github.com/:_authToken" <PAT>`.
- `.env*` 가 `.gitignore` 대상이라 로컬 환경 파일은 CI로 전달되지 않는다. 소유확인 코드 두 개는 아래의 Actions Variables로 주입하며, 나머지는 별도 주입이 없어 코드에 박힌 기본값으로 만들어진다:
  - `NEXT_PUBLIC_HUB_URL` → `https://tskool.kr`
  - `NEXT_PUBLIC_HUB_API_URL` → `https://ts-back-nest-479305.du.r.appspot.com`
  - `NEXT_PUBLIC_MOGO_URL` → `https://mogomogo.kr`
  - `NEXT_PUBLIC_MOGO_API_URL` → `https://mogo-backend-dot-ts-back-nest-479305.du.r.appspot.com`
  - `NEXT_PUBLIC_FIREBASE_*` → **없음 → Firestore 비활성, localStorage 폴백**
  - `NEXT_PUBLIC_SAKWAN_MOCK_PRODUCT_ID` → **없음 → `/products` 목록으로 폴백**
  → **기본값이 곧 프로덕션 설정**이다. 기본값을 바꾸는 것은 프로덕션 변경이다.

## 검색엔진 소유확인 코드

GitHub 저장소의 **Settings → Secrets and variables → Actions → Variables**에 다음 Repository variables를 등록한다:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console의 HTML 태그 인증에서 발급한 `content` 값.
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`: 네이버 서치어드바이저의 HTML 태그 인증에서 발급한 `content` 값.

메타 태그 전체가 아니라 `content` 속성의 값만 입력한다. 이 값은 공개 HTML에 표시되는 소유확인 코드다. CI의 Build 단계가 환경변수로 전달하고, `app/layout.tsx`가 각각 `google-site-verification`과 `naver-site-verification` 메타 태그를 생성한다. 미등록 값은 태그를 생략하며 빌드를 막지 않는다.

로컬 빌드는 `.env.local`에 같은 이름으로 설정한다. 변수 등록·변경만으로 기존 정적 HTML은 바뀌지 않으므로 워크플로 재실행 또는 다음 main push로 다시 빌드·배포한다. 배포 후 홈 HTML의 인증 태그를 확인하고 각 검색엔진에서 소유확인을 완료한 다음 `https://tsakwan.kr/sitemap.xml`을 제출한다.

## 도메인

`app/domain-redirect.tsx` (클라이언트 컴포넌트, `useEffect`) 가 `sakwan-front.web.app` / `sakwan-front.firebaseapp.com` 접속을 경로·쿼리·해시 보존한 채 **`tsakwan.kr`** 로 넘긴다. `app/layout.tsx` 가 `<DomainRedirect />` 를 렌더한다.
`metadataBase` 는 `https://tsakwan.kr` 로 하드코딩돼 있다(형제 앱 Kwakiwon 은 `NEXT_PUBLIC_SITE_URL` 로 뽑아 쓴다).
