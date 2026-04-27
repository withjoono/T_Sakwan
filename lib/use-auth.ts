"use client"

import { useEffect, useState, useCallback } from "react"
import { exchangeSsoCode, saveAuth, loadAuth, clearAuth, getLoginUrl, type HubUser } from "@/lib/auth"

/**
 * Hub SSO 인증 상태를 관리하는 커스텀 훅
 */
export function useAuth() {
  const [user, setUser] = useState<HubUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로드: localStorage에서 인증 정보 복원
  useEffect(() => {
    const { token, user: savedUser } = loadAuth()
    if (token && savedUser) {
      setUser(savedUser)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  // SSO 코드 처리: URL에 sso_code가 있으면 자동 교환
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ssoCode = params.get("sso_code")

    if (ssoCode) {
      setIsLoading(true)
      exchangeSsoCode(ssoCode)
        .then(({ token, user: ssoUser }) => {
          saveAuth(token, ssoUser)
          setUser(ssoUser)
          setIsAuthenticated(true)
          // URL에서 sso_code 제거
          const newUrl = window.location.pathname
          window.history.replaceState({}, document.title, newUrl)
        })
        .catch(() => {
          // SSO 실패 시 URL 정리
          const newUrl = window.location.pathname
          window.history.replaceState({}, document.title, newUrl)
        })
        .finally(() => setIsLoading(false))
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    loginUrl: getLoginUrl(),
  }
}
