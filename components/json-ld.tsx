/**
 * JSON-LD 삽입용 서버 컴포넌트.
 * 클라이언트에서 넣지 않는다 — JS 를 실행하지 않는 AI 크롤러도 읽어야 하므로
 * 빌드 시점에 HTML 안에 들어가야 한다.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // </script> 조기 종료와 XSS 를 막기 위해 '<' 를 이스케이프한다.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
