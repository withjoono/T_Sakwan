---
name: seo-status
description: tsakwan.kr 검색·AI 검색 노출 — 적용된 SEO 구조의 규칙, 2026-10-21 점검 결과, 남은 작업 — 메타데이터·sitemap·본문 보강 작업 시 읽을 것
type: project
source: claude.ai 프로젝트 문서 tsakwan-seo.md에서 이관 (2026-10-25)
---

# SEO · AI 검색 노출

배포·소유확인 변수 주입 방법은 `static-export-and-deploy.md` 참조. 여기에는 SEO 코드 규칙과 상태만 둔다.

## 코드 규칙 (지킬 것)

- `lib/seo.ts` — `SITE_URL`·`abs`·`ORGANIZATION`·`WEBSITE`·`breadcrumb`·`course`·`faqPage`·`graph` 헬퍼. 새 페이지는 이걸 쓴다.
- **`CONTENT_UPDATED` 는 손으로 올리는 상수다.** 빌드마다 오늘 날짜를 넣지 말 것(신뢰 하락). 실제 내용이 바뀔 때만 올리고 sitemap lastmod도 같이 갱신된다.
- `components/json-ld.tsx` — 서버 컴포넌트로 빌드 시 HTML에 JSON-LD 삽입.
- `app/robots.ts`, `app/sitemap.ts` — `export const dynamic = "force-static"` 필수(정적 export).
- 루트 layout에 `og:url` 을 고정하지 말 것(전 페이지가 홈 URL을 신고하던 버그).
- 클라이언트 페이지는 `*-client.tsx` + 서버 `page.tsx` 래퍼로 나눠 페이지별 metadata·canonical·BreadcrumbList를 단다.
- 로그인 뒤 앱 화면(`/mock/grade` 등)은 layout의 `robots: { index: false }` 로 noindex. **robots.txt로 막지 말 것** — 막으면 크롤러가 noindex를 못 읽는다.
- 표는 이미지가 아니라 실제 `<table>`. 섹션 첫 문장은 질문에 대한 직답.
- 새 공개 페이지는 `app/sitemap.ts` 에 등록.

## 2026-10-21 점검 결과

- 기술 상태 정상: robots·sitemap 200, sitemap 22 URL 전부 200, 페이지별 title·canonical·JSON-LD, 앱 화면 noindex.
- ❌ 소유확인 메타(google/naver)가 라이브 HTML에 없음 → GitHub Actions Variables 미설정 추정.
- ❌ `www.tsakwan.kr` 이 301 없이 200 → 구글이 www를 대표 URL로 잡은 페이지 있음.
- 구글 `site:` 약 17건(옛 title·www·noindex 대상 잔존). 브랜드 "T사관" 1위. "사관학교 모의고사"·"1차 합불 예측"·"경찰대 면접 질문"은 1페이지 밖.
- 네이버 `site:` 20건, 브랜드 검색 노출 0. 롱테일은 일부 노출(블로그·카페·지식iN 아래).
- 얇은 페이지: `/1cha` 372자, `/sanggibu` 425자, `/planner`·`/mock` ~670자. `/interview` 는 "빈출 질문 100선" title인데 HTML에 3문항, 지난 멘토링 날짜 노출.

## 남은 작업

1. 서치콘솔·네이버 서치어드바이저 등록 → 소유확인 값을 Actions Variables에 넣고 재배포 → sitemap 제출 (코드 작업 아님, 사용자 작업)
2. www → apex 301 (Firebase Hosting 콘솔, 코드 작업 아님)
3. 네이버 블로그 채널 병행 (코드 작업 아님)
4. **얇은 페이지 보강**: `/1cha`·`/sanggibu`·`/planner`·`/mock` 본문 1,500자 이상, `/interview` 100문항 HTML 노출, 지난 일정 제거
5. 블로그 실글 발행 + `CONTENT_UPDATED` 갱신
6. 효과 측정: 서치콘솔 쿼리, Analytics referrer `chatgpt.com`·`perplexity.ai`
