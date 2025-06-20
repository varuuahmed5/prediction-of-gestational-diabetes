import { Link } from "react-router-dom"
import { ChevronRight } from "react-feather"

const HowItWorks = () => {
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
                  className="border-blue-500 text-gray-900 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
              How It Works
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-200">
              Learn how our platform helps you predict and prevent diabetes risk in just a few simple steps.
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <ol className="relative border-l border-gray-200 ml-6">
              {/* Step 1 */}
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">1</span>
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Create Your Account</h3>
                <p className="mb-4 text-base font-normal text-gray-500">
                  Sign up for a free account to get started. We'll ask for some basic information to set up your
                  profile.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Register now
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </li>

              {/* Step 2 */}
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">2</span>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">Complete Health Assessment</h3>
                <p className="mb-4 text-base font-normal text-gray-500">
                  Answer questions about your health, lifestyle, and family history to help our AI analyze your diabetes
                  risk factors.
                </p>
              </li>

              {/* Step 3 */}
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">3</span>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">Get Your Risk Assessment</h3>
                <p className="mb-4 text-base font-normal text-gray-500">
                  Our AI analyzes your data and provides a comprehensive risk assessment with detailed insights about
                  your diabetes risk factors.
                </p>
              </li>

              {/* Step 4 */}
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">4</span>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">Follow Personalized Recommendations</h3>
                <p className="mb-4 text-base font-normal text-gray-500">
                  Receive tailored recommendations and action plans to help you reduce your risk and improve your health
                  outcomes.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* How the AI Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How Our AI Technology Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Our advanced machine learning algorithms are trained on extensive medical datasets to provide accurate
              predictions.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Data Collection</h3>
              <p className="mt-2 text-gray-500">
                We collect relevant health data through our comprehensive assessment questionnaire, focusing on known
                diabetes risk factors.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Risk Analysis</h3>
              <p className="mt-2 text-gray-500">
                Our AI model analyzes your data against established medical guidelines and patterns identified in
                large-scale health studies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Personalized Insights</h3>
              <p className="mt-2 text-gray-500">
                The system generates personalized risk scores and recommendations based on your unique health profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to take control of your health?</span>
            <span className="block text-blue-200">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
                <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </div>
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

export default HowItWorks
