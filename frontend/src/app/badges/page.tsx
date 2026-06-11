"use client";

export default function BadgesPage() {
  const earnedBadges = [
    {
      name: "Best Volunteer",
      icon: "🏆",
      description: "Awarded for exceptional volunteer work.",
    },
    {
      name: "Tech Expert",
      icon: "💻",
      description: "Outstanding technical contribution.",
    },
    {
      name: "Community Builder",
      icon: "🤝",
      description: "Helped grow CyberKavach community.",
    },
  ];

  const lockedBadges = [
    {
      name: "Innovation Award",
      icon: "🚀",
      progress: "70%",
    },
    {
      name: "Event Master",
      icon: "🎯",
      progress: "45%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Badges & Achievements
        </h1>

        <p className="text-gray-400 mb-8">
          Track your accomplishments and progress
        </p>

        {/* Earned Badges */}

        <div className="mb-10">

          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Earned Badges
          </h2>

          <div className="grid grid-cols-3 gap-6 responsive-grid-3">

            {earnedBadges.map((badge) => (
              <div
                key={badge.name}
                className="bg-slate-900 rounded-xl p-6 text-center"
              >
                <div className="text-6xl mb-4">
                  {badge.icon}
                </div>

                <h3 className="text-xl font-bold">
                  {badge.name}
                </h3>

                <p className="text-gray-400 mt-3">
                  {badge.description}
                </p>
              </div>
            ))}

          </div>

        </div>

        {/* Locked Badges */}

        <div>

          <h2 className="text-3xl font-bold mb-6">
            In Progress
          </h2>

          <div className="grid grid-cols-2 gap-6 responsive-grid-2">

            {lockedBadges.map((badge) => (
              <div
                key={badge.name}
                className="bg-slate-900 rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4 responsive-flex">

                  <div className="text-5xl opacity-50">
                    {badge.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      {badge.name}
                    </h3>

                    <p className="text-gray-400">
                      Progress: {badge.progress}
                    </p>
                  </div>

                </div>

                <div className="h-3 bg-slate-700 rounded-full">

                  <div
                    className="h-3 bg-green-500 rounded-full"
                    style={{
                      width: badge.progress,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}