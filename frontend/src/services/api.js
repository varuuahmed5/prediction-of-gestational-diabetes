import axios from "axios"

export const mlAPI = {
  // U dir Flask model inputka
  predictGDM: (data) => axios.post("http://localhost:8000/predict", data)
};

const handlePredict = async () => {
  const input = {
    Age: 30,
    BMI: 27.5,
    Glucose: 140,
    // ku dar dhammaan featureska loo baahan yahay
  };

  try {
    const response = await mlAPI.predictGDM(input);
    console.log("Prediction:", response.data);
    alert("Natiijo: " + response.data.prediction);
  } catch (error) {
    console.error("Prediction Error:", error);
    alert("Error: " + error.message);
  }
};

// Create an axios instance with the base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/"
console.log("API URL:", API_URL) // Log the API URL for debugging

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // Increase timeout to 60 seconds
  timeout: 90000,
})
axios.create({
  baseURL: API_URL,
  timeout: 30000 // 30s
})


// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`, config.data)

    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status, response.data)
    return response
  },
  (error) => {
    // Create a more user-friendly error object
    const apiError = {
      type: "API_ERROR",
      status: error.response?.status,
      message: "An error occurred",
      data: error.response?.data,
      originalError: error,
    }

    // Handle different types of errors
    if (error.code === "ECONNABORTED") {
      apiError.message = "Request timeout - server took too long to respond"
      console.error("Timeout error:", error.message, "URL:", error.config?.url)
    } else if (error.response) {
      // The server responded with a status code outside the 2xx range
      apiError.message = error.response.data?.message || `Error: ${error.response.status}`
      console.error("Response error:", error.response.status, error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      apiError.message = "No response from server"
      console.error("No response error:", error.request)
    } else {
      // Something happened in setting up the request
      apiError.message = error.message
      console.error("Request setup error:", error.message)
    }

    console.error("API Error:", apiError)

    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(apiError)
  },
)

// Function to set the auth token for subsequent requests
api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/update-profile", userData),
  changePassword: (passwordData) => api.post("/auth/change-password", passwordData),
}


// Prediction API calls
export const predictionAPI = {
  createPrediction: (data) => api.post("/predictions", data),
  getPredictions: () => api.get("/predictions"),
  getPrediction: (id) => api.get(`/predictions/${id}`),
  updatePrediction: (id, data) => api.put(`/predictions/${id}`, data),
  deletePrediction: (id) => api.delete(`/predictions/${id}`),
}

// Appointment API calls
export const appointmentAPI = {
  createAppointment: (data) => api.post("/appointments", data),
  getAppointments: () => api.get("/appointments"),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
}

// Notification API calls
export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
}

// Report API calls
export const reportAPI = {
  getSavedReports: () => {
    console.log("📥 Fetching all saved reports...");
    return api.get("/reports");
  },
  getSavedReport: (id) => {
    console.log(`📥 Fetching report with ID: ${id}`);
    return api.get(`/reports/${id}`);
  },
  saveReport: (data) => api.post("/reports", data),
  updateSavedReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteSavedReport: (id) => api.delete(`/reports/${id}`),
};
export const predictUtils = {
  handlePredict
};


// Admin API calls
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllPredictions: () => api.get("/admin/predictions"),
  getAllAppointments: () => api.get("/admin/appointments"),
  getSystemStats: () => api.get("/admin/stats"),
  updateSystemSettings: (data) => api.put("/admin/settings", data),
  generateReport: (filters) => api.post("/admin/reports/generate", filters),
}

export default api
