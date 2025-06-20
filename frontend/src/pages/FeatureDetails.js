"use client"

import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Activity, Shield, Users, Calendar, Target } from "react-feather"

const FeatureDetails = () => {
  const { featureId } = useParams()

  // Feature data
  const features = {
    "ai-predictions": {
      icon: <Activity className="h-12 w-12" />,
      title: "AI-Powered Predictions",
      description:
        "Our advanced machine learning algorithms analyze your health data to provide accurate diabetes risk assessments.",
      content: [
        {
          heading: "How Our AI Works",
          text: "Our AI system uses multiple data points including blood glucose levels, BMI, family history, and lifestyle factors to calculate your risk score. The algorithm has been trained on extensive medical datasets and validated by healthcare professionals to ensure accuracy and reliability.",
        },
        {
          heading: "Continuous Learning",
          text: "Our AI models continuously improve as they process more data. This means predictions become more accurate over time, while always maintaining strict privacy controls.",
        },
        {
          heading: "Personalized Risk Factors",
          text: "The system identifies which factors contribute most to your personal risk, allowing you to focus on the most impactful lifestyle changes.",
        },
      ],
    },
    "secure-tracking": {
      icon: <Shield className="h-12 w-12" />,
      title: "Secure Health Tracking",
      description:
        "Securely store and track your health metrics over time, with end-to-end encryption and privacy controls.",
      content: [
        {
          heading: "End-to-End Encryption",
          text: "Your health data is protected with industry-standard encryption both in transit and at rest. We implement strict access controls and regular security audits to ensure your information remains private.",
        },
        {
          heading: "User Control",
          text: "You have complete control over who can access your data and can revoke access at any time. Our platform puts you in charge of your health information.",
        },
        {
          heading: "Compliance Standards",
          text: "We adhere to international data protection regulations and healthcare privacy standards to ensure your data is handled with the utmost care.",
        },
      ],
    },
    "healthcare-access": {
      icon: <Users className="h-12 w-12" />,
      title: "Healthcare Professional Access",
      description: "Share your health data with healthcare providers for better coordinated care and expert advice.",
      content: [
        {
          heading: "Seamless Sharing",
          text: "Easily generate shareable reports for your healthcare providers. With your permission, doctors can access your health trends and prediction results to provide more informed care.",
        },
        {
          heading: "Integrated Care",
          text: "This seamless integration helps bridge the gap between self-monitoring and professional healthcare, ensuring continuity of care.",
        },
        {
          heading: "Secure Provider Portal",
          text: "Healthcare providers access your data through a secure portal that maintains all privacy protections while providing them with the insights they need.",
        },
      ],
    },
    "appointment-scheduling": {
      icon: <Calendar className="h-12 w-12" />,
      title: "Appointment Scheduling",
      description: "Easily schedule appointments with healthcare providers directly through our platform.",
      content: [
        {
          heading: "Real-Time Availability",
          text: "Our integrated scheduling system connects with healthcare providers' calendars to show real-time availability. Book, reschedule, or cancel appointments with just a few clicks.",
        },
        {
          heading: "Automated Reminders",
          text: "Receive automated reminders to ensure you never miss an important healthcare visit. Choose to receive notifications via email, SMS, or push notifications.",
        },
        {
          heading: "Follow-Up Management",
          text: "The system helps track follow-up appointments and regular check-ups, ensuring you maintain consistent healthcare monitoring.",
        },
      ],
    },
    "personalized-recommendations": {
      icon: <Target className="h-12 w-12" />,
      title: "Personalized Recommendations",
      description: "Receive tailored lifestyle and health recommendations based on your risk profile and health data.",
      content: [
        {
          heading: "Evidence-Based Suggestions",
          text: "Based on your unique health profile, our system generates personalized recommendations for diet, exercise, and lifestyle changes. These evidence-based suggestions are designed to help you reduce your diabetes risk.",
        },
        {
          heading: "Adaptive Guidance",
          text: "As your health data changes over time, so do your recommendations. Our system adapts to your progress and adjusts suggestions accordingly.",
        },
        {
          heading: "Expert-Reviewed Content",
          text: "All recommendations are developed in consultation with healthcare professionals and based on the latest medical research and guidelines.",
        },
      ],
    },
  }

  const feature = features[featureId]

  if (!feature) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Feature not found</h2>
          <p className="mt-2 text-gray-600">The feature you're looking for doesn't exist.</p>
          <Link to="/features" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to features
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
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

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/features" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all features
        </Link>
      </div>

      {/* Feature Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 h-24 w-24 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
            {feature.icon}
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <h1 className="text-3xl font-bold text-gray-900">{feature.title}</h1>
            <p className="mt-2 text-xl text-gray-600">{feature.description}</p>
          </div>
        </div>
      </div>

      {/* Feature Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-custom rounded-lg overflow-hidden">
          <div className="p-8">
            {feature.content.map((section, index) => (
              <div key={index} className={index > 0 ? "mt-12" : ""}>
                <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
                <p className="mt-4 text-lg text-gray-600">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 mt-12">
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

export default FeatureDetails
