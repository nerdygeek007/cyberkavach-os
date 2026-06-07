"use client";

import { useState } from "react";

export default function CheckInPage() {
  const [teamId, setTeamId] = useState("");

  const stats = {
    total: 120,
    checkedIn: 67,
    pending: 53,
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Event Check-In
        </h1>

        <p className="text-gray-400 mb-8">
          Team QR & Attendance Management
        </p>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Total Registered
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              {stats.total}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Checked In
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              {stats.checkedIn}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              {stats.pending}
            </h2>
          </div>

        </div>

        {/* QR Scanner */}

        <div className="bg-slate-900 rounded-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            QR Scanner
          </h2>

          <div className="h-72 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-gray-400">
            QR Scanner Placeholder
          </div>

        </div>

        {/* Manual Entry */}

        <div className="bg-slate-900 rounded-xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Manual Team Check-In
          </h2>

          <div className="flex gap-4">

            <input
              value={teamId}
              onChange={(e) =>
                setTeamId(e.target.value)
              }
              placeholder="Enter Team ID"
              className="flex-1 bg-slate-800 rounded-lg p-4"
            />

            <button className="bg-green-500 text-black px-8 rounded-lg font-bold">
              Check In
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}