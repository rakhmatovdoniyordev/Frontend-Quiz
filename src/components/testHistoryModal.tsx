import { useState, useEffect } from "react"
import type { TestResult } from "../types/testHistory"
import { getTestHistory, clearTestHistory } from "../utils/testHistory"
import { useAppSelector } from "../hooks"
import {
  MdHistory,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdTimer,
  MdCalendarToday,
  MdDelete,
  MdTrendingUp,
  MdCloudOff,
} from "react-icons/md"
import { FaReact, FaVuejs } from "react-icons/fa"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

interface TestHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TestHistoryModal({ isOpen, onClose }: TestHistoryModalProps) {
  const [history, setHistory] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const { user } = useAppSelector((state) => state.auth)

  // Test tarixini yuklash
  useEffect(() => {
    if (isOpen) {
      loadTestHistory()
    }
  }, [isOpen, user?.uid])

  const loadTestHistory = async () => {
    setIsLoading(true)
    try {
      const timeoutPromise = new Promise<TestResult[]>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000),
      )

      const historyPromise = getTestHistory(user?.uid || null)

      const testHistory = await Promise.race([historyPromise, timeoutPromise])
      setHistory(testHistory)
    } catch (error) {
      console.error("Test tarixini yuklashda xatolik:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-50 border-emerald-200"
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  const handleClearHistory = async () => {
    if (confirm("Haqiqatan ham barcha test tarixini o'chirmoqchimisiz?")) {
      setIsClearing(true)
      try {
        await clearTestHistory(user?.uid || null)
        setHistory([])
      } catch (error) {
        console.error("Test tarixini tozalashda xatolik:", error)
        alert("Test tarixini tozalashda xatolik yuz berdi")
      } finally {
        setIsClearing(false)
      }
    }
  }

  const averageScore =
    history.length > 0 ? Math.round(history.reduce((sum, test) => sum + test.percentage, 0) / history.length) : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-b border-white/20 max-[460px]:px-4 max-[460px]:py-4 max-[410px]:px-3 max-[410px]:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center max-[500px]:w-8 max-[500px]:h-8">
                <MdHistory className="w-6 h-6 text-white max-[460px]:w-4 max-[460px]:h-4" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 max-[500px]:text-[16px]">Test tarixi</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 max-[500px]:text-[14px] text-wrap max-[410px]:text-[12px]">
                    {user ? `${user.displayName || user.email} uchun natijalar` : "Mahalliy natijalar"}
                  </p>
                  {!user && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <MdCloudOff className="w-4 h-4" />
                      <span className="text-xs">Offline</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 max-[500px]:w-8 max-[500px]:h-8 max-[500px]:"
            >
              <MdClose className="w-5 h-5 text-gray-600 max-[500px]:w-4 max-[500px]:h-4" />
            </button>
          </div>
        </div>

        {/* Warning for non-authenticated users */}
        {!user && (
          <div className="px-8 py-4 bg-orange-50 border-b border-orange-200 max-[460px]:px-4">
            <div className="flex items-center space-x-3">
              <MdCloudOff className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Mahalliy saqlash rejimi</p>
                <p className="text-orange-700">
                  Tizimga kiring va natijalaringiz bulutda saqlansin. Hozir natijalar faqat shu qurilmada saqlanadi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AiOutlineLoading3Quarters className="w-8 h-8 text-violet-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Test tarixi yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {!isLoading && history.length > 0 && (
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 max-[460px]:p-4 max-[410px]:p-3">
            <div className="grid grid-cols-3 gap-6 max-[460px]:gap-1">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MdHistory className="w-5 h-5 text-violet-600 max-[620px]:w-4 max-[620px]:h-4" />
                  <span className="font-semibold text-gray-700 max-[620px]:text-[14px] max-[410px]:text-[12px]">Jami testlar</span>
                </div>
                <p className="text-3xl font-bold text-violet-600 max-[620px]:text-2xl max-[410px]:text-xl">{history.length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MdTrendingUp className="w-5 h-5 text-violet-600 max-[620px]:w-4 max-[620px]:h-4" />
                  <span className="font-semibold text-gray-700 max-[620px]:text-[14px] max-[410px]:text-[12px]">O'rtacha ball</span>
                </div>
                <p className={`text-3xl font-bold max-[620px]:text-2xl max-[410px]:text-xl ${getScoreColor(averageScore)}`}>{averageScore}%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MdCheckCircle className="w-5 h-5 text-violet-600 max-[620px]:w-4 max-[620px]:h-4"  />
                  <span className="font-semibold text-gray-700 max-[620px]:text-[14px] max-[410px]:text-[12px]">Eng yaxshi</span>
                </div>
                <p className="text-3xl max-[620px]:text-2xl max-[410px]:text-xl font-bold text-emerald-600">{Math.max(...history.map((h) => h.percentage))}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-80 max-[460px]:p-6 max-[410px]:p-3">
          {!isLoading && history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdHistory className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hali test topshirmadingiz</h3>
              <p className="text-gray-600">Birinchi testingizni topshiring va natijalar bu yerda ko'rinadi</p>
            </div>
          ) : (
            !isLoading && (
              <div className="space-y-4">
                {/* Clear History Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleClearHistory}
                    disabled={isClearing}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearing ? (
                      <AiOutlineLoading3Quarters className="w-4 h-4 text-red-600 animate-spin" />
                    ) : (
                      <MdDelete className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-red-700">
                      {isClearing ? "Tozalanmoqda..." : "Tarixni tozalash"}
                    </span>
                  </button>
                </div>

                {/* History List */}
                {history.map((test) => (
                  <div
                    key={test.id}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md max-[620px]:p-4 max-[410px]:p-3 ${getScoreBg(test.percentage)}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm max-[410px]:w-6 max-[410px]:h-6">
                          {test.framework === "React" ? (
                            <FaReact className="w-5 h-5 text-blue-500 max-[410px]:w-4 max-[410px]:h-4" />
                          ) : (
                            <FaVuejs className="w-5 h-5 text-green-500 max-[410px]:w-4 max-[410px]:h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 max-[410px]:text-[14px]">{test.framework} Test</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MdCalendarToday className="w-4 h-4 max-[410px]:w-3 max-[410px]:h-3" />
                            <span className="max-[410px]:text-[12px]">{formatDate(test.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold max-[500px]:text-xl ${getScoreColor(test.percentage)}`}>{test.percentage}%</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MdCheckCircle className="w-4 h-4 text-emerald-500 max-[410px]:w-3 max-[410px]:h-3" />
                        <span className="text-gray-700">
                          To'g'ri: <span className="font-semibold">{test.correctAnswers}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MdCancel className="w-4 h-4 text-red-500 max-[410px]:w-3 max-[410px]:h-3" />
                        <span className="text-gray-700">
                          Noto'g'ri: <span className="font-semibold">{test.totalQuestions - test.correctAnswers}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MdTimer className="w-4 h-4 text-violet-500 max-[410px]:w-3 max-[410px]:h-3" />
                        <span className="text-gray-700">
                          Vaqt: <span className="font-semibold">{formatTime(test.timeSpent)}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">
                          Jami: <span className="font-semibold">{test.totalQuestions} ta</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
