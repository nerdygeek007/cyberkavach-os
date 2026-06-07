"use client";

export default function TechCoordinatorPage() {
  const requests = [
    {
      id: 1,
      type: "Software Access",
      requester: "Palak Dekiwadia",
      status: "Pending",
    },
    {
      id: 2,
      type: "Lab Resource Request",
      requester: "Diya Patel",
      status: "Approved",
    },
    {
      id: 3,
      type: "Server Access",
      requester: "Maharshi Trivedi",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Tech Coordinator Dashboard
        </h1>

        <p className="text-gray-400 mb-8">
          Technical Resources & Infrastructure Management
        </p>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Pending Requests
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              12
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Approved Requests
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              45
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Active Resources
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              28
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Open Issues
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-3">
              4
            </h2>
          </div>

        </div>

        {/* Request Table */}

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  Request Type
                </th>

                <th className="p-4 text-left">
                  Requester
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {req.type}
                  </td>

                  <td className="p-4">
                    {req.requester}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        req.status === "Approved"
                          ? "bg-green-500 text-black"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {req.status}
                    </span>

                  </td>

                  <td className="p-4 flex gap-2">

                    <button className="bg-green-500 text-black px-3 py-2 rounded-lg">
                      Approve
                    </button>

                    <button className="bg-red-500 text-white px-3 py-2 rounded-lg">
                      Reject
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