"use client"

import { Link, useLocation } from "react-router-dom"
import {
  Home, Activity, FileText, Calendar, Settings, User,
  LogOut, Bell, HelpCircle, Edit, Shield
} from "react-feather"
import { useAuth } from "../contexts/AuthContext"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const { user, loginAsAdmin, logout } = useAuth()
  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  const isActive = (path) => location.pathname === path

  const handleAdminLogin = () => {
    // Directly login as admin without showing login screen
    loginAsAdmin({
      email: 'admin@gdmpredict.com',
      role: 'admin'
    })
  }

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard", requiresAuth: true },
    { name: "New Prediction", icon: <Activity size={20} />, path: "/prediction/new", requiresAuth: true },
    { name: "Prediction History", icon: <FileText size={20} />, path: "/prediction/history", requiresAuth: true },
    { name: "Appointments", icon: <Calendar size={20} />, path: "/appointments", requiresAuth: true },
    { name: "Manage Appointments", icon: <Edit size={20} />, path: "/appointments/manage", requiresAuth: true, requiresAdmin: true },
    { name: "New Appointment", icon: <Calendar size={20} />, path: "/appointment/new", requiresAuth: true },
    { name: "Appointment Details", icon: <HelpCircle size={20} />, path: "/appointment/details", requiresAuth: true },
    { name: "Notifications", icon: <Bell size={20} />, path: "/notifications", requiresAuth: true },
    { name: "Profile", icon: <User size={20} />, path: "/profile", requiresAuth: true },
    { name: "Admin Profile", icon: <Shield size={20} />, path: "/admin/profile", requiresAuth: true, requiresAdmin: true },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings", requiresAuth: true },
  ]

  const publicItems = [
    { name: "Home", icon: <Home size={20} />, path: "/" },
    { name: "Features", icon: <Activity size={20} />, path: "/features" },
    { name: "How It Works", icon: <HelpCircle size={20} />, path: "/how-it-works" },
    { name: "FAQ", icon: <FileText size={20} />, path: "/faq" },
  ]

  // Filter items based on authentication and admin status
  const filteredNavItems = isAuthenticated
    ? navItems.filter(item => {
        if (!item.requiresAuth) return false
        if (item.requiresAdmin) return isAdmin
        return true
      })
    : publicItems

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DiabetesPred</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {filteredNavItems.map((item) => (

                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={isActive(item.path) ? "text-blue-600" : "text-gray-500"}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                  {item.requiresAdmin && (
                    <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                  
                </Link>
                
              ))}
              <hr className="my-2" />
  <p className="text-xs text-gray-400 px-4">Doctors</p>

  <Link to="/doctors/hepel" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
    <span className="text-gray-500">🩺</span>
    <span className="ml-3">Dr. Hepel</span>
  </Link>
  <Link to="/doctors/suleyman" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
    <span className="text-gray-500">🩺</span>
    <span className="ml-3">Dr. Suleyman</span>
  </Link>
  <Link to="/doctors/samira" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
    <span className="text-gray-500">🩺</span>
    <span className="ml-3">Dr. Samira</span>
  </Link>
            </nav>
          </div>

          {isAuthenticated ? (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                    {isAdmin && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 w-full"
              >
                <LogOut size={18} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Shield size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Admin Access</p>
                  <p className="text-xs text-gray-500">Direct admin dashboard</p>
                </div>
              </div>
              <button
                onClick={handleAdminLogin}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full"
              >
                Enter Admin Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar