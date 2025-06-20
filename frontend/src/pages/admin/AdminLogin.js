import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { Shield, Eye, EyeOff } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Attempt to login
      const response = await login(email, password)

      // Check if user is admin
      if (response.user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.")
        setIsLoading(false)
        return
      }

      // Success - redirect to admin profile
      toast.success("Admin login successful!")
      navigate("/admin/profile", { replace: true }) // Redirect to AdminProfile
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.message || "Failed to login. Please check your credentials.")
      setIsLoading(false)
    }
  }

  // Quick admin access for development
  const handleQuickAdminAccess = () => {
    // Create mock admin user
    const mockAdminUser  = {
      _id: "admin123",
      name: "Admin User",
      firstName: "Admin",
      lastName: "User ",
      email: "admin@example.com",
      role: "admin",
      isEmailVerified: true,
      verified: true,
      createdAt: new Date().toISOString(),
    }

    const mockToken = "mock-admin-token-123"

    // Store in localStorage
    localStorage.setItem("token", mockToken)
    localStorage.setItem("user", JSON.stringify(mockAdminUser ))

    toast.success("Admin access granted!")
    navigate("/admin/profile") // Redirect to AdminProfile
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-600 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Secure access for administrative users only</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Admin Email"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Shield className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                </span>
              )}
              {isLoading ? "Signing in..." : "Sign in as Admin"}
            </button>
          </div>
        </form>

        {/* Development Quick Access */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleQuickAdminAccess}
            className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Shield className="h-5 w-5 text-red-400" />
            <span>Quick Admin Access (Dev Only)</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="font-medium text-red-600 hover:text-red-500">
            Back to Home
          </Link>
          <span className="mx-2 text-gray-500">|</span>
          <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
            Patient Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
