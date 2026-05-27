/**
 * Firebase 초기화 (사용자별 사관 점수 저장용)
 *
 * 환경변수 (필수, NEXT_PUBLIC_FIREBASE_* — Firebase 프로젝트 설정 → 일반 → 웹 앱):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *
 * 미설정 시 → localStorage fallback (lib/sakwan/scores-store.ts)
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let db: Firestore | null = null

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
}

export function getDb(): Firestore | null {
  if (typeof window === "undefined") return null
  if (!isFirebaseConfigured()) return null
  if (!app) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig as Record<string, string>)
  }
  if (!db) {
    db = getFirestore(app)
  }
  return db
}
