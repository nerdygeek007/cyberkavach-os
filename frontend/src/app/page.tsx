"use client";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 border-r border-green-500/20 items-center justify-center p-12">

        <div className="max-w-lg">

          <div className="mb-6">
            <p className="text-green-400 font-mono text-sm">
              &gt; CYBERKAVACH_OS v1.0
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-6">
            CyberKavach
          </h1>

          <p className="text-gray-400 text-lg mb-10">
            Smart Club Management System
          </p>

          <div className="space-y-6">

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>System Integrity</span>
                <span className="text-green-400">100%</span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full">
                <div className="h-2 w-full bg-green-400 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Threat Detection</span>
                <span className="text-green-400">ACTIVE</span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full">
                <div className="h-2 w-full bg-cyan-400 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Club Network</span>
                <span className="text-green-400">SECURED</span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full">
                <div className="h-2 w-full bg-green-400 rounded-full"></div>
              </div>
            </div>

          </div>

          <div className="mt-12 font-mono text-green-400 text-sm space-y-2">

            <p>&gt; Initializing secure session...</p>
            <p>&gt; Loading access control modules...</p>
            <p>&gt; Monitoring active club operations...</p>
            <p>&gt; Awaiting authentication...</p>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6">

        <div className="w-full max-w-md bg-[#111827] border border-green-500/20 rounded-2xl p-6 md:p-8 shadow-2xl">

          <div className="mb-8">

            <p className="text-green-400 font-mono text-sm mb-2">
              &gt; AUTHENTICATE USER
            </p>

            <h2 className="text-2xl md:text-3xl font-bold"> 
              Access System
            </h2>

          </div>

          <form className="space-y-5">

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                placeholder="user@cyberkavach.local"
                className="w-full bg-[#0a0f1c] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-[#0a0f1c] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-400"
              />
            </div>

            <Link
  href="/dashboard"
  className="w-full block text-center bg-green-500 text-black font-semibold py-3 rounded-lg"
>
  ACCESS SYSTEM
</Link>
          </form>

          <div className="mt-6 text-center">

            <button className="text-cyan-400 text-sm hover:text-cyan-300">
              Forgot Password?
            </button>

            <p className="mt-4 text-sm text-gray-400">
  No account?

  <Link
    href="/register"
    className="text-green-400 ml-2"
  >
    Request Access
  </Link>

</p>

          </div>

        </div>

      </div>

    </div>
  );
}