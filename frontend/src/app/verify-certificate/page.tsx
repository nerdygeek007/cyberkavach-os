"use client";

import { useState } from "react";

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("");

  const certificate = {
    id: "CERT001",
    participant: "Palak Dekiwadia",
    event: "CTF Node 1",
    issueDate: "06 Jun 2026",
    authority: "CyberKavach Club",
    status: "Verified",
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Certificate Verification
        </h1>

        <p className="text-gray-400 mb-8">
          Verify authenticity of issued certificates
        </p>

        <div className="bg-slate-900 rounded-xl p-8 mb-8">

          <label className="block mb-3">
            Certificate ID
          </label>

          <div className="flex gap-4">

            <input
              value={certificateId}
              onChange={(e) =>
                setCertificateId(e.target.value)
              }
              placeholder="Enter Certificate ID"
              className="flex-1 bg-slate-800 p-4 rounded-lg"
            />

            <button className="bg-green-500 text-black px-8 rounded-lg font-bold">
              Verify
            </button>

          </div>

        </div>

        <div className="bg-slate-900 rounded-xl p-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Verification Result
            </h2>

            <span className="bg-green-500 text-black px-4 py-2 rounded-full font-semibold">
              VERIFIED
            </span>

          </div>

          <div className="space-y-4">

            <p>
              <strong>Certificate ID:</strong>{" "}
              {certificate.id}
            </p>

            <p>
              <strong>Participant:</strong>{" "}
              {certificate.participant}
            </p>

            <p>
              <strong>Event:</strong>{" "}
              {certificate.event}
            </p>

            <p>
              <strong>Issue Date:</strong>{" "}
              {certificate.issueDate}
            </p>

            <p>
              <strong>Issuing Authority:</strong>{" "}
              {certificate.authority}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {certificate.status}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}