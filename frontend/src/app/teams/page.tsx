"use client";

export default function TeamsPage() {
  const teams = [
    {
      id: "TEAM001",
      teamName: "Cyber Ninjas",
      event: "CTF Node 1",
      leader: "Palak Dekiwadia",
      members: 4,
    },
    {
      id: "TEAM002",
      teamName: "Binary Hunters",
      event: "HackSprint",
      leader: "Diya Patel",
      members: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-5xl font-bold">
              My Teams
            </h1>

            <p className="text-gray-400 mt-2">
              Manage team registrations and history
            </p>
          </div>

          <a
            href="/teams/create"
            className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold"
          >
            + Create Team
          </a>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-slate-900 rounded-xl p-6"
            >

              <h2 className="text-2xl font-bold">
                {team.teamName}
              </h2>

              <p className="text-green-400 mt-2">
                {team.event}
              </p>

              <div className="mt-4 space-y-2">

                <p>
                  <strong>Team ID:</strong>{" "}
                  {team.id}
                </p>

                <p>
                  <strong>Leader:</strong>{" "}
                  {team.leader}
                </p>

                <p>
                  <strong>Members:</strong>{" "}
                  {team.members}
                </p>

              </div>

              <div className="flex gap-3 mt-6">

                <button className="bg-blue-500 px-4 py-2 rounded-lg">
                  View Team
                </button>

                <button className="bg-green-500 text-black px-4 py-2 rounded-lg">
                  Reuse Team
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}