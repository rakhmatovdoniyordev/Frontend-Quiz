import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import TestPage from "../pages/TestPage"
import Layout from "../pages/Layout"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAppSelector((state) => state.auth)

  // Agar hali initialized bo'lmagan bo'lsa, loading ko'rsatish
  if (!isInitialized) {
    return <div>Loading...</div>
  }

  // Agar user yo'q bo'lsa, login sahifasiga yo'naltirish
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Public Route komponenti (faqat login qilmagan userlar uchun)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAppSelector((state) => state.auth)

  // Agar hali initialized bo'lmagan bo'lsa, loading ko'rsatish
  if (!isInitialized) {
    return <div>Loading...</div>
  }

  // Agar user mavjud bo'lsa, dashboard ga yo'naltirish
  if (user) {
    return <Navigate to="/test" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route path="/test" element={<Layout/>}>
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/test" replace />} />
    </Routes>
  )
}
