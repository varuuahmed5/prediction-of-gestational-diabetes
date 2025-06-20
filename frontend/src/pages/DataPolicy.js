import Layout from "../components/Layout"

const DataPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Policy</h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-lg">Last updated: May 16, 2025</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Data Collection</h2>
          <p>DiabetesPred collects various types of data to provide our diabetes prediction services. This includes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal information (name, email, age, gender)</li>
            <li>Health data (glucose levels, blood pressure, BMI, etc.)</li>
            <li>Usage data (how you interact with our platform)</li>
            <li>Device information (browser type, operating system, etc.)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Data Storage</h2>
          <p>
            All data is stored securely in encrypted databases. We implement industry-standard security measures to
            protect your information from unauthorized access, alteration, or disclosure.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Usage</h2>
          <p>We use your data for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing and improving our diabetes prediction services</li>
            <li>Personalizing your experience on our platform</li>
            <li>Conducting research to improve our prediction algorithms</li>
            <li>Communicating with you about your account and our services</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share your data with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service providers who help us operate our platform</li>
            <li>Healthcare providers (with your explicit consent)</li>
            <li>Research partners (in anonymized or aggregated form)</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as needed to provide you with our services. You
            can request deletion of your data at any time through your account settings or by contacting us.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Data Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your data, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>The right to access your data</li>
            <li>The right to correct inaccurate data</li>
            <li>The right to delete your data</li>
            <li>The right to restrict processing</li>
            <li>The right to data portability</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Data Protection Officer</h2>
          <p>If you have any questions about our data practices, you can contact our Data Protection Officer at:</p>
          <p>
            Email: dpo@diabetespred.com
            <br />
            Address: 123 Health Street, Medical District, City, Country
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
          <p>
            We may update this Data Policy from time to time. We will notify you of any significant changes by email or
            through our platform.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default DataPolicy
