"use client";

export default function AttendancePage() {
  const attendees = [
    {
      name: "Palak Dekiwadia",
      team: "Cyber Ninjas",
      checkIn: "09:05 AM",
      checkOut: "-",
      status: "Checked In",
    },
    {
      name: "Diya Patel",
      team: "Cyber Ninjas",
      checkIn: "09:10 AM",
      checkOut: "04:30 PM",
      status: "Checked Out",
    },
    {
      name: "Maharshi Trivedi",
      team: "Binary Hunters",
      checkIn: "09:40 AM",
      checkOut: "-",
      status: "Late Arrival",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Attendance Dashboard
        </h1>

        <p className="text-gray-400 mb-8">
          Real-Time Attendance Monitoring
        </p>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Checked In
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              67
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Checked Out
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              18
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              35
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Late Arrivals
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-3">
              5
            </h2>
          </div>

        </div>

        {/* Table */}

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Team
                </th>

                <th className="p-4 text-left">
                  Check In
                </th>

                <th className="p-4 text-left">
                  Check Out
                </th>

                <th className="p-4 text-left">
                  Status
                </th>
              </tr>

            </thead>

            <tbody>

              {attendees.map((person, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {person.name}
                  </td>

                  <td className="p-4">
                    {person.team}
                  </td>

                  <td className="p-4">
                    {person.checkIn}
                  </td>

                  <td className="p-4">
                    {person.checkOut}
                  </td>

                  <td className="p-4">

                    <span className={`px-3 py-1 rounded-full text-sm ${
                      person.status === "Checked In"
                        ? "bg-green-500 text-black"
                        : person.status === "Checked Out"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                    }`}>
                      {person.status}
                    </span>

                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

        <div className="mt-8 flex gap-4">

          <button className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold">
            Export CSV
          </button>

          <button className="bg-blue-500 text-white px-5 py-3 rounded-lg font-bold">
            Export PDF
          </button>

        </div>

      </div>

    </div>
  );
}