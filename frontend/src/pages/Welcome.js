"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, ArrowRight, FileText, Activity, Calendar } from "react-feather"

const Welcome = () => {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Get registration data from localStorage
    const registeredUser = localStorage.getItem("registeredUser")
    if (registeredUser) {
      setUserData(JSON.parse(registeredUser))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to DiabetesPred</h1>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Registration Successful!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {userData ? (
                      <>
                        Welcome, <span className="font-semibold">{userData.name}</span>!
                      </>
                    ) : (
                      <>Welcome to your new account!</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Next Steps</h2>
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li>
                  <Link to="/login" className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                          <ArrowRight className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Log in to your account</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Use your email and password to access your dashboard
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Learn how it works</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Understand how our diabetes prediction system helps you
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/prediction/new" className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                          <Activity className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Make your first prediction
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Enter your health data to get a diabetes risk assessment
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/appointment/new" className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-100 rounded-md p-2">
                          <Calendar className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule an appointment</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Book a consultation with a healthcare professional
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Features overview */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">What You Can Do</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Diabetes Prediction</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get accurate risk assessments using our AI-powered prediction model
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appointment Scheduling</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Book appointments with healthcare professionals
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Health Reports</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Save and manage your health reports and predictions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-blue-600 dark:bg-blue-700 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <div className="text-center">
                <h3 className="text-2xl leading-8 font-extrabold text-white">Ready to get started?</h3>
                <p className="mt-2 text-lg leading-6 text-blue-200">
                  Log in now to access all features of our diabetes prediction platform.
                </p>
                <div className="mt-8">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                  >
                    Log in now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Welcome
