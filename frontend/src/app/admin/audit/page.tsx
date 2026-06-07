"use client";

export default function AuditLogsPage() {
  const logs = [
    {
      user: "Palak Dekiwadia",
      action: "Created Event",
      target: "CTF Node 1",
      time: "06 Jun 2026 10:15 AM",
    },
    {
      user: "Maharshi Trivedi",
      action: "Approved Request",
      target: "Budget Approval",
      time: "06 Jun 2026 11:45 AM",
    },
    {
      user: "Diya Patel",
      action: "Generated Certificates",
      target: "HackSprint",
      time: "05 Jun 2026 04:20 PM",
    },
    {
      user: "Admin",
      action: "Assigned Role",
      target: "Content Coordinator",
      time: "05 Jun 2026 02:10 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Audit Logs
        </h1>

        <p className="text-gray-400 mb-8">
          System Activity Tracking
        </p>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

                <th className="p-4 text-left">
                  Target
                </th>

                <th className="p-4 text-left">
                  Timestamp
                </th>
              </tr>

            </thead>

            <tbody>

              {logs.map((log, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {log.user}
                  </td>

                  <td className="p-4">
                    {log.action}
                  </td>

                  <td className="p-4">
                    {log.target}
                  </td>

                  <td className="p-4">
                    {log.time}
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