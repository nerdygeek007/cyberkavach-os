"use client";

export default function RoleManagementPage() {
  const users = [
    {
      id: 1,
      name: "Palak Dekiwadia",
      currentRole: "Club Member",
    },
    {
      id: 2,
      name: "Diya Patel",
      currentRole: "Content Coordinator",
    },
    {
      id: 3,
      name: "Maharshi Trivedi",
      currentRole: "Student Coordinator",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Role Management
        </h1>

        <p className="text-gray-400 mb-8">
          Assign and manage system roles
        </p>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="responsive-table">
        <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Current Role
                </th>

                <th className="p-4 text-left">
                  Assign Role
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-800"
                >

                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.currentRole}
                  </td>

                  <td className="p-4">

                    <select className="bg-slate-800 p-2 rounded-lg w-full">

                      <option>
                        Club Member
                      </option>

                      <option>
                        Student Coordinator
                      </option>

                      <option>
                        Tech Coordinator
                      </option>

                      <option>
                        Content Coordinator
                      </option>

                      <option>
                        Social Media Coordinator
                      </option>

                      <option>
                        Faculty Coordinator
                      </option>

                      <option>
                        Admin
                      </option>

                    </select>

                  </td>

                  <td className="p-4">

                    <button className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold responsive-button">
                      Update
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