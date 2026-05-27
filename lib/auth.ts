const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://tskool.kr';
const HUB_API_URL = process.env.NEXT_PUBLIC_HUB_API_URL || 'https://ts-back-nest-479305.du.r.appspot.com';

export interface HubUser {
  id: number;
  userName: string;
  memberType: string;
  email?: string;
  domainCode?: string;
}

export function getLoginUrl(redirectPath?: string): string {
  const currentUrl = typeof window !== 'undefined'
    ? window.location.origin + (redirectPath || '/')
    : HUB_URL;
  return `${HUB_URL}/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
}

export async function exchangeSsoCode(ssoCode: string): Promise<{ token: string; user: HubUser }> {
  const res = await fetch(`${HUB_API_URL}/auth/sso/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: ssoCode, serviceId: 'sakwan' }),
  });

  if (!res.ok) throw new Error('SSO 코드 교환 실패');

  const body = await res.json();
  const tokenData = body.data ?? body;
  const accessToken: string = tokenData.accessToken;

  const meRes = await fetch(`${HUB_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!meRes.ok) throw new Error('사용자 정보 조회 실패');

  const meBody = await meRes.json();
  const me = meBody.data ?? meBody;

  return {
    token: accessToken,
    user: {
      id: me.id,
      userName: me.nickname ?? me.name ?? me.userName ?? '',
      memberType: me.memberType ?? me.role ?? '',
      email: me.email,
      domainCode: me.domainCode,
    },
  };
}

export function saveAuth(token: string, user: HubUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sakwan_token', token);
  localStorage.setItem('sakwan_user', JSON.stringify(user));
}

export function loadAuth(): { token: string | null; user: HubUser | null } {
  if (typeof window === 'undefined') return { token: null, user: null };
  const token = localStorage.getItem('sakwan_token');
  const userStr = localStorage.getItem('sakwan_user');
  return {
    token,
    user: userStr ? JSON.parse(userStr) : null,
  };
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('sakwan_token');
  localStorage.removeItem('sakwan_user');
}

export { HUB_URL, HUB_API_URL };
