import Layout from "../components/Layout"

const MedicalDisclaimer = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Medical Disclaimer</h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-lg">Last updated: May 16, 2025</p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-700">
              <strong>IMPORTANT:</strong> The information provided by DiabetesPred is not a substitute for professional
              medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified
              health provider with any questions you may have regarding a medical condition.
            </p>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Not Medical Advice</h2>
          <p>
            The content provided through our service is for informational purposes only. It is not intended to be a
            substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your
            physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. No Doctor-Patient Relationship</h2>
          <p>
            Using our service does not create a doctor-patient relationship. Our AI-powered predictions and
            recommendations should be discussed with your healthcare provider before making any medical decisions.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Emergency Situations</h2>
          <p>
            Do not use our service for emergency medical needs. If you have a medical emergency, call your doctor or
            emergency services immediately.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no representations or warranties of
            any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of
            our service or the information contained on our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Risk Assessment</h2>
          <p>
            Our diabetes risk assessment tools provide estimates based on statistical models and available data.
            Individual results may vary, and the predictions should not be considered definitive diagnoses.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p>If you have any questions about this Medical Disclaimer, please contact us at:</p>
          <p>
            Email: medical@diabetespred.com
            <br />
            Address: 123 Health Street, Medical District, City, Country
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default MedicalDisclaimer
