"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Activity, FileText, Calendar, AlertTriangle, TrendingUp, Users, Bell } from "react-feather"
import { useAuth } from "../contexts/AuthContext"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    predictions: 0,
    appointments: 0,
    highRiskPredictions: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  // Console log to check which dashboard is loading
  console.log("USER DASHBOARD LOADING - User:", user)
  console.log("USER DASHBOARD - User role:", user?.role)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Mock data for patient dashboard
        setTimeout(() => {
          setStats({
            predictions: 12,
            appointments: 3,
            highRiskPredictions: 2,
            recentActivity: [
              { id: 1, type: "prediction", date: "2025-04-15", result: "Low Risk" },
              { id: 2, type: "appointment", date: "2025-04-10", doctor: "Dr. Smith" },
              { id: 3, type: "prediction", date: "2025-04-05", result: "High Risk" },
              { id: 4, type: "appointment", date: "2025-05-28", doctor: "Dr. Johnson" },
            ],
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Show clear indication this is PATIENT dashboard
  return (
    <div className="min-h-screen bg-blue-50 px-4 py-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">🏥 PATIENT DASHBOARD</h1>
              <p className="text-blue-600">Welcome back, {user?.name || "Patient"}!</p>
              <p className="text-sm text-gray-500">Role: {user?.role || "patient"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Dashboard Type</p>
              <p className="text-lg font-semibold text-blue-600">Patient Portal</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Patient Statistics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <PatientStatCard
                icon={<FileText size={24} />}
                title="My Predictions"
                value={stats.predictions}
                link="/prediction/history"
                color="blue"
                description="Total diabetes predictions"
              />
              <PatientStatCard
                icon={<Calendar size={24} />}
                title="My Appointments"
                value={stats.appointments}
                link="/appointments"
                color="green"
                description="Upcoming appointments"
              />
              <PatientStatCard
                icon={<AlertTriangle size={24} />}
                title="High Risk Alerts"
                value={stats.highRiskPredictions}
                link="/prediction/history"
                color="red"
                description="Requires attention"
              />
            </section>

            {/* Patient Quick Actions */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">🚀 Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PatientQuickAction icon={<Activity />} label="New Diabetes Check" to="/prediction/new" color="blue" />
                <PatientQuickAction icon={<Calendar />} label="Book Appointment" to="/appointment/new" color="green" />
                <PatientQuickAction icon={<FileText />} label="View My Reports" to="/reports" color="purple" />
              </div>
            </section>

            {/* Patient Recent Activity */}
            <section className="bg-white rounded-xl shadow-lg">
              <div className="border-b px-6 py-4">
                <h2 className="text-xl font-semibold text-blue-800">📋 My Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {stats.recentActivity.length ? (
                  stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="px-6 py-4 flex items-start space-x-4">
                      <div className="text-blue-600 mt-1">
                        {activity.type === "prediction" ? <Activity size={20} /> : <Calendar size={20} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {activity.type === "prediction"
                            ? `Diabetes Check Result: ${activity.result}`
                            : `Appointment with ${activity.doctor}`}
                        </p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500">No recent activity</div>
                )}
              </div>
              <div className="px-6 py-4 border-t">
                <Link to="/prediction/history" className="text-sm text-blue-600 hover:text-blue-800 transition">
                  View all my activity &rarr;
                </Link>
              </div>
            </section>

            {/* Patient Health Insights */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-blue-800">💡 My Health Insights</h2>
                  <TrendingUp className="text-blue-600" />
                </div>
                <p className="text-gray-600 mb-4">Based on your recent diabetes checks:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <p className="text-gray-700">Your glucose levels are stable</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">⚠</div>
                    <p className="text-gray-700">Consider increasing physical activity</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-blue-500 mr-2">ℹ</div>
                    <p className="text-gray-700">Schedule your next check-up</p>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-blue-800">🤝 Support & Community</h2>
                  <Users className="text-blue-600" />
                </div>
                <p className="text-gray-600 mb-4">Connect with others on similar health journeys:</p>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800">Diabetes Support Group</h3>
                    <p className="text-sm text-gray-600 mt-1">Join weekly discussions with healthcare professionals</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Learn more &rarr;</button>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800">Healthy Living Workshop</h3>
                    <p className="text-sm text-gray-600 mt-1">Tips and strategies for managing diabetes risk factors</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Learn more &rarr;</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Patient Notifications */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-800">🔔 My Notifications</h2>
                <Bell className="text-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Upcoming Appointment</p>
                    <p className="text-sm text-gray-600">You have an appointment with Dr. Smith on May 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-600">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Health Check Reminder</p>
                    <p className="text-sm text-gray-600">
                      It's been 30 days since your last diabetes check. Consider making a new one.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-800 transition">
                  View all notifications &rarr;
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

// Patient Dashboard Components
const PatientStatCard = ({ icon, title, value, link, color = "blue", description }) => {
  const colorClass =
    color === "red"
      ? "text-red-500 bg-red-100"
      : color === "green"
        ? "text-green-500 bg-green-100"
        : "text-blue-500 bg-blue-100"
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <div className="mt-4">
        <Link to={link} className="text-sm text-blue-600 hover:text-blue-800">
          View details &rarr;
        </Link>
      </div>
    </div>
  )
}

const PatientQuickAction = ({ icon, label, to, color = "blue" }) => {
  const colorClass =
    color === "green"
      ? "bg-green-50 hover:bg-green-100 text-green-800"
      : color === "purple"
        ? "bg-purple-50 hover:bg-purple-100 text-purple-800"
        : "bg-blue-50 hover:bg-blue-100 text-blue-800"

  return (
    <Link to={to} className={`flex items-center p-4 rounded-lg ${colorClass} transition`}>
      <div className="mr-3">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default Dashboard
