"use client";

export default function EventTelemetryDashboard() {
  const attendees = [
    {
      name: "Palak Dekiwadia",
      email: "palak@gmail.com",
      status: "CONFIRMED",
      registeredAt: "2026-06-05",
    },
    {
      name: "Maharshi Trivedi",
      email: "maharshi@gmail.com",
      status: "CONFIRMED",
      registeredAt: "2026-06-04",
    },
    {
      name: "Diya Patel",
      email: "diya@gmail.com",
      status: "PENDING",
      registeredAt: "2026-06-03",
    },
  ];

  const currentOccupancy = 67;
  const maxCapacity = 100;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            CTF Node 1
          </h1>

          <p className="text-gray-400 mt-2">
            Event Telemetry Dashboard
          </p>

        </div>

        {/* Status Cards */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Registration Status
            </p>

            <h2 className="text-green-400 text-3xl font-bold mt-3">
              OPEN
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Occupancy
            </p>

            <h2 className="text-green-400 text-3xl font-bold mt-3">
              {currentOccupancy}/{maxCapacity}
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Remaining Seats
            </p>

            <h2 className="text-green-400 text-3xl font-bold mt-3">
              {maxCapacity - currentOccupancy}
            </h2>
          </div>

        </div>

        {/* Occupancy Bar */}

        <div className="bg-slate-900 rounded-xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Occupancy Gauge
          </h2>

          <div className="h-5 bg-slate-700 rounded-full">

            <div
              className="h-5 bg-green-500 rounded-full"
              style={{
                width: `${
                  (currentOccupancy /
                    maxCapacity) *
                  100
                }%`,
              }}
            />

          </div>

        </div>

        {/* Attendee Table */}

        <div className="bg-slate-900 rounded-xl p-6">

          <div className="flex justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Attendee Ledger
            </h2>

            <button className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold">
              Download CSV
            </button>

          </div>

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="text-left py-3">
                  Name
                </th>

                <th className="text-left py-3">
                  Email
                </th>

                <th className="text-left py-3">
                  Status
                </th>

                <th className="text-left py-3">
                  Registered At
                </th>

              </tr>

            </thead>

            <tbody>

              {attendees.map((person) => (
                <tr
                  key={person.email}
                  className="border-b border-slate-800"
                >
                  <td className="py-4">
                    {person.name}
                  </td>

                  <td className="py-4">
                    {person.email}
                  </td>

                  <td className="py-4">
                    {person.status}
                  </td>

                  <td className="py-4">
                    {person.registeredAt}
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