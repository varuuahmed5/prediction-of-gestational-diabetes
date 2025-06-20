import Layout from "../components/Layout"
import { Link } from "react-router-dom"
import { HelpCircle, FileText, MessageCircle, Mail } from "react-feather"

const Support = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Support Center</h1>
          <p className="mt-4 text-lg text-gray-500">Find answers to your questions and get the help you need.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-4">Find answers to common questions about our service.</p>
            <Link
              to="/faq"
              className="mt-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              View FAQs
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">User Guides</h2>
            <p className="text-gray-600 mb-4">Step-by-step guides to help you use our platform effectively.</p>
            <Link
              to="/how-it-works"
              className="mt-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              View Guides
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Contact Support</h2>
            <p className="text-gray-600 mb-4">Need more help? Our support team is ready to assist you.</p>
            <Link
              to="/contact"
              className="mt-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Common Support Topics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Account Management</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    How to create an account
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Resetting your password
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Updating your profile information
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Managing email notifications
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Using the Prediction Tool</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    How to enter health data
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Understanding your risk score
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Saving and sharing your results
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Tracking changes over time
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Appointments</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Scheduling a consultation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Rescheduling or canceling
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Preparing for your appointment
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Following up after consultation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Technical Issues</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Troubleshooting login problems
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Browser compatibility
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Mobile app issues
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Data synchronization
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Still need help?</h2>
            <p className="text-gray-600">Our support team is available Monday through Friday, 9am to 6pm.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Support
