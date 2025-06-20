// frontend/services/adminAPI.js
import axios from "axios"

const adminAPI = {
  getAdminProfile: () => axios.get("/api/admin/profile"),
  updateAdminProfile: (data) => axios.put("/api/admin/profile", data),
  getAdminReports: () => axios.get("/api/admin/reports"),
  saveAdminReport: (data) => axios.post("/api/admin/reports", data),
  downloadAdminReport: (id) =>
    axios.get(`/api/admin/reports/${id}/download`, { responseType: "blob" }),
}

export default adminAPI
