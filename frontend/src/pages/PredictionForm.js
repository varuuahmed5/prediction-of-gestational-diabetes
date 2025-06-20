"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { predictionAPI } from "../services/api"
import { toast } from "react-toastify"

const PredictionForm = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  
  // Validation schema
  const validationSchema = Yup.object({
    pregnancies: Yup.number().required("Required").min(0, "Must be at least 0").max(20, "Must be at most 20"),
    glucose: Yup.number().required("Required").min(0, "Must be at least 0").max(300, "Must be at most 300"),
    bloodPressure: Yup.number().required("Required").min(0, "Must be at least 0").max(200, "Must be at most 200"),
    skinThickness: Yup.number().required("Required").min(0, "Must be at least 0").max(100, "Must be at most 100"),
    insulin: Yup.number().required("Required").min(0, "Must be at least 0").max(1000, "Must be at most 1000"),
    bmi: Yup.number().required("Required").min(10, "Must be at least 10").max(70, "Must be at most 70"),
    diabetesPedigreeFunction: Yup.number()
      .required("Required")
      .min(0, "Must be at least 0")
      .max(3, "Must be at most 3"),
    age: Yup.number().required("Required").min(18, "Must be at least 18").max(120, "Must be at most 120"),
  })

  // Formik setup
  const formik = useFormik({
    initialValues: {
      pregnancies: "",
      glucose: "",
      bloodPressure: "",
      skinThickness: "",
      insulin: "",
      bmi: "",
      diabetesPedigreeFunction: "",
      age: "",
    },
    validationSchema,
    onSubmit: async (values) => {
  try {
    setLoading(true)
    const token = localStorage.getItem("token") // ✅ JWT token

    const response = await fetch("http://localhost:5001/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ ku dar token-ka
      },
      body: JSON.stringify({
        patientData: {
          pregnancies: values.pregnancies,
          glucoseLevel: values.glucose,
          bloodPressure: {
            systolic: 120,
            diastolic: values.bloodPressure,
          },
          skinThickness: values.skinThickness,
          insulinLevel: values.insulin,
          bmi: values.bmi,
          diabetesPedigreeFunction: values.diabetesPedigreeFunction,
          age: values.age,
          gender: "female",
          physicalActivity: "moderate",
          smokingStatus: "never",
          alcoholConsumption: "light",
        },
      }),
    })

    if (!response.ok) throw new Error("Failed to create prediction")
    const result = await response.json()

    toast.success("Prediction created successfully!")
    navigate(`/prediction/result/${result.data.prediction._id}`)
  } catch (error) {
    console.error("Prediction error:", error)
    toast.error(error.message || "Failed to create prediction")
  } finally {
    setLoading(false)
  }
}

  })
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Diabetes Prediction Form</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pregnancies */}
            <div>
              <label htmlFor="pregnancies" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Pregnancies
              </label>
              <input
                id="pregnancies"
                name="pregnancies"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pregnancies}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.pregnancies && formik.errors.pregnancies ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.pregnancies && formik.errors.pregnancies && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.pregnancies}</div>
              )}
            </div>

            {/* Glucose */}
            <div>
              <label htmlFor="glucose" className="block text-sm font-medium text-gray-700 mb-1">
                Glucose Level (mg/dL)
              </label>
              <input
                id="glucose"
                name="glucose"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.glucose}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.glucose && formik.errors.glucose ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.glucose && formik.errors.glucose && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.glucose}</div>
              )}
            </div>

            {/* Blood Pressure */}
            <div>
              <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure (mm Hg)
              </label>
              <input
                id="bloodPressure"
                name="bloodPressure"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bloodPressure}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.bloodPressure && formik.errors.bloodPressure ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.bloodPressure && formik.errors.bloodPressure && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.bloodPressure}</div>
              )}
            </div>

            {/* Skin Thickness */}
            <div>
              <label htmlFor="skinThickness" className="block text-sm font-medium text-gray-700 mb-1">
                Skin Thickness (mm)
              </label>
              <input
                id="skinThickness"
                name="skinThickness"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.skinThickness}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.skinThickness && formik.errors.skinThickness ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.skinThickness && formik.errors.skinThickness && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.skinThickness}</div>
              )}
            </div>

            {/* Insulin */}
            <div>
              <label htmlFor="insulin" className="block text-sm font-medium text-gray-700 mb-1">
                Insulin Level (μU/ml)
              </label>
              <input
                id="insulin"
                name="insulin"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.insulin}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.insulin && formik.errors.insulin ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.insulin && formik.errors.insulin && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.insulin}</div>
              )}
            </div>

            {/* BMI */}
            <div>
              <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">
                BMI (kg/m²)
              </label>
              <input
                id="bmi"
                name="bmi"
                type="number"
                step="0.1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bmi}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.bmi && formik.errors.bmi ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.bmi && formik.errors.bmi && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.bmi}</div>
              )}
            </div>

            {/* Diabetes Pedigree Function */}
            <div>
              <label htmlFor="diabetesPedigreeFunction" className="block text-sm font-medium text-gray-700 mb-1">
                Diabetes Pedigree Function
              </label>
              <input
                id="diabetesPedigreeFunction"
                name="diabetesPedigreeFunction"
                type="number"
                step="0.001"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.diabetesPedigreeFunction}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.diabetesPedigreeFunction && formik.errors.diabetesPedigreeFunction
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.diabetesPedigreeFunction && formik.errors.diabetesPedigreeFunction && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.diabetesPedigreeFunction}</div>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age (years)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.age}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.age && formik.errors.age ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.age && formik.errors.age && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit for Prediction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PredictionForm
