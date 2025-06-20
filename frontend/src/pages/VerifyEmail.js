"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Check, AlertTriangle, Mail, Loader } from "react-feather"
import { useAuth } from "../contexts/AuthContext"

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { verifyEmail } = useAuth()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid verification link")
        setLoading(false)
        return
      }

      try {
        const success = await verifyEmail(token)
        if (success) {
          setVerified(true)
        } else {
          setError("Failed to verify email. The token may be invalid or expired.")
        }
      } catch (err) {
        console.error("Email verification error:", err)
        setError("Failed to verify email. The token may be invalid or expired.")
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token, verifyEmail])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <Loader className="animate-spin h-12 w-12 mx-auto text-blue-500" />
          <h2 className="mt-6 text-center text-xl font-medium text-gray-900 dark:text-white">
            Verifying your email...
          </h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Verification failed
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">{error}</p>
            <div className="mt-6 flex flex-col space-y-4">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Go to login
              </Link>
              <button
                onClick={() => navigate("/register")}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Create a new account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Email verified successfully!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Your email has been verified. You can now log in to your account.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Mail className="mr-2 h-5 w-5" />
              Go to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
