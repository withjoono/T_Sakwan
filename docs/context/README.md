# docs/context 색인

작업 전에 이 표에서 해당 문서만 열어 본다. 규칙(반드시 지킬 것)은 루트 `AGENTS.md`, 배경·결정은 여기.

## 기술 · 운영

| 파일 | 언제 읽나 |
|---|---|
| `static-export-and-deploy.md` | 빌드·배포·Firebase·CI·환경변수, 서버 기능을 추가하려 할 때 |
| `mock-and-onecha.md` | 모의고사·채점·1차 합불예측·Mogo 연동 |
| `hub-sso-and-license.md` | 로그인(Hub SSO), 결제·유료 자료 다운로드 권한 |
| `satellite-header.md` | 공통 헤더(`@tskool/satellite-header`, Music_College 저장소 링크), 네비게이션 |
| `sibling-apps-drift.md` | 형제 앱(Kwakiwon·T_Medi)과 공유하는 코드를 고칠 때 |
| `seo-status.md` | 메타데이터·sitemap·JSON-LD·본문 보강, 검색 노출 상태 |

## 제품 · 콘텐츠 결정

| 파일 | 언제 읽나 |
|---|---|
| `product-direction.md` | 제품 범위(플래너·모고·생기부 변형), AI 에이전트 대시보드 구상, 작업 순서·전환 목표 |
| `content-strategy.md` | 새 정보·홍보 페이지 — `/admission` 과의 범위 경계, 주제 후보, 시기 |

## 입시정보 페이지 (`/admission`) — `docs/admission/`

| 파일 | 내용 |
|---|---|
| `docs/admission/대학별-페이지-구현노트.md` | **먼저 읽을 것.** 실제 구조(허브 + 대학별 5), 파일 위치, 데이터 원칙 3가지, 2028 처리, 후속 과제 |
| `docs/admission/기획서-v2.md` | 원 기획(주제별 8 구조, 구현 시 대학별로 전환). 교차검증 결과, CTA·SEO·면책 문구, §7 요강 재확인 필요 항목 |
| `docs/admission/요강정리-{육사,해사,공사,국간사,경찰대}.md` | 2027 모집요강 구조화 정리본 — 수치의 근거 |

원천 PDF(2027 모집요강·2028 시행계획)는 저장소 밖 로컬 폴더 `E:\Dev\github\Susi\2028_susi\Sakwan` 에 학교별로 있다. 원격 세션(웹·모바일)에서는 접근할 수 없으므로 위 요강정리본을 근거로 쓴다.

## 루트 배경 문서

`T사관_앱_컨셉_기획서.md`, `페이지별_기획서.md`, `Mogo_연동_설계서.md`, `사관_1차_환산점수_예측_설계서.md`, `사관_OMR_사용_가이드.md` — 초기 설계. **코드와 충돌하면 코드가 우선**(특히 Mogo 설계서의 "Mogo 무수정" 원칙은 폐기됨).
