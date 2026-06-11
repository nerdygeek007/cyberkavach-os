"use client";

export default function AppreciationPage() {
  const contributions = [
    {
      event: "CTF Node 1",
      category: "Technical Contribution",
      points: 50,
      date: "06 Jun 2026",
    },
    {
      event: "HackSprint",
      category: "Best Volunteer",
      points: 30,
      date: "01 Jun 2026",
    },
    {
      event: "Cyber Hunt",
      category: "Community Builder",
      points: 20,
      date: "25 May 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Appreciation Dashboard
        </h1>

        <p className="text-gray-400 mb-8">
          Rewards, Recognition & Contributions
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8 responsive-grid-3">

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Total Points
            </p>

            <h2 className="text-5xl font-bold text-green-400 mt-3">
              100
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Badges Earned
            </p>

            <h2 className="text-5xl font-bold text-yellow-400 mt-3">
              4
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">
              Events Participated
            </p>

            <h2 className="text-5xl font-bold text-blue-400 mt-3">
              12
            </h2>
          </div>

        </div>

        <div className="bg-slate-900 rounded-xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Achievement Badges
          </h2>

          <div className="grid grid-cols-4 gap-4 responsive-grid-4">

            <div className="bg-slate-800 p-5 rounded-xl text-center">
              🏆
              <p className="mt-2">
                Best Volunteer
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl text-center">
              💻
              <p className="mt-2">
                Tech Expert
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl text-center">
              🚀
              <p className="mt-2">
                Rising Star
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl text-center">
              🔥
              <p className="mt-2">
                Top Contributor
              </p>
            </div>

          </div>

        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="responsive-table">
        <table className="w-full">

            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 text-left">
                  Event
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Points
                </th>

                <th className="p-4 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {contributions.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {item.event}
                  </td>

                  <td className="p-4">
                    {item.category}
                  </td>

                  <td className="p-4 text-green-400 font-bold">
                    +{item.points}
                  </td>

                  <td className="p-4">
                    {item.date}
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