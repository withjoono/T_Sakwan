import type { MetadataRoute } from "next"
import { abs } from "@/lib/seo"

// output: 'export' 에서 필수. 없으면 SITE_URL 이 process.env 를 읽는 탓에
// 동적 라우트로 판단돼 빌드가 죽는다.
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 생태계 표준의 예약 접두사 (Hub/docs/url-standard.md).
        // 앱 화면(/mock/exam 등)은 여기서 막지 않는다 — 크롤링을 막으면
        // 각 페이지의 noindex 를 읽지 못해 오히려 색인에서 빠지지 않는다.
        // 같은 이유로 /share 도 막지 않는다.
        disallow: ["/app$", "/app/", "/app?", "/auth$", "/auth/", "/auth?"],
      },
    ],
    sitemap: abs("/sitemap.xml"),
  }
}
