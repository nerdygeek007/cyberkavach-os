"use client";

import { useState } from "react";

type Props = {
    open?: boolean;
    onClose: () => void;
    event: {
      id: string;
      title: string;
      max_team_size: number;
    };
  };
  
  export default function RegistrationModal({
    open = true,
    event,
    onClose,
  }: Props) {
  const [mode, setMode] =
    useState("SOLO");

  const [teamName, setTeamName] =
    useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-[#111827] w-full max-w-md rounded-xl p-6">

        <h2 className="text-2xl text-white font-bold mb-6">
          Event Registration
        </h2>

        {event.max_team_size === 1 ? (
          <button
            className="w-full bg-green-500 text-black py-3 rounded-lg"
          >
            Confirm Registration
          </button>
        ) : (
          <>
            <div className="space-y-3">

              <button
                onClick={() =>
                  setMode("SOLO")
                }
                className={`w-full p-3 rounded-lg ${
                  mode === "SOLO"
                    ? "bg-green-500 text-black"
                    : "bg-gray-800 text-white"
                }`}
              >
                Register Individual
              </button>

              <button
                onClick={() =>
                  setMode("TEAM")
                }
                className={`w-full p-3 rounded-lg ${
                  mode === "TEAM"
                    ? "bg-green-500 text-black"
                    : "bg-gray-800 text-white"
                }`}
              >
                Create Team
              </button>

            </div>

            {mode === "TEAM" && (
              <input
                value={teamName}
                onChange={(e) =>
                  setTeamName(
                    e.target.value
                  )
                }
                placeholder="Team Name"
                className="mt-4 w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
              />
            )}

            <button
              className="mt-6 w-full bg-green-500 text-black py-3 rounded-lg font-bold"
            >
              Confirm Registration
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full border border-gray-600 py-3 rounded-lg text-white"
        >
          Close
        </button>

      </div>

    </div>
  );
}