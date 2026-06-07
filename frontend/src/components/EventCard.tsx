"use client";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    venue: string;
    date: string;
    poster?: string;
    max_team_size: number;
    status: string;
  };
  onRegister: () => void;
};

export default function EventCard({
  event,
  onRegister,
}: EventCardProps) {
  return (
    <div className="bg-[#111827] border border-green-500/20 rounded-xl overflow-hidden">

      <img
        src={
          event.poster ||
          "https://placehold.co/600x300"
        }
        alt={event.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-5">

        <h3 className="text-xl font-bold text-white">
          {event.title}
        </h3>

        <p className="text-gray-400 mt-2">
          📍 {event.venue}
        </p>

        <p className="text-gray-400">
          📅 {event.date}
        </p>

        <div className="mt-3">

          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            Team Size: {event.max_team_size}
          </span>

        </div>

        <button
          onClick={onRegister}
          className="mt-5 w-full bg-green-500 text-black py-3 rounded-lg font-bold"
        >
          Register
        </button>

      </div>

    </div>
  );
}