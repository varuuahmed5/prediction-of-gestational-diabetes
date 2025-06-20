"use client"

import { Link } from "react-router-dom"
import { Activity, ChevronUp, ChevronDown } from "react-feather"
import { useState } from "react"

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleFooter = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Collapse/Expand Button */}
      <div className="flex justify-center border-b border-gray-200">
        <button
          onClick={toggleFooter}
          className="flex items-center justify-center p-2 w-full text-gray-500 hover:text-blue-600 focus:outline-none"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse footer" : "Expand footer"}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-5 w-5" />
              <span className="ml-2 text-sm">Collapse</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5" />
              <span className="ml-2 text-sm">Expand</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Content - Collapsible */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <Link to="/" className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">DiabetesPred</span>
              </Link>
              <p className="mt-4 text-base text-gray-500">
                Taking control of your health with advanced AI-powered diabetes risk prediction.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">NAVIGATION</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-base text-gray-500 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-base text-gray-500 hover:text-gray-900">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link to="/testimonials" className="text-base text-gray-500 hover:text-gray-900">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-base text-gray-500 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">LEGAL</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="text-base text-gray-500 hover:text-gray-900">
                    Medical Disclaimer
                  </Link>
                </li>
                <li>
                  <Link to="/data-policy" className="text-base text-gray-500 hover:text-gray-900">
                    Data Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">CONTACT</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-base text-gray-500 hover:text-gray-900">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright - Always visible */}
      <div className="border-t border-gray-200 py-4">
        <p className="text-base text-gray-400 text-center">
          &copy; {new Date().getFullYear()} DiabetesPred. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
