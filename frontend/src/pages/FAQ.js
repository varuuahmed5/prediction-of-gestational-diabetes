"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronUp } from "react-feather"

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "What is DiabetesPred?",
      answer:
        "DiabetesPred is an AI-powered platform that helps users assess their risk of developing diabetes. Our system uses advanced machine learning algorithms to analyze health data and provide personalized risk assessments and recommendations.",
    },
    {
      question: "How accurate are the predictions?",
      answer:
        "Our prediction model is trained on extensive medical datasets and has been validated against established clinical guidelines. While no prediction system is 100% accurate, our platform provides a reliable assessment of your diabetes risk based on the information you provide.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security and privacy very seriously. All your personal and health information is encrypted and stored securely. We comply with relevant data protection regulations and never share your data with third parties without your explicit consent.",
    },
    {
      question: "Do I need to provide medical test results?",
      answer:
        "No, our initial assessment is based on information you can provide without medical tests, such as your age, family history, lifestyle factors, and any symptoms you may be experiencing. However, for more accurate predictions, you can optionally input medical test results if you have them.",
    },
    {
      question: "How often should I update my assessment?",
      answer:
        "We recommend updating your assessment every 3-6 months, or whenever there are significant changes in your health or lifestyle. Regular updates help track changes in your risk profile over time and allow you to see the impact of any lifestyle modifications.",
    },
    {
      question: "Can DiabetesPred replace medical advice?",
      answer:
        "No, DiabetesPred is designed to be a supportive tool and should not replace professional medical advice. If you have concerns about your health or diabetes risk, we always recommend consulting with a healthcare professional.",
    },
    {
      question: "Is there a cost to use DiabetesPred?",
      answer:
        "We offer both free and premium subscription options. The basic risk assessment is free, while our premium subscription provides more detailed insights, personalized recommendations, and continuous monitoring features.",
    },
  ]

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">DiabetesPred</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/features"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Features
                </Link>
                <Link
                  to="/how-it-works"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  How it works
                </Link>
                <Link
                  to="/testimonials"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Testimonials
                </Link>
                <Link
                  to="/faq"
                  className="border-blue-500 text-gray-900 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  FAQ
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Log in
              </Link>
              <Link
                to="/register"
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-200">
              Find answers to common questions about DiabetesPred and how it can help you manage your health.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="pt-6">
                <button
                  className="text-left w-full flex justify-between items-start text-gray-900"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span className="ml-6 h-7 flex items-center">
                    {openIndex === index ? (
                      <ChevronUp className="h-6 w-6 text-blue-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-blue-500" />
                    )}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-2 pr-12">
                    <p className="text-base text-gray-500">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Still have questions?</h2>
            <p className="mt-4 text-gray-500">
              If you couldn't find the answer to your question, feel free to contact our support team.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features" className="text-base text-gray-500 hover:text-gray-900">
                Features
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                Terms
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
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

export default FAQ
