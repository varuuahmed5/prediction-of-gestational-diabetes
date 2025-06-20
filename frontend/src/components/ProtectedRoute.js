"use client"

import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-12 border-b-2 border-blue-00"></div>
      </div>
    )
  }

  // Check localStorage for user data if context doesn't have it
  const storedUser = localStorage.getItem("user")
  const storedToken = localStorage.getItem("token")
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null)

  console.log("ProtectedRoute Debug:")
  console.log("- Current user:", currentUser)
  console.log("- Token exists:", !!storedToken)
  console.log("- Required role:", requiredRole)
  console.log("- User role:", currentUser?.role)

  // If no user or token, redirect to login
  if (!currentUser || !storedToken) {
    console.log("❌ No user or token, redirecting to login")
    return <Navigate to="/login" replace />
  }

  // If specific role is required, check it
  if (requiredRole && currentUser.role !== requiredRole) {
    console.log(`❌ User role ${currentUser.role} doesn't match required role ${requiredRole}`)
    return <Navigate to="/dashboard" replace />
  }

  console.log("✅ Access granted to protected route")
  return children
}

export default ProtectedRoute
