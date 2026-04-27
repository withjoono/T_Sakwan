/**
 * Hub SSO 인증 유틸리티
 *
 * Hub SSO Code Exchange 방식으로 로그인을 처리합니다.
 * - Hub에서 sso_code를 받아 JWT 토큰으로 교환
 * - localStorage에 토큰과 사용자 정보 저장
 */

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://tskool.kr';
const HUB_API_URL = process.env.NEXT_PUBLIC_HUB_API_URL || 'https://api.tskool.kr';

export interface HubUser {
  id: number;
  userName: string;
  memberType: string;
  email?: string;
  domainCode?: string;
}

/**
 * Hub SSO 로그인 URL 생성
 */
export function getLoginUrl(redirectPath?: string): string {
  const currentUrl = typeof window !== 'undefined'
    ? window.location.origin + (redirectPath || '/')
    : HUB_URL;
  return `${HUB_URL}/login?redirect=${encodeURIComponent(currentUrl)}`;
}

/**
 * Hub SSO Code를 JWT 토큰으로 교환
 */
export async function exchangeSsoCode(ssoCode: string): Promise<{ token: string; user: HubUser }> {
  const res = await fetch(`${HUB_API_URL}/auth/sso/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: ssoCode }),
  });

  if (!res.ok) {
    throw new Error('SSO 코드 교환 실패');
  }

  const data = await res.json();
  return {
    token: data.token || data.access_token,
    user: {
      id: data.user?.id,
      userName: data.user?.userName || data.user?.name,
      memberType: data.user?.memberType,
      email: data.user?.email,
      domainCode: data.user?.domainCode,
    },
  };
}

/**
 * 로컬 스토리지에 인증 정보 저장
 */
export function saveAuth(token: string, user: HubUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kwakiwon_token', token);
  localStorage.setItem('kwakiwon_user', JSON.stringify(user));
}

/**
 * 로컬 스토리지에서 인증 정보 로드
 */
export function loadAuth(): { token: string | null; user: HubUser | null } {
  if (typeof window === 'undefined') return { token: null, user: null };
  const token = localStorage.getItem('kwakiwon_token');
  const userStr = localStorage.getItem('kwakiwon_user');
  return {
    token,
    user: userStr ? JSON.parse(userStr) : null,
  };
}

/**
 * 로그아웃
 */
export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kwakiwon_token');
  localStorage.removeItem('kwakiwon_user');
}

export { HUB_URL, HUB_API_URL };
