"use client";

export default function AdminUsersPage() {
  const users = [
    {
      id: "1",
      name: "Palak Dekiwadia",
      email: "palak@gmail.com",
      role: "Club Member",
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "Diya Patel",
      email: "diya@gmail.com",
      role: "Club Member",
      status: "PENDING",
    },
    {
      id: "3",
      name: "Maharshi Trivedi",
      email: "maharshi@gmail.com",
      role: "Coordinator",
      status: "ACTIVE",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between mb-8 responsive-flex">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              User Management
            </h1>

            <p className="text-gray-400 mt-2">
              Manage registrations and approvals
            </p>
          </div>

        </div>

        <div className="bg-slate-900 rounded-xl p-6">

        <div className="responsive-table">
        <table className="w-full">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="text-left py-4">
                  Name
                </th>

                <th className="text-left py-4">
                  Email
                </th>

                <th className="text-left py-4">
                  Role
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

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-800"
                >
                  <td className="py-4">
                    {user.name}
                  </td>

                  <td className="py-4">
                    {user.email}
                  </td>

                  <td className="py-4">
                    {user.role}
                  </td>

                  <td className="py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.status === "ACTIVE"
                          ? "bg-green-500 text-black"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {user.status}
                    </span>

                  </td>

                  <td className="py-4 flex gap-2 responsive-flex">

                    <button className="bg-green-500 text-black px-3 py-2 rounded-lg font-semibold responsive-button">
                      Approve
                    </button>

                    <button className="bg-red-500 text-white px-3 py-2 rounded-lg font-semibold responsive-button">
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
    </div>
  );
}