"use client";

import { useState } from "react";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");

  const [members, setMembers] = useState([
    "palak@gmail.com",
    "diya@gmail.com",
  ]);

  const [search, setSearch] = useState("");

  const addMember = () => {
    if (!search) return;

    setMembers([...members, search]);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Create Team
        </h1>

        <p className="text-gray-400 mb-8">
          Build your event team
        </p>

        <div className="bg-slate-900 rounded-xl p-8">

          {/* Team Name */}

          <div className="mb-6">

            <label className="block mb-2">
              Team Name
            </label>

            <input
              value={teamName}
              onChange={(e) =>
                setTeamName(e.target.value)
              }
              placeholder="Cyber Ninjas"
              className="w-full bg-slate-800 rounded-lg p-4"
            />

          </div>

          {/* Search Member */}

          <div className="mb-6">

            <label className="block mb-2">
              Add Member
            </label>

            <div className="flex gap-3">

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Student ID or Email"
                className="flex-1 bg-slate-800 rounded-lg p-4"
              />

              <button
                onClick={addMember}
                className="bg-green-500 text-black px-5 rounded-lg font-bold"
              >
                Add
              </button>

            </div>

          </div>

          {/* Member List */}

          <div className="mb-6">

            <h2 className="text-xl font-bold mb-4">
              Team Members
            </h2>

            <div className="space-y-3">

              {members.map((member, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-lg p-4 flex justify-between"
                >
                  <span>{member}</span>

                  <button className="text-red-400">
                    Remove
                  </button>
                </div>
              ))}

            </div>

          </div>

          <button
            className="w-full bg-green-500 text-black py-4 rounded-lg font-bold"
          >
            Create Team
          </button>

        </div>

      </div>

    </div>
  );
}