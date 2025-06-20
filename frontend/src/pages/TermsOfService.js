import Layout from "../components/Layout"

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-lg">Last updated: May 16, 2025</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using DiabetesPred services, you agree to be bound by these Terms of Service. If you do not
            agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            DiabetesPred provides a platform for diabetes risk assessment and prediction using artificial intelligence.
            Our services are intended for informational purposes only and should not replace professional medical
            advice.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            To access certain features of our service, you may need to create an account. You are responsible for
            maintaining the confidentiality of your account information and for all activities that occur under your
            account.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use our service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to any part of our service</li>
            <li>Interfere with the proper functioning of the service</li>
            <li>Share your account credentials with others</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our service are owned by DiabetesPred and are protected by
            copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            DiabetesPred shall not be liable for any indirect, incidental, special, consequential, or punitive damages
            resulting from your use of or inability to use the service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
          <p>
            We may modify these Terms of Service at any time. It is your responsibility to review these terms
            periodically for changes.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <p>
            Email: legal@diabetespred.com
            <br />
            Address: 123 Health Street, Medical District, City, Country
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default TermsOfService
