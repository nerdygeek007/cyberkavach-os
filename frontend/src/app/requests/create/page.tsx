"use client";

import { useState } from "react";

export default function CreateRequestPage() {
  const [requestType, setRequestType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    alert("Request Submitted Successfully");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          New Request
        </h1>

        <p className="text-gray-400 mb-8">
          Submit approval requests to coordinators
        </p>

        <div className="bg-slate-900 rounded-xl p-8">

          <div className="space-y-6">

            <div>
              <label className="block mb-2">
                Request Type
              </label>

              <select
                value={requestType}
                onChange={(e) =>
                  setRequestType(e.target.value)
                }
                className="w-full bg-slate-800 p-4 rounded-lg"
              >
                <option value="">
                  Select Request Type
                </option>

                <option>
                  Event Permission
                </option>

                <option>
                  Budget Approval
                </option>

                <option>
                  Resource Request
                </option>

                <option>
                  Content Publishing
                </option>

                <option>
                  Social Media Approval
                </option>

                <option>
                  Certificate Authorization
                </option>

              </select>
            </div>

            <div>

              <label className="block mb-2">
                Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full bg-slate-800 p-4 rounded-lg"
                placeholder="Enter title"
              />

            </div>

            <div>

              <label className="block mb-2">
                Description
              </label>

              <textarea
                rows={6}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full bg-slate-800 p-4 rounded-lg"
                placeholder="Describe your request"
              />

            </div>

            <div>

              <label className="block mb-2">
                Supporting Document
              </label>

              <input
                type="file"
                className="w-full bg-slate-800 p-4 rounded-lg"
              />

            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-black py-4 rounded-lg font-bold"
            >
              Submit Request
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}