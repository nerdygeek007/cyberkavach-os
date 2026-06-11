"use client";

export default function ContentCoordinatorPage() {
  const contentItems = [
    {
      id: 1,
      title: "Cyber Security Awareness Blog",
      author: "Palak Dekiwadia",
      status: "Pending Review",
    },
    {
      id: 2,
      title: "June Newsletter",
      author: "Diya Patel",
      status: "Approved",
    },
    {
      id: 3,
      title: "CTF Event Summary",
      author: "Maharshi Trivedi",
      status: "Draft",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 responsive-padding">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8 responsive-flex">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              Content Coordinator Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Manage articles, newsletters and publications
            </p>
          </div>

          <button className="bg-green-500 text-black px-5 py-3 rounded-lg font-bold responsive-button">
            + New Content
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-4 gap-6 mb-8 responsive-grid-4">

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">Drafts</p>
            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              8
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">Pending Review</p>
            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              5
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">Published</p>
            <h2 className="text-4xl font-bold text-green-400 mt-3">
              42
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-gray-400">Newsletters</p>
            <h2 className="text-4xl font-bold text-purple-400 mt-3">
              12
            </h2>
          </div>

        </div>

        {/* Content Table */}

        <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="responsive-table">
        <table className="w-full">

            <thead className="bg-slate-800">

              <tr>
                <th className="p-4 text-left">
                  Title
                </th>

                <th className="p-4 text-left">
                  Author
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {contentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {item.title}
                  </td>

                  <td className="p-4">
                    {item.author}
                  </td>

                  <td className="p-4">
                    {item.status}
                  </td>

                  <td className="p-4 flex gap-2 responsive-flex">

                    <button className="bg-blue-500 px-3 py-2 rounded-lg responsive-button">
                      View
                    </button>

                    <button className="bg-green-500 text-black px-3 py-2 rounded-lg responsive-button">
                      Publish
                    </button>

                    <button className="bg-yellow-500 text-black px-3 py-2 rounded-lg responsive-button">
                      Edit
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