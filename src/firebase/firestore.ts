// Xavfsiz Firestore operatsiyalari
import type { TestResult } from "../types/testHistory"

// Window interfeysini kengaytirish
declare global {
  interface Window {
    firebase?: any
  }
}

// Firebase mavjudligini tekshirish
function isFirebaseAvailable(): boolean {
  try {
    // Firebase import qilishga urinish
    return typeof window !== "undefined" && window.firebase !== undefined
  } catch {
    return false
  }
}

// Example usage of isFirebaseAvailable
console.log("Firebase available:", isFirebaseAvailable());

// Test natijasini Firestore ga saqlash (xavfsiz)
export async function saveTestResultToFirestore(userId: string, result: Omit<TestResult, "id">): Promise<void> {
  try {
    // Hozircha localStorage ga saqlash (Firebase o'rnatilmagan)
    console.log("Firebase hali o'rnatilmagan, localStorage ishlatiladi")

    const testResult = {
      ...result,
      id: Date.now().toString(),
      userId,
      createdAt: new Date().toISOString(),
    }

    // Foydalanuvchi-specific localStorage key
    const userStorageKey = `test_history_${userId}`
    const existingHistory = JSON.parse(localStorage.getItem(userStorageKey) || "[]")

    existingHistory.unshift(testResult)
    const limitedHistory = existingHistory.slice(0, 50)

    localStorage.setItem(userStorageKey, JSON.stringify(limitedHistory))
  } catch (error) {
    console.error("Test natijasini saqlashda xatolik:", error)
    throw error
  }
}

// Foydalanuvchi test tarixini olish (xavfsiz)
export async function getUserTestHistory(userId: string): Promise<TestResult[]> {
  try {
    console.log("Foydalanuvchi test tarixi olinmoqda:", userId)

    // Hozircha localStorage dan olish (Firebase o'rnatilmagan)
    const userStorageKey = `test_history_${userId}`
    const stored = localStorage.getItem(userStorageKey)
    const results = stored ? JSON.parse(stored) : []

    console.log("Topilgan natijalar:", results.length)

    // TestResult formatiga o'tkazish
    return results.map((item: any) => ({
      id: item.id,
      framework: item.framework,
      date: item.createdAt || item.date,
      totalQuestions: item.totalQuestions,
      correctAnswers: item.correctAnswers,
      timeSpent: item.timeSpent,
      percentage: item.percentage,
    }))
  } catch (error) {
    console.error("Foydalanuvchi test tarixini olishda xatolik:", error)
    return []
  }
}

// Foydalanuvchi test tarixini tozalash (xavfsiz)
export async function clearUserTestHistory(userId: string): Promise<void> {
  try {
    const userStorageKey = `test_history_${userId}`
    localStorage.removeItem(userStorageKey)
  } catch (error) {
    console.error("Test tarixini tozalashda xatolik:", error)
    throw error
  }
}
