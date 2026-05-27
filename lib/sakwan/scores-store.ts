/**
 * 사관·경찰 응시 결과 저장/조회
 *
 * Firestore 사용 (NEXT_PUBLIC_FIREBASE_* 설정 시) → 사용자별 영구 저장 + 랭킹·교차분석 가능
 * 미설정 시 localStorage fallback → 단말기 단위 저장만
 *
 * 컬렉션: `sakwan_scores`
 * 문서 ID: 자동
 * 필드: { userId, track, year, elective?, totalScore, sectionScores, gradedAt, createdAt }
 */

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore"
import { getDb, isFirebaseConfigured } from "./firebase"
import type { GradingResult } from "./scoring"

const COLLECTION = "sakwan_scores"
const LS_KEY = "sakwan_scores_v1"

export interface StoredScore extends GradingResult {
  id?: string
  userId: string
  createdAt?: string
}

export async function saveScore(userId: string, result: GradingResult): Promise<StoredScore> {
  const stored: StoredScore = {
    ...result,
    userId,
    createdAt: new Date().toISOString(),
  }

  if (isFirebaseConfigured()) {
    const db = getDb()
    if (db) {
      try {
        const docRef = await addDoc(collection(db, COLLECTION), {
          ...stored,
          createdAt: serverTimestamp(),
        })
        stored.id = docRef.id
        return stored
      } catch (e) {
        console.warn("[sakwan] Firestore save failed, falling back to localStorage:", e)
      }
    }
  }

  // localStorage fallback
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(LS_KEY) || "[]"
    const arr: StoredScore[] = JSON.parse(raw)
    stored.id = `local_${Date.now()}`
    arr.push(stored)
    window.localStorage.setItem(LS_KEY, JSON.stringify(arr))
  }
  return stored
}

export async function loadScores(userId: string): Promise<StoredScore[]> {
  if (isFirebaseConfigured()) {
    const db = getDb()
    if (db) {
      try {
        const q = query(
          collection(db, COLLECTION),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
        )
        const snap = await getDocs(q)
        return snap.docs.map((d) => {
          const data = d.data()
          const createdAtRaw = data.createdAt as Timestamp | undefined
          return {
            ...(data as StoredScore),
            id: d.id,
            createdAt: createdAtRaw && typeof createdAtRaw.toDate === "function"
              ? createdAtRaw.toDate().toISOString()
              : (data.createdAt as string | undefined),
          }
        })
      } catch (e) {
        console.warn("[sakwan] Firestore load failed, using localStorage:", e)
      }
    }
  }
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(LS_KEY) || "[]"
  const arr: StoredScore[] = JSON.parse(raw)
  return arr.filter((s) => s.userId === userId).sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || ""),
  )
}
