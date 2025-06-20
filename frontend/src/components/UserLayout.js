"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, Activity, Calendar, Info, Users, Settings, Bell, FileText, Heart, LogOut } from "react-feather"
import { useAuth } from "../contexts/AuthContext"

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth() // Use your AuthContext

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/") // Navigate to home page after logout
  }

  const isActive = (path) => location.pathname === path

  const userNavItems = [
    { name: "Dashboard", icon: Activity, path: "/dashboard" },
    { name: "New Prediction", icon: Calendar, path: "/prediction/new" },
    { name: "View Reports", icon: Calendar, path: "/reports" },
    { name: "Appointment Details", icon: Info, path: "/appointment/:id" },
    { name: "Prediction History", icon: FileText, path: "/prediction/history" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* User Sidebar */}
      <aside
        className={`bg-white shadow-lg ${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col transition-all duration-300 h-screen sticky top-0 border-r border-gray-200`}
      >
        {/* User Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-green-600">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <span className="text-white font-bold text-lg">GDM Predict</span>
                <p className="text-blue-100 text-xs">Patient Portal</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-blue-200 focus:outline-none"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Patient Badge */}
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Patient Portal</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">Manage your pregnancy health</p>
            </div>
          </div>
        )}

        {/* User Navigation */}
        <nav className="flex-1 mt-6 px-2 space-y-2">
          {sidebarOpen && (
            <div className="text-xs font-semibold px-4 pb-2 uppercase text-blue-600">Health Management</div>
          )}

          {userNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/profile"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Users className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  My Profile
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Patient</span>
                </p>
                <p className="text-xs text-gray-500 group-hover:text-blue-600">Personal settings</p>
              </div>
            )}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 mt-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 w-full"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main User Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* User Header */}
        <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Patient</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || "Patient Name"}</p>
                <p className="text-xs text-gray-500">{user?.email || "patient@example.com"}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* User Content Area */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

export default UserLayout
