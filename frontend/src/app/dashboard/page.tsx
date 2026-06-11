"use client";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
    },
    {
      title: "Total Events",
      value: "24",
    },
    {
      title: "Registrations",
      value: "4,682",
    },
    {
      title: "Active Sessions",
      value: "127",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        CyberKavach Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6 responsive-grid-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-slate-900 p-6 rounded-xl"
          >
            <p className="text-gray-400">{item.title}</p>

            <h2 className="text-3xl font-bold text-green-400 mt-3">
              {item.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}