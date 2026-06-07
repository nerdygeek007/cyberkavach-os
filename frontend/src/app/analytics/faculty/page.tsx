"use client";

export default function FacultyAnalyticsPage() {
  const monthlyStats = [
    {
      month: "January",
      events: 4,
      certificates: 120,
      approvals: 45,
    },
    {
      month: "February",
      events: 6,
      certificates: 180,
      approvals: 58,
    },
    {
      month: "March",
      events: 5,
      certificates: 150,
      approvals: 52,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Faculty Analytics
        </h1>

        <p className="text-gray-400 mb-8">
          Club-wide Performance Monitoring
        </p>

        {/* Overview Cards */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Total Members
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              486
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Total Events
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              42
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Certificates Issued
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              1,248
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Avg Approval Time
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-3">
              4.2h
            </h2>
          </div>

        </div>

        {/* Club Growth */}

        <div className="bg-slate-900 rounded-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Member Growth Trend
          </h2>

          <div className="h-80 bg-slate-800 rounded-xl flex items-center justify-center">
            Growth Chart Placeholder
          </div>

        </div>

        {/* Monthly Performance */}

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  Month
                </th>

                <th className="p-4 text-left">
                  Events
                </th>

                <th className="p-4 text-left">
                  Certificates
                </th>

                <th className="p-4 text-left">
                  Approvals
                </th>
              </tr>

            </thead>

            <tbody>

              {monthlyStats.map((month) => (
                <tr
                  key={month.month}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {month.month}
                  </td>

                  <td className="p-4">
                    {month.events}
                  </td>

                  <td className="p-4">
                    {month.certificates}
                  </td>

                  <td className="p-4">
                    {month.approvals}
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