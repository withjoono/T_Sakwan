/* ───────── 허브(tskool.kr) 유료 자료 라이선스 연동 ─────────
 * 결제는 허브 주문 페이지(Iamport)에서 이뤄지고, 결제 완료 시 허브가
 * hub_app_subscriptions 에 features(mock.round.N / mock.all)를 부여한다.
 * 이 모듈은 그 라이선스를 조회해 "구매한 회차"를 알려준다.
 *
 * 미로그인·네트워크 오류·백엔드 미배포 시 null 을 반환 → 호출측이 기존
 * 로컬 게이트(GRANTED_EMAILS/localStorage)로 graceful 폴백한다.
 */
import { loadAuth } from "@/lib/auth"

const HUB_API_URL = process.env.NEXT_PUBLIC_HUB_API_URL || "https://ts-back-nest-479305.du.r.appspot.com"
const APP_ID = "sakwan"

type AssetItem = { key: string; name: string; owned: boolean }
type AssetList = { appId: string; plan: string; assets: AssetItem[] }

const roundOf = (key: string): number | null => {
  const m = /^round-(\d+)$/.exec(key)
  return m ? Number(m[1]) : null
}

/** 허브 라이선스로 보유(구매)한 회차 Set. 조회 불가 시 null. */
export async function fetchOwnedRounds(): Promise<Set<number> | null> {
  const { token } = loadAuth()
  if (!token) return null
  try {
    const res = await fetch(`${HUB_API_URL}/subscription/download/assets?appId=${APP_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const body = await res.json()
    const data = (body.data ?? body) as AssetList
    const owned = new Set<number>()
    for (const a of data.assets ?? []) {
      const r = roundOf(a.key)
      if (r && a.owned) owned.add(r)
    }
    return owned
  } catch {
    return null
  }
}
