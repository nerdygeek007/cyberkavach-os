"use client";

import { useState } from "react";

export default function AssignAppreciationPage() {
  const [member, setMember] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleAssign = () => {
    alert("Points Assigned Successfully");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Assign Appreciation
        </h1>

        <p className="text-gray-400 mb-8">
          Reward members for contributions
        </p>

        <div className="bg-slate-900 rounded-xl p-8">

          <div className="space-y-6">

            <div>

              <label className="block mb-2">
                Select Member
              </label>

              <select
                value={member}
                onChange={(e) =>
                  setMember(e.target.value)
                }
                className="w-full bg-slate-800 p-4 rounded-lg"
              >
                <option>Select Member</option>
                <option>Palak Dekiwadia</option>
                <option>Diya Patel</option>
                <option>Maharshi Trivedi</option>
              </select>

            </div>

            <div>

              <label className="block mb-2">
                Recognition Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full bg-slate-800 p-4 rounded-lg"
              >
                <option>Select Category</option>

                <option>
                  Best Coordinator
                </option>

                <option>
                  Best Volunteer
                </option>

                <option>
                  Technical Contribution
                </option>

                <option>
                  Creative Contribution
                </option>

                <option>
                  Event Management Excellence
                </option>

                <option>
                  Community Builder
                </option>

                <option>
                  Innovation Award
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2">
                Points
              </label>

              <input
                type="number"
                value={points}
                onChange={(e) =>
                  setPoints(e.target.value)
                }
                className="w-full bg-slate-800 p-4 rounded-lg"
                placeholder="Enter points"
              />

            </div>

            <div>

              <label className="block mb-2">
                Remarks
              </label>

              <textarea
                rows={5}
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
                className="w-full bg-slate-800 p-4 rounded-lg"
                placeholder="Reason for appreciation"
              />

            </div>

            <button
              onClick={handleAssign}
              className="w-full bg-green-500 text-black py-4 rounded-lg font-bold responsive-button"
            >
              Assign Appreciation
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}