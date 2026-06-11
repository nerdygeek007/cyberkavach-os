"use client";

export default function RequestsPage() {
  const requests = [
    {
      id: 1,
      type: "Event Permission",
      status: "Pending",
      created: "06 Jun 2026",
    },
    {
      id: 2,
      type: "Budget Approval",
      status: "Approved",
      created: "04 Jun 2026",
    },
    {
      id: 3,
      type: "Content Publishing",
      status: "Rejected",
      created: "01 Jun 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8 responsive-flex">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              My Requests
            </h1>

            <p className="text-gray-400 mt-2">
              Track all submitted approvals
            </p>
          </div>

          <a
            href="/requests/create"
            className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold responsive-button"
          >
            + New Request
          </a>

        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="responsive-table">
        <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  Request Type
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
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

                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      ${
                        req.status === "Approved"
                          ? "bg-green-500 text-black"
                          : req.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {req.status}
                    </span>

                  </td>

                  <td className="p-4">
                    {req.created}
                  </td>

                  <td className="p-4">

                    <a
                      href={`/requests/${req.id}`}
                      className="text-green-400"
                    >
                      View
                    </a>

                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
    </div>
  );
}