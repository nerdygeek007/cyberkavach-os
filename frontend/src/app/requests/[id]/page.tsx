"use client";

import { useParams } from "next/navigation";

export default function RequestDetailsPage() {
  const params = useParams();

  const request = {
    id: params.id,
    type: "Event Permission",
    title: "Cyber Security Workshop",
    status: "Under Review",
    submittedOn: "06 June 2026",
    description:
      "Requesting approval for Cyber Security Workshop in Seminar Hall.",
  };

  const timeline = [
    {
      step: "Request Submitted",
      person: "Palak Dekiwadia",
      date: "06 Jun 2026 10:15 AM",
      status: "completed",
    },
    {
      step: "Coordinator Review",
      person: "Maharshi Trivedi",
      date: "06 Jun 2026 02:45 PM",
      status: "completed",
    },
    {
      step: "Faculty Approval",
      person: "Pending",
      date: "-",
      status: "pending",
    },
    {
      step: "Final Authorization",
      person: "Pending",
      date: "-",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Request Details
        </h1>

        <p className="text-gray-400 mb-8">
          Track approval progress
        </p>

        {/* Request Info */}

        <div className="bg-slate-900 rounded-xl p-6 mb-8">

          <div className="flex justify-between items-center responsive-flex">

            <h2 className="text-2xl font-bold">
              {request.title}
            </h2>

            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold responsive-button">
              {request.status}
            </span>

          </div>

          <div className="mt-6 space-y-3">

            <p>
              <strong>Request Type:</strong>{" "}
              {request.type}
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {request.submittedOn}
            </p>

            <p>
              <strong>Description:</strong>
            </p>

            <p className="text-gray-300">
              {request.description}
            </p>

          </div>

        </div>

        {/* Timeline */}

        <div className="bg-slate-900 rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-8">
            Approval Timeline
          </h2>

          <div className="space-y-6">

            {timeline.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 responsive-flex"
              >

                <div
                  className={`w-5 h-5 rounded-full mt-1 ${
                    item.status === "completed"
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                />

                <div>

                  <h3 className="font-bold text-lg">
                    {item.step}
                  </h3>

                  <p className="text-gray-300">
                    {item.person}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {item.date}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}