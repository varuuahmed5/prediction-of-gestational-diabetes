"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Menu, X, Activity, Calendar, Edit2, Info, Users, Heart, Shield } from "react-feather"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"

const LandingPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Quick admin access function
  const handleQuickAdminAccess = () => {
    console.log("Quick admin access clicked")

    // Create mock admin user
    const mockAdminUser = {
      _id: "admin123",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    }

    const mockToken = "mock-admin-token-123"

    // Store in localStorage
    localStorage.setItem("token", mockToken)
    localStorage.setItem("user", JSON.stringify(mockAdminUser))

    console.log("Mock admin user created and stored")
    toast.success("Admin access granted!")

    // Navigate directly to admin profile
    navigate("/admin/profile")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg ${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col transition-all duration-300 h-screen sticky top-0`}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          {sidebarOpen ? (
            <div className="flex items-center">
              <LogoIcon className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold">GDM Predict</span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">GD</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <nav className="flex-1 mt-6 px-2 space-y-4">
          <SidebarLink to="/" icon={<Activity className="h-5 w-5" />} label="Home" sidebarOpen={sidebarOpen} />
          <SidebarLink
            to="/appointments"
            icon={<Calendar className="h-5 w-5" />}
            label="Appointments"
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/appointment-management"
            icon={<Edit2 className="h-5 w-5" />}
            label="Manage Appointments"
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/appointment-form"
            icon={<Edit2 className="h-5 w-5" />}
            label="New Appointment"
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            to="/appointment-details"
            icon={<Info className="h-5 w-5" />}
            label="Appointment Details"
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink to="/profile" icon={<Users className="h-5 w-5" />} label="Profile" sidebarOpen={sidebarOpen} />
        </nav>

        {/* Quick Admin Access Section */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Direct Link to Admin Profile */}
          <Link
            to="/admin/profile"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                  Admin Profile
                </p>
                <p className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors">
                  Access admin dashboard
                </p>
              </div>
            )}
          </Link>

          {/* Quick Admin Access Button */}
          <button
            onClick={handleQuickAdminAccess}
            className="w-full flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors text-white"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="text-left">
                <p className="text-sm font-medium">🚀 Quick Admin</p>
                <p className="text-xs text-purple-100">Instant access</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow px-4 sm:px-8 py-4 flex justify-between items-center">
          <nav className="hidden md:flex space-x-6 text-gray-700">
            <Link to="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/features" className="hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link to="/how-it-works" className="hover:text-purple-600 transition-colors">
              How it works
            </Link>
            <Link to="/testimonials" className="hover:text-purple-600 transition-colors">
              Testimonials
            </Link>
            <Link to="/faq" className="font-semibold text-indigo-900 underline underline-offset-4">
              FAQ
            </Link>
          </nav>
          <div className="flex space-x-2 sm:space-x-4">
            <Link
              to="/signup"
              className="px-3 sm:px-4 py-2 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors text-sm sm:text-base"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-colors text-sm sm:text-base"
            >
              Sign In
            </Link>

            {/* Quick Admin Button in Header */}
            <button
              onClick={handleQuickAdminAccess}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-colors text-sm sm:text-base"
            >
              🛡️ Admin
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-12 sm:py-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                AI Companion for a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Healthier Pregnancy
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                Our intelligent platform empowers expectant mothers to assess their risk of gestational diabetes early.
                Using cutting-edge machine learning and a patient-first design, we guide mothers through their pregnancy
                with insights, alerts, and tools.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-colors text-center text-sm sm:text-base"
                >
                  Get Started
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors text-center text-sm sm:text-base"
                >
                  Learn More
                </Link>

                {/* Hero Quick Admin Button */}
                <button
                  onClick={handleQuickAdminAccess}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-colors text-center text-sm sm:text-base"
                >
                  🚀 Quick Admin Access
                </button>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 sm:mt-12 md:mt-0 flex justify-center">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%282%29-al8oiShYsZ8GHmklFYcTtfAFsy2WTn.jpeg"
                  alt="Ultrasound"
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain rounded-lg shadow-lg z-10 relative"
                  loading="lazy"
                />
                <div className="absolute -top-4 -right-4">
                  <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
                </div>
                <div className="absolute -top-2 -left-2">
                  <Heart className="h-6 w-6 text-pink-400 fill-pink-400" />
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-lg blur-xl -z-10"
                  style={{ transform: "scale(1.1)" }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges & Solutions */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
              Addressing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Critical Challenges
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard
                icon={<ChallengeIcon className="h-12 sm:h-16 w-12 sm:w-16 text-white" />}
                title="Challenges in Somalia"
                description="Pregnant women in Somalia face significant barriers in accessing healthcare services, especially for gestational diabetes screening. Limited resources, delayed diagnoses, and a lack of public health education worsen the situation, leading to increased risks for both mothers and newborns."
                color="from-purple-500 to-purple-600"
              />
              <FeatureCard
                icon={<SolutionIcon className="h-12 sm:h-16 w-12 sm:w-16 text-white" />}
                title="How Our App Solves It"
                description="Our AI-driven application bridges the healthcare gap by offering early risk prediction for gestational diabetes. It enables early interventions, educates mothers, and empowers them to take proactive measures, significantly improving maternal and child health outcomes."
                color="from-indigo-500 to-indigo-600"
              />
              <FeatureCard
                icon={<ImpactIcon className="h-12 sm:h-16 w-12 sm:w-16 text-white" />}
                title="Lasting Impact"
                description="By facilitating early diagnosis and continuous monitoring, we aim to reduce maternal and neonatal complications. The app promotes a healthier pregnancy journey, saving lives and creating stronger future generations."
                color="from-purple-500 to-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* Understanding Gestational Diabetes */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                  <PregnantWomanIcon className="w-full h-full text-purple-600" />
                  <div
                    className="absolute inset-0 bg-purple-500/10 rounded-full animate-pulse"
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Understanding Gestational Diabetes
                </h2>
                <p className="text-gray-600 mb-3 sm:mb-4">
                  Gestational diabetes mellitus (GDM) is a type of diabetes that develops during pregnancy in women who
                  didn't have diabetes before. It affects how your cells use sugar (glucose) and causes high blood sugar
                  that can affect your pregnancy and your baby's health.
                </p>
                <p className="text-gray-600 mb-4 sm:mb-6">
                  In Somalia, approximately 10-15% of pregnant women develop gestational diabetes, yet many cases go
                  undiagnosed due to limited healthcare access. Our prediction tool uses key health indicators to
                  identify at-risk mothers early, allowing for timely intervention.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                    <h3 className="font-bold text-purple-800 mb-2">Risk Factors</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                      <li>Family history of diabetes</li>
                      <li>Previous GDM diagnosis</li>
                      <li>Overweight or obesity</li>
                      <li>Advanced maternal age</li>
                      <li>Previous delivery of a large baby</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                    <h3 className="font-bold text-indigo-800 mb-2">Our Approach</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                      <li>Early risk assessment</li>
                      <li>Personalized monitoring plans</li>
                      <li>Educational resources</li>
                      <li>Healthcare provider connections</li>
                      <li>Community support network</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
              Why{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Choose Us
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard
                icon={<SmartIcon className="h-10 sm:h-12 w-10 sm:w-12 text-white" />}
                title="Smart Predictions"
                description="Machine learning models offer accurate, early risk assessments with confidence scores and tailored insights for each user."
                color="from-purple-500 to-purple-600"
              />
              <FeatureCard
                icon={<PrivacyIcon className="h-10 sm:h-12 w-10 sm:w-12 text-white" />}
                title="Data Privacy"
                description="We prioritize full data security, ensuring sensitive health information is encrypted and shared only with consent."
                color="from-indigo-500 to-indigo-600"
              />
              <FeatureCard
                icon={<CalendarIconCustom className="h-10 sm:h-12 w-10 sm:w-12 text-white" />}
                title="Appointment Management"
                description="Schedule, track, and manage medical consultations easily, ensuring timely follow-ups and better pregnancy care."
                color="from-purple-500 to-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Ready to Take Control of Your Pregnancy Health?
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-purple-100">
              Join thousands of mothers who are using our platform to monitor their health and ensure a safer pregnancy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-purple-600 font-medium rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="px-6 sm:px-8 py-2 sm:py-3 border border-white text-white rounded-full hover:bg-white/10 transition-colors text-sm sm:text-base"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="flex items-center mb-3 sm:mb-4">
                  <LogoIcon className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                  <span className="ml-2 text-white font-bold">GDM Predict</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Empowering expectant mothers with AI-driven gestational diabetes risk assessment and management.
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/features"
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/how-it-works"
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/privacy"
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/data-policy"
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      Data Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                  <li className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    contact@gdmpredict.com
                  </li>
                  <li className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    +252 61 200 8472
                  </li>
                  <li className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Mogadishu, Somalia
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} Gestational Diabetes Prediction. All rights reserved.
              </p>
              <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-4 sm:h-5 w-4 sm:w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-4 sm:h-5 w-4 sm:w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-4 sm:h-5 w-4 sm:w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

const SidebarLink = ({ to, icon, label, sidebarOpen }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
  >
    <div className="text-gray-500">{icon}</div>
    {sidebarOpen && <span className="text-sm sm:text-base">{label}</span>}
  </Link>
)

const FeatureCard = ({ icon, title, description, color = "from-purple-500 to-indigo-600" }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
    <div
      className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}
    >
      {icon}
    </div>
    <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-900 text-center">{title}</h3>
    <p className="mt-2 sm:mt-3 text-gray-600 text-center text-sm sm:text-base">{description}</p>
  </div>
)

// Custom SVG Icons
const LogoIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
)

const ChallengeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const SolutionIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

const ImpactIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const SmartIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const PrivacyIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const CalendarIconCustom = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const PregnantWomanIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v4" />
    <path d="M9 10c0 3 1.5 6 3 8 1.5-2 3-5 3-8" />
    <path d="M7 16c0 2.5 2.5 4 5 4s5-1.5 5-4" />
    <path d="M15 10c0 0 1 0 2 2" />
    <path d="M9 10c0 0-1 0-2 2" />
  </svg>
)

// Import missing icons
const Mail = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)

const Phone = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
)

const MapPin = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const Facebook = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const Twitter = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
)

const Instagram = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

export default LandingPage