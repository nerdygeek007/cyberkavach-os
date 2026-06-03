"use client";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-[#111827] border border-green-500/20 rounded-2xl p-8 shadow-2xl">

        <p className="text-green-400 font-mono text-sm mb-2">
          {">"} REGISTER USER
        </p>

        <h1 className="text-5xl font-bold mb-8">
          Create Account
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Student ID"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
          />

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-green-500 text-black font-bold py-3 rounded-lg hover:bg-green-400"
          >
            CREATE ACCOUNT
          </button>

        </div>

      </div>

    </div>
  );
}