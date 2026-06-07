"use client";

export default function AttendanceReportsPage() {
  const reports = [
    {
      event: "CTF Node 1",
      registered: 120,
      attended: 109,
      attendance: "91%",
    },
    {
      event: "HackSprint",
      registered: 85,
      attended: 75,
      attendance: "88%",
    },
    {
      event: "Cyber Hunt",
      registered: 65,
      attended: 62,
      attendance: "95%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-5xl font-bold">
              Attendance Reports
            </h1>

            <p className="text-gray-400 mt-2">
              Event-wise attendance analytics and exports
            </p>
          </div>

          <div className="flex gap-3">

            <button className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold">
              Export CSV
            </button>

            <button className="bg-blue-500 text-white px-5 py-3 rounded-lg font-bold">
              Export PDF
            </button>

          </div>

        </div>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Total Events
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
              1240
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Attendees
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              1128
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Avg Attendance
            </p>

            <h2 className="text-4xl font-bold text-purple-400 mt-3">
              91%
            </h2>
          </div>

        </div>

        {/* Analytics Chart Placeholder */}

        <div className="bg-slate-900 rounded-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Attendance Trend
          </h2>

          <div className="h-72 bg-slate-800 rounded-xl flex items-center justify-center text-gray-400">
            Attendance Analytics Chart
          </div>

        </div>

        {/* Event Table */}

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="p-4 text-left">
                  Event
                </th>

                <th className="p-4 text-left">
                  Registered
                </th>

                <th className="p-4 text-left">
                  Attended
                </th>

                <th className="p-4 text-left">
                  Attendance %
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {reports.map((report) => (
                <tr
                  key={report.event}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {report.event}
                  </td>

                  <td className="p-4">
                    {report.registered}
                  </td>

                  <td className="p-4">
                    {report.attended}
                  </td>

                  <td className="p-4 text-green-400 font-bold">
                    {report.attendance}
                  </td>

                  <td className="p-4">

                    <button className="bg-blue-500 px-3 py-2 rounded-lg">
                      View Report
                    </button>

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