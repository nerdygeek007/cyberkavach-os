"use client";

export default function CertificatesPage() {
  const certificates = [
    {
      id: "CERT001",
      name: "Palak Dekiwadia",
      event: "CTF Node 1",
      date: "06 Jun 2026",
    },
    {
      id: "CERT002",
      name: "Diya Patel",
      event: "HackSprint",
      date: "04 Jun 2026",
    },
    {
      id: "CERT003",
      name: "Maharshi Trivedi",
      event: "Cyber Hunt",
      date: "01 Jun 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8 responsive-flex">

          <div>
            <h1 className="text-5xl font-bold">
              Generated Certificates
            </h1>

            <p className="text-gray-400 mt-2">
              Manage generated certificates
            </p>
          </div>

          <button className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold responsive-button">
            Download ZIP
          </button>

        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="responsive-table">
        <table className="w-full">
       

            <thead className="bg-slate-800">

              <tr>

                <th className="p-4 text-left">
                  Certificate ID
                </th>

                <th className="p-4 text-left">
                  Participant
                </th>

                <th className="p-4 text-left">
                  Event
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {cert.id}
                  </td>

                  <td className="p-4">
                    {cert.name}
                  </td>

                  <td className="p-4">
                    {cert.event}
                  </td>

                  <td className="p-4">
                    {cert.date}
                  </td>

                  <td className="p-4 flex gap-2 responsive-flex">

                    <button className="bg-blue-500 px-3 py-2 rounded-lg responsive-button">
                      Preview
                    </button>

                    <button className="bg-green-500 text-black px-3 py-2 rounded-lg responsive-button">
                      PDF
                    </button>

                    <button className="bg-yellow-500 text-black px-3 py-2 rounded-lg responsive-button">
                      Email
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
    </div>
  );
}