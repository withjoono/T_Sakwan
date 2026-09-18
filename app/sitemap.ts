import type { MetadataRoute } from "next"
import { abs, CONTENT_UPDATED } from "@/lib/seo"

export const dynamic = "force-static"

type Entry = {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}

/**
 * 비로그인 방문자가 읽을 수 있는 페이지만 넣는다.
 * 로그인 뒤에서만 의미 있는 앱 화면(/mock/exam·/mock/result·/mock/tsagwan/* 등)은
 * 각 layout 에서 noindex 처리했으므로 여기에도 넣지 않는다.
 * (리다이렉트·noindex·삭제된 페이지를 넣으면 색인 실패 경고만 쌓인다.)
 */
const CLASS_SLUGS = ["army", "airforce", "navy", "nursing", "police"] as const

// 대학별 전형 안내(/admission/[school]). 슬러그는 /class 와 공유한다 — lib/admission/index.ts 참조.
const ADMISSION_SLUGS = ["army", "navy", "airforce", "nursing", "police"] as const

const ENTRIES: Entry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/promo", priority: 0.9, changeFrequency: "monthly" },
  { path: "/promo/guide", priority: 0.7, changeFrequency: "monthly" },
  { path: "/promo/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/1cha", priority: 0.9, changeFrequency: "weekly" },
  { path: "/mock", priority: 0.9, changeFrequency: "weekly" },
  { path: "/mock/past", priority: 0.8, changeFrequency: "monthly" },
  { path: "/interview", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sanggibu", priority: 0.8, changeFrequency: "monthly" },
  { path: "/mentoring", priority: 0.8, changeFrequency: "monthly" },
  { path: "/planner", priority: 0.7, changeFrequency: "monthly" },
  ...CLASS_SLUGS.map((slug) => ({
    path: `/class/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  })),
  // 입시 총정리 — 허브 + 대학별 5개.
  // 원서접수·1차 일정이 바뀌면 바로 반영해야 하므로 허브는 weekly 로 둔다.
  { path: "/admission", priority: 0.9, changeFrequency: "weekly" },
  ...ADMISSION_SLUGS.map((slug) => ({
    path: `/admission/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  })),
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ENTRIES.map(({ path, priority, changeFrequency }) => ({
    url: abs(path),
    lastModified: CONTENT_UPDATED,
    changeFrequency,
    priority,
  }))
}
