export default function Navbar() {
  return (
    <div className="border-b border-green-500/20 bg-[#111827] p-4 md:px-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h2 className="text-white text-2xl font-bold">
            Dashboard
          </h2>

          <p className="text-gray-400 text-sm">
            CyberKavach Management Console
          </p>

        </div>

        <div className="text-left md:text-right">

          <p className="text-white">
            Maharshi Trivedi
          </p>

          <p className="text-green-400 text-sm">
            ACTIVE
          </p>

        </div>

      </div>

    </div>
  );
}