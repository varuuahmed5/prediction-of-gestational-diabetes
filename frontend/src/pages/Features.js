"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Activity, Shield, Users, Calendar, Target, ArrowRight } from "react-feather"

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(null)

  const features = [
    {
      id: "ai-predictions",
      icon: <Activity className="h-8 w-8 text-white" />,
      title: "AI-Powered Predictions",
      description:
        "Our advanced machine learning algorithms analyze your health data to provide accurate diabetes risk assessments.",
      details:
        "Our AI system uses multiple data points including blood glucose levels, BMI, family history, and lifestyle factors to calculate your risk score. The algorithm has been trained on extensive medical datasets and validated by healthcare professionals to ensure accuracy and reliability.",
    },
    {
      id: "secure-tracking",
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Secure Health Tracking",
      description:
        "Securely store and track your health metrics over time, with end-to-end encryption and privacy controls.",
      details:
        "Your health data is protected with industry-standard encryption both in transit and at rest. We implement strict access controls and regular security audits to ensure your information remains private. You have complete control over who can access your data and can revoke access at any time.",
    },
    {
      id: "healthcare-access",
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Healthcare Professional Access",
      description: "Share your health data with healthcare providers for better coordinated care and expert advice.",
      details:
        "Easily generate shareable reports for your healthcare providers. With your permission, doctors can access your health trends and prediction results to provide more informed care. This seamless integration helps bridge the gap between self-monitoring and professional healthcare.",
    },
    {
      id: "appointment-scheduling",
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Appointment Scheduling",
      description: "Easily schedule appointments with healthcare providers directly through our platform.",
      details:
        "Our integrated scheduling system connects with healthcare providers' calendars to show real-time availability. Book, reschedule, or cancel appointments with just a few clicks. Receive automated reminders to ensure you never miss an important healthcare visit.",
    },
    {
      id: "personalized-recommendations",
      icon: <Target className="h-8 w-8 text-white" />,
      title: "Personalized Recommendations",
      description: "Receive tailored lifestyle and health recommendations based on your risk profile and health data.",
      details:
        "Based on your unique health profile, our system generates personalized recommendations for diet, exercise, and lifestyle changes. These evidence-based suggestions are designed to help you reduce your diabetes risk and improve overall health outcomes.",
    },
  ]

  const handleFeatureClick = (id) => {
    setActiveFeature(id === activeFeature ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                  DiabetesPred
                </span>
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to="/features"
                  className="border-blue-500 text-gray-900 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/how-it-works"
                  className="border-transparent text-gray-500 hover:text-gray-900 hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  How it works
                </Link>
                <Link
                  to="/testimonials"
                  className="border-transparent text-gray-500 hover:text-gray-900 hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  to="/faq"
                  className="border-transparent text-gray-500 hover:text-gray-900 hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  FAQ
                </Link>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Everything you need to</span>
              <span className="block text-blue-600">monitor your health</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Our comprehensive platform provides tools and insights to help you understand and manage your diabetes
              risk.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Key Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 ${activeFeature === feature.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="ml-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-500">{feature.description}</p>

                  {/* Expandable content */}
                  <div
                    className={`mt-4 overflow-hidden transition-all duration-300 ${activeFeature === feature.id ? "max-h-96" : "max-h-0"}`}
                  >
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-600">{feature.details}</p>
                      <div className="mt-4">
                        <Link
                          to={`/feature-details/${feature.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          Learn more
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience these features?</span>
            <span className="block text-blue-100">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Get started
                <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-gray-500 hover:text-gray-900 transition-colors">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features" className="text-base text-gray-500 hover:text-gray-900 transition-colors">
                Features
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900 transition-colors">
                Privacy
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900 transition-colors">
                Terms
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">&copy; 2023 DiabetesPred. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Features
