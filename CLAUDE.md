# CLAUDE.md — Sakwan (T사관, tsakwan.kr)

Claude Code가 이 파일을 자동으로 읽는다. 아래 두 파일을 함께 불러온다.

@AGENTS.md
@docs/context/README.md

- `AGENTS.md` = **규칙**(어기면 프로덕션이 깨짐). Codex와 공용이므로 규칙은 거기에 쓰고 여기에 중복하지 않는다.
- `docs/context/README.md` = 배경·결정 문서 색인. 작업에 해당하는 문서만 열어 본다.
- 답변·보고는 한국어로.

## 작업 끝나면 바로 커밋·푸시 (자동 배포)

기본 브랜치는 **`main`** 이다(master 아님). `main` 에 push하면 `.github/workflows/deploy-frontend.yml` 이 빌드 후 Firebase Hosting(`sakwan-front` → tsakwan.kr)에 **자동 배포**한다.

- 작업이 끝나면 **`main` 에 바로 커밋하고 push** 한다. 별도 브랜치·PR을 만들지 않는다(사용자가 따로 요청한 경우 제외).
- push 전에 타입 검사: `npx tsc --noEmit` (빌드에는 타입·린트 게이트가 없다). 가능하면 `pnpm build` 도.
  - pnpm 실행기가 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` 로 멈추면 `node node_modules/next/dist/bin/next build`, `node node_modules/typescript/bin/tsc --noEmit` 를 직접 실행한다.
- push 후 GitHub Actions 결과를 확인하고(`gh run list -R withjoono/T_Sakwan -L 3`), 실패하면 고친다.
- 커밋하지 말 것: `.env*`, `out/`, `.next/`, `.firebase/` 캐시, `upload/`·`design/` 원본 자료.
- 비밀번호·API 키·토큰·학생 개인정보는 코드·문서·커밋 메시지 어디에도 넣지 않는다. `NEXT_PUBLIC_*` 는 번들에 그대로 노출된다.

## 원격 세션(웹·모바일 Claude Code)에서 주의

- 저장소 밖 로컬 경로(`E:\Dev\github\Susi\...` 원천 PDF, `../Music_College/packages/satellite-header` 링크)는 없다. 요강 수치는 `docs/admission/요강정리-*.md` 를 근거로 쓴다.
- `pnpm install` 은 GitHub Packages 토큰과 Music_College 체크아웃이 있어야 성공한다. 설치가 안 되면 빌드 검증은 CI에 맡기고, 그 사실을 보고에 적는다.
