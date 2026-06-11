"use client";

export default function SocialCoordinatorPage() {
  const campaigns = [
    {
      id: 1,
      campaign: "CTF Node 1 Promotion",
      platform: "Instagram",
      status: "Scheduled",
    },
    {
      id: 2,
      campaign: "Cyber Hunt Highlights",
      platform: "LinkedIn",
      status: "Published",
    },
    {
      id: 3,
      campaign: "HackSprint Registration Drive",
      platform: "Instagram",
      status: "Pending Approval",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8 responsive-flex">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              Social Media Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Campaigns, Posts & Engagement Management
            </p>
          </div>

          <button className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold responsive-button">
            + Create Campaign
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-4 gap-6 mb-8 responsive-grid-4">

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Scheduled Posts
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              14
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Published Posts
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              86
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Pending Approval
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              5
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">
              Engagement Rate
            </p>

            <h2 className="text-4xl font-bold text-purple-400 mt-3">
              12.8%
            </h2>
          </div>

        </div>

        {/* Campaign Table */}

        <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="responsive-table">
        <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  Campaign
                </th>

                <th className="p-4 text-left">
                  Platform
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

              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {campaign.campaign}
                  </td>

                  <td className="p-4">
                    {campaign.platform}
                  </td>

                  <td className="p-4">
                    {campaign.status}
                  </td>

                  <td className="p-4 flex gap-2 responsive-flex">

                    <button className="bg-blue-500 px-3 py-2 rounded-lg responsive-button">
                      View
                    </button>

                    <button className="bg-green-500 text-black px-3 py-2 rounded-lg responsive-button">
                      Publish
                    </button>

                    <button className="bg-yellow-500 text-black px-3 py-2 rounded-lg responsive-button">
                      Edit
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