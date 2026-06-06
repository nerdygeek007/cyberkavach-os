"use client";

import { useState } from "react";

export default function GenerateCertificatesPage() {
  const [progress] = useState(65);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Bulk Certificate Generation
        </h1>

        <p className="text-gray-400 mb-8">
          Generate certificates for participants
        </p>

        <div className="bg-slate-900 rounded-xl p-8">

          {/* Upload File */}

          <div className="mb-6">

            <label className="block mb-2">
              Upload Excel / CSV
            </label>

            <input
              type="file"
              className="w-full bg-slate-800 rounded-lg p-4"
            />

          </div>

          {/* Template */}

          <div className="mb-6">

            <label className="block mb-2">
              Select Template
            </label>

            <select className="w-full bg-slate-800 rounded-lg p-4">
              <option>
                Participation Certificate
              </option>

              <option>
                Winner Certificate
              </option>

              <option>
                Volunteer Certificate
              </option>
            </select>

          </div>

          {/* Field Mapping */}

          <div className="mb-8">

            <h2 className="text-xl font-bold mb-4">
              Field Mapping
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              <select className="bg-slate-800 p-4 rounded-lg">
                <option>
                  Participant Name
                </option>
              </select>

              <select className="bg-slate-800 p-4 rounded-lg">
                <option>
                  Event Name
                </option>
              </select>

              <select className="bg-slate-800 p-4 rounded-lg">
                <option>
                  Certificate ID
                </option>
              </select>

            </div>

          </div>

          {/* Progress */}

          <div className="mb-8">

            <div className="flex justify-between mb-2">
              <span>Generation Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="h-4 bg-slate-700 rounded-full">

              <div
                className="h-4 bg-green-500 rounded-full"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          <button className="w-full bg-green-500 text-black py-4 rounded-lg font-bold">
            Generate Certificates
          </button>

        </div>

      </div>

    </div>
  );
}