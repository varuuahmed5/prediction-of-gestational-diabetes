"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { toast } from "react-toastify"

const SystemSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      siteName: "",
      siteDescription: "",
      contactEmail: "",
      supportPhone: "",
      maintenanceMode: false,
    },
    email: {
      emailProvider: "smtp",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPassword: "",
      senderEmail: "",
      senderName: "",
    },
    notifications: {
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      enablePushNotifications: false,
      notifyOnNewPrediction: true,
      notifyOnAppointmentChange: true,
      notifyOnAccountActivity: true,
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecialChar: true,
      passwordRequireNumber: true,
      passwordRequireUppercase: true,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      requireEmailVerification: true,
      twoFactorAuthEnabled: false,
    },
    prediction: {
      defaultRiskThresholds: {
        highRisk: 0.7,
        mediumRisk: 0.4,
      },
      enableAutoRecommendations: true,
      enableFollowUpReminders: true,
      followUpReminderDays: 30,
    },
    appointments: {
      allowSelfScheduling: true,
      minScheduleNotice: 24,
      maxScheduleDaysAhead: 60,
      defaultAppointmentDuration: 30,
      workingHoursStart: "09:00",
      workingHoursEnd: "17:00",
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  })

  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/settings")
      setSettings(response.data.data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load system settings")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  const handleNestedChange = (category, parent, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parent]: {
          ...prev[category][parent],
          [field]: value,
        },
      },
    }))
  }

  const handleArrayChange = (category, field, value) => {
    const array = [...settings[category][field]]
    const index = array.indexOf(value)

    if (index === -1) {
      array.push(value)
    } else {
      array.splice(index, 1)
    }

    handleChange(category, field, array)
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      await api.put("/admin/settings", settings)
      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = async () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      try {
        setSaving(true)
        await api.post("/admin/settings/reset")
        toast.success("Settings reset to defaults")
        fetchSettings()
      } catch (error) {
        console.error("Error resetting settings:", error)
        toast.error("Failed to reset settings")
      } finally {
        setSaving(false)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading system settings...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleResetSettings}
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {Object.keys(settings).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">General Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleChange("general", "siteName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleChange("general", "contactEmail", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                  <input
                    type="text"
                    value={settings.general.supportPhone}
                    onChange={(e) => handleChange("general", "supportPhone", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => handleChange("general", "siteDescription", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenance-mode"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => handleChange("general", "maintenanceMode", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="maintenance-mode" className="text-sm font-medium text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Email Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Provider</label>
                <select
                  value={settings.email.emailProvider}
                  onChange={(e) => handleChange("email", "emailProvider", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="smtp">SMTP</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                </select>
              </div>

              {settings.email.emailProvider === "smtp" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => handleChange("email", "smtpHost", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                    <input
                      type="text"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleChange("email", "smtpPort", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                    <input
                      type="text"
                      value={settings.email.smtpUser}
                      onChange={(e) => handleChange("email", "smtpUser", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                    <input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleChange("email", "smtpPassword", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
                  <input
                    type="email"
                    value={settings.email.senderEmail}
                    onChange={(e) => handleChange("email", "senderEmail", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                  <input
                    type="text"
                    value={settings.email.senderName}
                    onChange={(e) => handleChange("email", "senderName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={async () => {
                    try {
                      await api.post("/admin/settings/test-email")
                      toast.success("Test email sent successfully")
                    } catch (error) {
                      console.error("Error sending test email:", error)
                      toast.error("Failed to send test email")
                    }
                  }}
                >
                  Send Test Email
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Notification Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable-email"
                    checked={settings.notifications.enableEmailNotifications}
                    onChange={(e) => handleChange("notifications", "enableEmailNotifications", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="enable-email" className="text-sm font-medium text-gray-700">
                    Enable Email Notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable-sms"
                    checked={settings.notifications.enableSmsNotifications}
                    onChange={(e) => handleChange("notifications", "enableSmsNotifications", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="enable-sms" className="text-sm font-medium text-gray-700">
                    Enable SMS Notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable-push"
                    checked={settings.notifications.enablePushNotifications}
                    onChange={(e) => handleChange("notifications", "enablePushNotifications", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="enable-push" className="text-sm font-medium text-gray-700">
                    Enable Push Notifications
                  </label>
                </div>
              </div>

              <h3 className="text-md font-medium mt-4">Notification Events</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-prediction"
                    checked={settings.notifications.notifyOnNewPrediction}
                    onChange={(e) => handleChange("notifications", "notifyOnNewPrediction", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="notify-prediction" className="text-sm font-medium text-gray-700">
                    Notify on New Prediction
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-appointment"
                    checked={settings.notifications.notifyOnAppointmentChange}
                    onChange={(e) => handleChange("notifications", "notifyOnAppointmentChange", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="notify-appointment" className="text-sm font-medium text-gray-700">
                    Notify on Appointment Changes
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-account"
                    checked={settings.notifications.notifyOnAccountActivity}
                    onChange={(e) => handleChange("notifications", "notifyOnAccountActivity", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="notify-account" className="text-sm font-medium text-gray-700">
                    Notify on Account Activity
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Security Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleChange("security", "passwordMinLength", Number.parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require-special"
                    checked={settings.security.passwordRequireSpecialChar}
                    onChange={(e) => handleChange("security", "passwordRequireSpecialChar", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="require-special" className="text-sm font-medium text-gray-700">
                    Require Special Character in Password
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require-number"
                    checked={settings.security.passwordRequireNumber}
                    onChange={(e) => handleChange("security", "passwordRequireNumber", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="require-number" className="text-sm font-medium text-gray-700">
                    Require Number in Password
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require-uppercase"
                    checked={settings.security.passwordRequireUppercase}
                    onChange={(e) => handleChange("security", "passwordRequireUppercase", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="require-uppercase" className="text-sm font-medium text-gray-700">
                    Require Uppercase Letter in Password
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require-email-verification"
                    checked={settings.security.requireEmailVerification}
                    onChange={(e) => handleChange("security", "requireEmailVerification", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="require-email-verification" className="text-sm font-medium text-gray-700">
                    Require Email Verification
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="two-factor-auth"
                    checked={settings.security.twoFactorAuthEnabled}
                    onChange={(e) => handleChange("security", "twoFactorAuthEnabled", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="two-factor-auth" className="text-sm font-medium text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Prediction Settings */}
          {activeTab === "prediction" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Prediction Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">High Risk Threshold</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.prediction.defaultRiskThresholds.highRisk}
                    onChange={(e) =>
                      handleNestedChange(
                        "prediction",
                        "defaultRiskThresholds",
                        "highRisk",
                        Number.parseFloat(e.target.value),
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Probability threshold for high risk classification (0-1)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medium Risk Threshold</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.prediction.defaultRiskThresholds.mediumRisk}
                    onChange={(e) =>
                      handleNestedChange(
                        "prediction",
                        "defaultRiskThresholds",
                        "mediumRisk",
                        Number.parseFloat(e.target.value),
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Probability threshold for medium risk classification (0-1)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Reminder Days</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.prediction.followUpReminderDays}
                    onChange={(e) =>
                      handleChange("prediction", "followUpReminderDays", Number.parseInt(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Days after prediction to send follow-up reminder</p>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-recommendations"
                    checked={settings.prediction.enableAutoRecommendations}
                    onChange={(e) => handleChange("prediction", "enableAutoRecommendations", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="auto-recommendations" className="text-sm font-medium text-gray-700">
                    Enable Automatic Recommendations
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="follow-up-reminders"
                    checked={settings.prediction.enableFollowUpReminders}
                    onChange={(e) => handleChange("prediction", "enableFollowUpReminders", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="follow-up-reminders" className="text-sm font-medium text-gray-700">
                    Enable Follow-Up Reminders
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Settings */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Appointment Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Scheduling Notice (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="72"
                    value={settings.appointments.minScheduleNotice}
                    onChange={(e) => handleChange("appointments", "minScheduleNotice", Number.parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum hours in advance to schedule an appointment</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Scheduling Days Ahead</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.appointments.maxScheduleDaysAhead}
                    onChange={(e) =>
                      handleChange("appointments", "maxScheduleDaysAhead", Number.parseInt(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum days in advance to schedule an appointment</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Appointment Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    step="15"
                    value={settings.appointments.defaultAppointmentDuration}
                    onChange={(e) =>
                      handleChange("appointments", "defaultAppointmentDuration", Number.parseInt(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours Start</label>
                    <input
                      type="time"
                      value={settings.appointments.workingHoursStart}
                      onChange={(e) => handleChange("appointments", "workingHoursStart", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours End</label>
                    <input
                      type="time"
                      value={settings.appointments.workingHoursEnd}
                      onChange={(e) => handleChange("appointments", "workingHoursEnd", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        checked={settings.appointments.workingDays.includes(day)}
                        onChange={() => handleArrayChange("appointments", "workingDays", day)}
                        className="mr-2"
                      />
                      <label htmlFor={`day-${day}`} className="text-sm">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="self-scheduling"
                  checked={settings.appointments.allowSelfScheduling}
                  onChange={(e) => handleChange("appointments", "allowSelfScheduling", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="self-scheduling" className="text-sm font-medium text-gray-700">
                  Allow Self-Scheduling
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings
