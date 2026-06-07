"use client";

export default function LeaderboardPage() {
  const users = [
    {
      rank: 1,
      name: "Palak Dekiwadia",
      points: 1250,
      badge: "Cyber Elite",
    },
    {
      rank: 2,
      name: "Maharshi Trivedi",
      points: 1180,
      badge: "Security Analyst",
    },
    {
      rank: 3,
      name: "Diya Patel",
      points: 1100,
      badge: "Threat Hunter",
    },
    {
      rank: 4,
      name: "Nerdy Geek",
      points: 950,
      badge: "Cyber Rookie",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Leaderboard
        </h1>

        <p className="text-gray-400 mb-8">
          Top performers across CyberKavach events
        </p>

        {/* Top 3 */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {users.slice(0, 3).map((user) => (
            <div
              key={user.rank}
              className="bg-slate-900 rounded-xl p-6 text-center"
            >
              <div className="text-5xl mb-4">
                🏆
              </div>

              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="text-green-400 mt-2">
                {user.badge}
              </p>

              <p className="text-3xl font-bold mt-4">
                {user.points}
              </p>
            </div>
          ))}

        </div>

        {/* Full Ranking */}

        <div className="bg-slate-900 rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Global Rankings
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3">Rank</th>
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Badge</th>
                <th className="text-left py-3">Points</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr
                  key={user.rank}
                  className="border-b border-slate-800"
                >
                  <td className="py-4">
                    #{user.rank}
                  </td>

                  <td className="py-4">
                    {user.name}
                  </td>

                  <td className="py-4 text-green-400">
                    {user.badge}
                  </td>

                  <td className="py-4 font-bold">
                    {user.points}
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