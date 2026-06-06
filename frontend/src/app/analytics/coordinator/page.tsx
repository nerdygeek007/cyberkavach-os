"use client";

export default function CoordinatorAnalyticsPage() {
  const recentEvents = [
    {
      event: "CTF Node 1",
      registrations: 120,
      attendance: "91%",
    },
    {
      event: "HackSprint",
      registrations: 85,
      attendance: "88%",
    },
    {
      event: "Cyber Hunt",
      registrations: 65,
      attendance: "95%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Coordinator Analytics
        </h1>

        <p className="text-gray-400 mb-8">
          Event Performance & Coordination Insights
        </p>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Events Managed
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              24
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Registrations
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              1,240
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Attendance Rate
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              91%
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Pending Approvals
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-3">
              8
            </h2>
          </div>

        </div>

        {/* Chart Placeholder */}

        <div className="bg-slate-900 rounded-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Registration Trends
          </h2>

          <div className="h-80 bg-slate-800 rounded-xl flex items-center justify-center text-gray-400">
            Registration Chart Placeholder
          </div>

        </div>

        {/* Recent Events */}

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  Event
                </th>

                <th className="p-4 text-left">
                  Registrations
                </th>

                <th className="p-4 text-left">
                  Attendance
                </th>
              </tr>

            </thead>

            <tbody>

              {recentEvents.map((event, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {event.event}
                  </td>

                  <td className="p-4">
                    {event.registrations}
                  </td>

                  <td className="p-4">
                    {event.attendance}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}