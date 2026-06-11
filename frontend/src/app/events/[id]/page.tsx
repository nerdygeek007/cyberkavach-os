"use client";

import { useState } from "react";
import RegistrationModal from "@/components/RegistrationModal";

export default function EventDetailsPage() {
  const [showModal, setShowModal] = useState(false);

  const event = {
    id: "1",
    title: "CTF Node 1",
    description:
      "A cybersecurity Capture The Flag competition designed to test offensive and defensive skills.",
    venue: "SCET Cyber Lab",
    date: "20 June 2026",
    registration_deadline: "18 June 2026",
    max_capacity: 100,
    current_registrations: 67,
    min_team_size: 1,
    max_team_size: 4,
    status: "PUBLISHED",
  };

  const occupancy =
    (event.current_registrations / event.max_capacity) * 100;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">
      <div className="max-w-6xl mx-auto">

        {/* Banner */}
        <div className="h-72 bg-slate-800 rounded-xl flex items-center justify-center text-4xl font-bold mb-8">
          EVENT POSTER
        </div>

        <div className="grid grid-cols-3 gap-8 responsive-grid-3">

          {/* Left Section */}
          <div className="lg:col-span-2">

            <h1 className="text-5xl font-bold mb-4">
              {event.title}
            </h1>

            <p className="text-gray-400 mb-8">
              {event.description}
            </p>

            <div className="grid grid-cols-2 gap-4 responsive-grid-2">

              <div className="bg-slate-900 p-5 rounded-xl">
                <h3 className="text-green-400 font-semibold">
                  Venue
                </h3>
                <p>{event.venue}</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl">
                <h3 className="text-green-400 font-semibold">
                  Event Date
                </h3>
                <p>{event.date}</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl">
                <h3 className="text-green-400 font-semibold">
                  Registration Deadline
                </h3>
                <p>{event.registration_deadline}</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl">
                <h3 className="text-green-400 font-semibold">
                  Team Size
                </h3>
                <p>
                  {event.min_team_size} - {event.max_team_size}
                </p>
              </div>

            </div>

          </div>

          {/* Right Section */}
          <div>

            <div className="bg-slate-900 rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-6">
                Registration Status
              </h2>

              <div className="mb-4">
              <div className="flex justify-between mb-2 responsive-flex">
                  <span>Occupancy</span>
                  <span>
                    {event.current_registrations}/
                    {event.max_capacity}
                  </span>
                </div>

                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${occupancy}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-green-400">
                  Status: {event.status}
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full mt-6 bg-green-500 text-black font-bold py-4 rounded-lg responsive-button"
              >
                Register Now
              </button>

            </div>

          </div>

        </div>

      </div>

      {showModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}