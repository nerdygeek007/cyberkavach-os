"use client";

import { useParams } from "next/navigation";

export default function TeamDetailsPage() {
  const params = useParams();

  const team = {
    id: params.id,
    name: "Cyber Ninjas",
    event: "CTF Node 1",
    leader: "Palak Dekiwadia",
    status: "Registered",
    members: [
      "Palak Dekiwadia",
      "Diya Patel",
      "Maharshi Trivedi",
      "Nerdy Geek",
    ],
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Team Details
        </h1>

        <p className="text-gray-400 mb-8">
          Team Management Dashboard
        </p>

        <div className="grid grid-cols-3 gap-8 responsive-grid-3">

          {/* Left */}

          <div className="lg:col-span-2">

            <div className="bg-slate-900 rounded-xl p-6 mb-6">

              <h2 className="text-2xl md:text-3xl font-bold">
                {team.name}
              </h2>

              <div className="mt-6 space-y-3">

                <p>
                  <strong>Team ID:</strong>{" "}
                  {team.id}
                </p>

                <p>
                  <strong>Event:</strong>{" "}
                  {team.event}
                </p>

                <p>
                  <strong>Leader:</strong>{" "}
                  {team.leader}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="bg-green-500 text-black px-3 py-1 rounded-full responsive-button">
                    {team.status}
                  </span>
                </p>

              </div>

            </div>

            <div className="bg-slate-900 rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-6">
                Team Members
              </h2>

              <div className="space-y-3">

                {team.members.map((member, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 p-4 rounded-lg"
                  >
                    {member}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* Right */}

          <div>

            <div className="bg-slate-900 rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-6">
                Team QR Code
              </h2>

              <div className="h-48 md:h-64 bg-slate-800 rounded-xl flex items-center justify-center text-center">
                QR CODE
              </div>

              <button className="w-full mt-6 bg-green-500 text-black py-3 rounded-lg font-bold responsive-button">
                Download QR
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}