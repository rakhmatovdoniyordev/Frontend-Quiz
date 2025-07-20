import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./hooks"
import { checkUser } from "./features/auth/authSlice"
import { AppRoutes } from "./Route/routes"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

export default function App() {
  const dispatch = useAppDispatch()
  const { isInitialized, status } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkUser())
  }, [dispatch])

  // Authentication tekshirilgunga qadar loading ko'rsatish
  if (!isInitialized || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full mb-6 shadow-2xl">
            <AiOutlineLoading3Quarters className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Yuklanmoqda...
          </h2>
          <p className="text-gray-600">Iltimos kuting</p>
        </div>
      </div>
    )
  }

  return <AppRoutes />
}
