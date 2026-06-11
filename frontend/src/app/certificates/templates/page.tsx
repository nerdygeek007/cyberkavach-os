"use client";

export default function CertificateTemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Participation Template",
      type: "PNG",
    },
    {
      id: 2,
      name: "Winner Template",
      type: "PDF",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8 responsive-flex">

          <div>
            <h1 className="text-5xl font-bold">
              Certificate Templates
            </h1>

            <p className="text-gray-400 mt-2">
              Manage certificate designs
            </p>
          </div>

          <button className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold responsive-button">
            Upload Template
          </button>

        </div>

        <div className="grid grid-cols-3 gap-6 responsive-grid-3">

          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-slate-900 rounded-xl p-6"
            >

              <div className="h-48 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                TEMPLATE PREVIEW
              </div>

              <h2 className="text-xl font-bold">
                {template.name}
              </h2>

              <p className="text-green-400 mt-2">
                {template.type}
              </p>

              <div className="flex gap-3 mt-6 responsive-flex">

                <button className="bg-blue-500 px-4 py-2 rounded-lg responsive-button">
                  Preview
                </button>

                <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg responsive-button">
                  Edit
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}