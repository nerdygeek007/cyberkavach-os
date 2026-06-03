import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex bg-[#0a0f1c] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20">
              <h3 className="text-gray-400">
                Total Users
              </h3>

              <p className="text-4xl font-bold text-green-400 mt-2">
                120
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20">
              <h3 className="text-gray-400">
                Events
              </h3>

              <p className="text-4xl font-bold text-cyan-400 mt-2">
                15
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20">
              <h3 className="text-gray-400">
                Registrations
              </h3>

              <p className="text-4xl font-bold text-green-400 mt-2">
                325
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20">
              <h3 className="text-gray-400">
                Active Sessions
              </h3>

              <p className="text-4xl font-bold text-red-400 mt-2">
                24
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}