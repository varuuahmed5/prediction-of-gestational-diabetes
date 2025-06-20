import Layout from "../components/Layout"

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-lg">Last updated: May 16, 2025</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            DiabetesPred ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you use our diabetes prediction service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create an account</li>
            <li>Use our prediction tools</li>
            <li>Contact our support team</li>
            <li>Participate in surveys or promotions</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to delete your information</li>
            <li>The right to restrict processing</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            Email: privacy@diabetespred.com
            <br />
            Address: 123 Health Street, Medical District, City, Country
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default PrivacyPolicy
