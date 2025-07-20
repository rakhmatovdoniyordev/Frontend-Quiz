import type { TestResult } from "../types/testHistory"

const STORAGE_KEY = "test_history"

// Test natijasini saqlash (Firestore va localStorage backup)
export async function saveTestResult(userId: string | null, result: Omit<TestResult, "id">): Promise<void> {
  try {
    if (userId) {
      // Agar foydalanuvchi tizimga kirgan bo'lsa, user-specific localStorage ga saqlash
      const userStorageKey = `test_history_${userId}`
      const history = getUserSpecificHistory(userId)
      const newResult: TestResult = {
        ...result,
        id: Date.now().toString(),
      }

      history.unshift(newResult)
      const limitedHistory = history.slice(0, 50)
      localStorage.setItem(userStorageKey, JSON.stringify(limitedHistory))

      console.log(`Test natijasi saqlandi: ${userId}`, newResult)
    } else {
      // Agar foydalanuvchi tizimga kirmagan bo'lsa, umumiy localStorage ga saqlash
      const history = getLocalTestHistory()
      const newResult: TestResult = {
        ...result,
        id: Date.now().toString(),
      }

      history.unshift(newResult)
      const limitedHistory = history.slice(0, 50)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory))
    }
  } catch (error) {
    console.error("Test natijasini saqlashda xatolik:", error)
  }
}

// Test tarixini olish
export async function getTestHistory(userId: string | null): Promise<TestResult[]> {
  try {
    if (userId) {
      // Foydalanuvchi-specific tarixni olish
      console.log("Foydalanuvchi tarixi olinmoqda:", userId)
      const userHistory = getUserSpecificHistory(userId)
      console.log("Topilgan natijalar:", userHistory.length)
      return userHistory
    } else {
      // Umumiy tarixni olish
      console.log("Umumiy tarix olinmoqda...")
      return getLocalTestHistory()
    }
  } catch (error) {
    console.error("Test tarixini olishda xatolik:", error)
    return []
  }
}

// Test tarixini tozalash
export async function clearTestHistory(userId: string | null): Promise<void> {
  try {
    if (userId) {
      // Foydalanuvchi-specific tarixni tozalash
      const userStorageKey = `test_history_${userId}`
      localStorage.removeItem(userStorageKey)
      console.log(`Foydalanuvchi tarixi tozalandi: ${userId}`)
    } else {
      // Umumiy tarixni tozalash
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.error("Test tarixini tozalashda xatolik:", error)
  }
}

// Foydalanuvchi-specific tarixni olish
function getUserSpecificHistory(userId: string): TestResult[] {
  try {
    const userStorageKey = `test_history_${userId}`
    const stored = localStorage.getItem(userStorageKey)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Foydalanuvchi tarixini olishda xatolik:", error)
    return []
  }
}

// LocalStorage dan umumiy test tarixini olish
function getLocalTestHistory(): TestResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("LocalStorage dan test tarixini olishda xatolik:", error)
    return []
  }
}

// Debug: Barcha foydalanuvchilar tarixini ko'rish
export function debugAllUserHistories(): void {
  console.log("=== DEBUG: Barcha foydalanuvchilar tarixi ===")

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("test_history_")) {
      const userId = key.replace("test_history_", "")
      const history = getUserSpecificHistory(userId)
      console.log(`Foydalanuvchi ${userId}: ${history.length} ta test`)
    }
  }

  console.log("=== DEBUG tugadi ===")
}
