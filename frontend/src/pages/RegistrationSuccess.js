import { Link } from "react-router-dom"
import { CheckCircle, Mail } from "react-feather"

const RegistrationSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Registration Successful!
        </h2>
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for registering with our Diabetes Prediction System.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-500 mr-2" />
            <p className="text-gray-700 dark:text-gray-300">We've sent a verification email to your inbox.</p>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Please check your email and click on the verification link to activate your account.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Didn't receive the email? Check your spam folder or{" "}
            <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400">click here to resend</button>.
          </p>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationSuccess
