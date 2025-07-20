import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { loginWithEmail, loginWithGoogle, loginWithGithub } from "../features/auth/authSlice"
import { useNavigate, Link } from "react-router-dom"
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai"
import { MdEmail, MdError } from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"
import { FaGoogle, FaGithub } from "react-icons/fa"
import React from "react"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      navigate("/test")
    }
  }, [user, navigate])

  const handleGoogle = async () => {
    setIsLoading(true)
    try {
      await dispatch(loginWithGoogle())
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithub = async () => {
    setIsLoading(true)
    try {
      await dispatch(loginWithGithub())
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!email || !password) return

    setIsLoading(true)
    try {
      const res = await dispatch(loginWithEmail({ email, password }))
      if (loginWithEmail.fulfilled.match(res)) {
        navigate("/test")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 max-[500px]:mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 max-[500px]:w-14 max-[500px]:h-14 max-[500px]:mb-2">
            <RiLockPasswordLine className="w-10 h-10 text-white max-[500px]:w-8 max-[500px]:h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 max-[500px]:text-2xl max-[500px]:mb-0">
            Xush kelibsiz
          </h1>
          <p className="text-gray-600 text-lg max-[500px]:text-[16px]">Hisobingizga kiring va davom eting</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 max-[500px]:p-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 max-[500px]:text-xl">Kirish</h2>
            <p className="text-center text-gray-600 max-[500px]:text-[14px]">Email va parolingizni kiriting</p>
          </div>

          {/* Card Content */}
          <div className="px-8 pb-8 space-y-6 max-[500px]:px-5 max-[500px]:pb-5 max-[500px]:space-y-2">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <MdError className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email manzil
              </label>
              <div className="relative group">
                <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative group">
                <RiLockPasswordLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!email || !password || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
                  <span>Kirish...</span>
                </div>
              ) : (
                "Kirish"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Yoki</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogle}
                disabled={isLoading}
                className="flex items-center justify-center space-x-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaGoogle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-700">Google</span>
              </button>
              <button
                onClick={handleGithub}
                disabled={isLoading}
                className="flex items-center justify-center space-x-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaGithub className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-700">GitHub</span>
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Ro'yxatdan o'tmaganmisiz?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:underline"
                >
                  Ro'yxatdan o'tish
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            Kirish orqali siz bizning{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Foydalanish shartlari
            </a>{" "}
            va{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Maxfiylik siyosati
            </a>
            ga rozilik bildirasiz.
          </p>
        </div>
      </div>
    </div>
  )
}


export default React.memo(LoginPage)