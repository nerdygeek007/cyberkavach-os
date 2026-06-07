"use client";

export default function AdminEventsPage() {
  const events = [
    {
      id: "1",
      title: "CTF Node 1",
      venue: "Cyber Lab",
      registrations: 67,
      capacity: 100,
      status: "PUBLISHED",
    },
    {
      id: "2",
      title: "HackSprint",
      venue: "Auditorium",
      registrations: 120,
      capacity: 120,
      status: "FULL",
    },
    {
      id: "3",
      title: "Cyber Hunt",
      venue: "Lab 301",
      registrations: 22,
      capacity: 50,
      status: "DRAFT",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-5xl font-bold">
              Event Management
            </h1>

            <p className="text-gray-400 mt-2">
              Manage all CyberKavach events
            </p>
          </div>

          <button className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold">
            + Create Event
          </button>

        </div>

        <div className="bg-slate-900 rounded-xl p-6">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="text-left py-4">
                  Event
                </th>

                <th className="text-left py-4">
                  Venue
                </th>

                <th className="text-left py-4">
                  Registrations
                </th>

                <th className="text-left py-4">
                  Status
                </th>

                <th className="text-left py-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-slate-800"
                >
                  <td className="py-4">
                    {event.title}
                  </td>

                  <td className="py-4">
                    {event.venue}
                  </td>

                  <td className="py-4">
                    {event.registrations}/{event.capacity}
                  </td>

                  <td className="py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        event.status === "PUBLISHED"
                          ? "bg-green-500 text-black"
                          : event.status === "FULL"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {event.status}
                    </span>

                  </td>

                  <td className="py-4 flex gap-2">

                    <button className="bg-blue-500 text-white px-3 py-2 rounded-lg">
                      View
                    </button>

                    <button className="bg-yellow-500 text-black px-3 py-2 rounded-lg">
                      Edit
                    </button>

                    <button className="bg-green-500 text-black px-3 py-2 rounded-lg">
                      Publish
                    </button>

                    <button className="bg-red-500 text-white px-3 py-2 rounded-lg">
                      Delete
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