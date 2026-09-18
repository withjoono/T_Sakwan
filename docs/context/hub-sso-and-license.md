---
name: hub-sso-and-license
description: Hub SSO 로그인 흐름과 유료 모의고사 자료 라이선스(Hub 결제) 연동
type: reference
---

# Hub SSO · 유료 자료 라이선스

이 앱에는 **자체 백엔드도, 자체 로그인도 없다.** 신원과 결제는 전부 Hub 가 갖는다.

## SSO 흐름 (`lib/auth.ts`)

```
1. getLoginUrl()  →  {HUB_URL}/auth/login?redirect=<현재 origin+경로>
2. Hub 가 로그인 후 ?sso_code=... 로 돌려보냄
3. POST {HUB_API_URL}/auth/sso/verify-code   body: { code, serviceId: "sakwan" }
      → { accessToken }        (응답은 body.data ?? body 봉투 허용)
4. GET  {HUB_API_URL}/auth/me   Authorization: Bearer <accessToken>
      → { id, nickname|name|userName, memberType|role, email, domainCode }
5. localStorage 에 sakwan_token / sakwan_user 저장
```

기본값: `HUB_URL = https://tskool.kr`, `HUB_API_URL = https://ts-back-nest-479305.du.r.appspot.com`.
`serviceId` 와 localStorage 키는 **앱마다 다르다**(`kwakiwon` / `sakwan` / `medical`). 형제 앱에서 코드를 복사할 때 반드시 바꾼다.

## hydration mismatch 방지 (이 앱에만 있는 수정)

`getLoginUrl(redirectPath?, forceServer = false)` — `forceServer` 가 true 면 `window` 를 읽지 않고 `HUB_URL` 을 쓴다.
`lib/use-auth.ts` 는 이렇게 2단으로 처리한다:

```ts
const [loginUrl, setLoginUrl] = useState(() => getLoginUrl(undefined, true)) // 서버와 같은 값으로 첫 렌더
useEffect(() => { setLoginUrl(getLoginUrl()) }, [])                          // mount 후 실제 origin 반영
```

**이 구조를 되돌리지 말 것.** `Kwakiwon`·`T_Medi` 는 아직 `loginUrl: getLoginUrl()` 을 그대로 반환한다 — 이 수정을 그쪽에 이식할 가치가 있다.

`useAuth()` 는 그 밖에 ① mount 시 localStorage 복원 ② URL 의 `?sso_code=` 자동 교환 후 `history.replaceState` 로 쿼리 제거(실패해도 동일하게 정리) 를 담당한다.

## 유료 자료 라이선스 (`lib/sakwan/licensed-download.ts`)

```
결제: Hub 주문 페이지(Iamport)
  ↓ 결제 완료 시 Hub 가 hub_app_subscriptions 에 feature 부여
     (mock.round.N  /  mock.all)
조회: GET {HUB_API_URL}/subscription/download/assets?appId=sakwan
      Authorization: Bearer <sakwan_token>
  → { appId, plan, assets: [{ key: "round-3", name, owned }] }
  → key 의 round-N 중 owned=true 만 모아 Set<number> 반환
```

**미로그인·네트워크 오류·백엔드 미배포 시 `null` 을 반환**한다. 호출측은 이때 기존 로컬 게이트(`GRANTED_EMAILS` / localStorage)로 **graceful 폴백**한다.

→ 이 폴백은 "백엔드가 아직 없을 때의 임시 통로"다. **정상 권한 판정으로 승격시키지 말 것.** 반대로, 폴백을 없애면 백엔드 장애 시 구매자가 자료를 못 받는다.

## 결제 진입점

`NEXT_PUBLIC_SAKWAN_MOCK_PRODUCT_ID` — Hub `payment_service` 의 "7월 5회 패키지" 상품 id.

- 설정 시: 결제하기 → `{HUB_URL}/order/<id>` 로 직행
- 미설정 시: `{HUB_URL}/products` 목록으로 폴백

`.env*` 가 `.gitignore` 대상이라 **CI 프로덕션 빌드에는 이 값이 없다** → 현재 프로덕션은 `/products` 폴백 경로로 동작한다(2026-09-03 리포 기준 추론, 실제 배포본 **확인 필요**).

상품 자체의 정의(이름·가격·포함 회차)는 `lib/sakwan/mock-products.ts` 에 있다 — Hub 의 상품과 **두 곳에서 따로 관리**되므로 가격·구성 변경 시 양쪽을 맞춰야 한다.

## Hub 유틸리티 링크

`components/navigation.tsx` 의 `HUB_UTILITY_URLS` 가 Hub 경로 규칙을 그대로 따른다:
`{HUB}/products` · `/notifications` · `/account-linkage` · `/users/profile` · `/users/payment`.
상단 1단 바는 `geobuk-shared/ui` 의 `EcosystemHeader` 를 쓴다(공유 패키지 — 임의 수정 금지, 변경은 `@withjoono/geobuk-shared` 리포에서).
