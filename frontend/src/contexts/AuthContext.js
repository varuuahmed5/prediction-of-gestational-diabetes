"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api, { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)



  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        console.log("Stored token:", storedToken ? "exists" : "not found")
        console.log("Stored user:", storedUser ? "exists" : "not found")

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser)

          // Verify token is still valid by making a test request
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`

          try {
            // Test the token by getting user profile
            const response = await api.get("/auth/me")

            setToken(storedToken)
            setUser(response.data.data.user)
            console.log("User authenticated successfully:", response.data.data.user)
          } catch (error) {
            console.log("Token validation failed:", error.message)
            // Token is invalid, clear storage
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            delete api.defaults.headers.common["Authorization"]
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        // Clear invalid data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        delete api.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])
  
  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", email)
      const response = await authAPI.login({ email, password })
      const { token: newToken, data } = response.data

      console.log("Login successful:", data.user)

      // Store in localStorage
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Set in state
      setToken(newToken)
      setUser(data.user)

      // Set default header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      return { success: true, user: data.user }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      console.log("Registering with data:", userData)
      const response = await api.post("/auth/register", userData)
      console.log("Registration response:", response.data)
      return response.data
    } catch (error) {
      console.error("Registration error:", error.message || error)
      throw error
    }
  }

  const logout = () => {
    console.log("Logging out user")

    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Clear state
    setToken(null)
    setUser(null)

    // Clear API header
    delete api.defaults.headers.common["Authorization"]
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)
      const updatedUser = response.data.data.user

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      return true
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email)
      return true
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    }
  }

  const resetPassword = async (token, password, passwordConfirm) => {
    try {
      await authAPI.resetPassword(token, { password, passwordConfirm })
      return true
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    }
  }

  const verifyEmail = async (token) => {
    try {
      await authAPI.verifyEmail(token)
      return true
    } catch (error) {
      console.error("Email verification error:", error)
      throw error
    }
  }

  const changePassword = async (passwordCurrent, password, passwordConfirm) => {
    try {
      await authAPI.changePassword({ passwordCurrent, password, passwordConfirm })
      return true
    } catch (error) {
      console.error("Change password error:", error)
      throw error
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
