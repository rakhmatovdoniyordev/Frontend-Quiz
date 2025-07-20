import React, {  useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { registerWithEmail } from "../features/auth/authSlice"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai"
import { MdEmail, MdError, MdPersonAdd } from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"

const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})


  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!email) {
      errors.email = "Email manzil kiritilishi shart"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email manzil noto'g'ri formatda"
    }

    if (!password) {
      errors.password = "Parol kiritilishi shart"
    } else if (password.length < 6) {
      errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Parolni tasdiqlash shart"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Parollar mos kelmaydi"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const res = await dispatch(registerWithEmail({ email, password }))
      if (registerWithEmail.fulfilled.match(res)) {
        navigate("/test")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-400 to-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 max-[500px]:mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 max-[500px]:w-14 max-[500px]:h-14 max-[500px]:mb-2">
            <MdPersonAdd className="w-10 h-10 text-white max-[500px]:w-8 max-[500px]:h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 max-[500px]:text-2xl max-[500px]:mb-0">
            Qo'shiling
          </h1>
          <p className="text-gray-600 text-lg max-[500px]:text-[16px]">Yangi hisob yarating va boshlang</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 max-[500px]:p-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 max-[500px]:text-xl">Ro'yxatdan o'tish</h2>
            <p className="text-center text-gray-600 max-[500px]:text-[14px]">Ma'lumotlaringizni kiriting</p>
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
                <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:bg-white ${
                    validationErrors.email ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                  <MdError className="h-3 w-3" />
                  <span>{validationErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative group">
                <RiLockPasswordLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:bg-white ${
                    validationErrors.password ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                  }`}
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
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                  <MdError className="h-3 w-3" />
                  <span>{validationErrors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Parolni tasdiqlang
              </label>
              <div className="relative group">
                <RiLockPasswordLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Parolni qayta kiriting"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:bg-white ${
                    validationErrors.confirmPassword ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                  <MdError className="h-3 w-3" />
                  <span>{validationErrors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">Parol kuchi:</span>
                  <span
                    className={`text-xs font-medium ${
                      password.length >= 8
                        ? "text-emerald-600"
                        : password.length >= 6
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {password.length >= 8 ? "Kuchli" : password.length >= 6 ? "O'rtacha" : "Zaif"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      password.length >= 8
                        ? "bg-emerald-500 w-full"
                        : password.length >= 6
                          ? "bg-yellow-500 w-2/3"
                          : "bg-red-500 w-1/3"
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={!email || !password || !confirmPassword || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
                  <span>Ro'yxatdan o'tish...</span>
                </div>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </button>

            {/* Terms and Conditions */}
            <div className="text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                Ro'yxatdan o'tish orqali siz bizning{" "}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                  Foydalanish shartlari
                </a>{" "}
                va{" "}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                  Maxfiylik siyosati
                </a>
                ga rozilik bildirasiz.
              </p>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600">
                Hisobingiz bormi?{" "}
                <Link
                  to="/"
                  className="font-semibold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 hover:underline"
                >
                  Kirish
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            Bizning platformamizga xush kelibsiz! Savollaringiz bo'lsa{" "}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
              yordam markazi
            </a>
            ga murojaat qiling.
          </p>
        </div>
      </div>
    </div>
  )
}


export default React.memo(RegisterPage)