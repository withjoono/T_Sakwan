# 사관·경찰 OMR 응시 시스템 — 사용 가이드

> 2026-05-28 추가
> Mogo가 아닌 **Sakwan 자체 OMR 응시 페이지**로 전환됨.

---

## 1. 새 구조

```
/mock                    ← 응시 선택 + 합격선 매칭 (대시보드)
  ├─ 기출 카드 (2022~2026 연도 버튼)
  └─ "응시 시작" 버튼 →

/mock/exam?track=&year=  ← 90문항 OMR 응시 페이지
  ├─ 사관: 국30 + 영30 + 수30(공통+선택)
  ├─ 경찰: 국45 + 영45 + 수25
  ├─ 답안 자동 임시저장 (localStorage)
  ├─ 타이머
  └─ "제출하고 채점" →

/mock/result?id=         ← 채점 결과 + 합격선 매칭
  ├─ 과목별 점수 + 문항별 정/오답
  ├─ 5개 학교 합격선 매칭
  └─ 응시 히스토리
```

**Mogo 의존성 0** — 응시·채점·저장 모두 Sakwan 안에서 완결됩니다.

---

## 2. 정답표 입력 (필수)

현재 `lib/sakwan/answer-keys.ts`의 정답표는 모두 `placeholder` (전 문항 1번 등)입니다.
실제 점수가 나오려면 정답표를 채워야 합니다.

### 2.1 입력 위치
```ts
// lib/sakwan/answer-keys.ts

export const SAAGWAN_ANSWER_KEYS: Record<number, SaagwanAnswerKey> = {
  2025: {
    korean: { 1: 3, 2: 5, 3: 2, ... 30: 4 },      // 30개 모두
    english: { 1: 1, 2: 4, ... 30: 5 },
    math: {
      common: { 1: 2, ..., 15: 5,                  // 객관식 1-15
                16: 7, 17: 24, ..., 22: 365 },     // 주관식 16-22 (정수)
      electives: {
        "확률과 통계": { 23: 3, 24: 1, ..., 28: 4,  // 객관식 23-28
                       29: 12, 30: 81 },           // 주관식 29-30
        "미적분":     { ... },
        "기하":       { ... },
      },
    },
  },
  // 2022~2024, 2026도 동일하게
}
```

### 2.2 입력 후 가용 표시
```ts
export const ANSWER_KEY_AVAILABLE: Record<string, boolean> = {
  "saagwan-2025": true,   // ← 입력 완료한 회차는 true로
  ...
}
```

`false` 상태에서도 응시·채점은 되지만, /mock에 "정답 미입력" 경고가 뜨고 채점 시 confirm 다이얼로그가 떠 사용자에게 경고합니다.

---

## 3. Firebase 설정 (선택)

미설정 시 → localStorage fallback. 단말기 단위로만 저장됨.

### 3.1 환경변수 추가
`E:\Dev\github\Sakwan\.env.local`에 추가:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ts-front-479305.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ts-front-479305
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ts-front-479305.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

값은 Firebase 콘솔 → 프로젝트 설정 → 일반 → 웹 앱 → SDK 설정 및 구성에서 복사.

### 3.2 Firestore 보안 규칙 (필수)

기본값(open mode)은 위험. 다음 규칙을 Firestore 콘솔 → Rules에 적용:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sakwan_scores/{docId} {
      // 본인 점수만 읽기/쓰기 — userId는 Hub의 사용자 ID
      allow read, write: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

**주의:** 위 규칙은 Firebase Auth를 가정합니다. 현재 Sakwan은 Hub SSO만 쓰므로 `request.auth`가 비어 있습니다.
간이 운영용으로는 우선 다음 규칙을 쓰고, 인증 통합 후 위 규칙으로 강화:

```
match /sakwan_scores/{docId} {
  allow read, write: if true;  // 임시 — 운영 전 반드시 보강
}
```

### 3.3 의존성 설치
```powershell
cd E:\Dev\github\Sakwan
pnpm install   # firebase ^10.14.0 자동 설치
```

---

## 4. 배포

```powershell
cd E:\Dev\github\Sakwan
git add app/mock lib/sakwan lib/auth.ts package.json 사관_OMR_사용_가이드.md
git commit -m "feat: Sakwan 자체 OMR 응시 시스템 + Firestore 저장 추가"
git push origin main
pnpm build
firebase deploy --only hosting
```

배포 후 확인:
- `https://sakwan-front.web.app/mock` → 기출 카드 + 연도 버튼
- `/mock/exam?track=saagwan&year=2025` → OMR 페이지 (로그인 필요)
- 제출 → `/mock/result` 자동 이동

---

## 5. 다음 단계 제안

| 우선순위 | 작업 | 예상 시간 |
|---|---|---|
| P0 | **정답표 입력** (최소 2025·2026년 사관) | 회차당 1~2시간 |
| P1 | Firebase 환경변수 + 보안 규칙 설정 | 30분 |
| P1 | 기출 문제지 PDF 업로드 + /mock/exam에서 "문제지 다운로드" 링크 | 1시간 |
| P2 | 6월 모의문제 1회차 제작 (정답표 + 가능하면 문제지) | 며칠 |
| P2 | 응시 결과 기반 취약 분석 자동화 (현재 하드코딩) | 반나절 |
| P3 | 사관·경찰 동일 회차 응시자 랭킹 (Firestore 집계) | 반나절 |

---

## 6. 트러블슈팅

**Q. `/mock/exam`에서 "Feature is disabled" 같은 메시지가 뜬다**
→ 이전 Mogo deep-link 시절 메시지. 캐시 새로고침(Ctrl+Shift+R).

**Q. 응시 제출 시 "사관 2025 정답표 없음" 에러**
→ `lib/sakwan/answer-keys.ts`에서 해당 연도가 placeholder도 안 등록된 경우. `makeSaagwanPlaceholder()`로 우선 채워넣고 실제 정답으로 교체.

**Q. 응시 결과가 다음 접속 시 사라진다**
→ Firebase 미설정 상태. localStorage는 브라우저별로 격리됨. 다른 단말기에서 보려면 Firebase 설정 필요.

**Q. tsc 빌드 에러 "Cannot find module 'firebase'"**
→ `pnpm install` 안 한 상태. package.json에 firebase가 추가됐으니 설치 필요.
