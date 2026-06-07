"use client";

import { useState } from "react";
import EventCard from "@/components/EventCard";
import RegistrationModal from "@/components/RegistrationModal";

export default function EventsPage() {

  const [selectedEvent, setSelectedEvent] =
    useState<any>(null);

  const events = [
    {
      id: "1",
      title: "CTF Node 1",
      venue: "Cyber Lab",
      date: "15 June 2026",
      max_team_size: 4,
      status: "PUBLISHED",
    },
    {
      id: "2",
      title: "HackSprint",
      venue: "Auditorium",
      date: "22 June 2026",
      max_team_size: 1,
      status: "PUBLISHED",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Upcoming Events
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={() =>
              setSelectedEvent(event)
            }
          />
        ))}

      </div>

      {selectedEvent && (
        <RegistrationModal
        open={true}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
      )}

    </div>
  );
}