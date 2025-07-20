"use client"

import React, { useEffect, useState } from "react"
import { getRandomQuestions, type Framework } from "../utils/getRandomQuestions"
import type { Question } from "../data/questions"
import { useAppDispatch, useAppSelector } from "../hooks"
import { logout } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import {
  MdQuiz,
  MdCheckCircle,
  MdCancel,
  MdRefresh,
  MdAssignment,
  MdTimer,
  MdPlayArrow,
  MdInfo,
  MdQuestionAnswer,
  MdLogout,
  MdPerson,
  MdPause,
  MdHome,
  MdPlayCircle,
  MdHistory,
} from "react-icons/md"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaAward, FaMedal, FaTrophy, FaLightbulb, FaClock, FaListOl, FaReact, FaVuejs } from "react-icons/fa"
import {  saveTestResult } from "../utils/testHistory"
import { TestHistoryModal } from "../components/testHistoryModal"
import { RiErrorWarningFill } from "react-icons/ri"

const TestPage = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<{ [id: string]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [selectedFramework, setSelectedFramework] = useState<Framework>("React")
  const [showHistory, setShowHistory] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && !submitted && !showPauseModal) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, submitted, showPauseModal])



  const handleStartTest = async () => {
    setIsLoading(true)
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setQuestions(getRandomQuestions(selectedFramework))
    setTestStarted(true)
    setTimerActive(true)
    setIsLoading(false)
  }

  const handleSelect = (questionId: string, option: string) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [questionId]: option }))
    }
  }

  const handleSubmitOrRetry = async () => {
    if (!submitted) {
      setSubmitted(true)
      setTimerActive(false)

      // Test natijasini saqlash
      const testResult = {
        framework: selectedFramework,
        date: new Date().toISOString(),
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timeSpent: currentTime,
        percentage: Math.round((correctCount / questions.length) * 100),
      }
      saveTestResult(user?.uid || null, testResult)
    } else {
      // Qayta urinish
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setQuestions(getRandomQuestions(selectedFramework))
      setAnswers({})
      setSubmitted(false)
      setCurrentTime(0)
      setTimerActive(true)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout())
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(true)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  // Pause/Stop test functions
  const handlePauseTest = () => {
    setShowPauseModal(true)
  }

  const handleQuitTest = () => {
    // Reset test state
    setTestStarted(false)
    setQuestions([])
    setAnswers({})
    setSubmitted(false)
    setCurrentTime(0)
    setTimerActive(false)
    setShowPauseModal(false)
    // Test intro sahifasiga qaytish (navigate o'rniga)
  }
  useEffect(()=>{
    window.scrollTo(0,0)
  }, [isLoading, testStarted])

  const handleContinueTest = () => {
    setShowPauseModal(false)
  }

  const handleBackToHome = () => {
    setTestStarted(false)
    setQuestions([])
    setAnswers({})
    setSubmitted(false)
    setCurrentTime(0)
    setTimerActive(false)
  }

  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length

  const answeredCount = Object.keys(answers).length
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = () => {
    const percentage = (correctCount / questions.length) * 100
    if (percentage >= 80) return "from-emerald-500 to-green-500"
    if (percentage >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getScoreIcon = () => {
    const percentage = (correctCount / questions.length) * 100
    if (percentage >= 80) return <FaTrophy className="w-8 h-8" />
    if (percentage >= 60) return <FaMedal className="w-8 h-8" />
    return <FaAward className="w-8 h-8" />
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full mb-6 shadow-2xl">
            <AiOutlineLoading3Quarters className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Test tayyorlanmoqda...
          </h2>
          <p className="text-gray-600">Savollar yuklanmoqda, iltimos kuting</p>
        </div>
      </div>
    )
  }

  // Logout confirmation modal
  const LogoutModal = () => {
    if (!showLogoutConfirm) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
              <MdLogout className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Tizimdan chiqish</h3>
            <p className="text-gray-600 mb-4">Haqiqatan ham tizimdan chiqmoqchimisiz?</p>
            <div className="flex space-x-4">
              <button
                onClick={cancelLogout}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-nowrap"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pause Test Modal
  const PauseTestModal = () => {
    if (!showPauseModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
              <MdPause className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Test to'xtatildi</h3>
            <p className="text-gray-600 mb-2">Testni tugatmoqchimisiz yoki davom ettirasizmi?</p>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hozirgi vaqt:</span>
                <span className="font-bold text-violet-700">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Javob berilgan:</span>
                <span className="font-bold text-violet-700">
                  {answeredCount}/{questions.length}
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleQuitTest}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                <MdHome className="w-4 h-4" />
                <span>Testni tugatish</span>
              </button>
              <button
                onClick={handleContinueTest}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                <MdPlayCircle className="w-4 h-4" />
                <span>Davom etish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fixed Test Header (only shown during test)
  const FixedTestHeader = () => {
    if (!testStarted || submitted) return null

    return (
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Test info */}
            <div className="flex items-center space-x-6 max-[500px]:space-x-0">
              <div className="flex items-center space-x-2 max-[500px]:hidden max-[500px]:space-x-0">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MdQuiz className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-800 hidden sm:block">Bilim Testi</span>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-3 max-[500px]:m-0">
                <MdAssignment className="w-5 h-5 text-violet-600 text-start" />
                <div className="flex items-center space-x-2">
                  <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {answeredCount}/{questions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Center - Timer and Pause button */}
            <div className="flex items-center space-x-3 max-[500px]:space-x-1">
              {/* Timer */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2 rounded-xl border border-violet-200 max-[450px]:px-2 max-[450px]:py-1">
                <MdTimer className="w-5 h-5 text-violet-600" />
                <span className="font-bold text-violet-700 text-lg tabular-nums">{formatTime(currentTime)}</span>
              </div>

              {/* Pause button */}
              <button
                onClick={handlePauseTest}
                className="group flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 hover:border-orange-300 rounded-xl px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                title="Testni to'xtatish"
              >
                <MdPause className="w-4 h-4 text-orange-600" />
                <span className="hidden md:block text-sm font-medium text-orange-700">To'xtatish</span>
              </button>
            </div>

            {/* Right side - User and logout */}
            <div className="flex items-center space-x-3 max-[500px]:space-x-0">
              {/* User info */}
              <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2">
                <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL || "/placeholder.svg"} alt="User" className="w-6 h-6 rounded-full" />
                  ) : (
                    <MdPerson className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={confirmLogout}
                className="group flex items-center space-x-1 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <MdLogout className="w-4 h-4 text-red-600" />
                <span className="hidden sm:block text-sm font-medium text-red-700">Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User info header component (for intro page)
  const UserHeader = () => (
    <div className="absolute top-4 right-4 z-20">
      <div className="flex items-center space-x-4">
        {/* User info */}
        <div className="hidden md:flex items-center space-x-3 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-lg border border-white/20">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL || "/placeholder.svg"} alt="User" className="w-8 h-8 rounded-full" />
            ) : (
              <MdPerson className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{user?.displayName || "Foydalanuvchi"}</p>
            <p className="text-gray-600 text-xs">{user?.email}</p>
          </div>
        </div>

        {/* Test History button - faqat intro sahifada */}
        {!testStarted && (
          <button
            onClick={() => setShowHistory(true)}
            className="group flex items-center space-x-2 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-lg border border-white/20 hover:bg-violet-50 hover:border-violet-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <MdHistory className="w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
            <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-violet-700 transition-colors">
              Tarix
            </span>
          </button>
        )}

        {/* Logout button */}
        <button
          onClick={confirmLogout}
          className="group flex items-center space-x-2 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-lg border border-white/20 hover:bg-red-50 hover:border-red-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <MdLogout className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
          <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-red-700 transition-colors">
            Chiqish
          </span>
        </button>
      </div>
    </div>
  )

  // Test introduction screen
  if (!testStarted) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-fuchsia-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
          </div>

          {/* User Header */}
          <UserHeader />

          <div className="max-w-4xl mx-auto relative z-10 max-[1100px]:mt-14 max-[768px]:mt-0">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 max-[768px]:w-20 max-[768px]:h-20">
                <MdQuiz className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4 max-[768px]:text-4xl max-[600px]:text-3xl">
                Bilim Testi
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed max-[600px]:text-[16px]">
                O'z bilimingizni sinab ko'ring va qanchalik tayyorligingizni aniqlang
              </p>
            </div>

            {/* Framework Selector */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
              <div className="px-8 py-6 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-b border-white/20">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold"><i><RiErrorWarningFill /></i></span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 max-[768px]:text-xl max-[450px]:text-[18px]">Framework tanlang</h2>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* React Option */}
                  <label
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 max-[450px]:p-3 ${
                      selectedFramework === "React"
                        ? "border-blue-500 bg-blue-100 shadow-lg"
                        : "border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="framework"
                      value="React"
                      checked={selectedFramework === "React"}
                      onChange={(e) => setSelectedFramework(e.target.value as Framework)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center max-[450px]:w-8 max-[450px]:h-8">
                        <FaReact className="w-7 h-7 text-white max-[450px]:w-5 max-[450px]:h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 max-[450px]:text-[16px]">React</h3>
                        <p className="text-gray-600 max-[450px]:text-[14px]">React.js kutubxonasi bo'yicha test</p>
                      </div>
                    </div>
                  </label>

                  {/* Vue Option */}
                  <label
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 max-[450px]:p-3 ${
                      selectedFramework === "Vue"
                        ? "border-green-500 bg-green-100 shadow-lg"
                        : "border-gray-200 bg-gray-50 hover:border-green-200 hover:bg-green-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="framework"
                      value="Vue"
                      checked={selectedFramework === "Vue"}
                      onChange={(e) => setSelectedFramework(e.target.value as Framework)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center max-[450px]:w-8 max-[450px]:h-8">
                        <FaVuejs className="w-7 h-7 text-white max-[450px]:w-5 max-[450px]:h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 max-[450px]:text-[16px]">Vue.js</h3>
                        <p className="text-gray-600 max-[450px]:text-[14px]">Vue.js framework bo'yicha test</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Info Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
              {/* Card Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-b border-white/20 max-[500px]:px-5 max-[500px]:py-4">
                <div className="flex items-center justify-center space-x-3">
                  <MdInfo className="w-6 h-6 text-violet-600" />
                  <h2 className="text-2xl font-bold text-gray-800 max-[768px]:text-xl max-[450px]:text-[18px]:">Test haqida ma'lumot</h2>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 max-[500px]:p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-[500px]:gap-4 max-[500px]:mb-5">
                  {/* Questions Count */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg max-[500px]:w-12 max-[500px]:h-12 max-[500px]:mb-0">
                      <FaListOl className="w-8 h-8 text-white max-[500px]:w-6 max-[500px]:h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 max-[500px]:mb-0 max-[500px]:text-[16px]">Savollar soni</h3>
                    <p className="text-3xl font-bold text-blue-600">25</p>
                    <p className="text-sm text-gray-600 mt-1">ta savol</p>
                  </div>

                  {/* Time Limit */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg max-[500px]:w-12 max-[500px]:h-12 max-[500px]:mb-0">
                      <FaClock className="w-8 h-8 text-white max-[500px]:w-6 max-[500px]:h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 max-[500px]:text-[16px]">Vaqt cheklovi</h3>
                    <p className="text-3xl font-bold text-orange-600">∞</p>
                    <p className="text-sm text-gray-600 mt-1">cheksiz vaqt</p>
                  </div>

                  {/* Difficulty */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg max-[500px]:w-12 max-[500px]:h-12 max-[500px]:mb-0">
                      <FaLightbulb className="w-8 h-8 text-white max-[500px]:w-6 max-[500px]:h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 max-[500px]:text-[16px]">Qiyinchilik</h3>
                    <p className="text-3xl font-bold text-emerald-600 max-[500px]:text-xl">O'rta</p>
                    <p className="text-sm text-gray-600 mt-1">daraja</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mb-8 max-[500px]:mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <MdQuestionAnswer className="w-5 h-5 text-violet-600" />
                    <span>Test qoidalari</span>
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Har bir savolda faqat bitta to'g'ri javob mavjud</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Barcha savollarga javob berishingiz shart</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Test tugagandan so'ng natijalarni ko'rishingiz mumkin</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Testni istalgan vaqtda to'xtatishingiz mumkin</span>
                    </li>
                  </ul>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <FaLightbulb className="w-5 h-5 text-amber-600" />
                    <span>Maslahatlar</span>
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Savollarni diqqat bilan o'qing</li>
                    <li>• Shoshilmang, o'ylab javob bering</li>
                    <li>• Agar javobni bilmasangiz, eng yaqin variantni tanlang</li>
                    <li>• Testni tugatishdan oldin javoblaringizni tekshiring</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={handleStartTest}
                className="group px-12 py-6 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.05] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 active:scale-[0.98] flex items-center space-x-4 mx-auto max-[768px]:px-10 max-[768px]:py-4 max-[450px]:px-8 max-[450px]:py-3 max-[450px]:text-lg max-[450px]:space-x-2"
              >
                <MdPlayArrow className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span>Testni boshlash</span>
              </button>
              <p className="text-gray-500 text-sm mt-4">Tayyor bo'lganingizda tugmani bosing</p>
            </div>
          </div>

          {/* Logout Modal */}
          <LogoutModal />

          {/* Test History Modal - intro sahifada */}
          <TestHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
        </div>
      </>

    )
  }

  // Main test screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden">
      {/* Fixed Test Header */}
      <FixedTestHeader />

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-fuchsia-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content with top padding to account for fixed header */}
      <div className={`${testStarted && !submitted ? "pt-20" : "pt-8"} pb-8 px-4`}>
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header (only show when test is not active) */}
          {(!testStarted || submitted) && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <MdQuiz className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                Bilim Testi
              </h1>
              <p className="text-gray-600 text-lg">O'z bilimingizni sinab ko'ring</p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6 mb-8">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.correctAnswer

              return (
                <div
                  key={q.id}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
                >
                  {/* Question Header */}
                  <div className="px-8 py-6 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-b border-white/20">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-lg font-semibold text-gray-800 leading-relaxed">{q.question}</p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="p-8 space-y-4">
                    {q.options.map((option) => {
                      const isUserChoice = userAnswer === option
                      const isCorrectAnswer = option === q.correctAnswer

                      let optionClass =
                        "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group hover:shadow-md "

                      if (submitted) {
                        if (isCorrectAnswer) {
                          optionClass += "border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                        } else if (isUserChoice && !isCorrect) {
                          optionClass += "border-red-300 bg-red-50 hover:bg-red-100"
                        } else {
                          optionClass += "border-gray-200 bg-gray-50 cursor-not-allowed"
                        }
                      } else {
                        if (isUserChoice) {
                          optionClass += "border-violet-300 bg-violet-50 shadow-md"
                        } else {
                          optionClass += "border-gray-200 bg-gray-50 hover:border-violet-200 hover:bg-violet-50"
                        }
                      }

                      return (
                        <label key={option} className={optionClass}>
                          <div className="relative">
                            <input
                              type="radio"
                              name={q.id}
                              value={option}
                              disabled={submitted}
                              checked={isUserChoice}
                              onChange={() => handleSelect(q.id, option)}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isUserChoice
                                  ? "border-violet-500 bg-violet-500"
                                  : "border-gray-300 group-hover:border-violet-400"
                              }`}
                            >
                              {isUserChoice && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                          </div>

                          <span className="flex-1 text-gray-700 font-medium">{option}</span>

                          {submitted && isCorrectAnswer && <MdCheckCircle className="w-6 h-6 text-emerald-500" />}
                          {submitted && isUserChoice && !isCorrect && <MdCancel className="w-6 h-6 text-red-500" />}
                        </label>
                      )
                    })}
                  </div>

                  {/* Answer Feedback */}
                  {submitted && (
                    <div className="px-8 pb-6">
                      <div
                        className={`p-4 rounded-xl border ${
                          isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {isCorrect ? (
                            <MdCheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <MdCancel className="w-5 h-5 text-red-600" />
                          )}
                          <p className={`font-medium ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                            {isCorrect
                              ? "To'g'ri javob berdingiz!"
                              : `Noto'g'ri. Siz tanlagan: ${userAnswer || "Hech narsa"} | To'g'ri javob: ${q.correctAnswer}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Submit/Retry Button */}
          <div className="text-center mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleSubmitOrRetry}
                disabled={!submitted && answeredCount < questions.length}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-[0.98] flex items-center space-x-2"
              >
                {submitted ? (
                  <>
                    <MdRefresh className="w-5 h-5" />
                    <span>Qayta urinish</span>
                  </>
                ) : (
                  <>
                    <MdAssignment className="w-5 h-5" />
                    <span>Testni tugatish</span>
                  </>
                )}
              </button>

              {submitted && (
                <button
                  onClick={handleBackToHome}
                  className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:scale-[0.98] flex items-center space-x-2"
                >
                  <MdHome className="w-5 h-5" />
                  <span>Bosh sahifa</span>
                </button>
              )}
            </div>

            {!submitted && answeredCount < questions.length && (
              <p className="text-sm text-gray-500 mt-2">
                Testni tugatish uchun barcha savollarga javob bering ({answeredCount}/{questions.length})
              </p>
            )}
          </div>

          {/* Results */}
          {submitted && (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-b border-white/20">
                <div className="flex items-center justify-center space-x-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getScoreColor()} text-white`}>
                    {getScoreIcon()}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Test natijalari</h2>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <MdCheckCircle className="w-6 h-6 text-emerald-500" />
                      <span className="font-semibold text-gray-700">To'g'ri javoblar</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">{correctCount}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <MdCancel className="w-6 h-6 text-red-500" />
                      <span className="font-semibold text-gray-700">Noto'g'ri javoblar</span>
                    </div>
                    <p className="text-3xl font-bold text-red-600">{questions.length - correctCount}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <MdTimer className="w-6 h-6 text-violet-500" />
                      <span className="font-semibold text-gray-700">Sarflangan vaqt</span>
                    </div>
                    <p className="text-3xl font-bold text-violet-600">{formatTime(currentTime)}</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-block p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl">
                    <p className="text-lg font-semibold text-gray-700 mb-2">Umumiy ball</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {Math.round((correctCount / questions.length) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LogoutModal />
      <PauseTestModal />

      {/* Test History Modal */}
      <TestHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  )
}


export default React.memo(TestPage);