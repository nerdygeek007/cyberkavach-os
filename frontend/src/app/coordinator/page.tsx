"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function CoordinatorPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    registration_deadline: "",
    venue: "",
    max_capacity: 100,
    min_team_size: 1,
    max_team_size: 1,
    tags: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/events/create",
        form
      );

      setMessage(
        res.data.message ||
          "Event created successfully"
      );
    } catch (err: any) {
      setMessage(
        err.response?.data?.error ||
          "Failed to create event"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] p-10">

      <h1 className="text-4xl text-white font-bold mb-8">
        Create Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-4"
      >

        <input
          placeholder="Event Title"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full p-4 rounded bg-[#111827] text-white"
          rows={4}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <input
          type="datetime-local"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              event_date: e.target.value,
            })
          }
        />

        <input
          type="datetime-local"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              registration_deadline:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Venue"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              venue: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Max Capacity"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              max_capacity: Number(
                e.target.value
              ),
            })
          }
        />

        <input
          type="number"
          placeholder="Min Team Size"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              min_team_size: Number(
                e.target.value
              ),
            })
          }
        />

        <input
          type="number"
          placeholder="Max Team Size"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              max_team_size: Number(
                e.target.value
              ),
            })
          }
        />

        <input
          placeholder="Tags"
          className="w-full p-4 rounded bg-[#111827] text-white"
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="bg-green-500 text-black px-6 py-3 rounded font-bold"
        >
          Create Event
        </button>

      </form>

      {message && (
        <p className="text-green-400 mt-6">
          {message}
        </p>
      )}

    </div>
  );
}