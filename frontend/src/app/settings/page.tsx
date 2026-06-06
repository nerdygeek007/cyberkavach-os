"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] =
    useState(true);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Settings
        </h1>

        <p className="text-gray-400 mb-8">
          Manage your CyberKavach preferences
        </p>

        {/* Account Settings */}

        <div className="bg-slate-900 rounded-xl p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Account Settings
          </h2>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Update Email"
              className="w-full p-4 rounded-lg bg-slate-800"
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-4 rounded-lg bg-slate-800"
            />

            <button className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold">
              Save Changes
            </button>

          </div>

        </div>

        {/* Preferences */}

        <div className="bg-slate-900 rounded-xl p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Preferences
          </h2>

          <div className="flex justify-between items-center mb-4">

            <span>Dark Mode</span>

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-green-500 text-black"
                  : "bg-slate-700"
              }`}
            >
              {darkMode ? "ON" : "OFF"}
            </button>

          </div>

          <div className="flex justify-between items-center">

            <span>Email Notifications</span>

            <button
              onClick={() =>
                setEmailNotifications(
                  !emailNotifications
                )
              }
              className={`px-4 py-2 rounded-lg ${
                emailNotifications
                  ? "bg-green-500 text-black"
                  : "bg-slate-700"
              }`}
            >
              {emailNotifications
                ? "ON"
                : "OFF"}
            </button>

          </div>

        </div>

        {/* Danger Zone */}

        <div className="bg-red-950 border border-red-700 rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            Danger Zone
          </h2>

          <button className="bg-red-500 text-white px-6 py-3 rounded-lg">
            Delete Account
          </button>

        </div>

      </div>

    </div>
  );
}