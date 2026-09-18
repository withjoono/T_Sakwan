# T사관 공통 헤더 연결 (2026-09-18)

## 원본과 설치

- 실제 원본: `E:/Dev/github/Music_College/packages/satellite-header`.
- 사용자 전달 경로 `Music/_College`는 이 PC에 없으며, 원본 README도 `Music_College`를 가리킨다.
- `package.json`과 `pnpm-lock.yaml`: `@tskool/satellite-header` → `link:../Music_College/packages/satellite-header`.
- 패키지 소스를 이 저장소에 복제하지 않는다. `next.config.mjs`의 `transpilePackages`, 루트 layout의 CSS import로 사용한다.
- 로컬 검증은 `node_modules/@tskool/satellite-header`를 원본으로 연결한 junction으로 수행했다. pnpm의 lockfile-only 실행은 오프라인에서도 레지스트리 정책 확인을 시도하다 네트워크 차단으로 중단되어, link 항목만 lockfile에 반영했다. 기존 의존성 버전은 변경하지 않았다.

## 구성

- `components/navigation.tsx`: 공통 컴포넌트, Next Link 어댑터, 기존 `useAuth` 연결.
- `lib/header-navigation.ts`: 성적관리·학습관리·입시예측·입시정보 구성, 하단 콘텐츠 메뉴.
- 사용자별 메뉴: 학생 플래너, Hub 학부모·선생님 계정연동, 프로필·결제 내역.
- 기존 하위 메뉴의 목적지는 모두 하단 가로 스크롤 메뉴에 유지한다.
- 로고는 기존 Hub 동기화 자산 `/logo.png?v=2`. 공통 CSS를 덮어쓰지 않는다.
- `/admission` 페이지군은 layout에서 헤더를 한 번 추가한다.
- 인증 교환, 토큰 키, hydration 방지 로직은 기존 `useAuth`를 유지한다. 로그아웃은 기존처럼 인증 삭제 후 Hub로 이동한다.
- 도토리 잔액 API는 기존 앱에 없어 값을 전달하지 않는다. 미확인을 0으로 표시하지 않는다.
- 기존 `/notifications` 링크는 Hub 라우터에 없다. 실제 Hub 헤더에 알림 목록이 있으므로 Hub 홈으로 연결하고 상단 알림 메뉴를 안내한다.

## CI 배포 전 조건

워크플로는 `Sakwan`과 `Music_College`를 같은 상위 폴더에 체크아웃해 로컬 상대경로를 재현한다. Firebase 대상은 `hosting:sakwan-front`를 유지한다.

공통 패키지를 Music_College의 `8b245ee0532f5a2474983feb0cc7f38b463b7a1b` 커밋으로 게시했으며, CI도 이 커밋으로 고정한다.

비공개 원본 저장소를 읽는 `SATELLITE_HEADER_TOKEN`을 사용하며, 미설정이면 기존 `NODE_AUTH_TOKEN`을 사용한다. 어느 쪽이든 Music_College 저장소 읽기 권한이 필요하다. 토큰 값은 코드에 넣지 않는다. 원격 체크아웃과 실제 배포는 실행하지 않았다.

## 검증

- 전체 TypeScript 검사 통과 (`node node_modules/typescript/bin/tsc --noEmit`).
- Next 프로덕션 정적 빌드 통과, 43개 페이지 생성 (`node node_modules/next/dist/bin/next build`).
- 원본 패키지의 테스트 4개 통과.
- 정적 헤더 링크 33개 검사: 모든 내부 목적지 산출물 존재, T음대 문구 없음, 입시정보 5개 학교의 헤더 확인.
- 브라우저: 1440px 데스크톱, 390px·320px 모바일. 공통 2줄 배치, 메뉴 가로 스크롤, 5개 메뉴 열기/Escape 닫기, 바깥 클릭, 도토리 미확인 안내, 알림 안내, 공유 링크 복사, 입시정보 경로 이동 및 현재 메뉴 표시 확인. 브라우저 오류 로그 없음.
- Hub 프로필·결제·계정연동·상품 링크는 로컬 Hub 라우터에서 확인. 외부 라이브 페이지는 웹 조회 도구에서 접근되지 않아 실계정 로그인·구매·알림 조회까지 검증하지 않았다.
