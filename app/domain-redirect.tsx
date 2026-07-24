"use client"

import { useEffect } from "react"

// 정식 도메인. Firebase 기본 도메인(*.web.app / *.firebaseapp.com)으로 들어온
// 접속은 경로·쿼리·해시를 그대로 유지한 채 이 도메인으로 옮긴다.
const CANONICAL_HOST = "tsakwan.kr"
const REDIRECT_HOSTS = ["sakwan-front.web.app", "sakwan-front.firebaseapp.com"]

export function DomainRedirect() {
  useEffect(() => {
    const { hostname, pathname, search, hash } = window.location
    if (REDIRECT_HOSTS.includes(hostname)) {
      window.location.replace(`https://${CANONICAL_HOST}${pathname}${search}${hash}`)
    }
  }, [])

  return null
}
