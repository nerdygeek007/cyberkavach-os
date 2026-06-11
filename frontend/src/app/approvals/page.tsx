"use client";

export default function ApprovalsPage() {
  const requests = [
    {
      id: 1,
      title: "Cyber Security Workshop",
      type: "Event Permission",
      requester: "Palak Dekiwadia",
      status: "Pending",
      submitted: "06 Jun 2026",
    },
    {
      id: 2,
      title: "Budget for HackSprint",
      type: "Budget Approval",
      requester: "Diya Patel",
      status: "Pending",
      submitted: "05 Jun 2026",
    },
    {
      id: 3,
      title: "Instagram Campaign",
      type: "Social Media Approval",
      requester: "Maharshi Trivedi",
      status: "Pending",
      submitted: "04 Jun 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Approval Dashboard
        </h1>

        <p className="text-gray-400 mb-8">
          Review and process pending requests
        </p>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="responsive-table">
        <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="p-4 text-left">
                  Title
                </th>

                <th className="p-4 text-left">
                  Type
                </th>

                <th className="p-4 text-left">
                  Requester
                </th>

                <th className="p-4 text-left">
                  Submitted
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {request.title}
                  </td>

                  <td className="p-4">
                    {request.type}
                  </td>

                  <td className="p-4">
                    {request.requester}
                  </td>

                  <td className="p-4">
                    {request.submitted}
                  </td>

                  <td className="p-4">

                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full responsive-button">
                      {request.status}
                    </span>

                  </td>

                  <td className="p-4 flex gap-2 responsive-flex">

                    <button className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold responsive-button">
                      Approve
                    </button>

                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold responsive-button">
                      Reject
                    </button>

                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold responsive-button">
                      View
                    </button>

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