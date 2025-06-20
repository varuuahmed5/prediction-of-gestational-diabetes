import { Link } from "react-router-dom"
import { Star } from "react-feather"

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "User for 8 months",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "This platform helped me understand my diabetes risk factors and take action before it was too late. The personalized recommendations were invaluable.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "User for 1 month",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "The continuous monitoring feature keeps me accountable and motivated. I've seen significant improvements in my health metrics since I started using DiabetesPred.",
      rating: 5,
    },
    {
      name: "Amina Hassan",
      role: "User for 2 months",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "As someone with a family history of diabetes, this tool gives me peace of mind. The AI predictions are accurate and the interface is easy to use.",
      rating: 4,
    },
    {
      name: "Robert Garcia",
      role: "User for 3 months",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "I was skeptical at first, but the insights I've gained about my health have been eye-opening. The recommendations are practical and easy to implement.",
      rating: 5,
    },
    {
      name: "Jennifer Lee",
      role: "User for 1 months",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "DiabetesPred has become an essential part of my health management routine. The ability to track changes over time is particularly helpful.",
      rating: 5,
    },
    {
      name: "David Okafor",
      role: "User for 4 months",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "The platform is intuitive and the predictions align with what my doctor has told me. It's like having a health coach in my pocket.",
      rating: 4,
    },
  ]

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
                  className="border-blue-500 text-gray-900 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
              What Our Users Say
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-200">
              Hear from people who have used DiabetesPred to take control of their health.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <img
                    className="h-12 w-12 rounded-full mr-4"
                    src={testimonial.image || "/placeholder.svg"}
                    alt={`${testimonial.name}'s profile`}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to join our satisfied users?</span>
            <span className="block text-blue-200">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
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

export default Testimonials
