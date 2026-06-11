"use client";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Registration Confirmed",
      message:
        "You have successfully registered for CTF Node 1.",
      time: "2 mins ago",
      type: "success",
    },
    {
      id: 2,
      title: "Team Invitation",
      message:
        "Cyber Ninjas invited you to join their team.",
      time: "1 hour ago",
      type: "info",
    },
    {
      id: 3,
      title: "Account Approved",
      message:
        "Your CyberKavach account has been approved.",
      time: "Yesterday",
      type: "success",
    },
    {
      id: 4,
      title: "Event Reminder",
      message:
        "HackSprint starts tomorrow at 9:00 AM.",
      time: "Yesterday",
      type: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Notifications
        </h1>

        <p className="text-gray-400 mb-8">
          Stay updated with CyberKavach activities
        </p>

        <div className="space-y-4">

          {notifications.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800"
            >

              <div className="flex justify-between responsive-flex">

                <h2 className="font-bold text-xl">
                  {item.title}
                </h2>

                <span className="text-gray-400 text-sm">
                  {item.time}
                </span>

              </div>

              <p className="text-gray-300 mt-3">
                {item.message}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}