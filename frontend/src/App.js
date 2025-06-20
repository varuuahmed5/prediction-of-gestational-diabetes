import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import LandingPage from "./pages/LandingPage";
import Features from "./pages/Features";
import FeatureDetails from "./pages/FeatureDetails";
import HowItWorks from "./pages/HowItWorks";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MedicalDisclaimer from "./pages/MedicalDisclaimer";
import DataPolicy from "./pages/DataPolicy";
import ContactUs from "./pages/ContactUs";
import Support from "./pages/Support";

// Protected pages
import Dashboard from "./pages/Dashboard";
import PredictionForm from "./pages/PredictionForm";
import PredictionResult from "./pages/PredictionResult";
import PredictionHistory from "./pages/PredictionHistory";
import PredictionDetails from "./pages/PredictionDetails";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import AppointmentForm from "./pages/AppointmentForm";
import AppointmentDetails from "./pages/AppointmentDetails";
import Notifications from "./pages/Notifications";
import SavedReports from "./pages/savedReports";
import ReportDetail from "./pages/ReportDetail";
import ReportEdit from "./pages/ReportEdit";

// Admin pages
import AdminProfile from "./pages/admin/AdminProfile";
import UserManagement from "./pages/admin/UserManagement";
import PredictionManagement from "./pages/admin/PredictionManagement";
import AppointmentManagement from "./pages/admin/AppointmentManagement";
import ReportGenerator from "./pages/admin/ReportGenerator";
import SystemSettings from "./pages/admin/SystemSettings";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

// Layout components
import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<Features />} />
              <Route path="/feature-details/:featureId" element={<FeatureDetails />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/disclaimer" element={<MedicalDisclaimer />} />
              <Route path="/data-policy" element={<DataPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/support" element={<Support />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <Dashboard />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prediction/new"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <PredictionForm />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prediction/result/:id"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <PredictionResult />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prediction/history"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <PredictionHistory />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prediction/:id"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <PredictionDetails />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <Profile />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <Appointments />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment/new"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <AppointmentForm />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment/:id"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <AppointmentDetails />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <Notifications />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <SavedReports />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/:id"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <ReportDetail />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/edit/:id"
                element={
                  <ProtectedRoute>
                    <UserLayout>
                      <ReportEdit />
                    </UserLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" />}
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <AdminDashboardPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <AdminProfile />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <UserManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/predictions"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <PredictionManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <AppointmentManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <ReportGenerator />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <SystemSettings />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={5000} />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;