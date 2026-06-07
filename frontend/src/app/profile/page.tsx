"use client";

export default function ProfilePage() {
  const user = {
    fullName: "Palak Dekiwadia",
    studentId: "24DCS014",
    email: "palakdekiwadia2006@gmail.com",
    role: "Club Member",
    github: "https://github.com/palak",
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "Cyber Security",
      "PostgreSQL",
    ],
    internshipType: "Paid Internship",
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          My Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Card */}

          <div className="bg-slate-900 rounded-xl p-6">

            <div className="w-36 h-36 rounded-full bg-slate-700 mx-auto mb-6 flex items-center justify-center text-4xl">
              👤
            </div>

            <h2 className="text-2xl font-bold text-center">
              {user.fullName}
            </h2>

            <p className="text-center text-gray-400 mt-2">
              {user.studentId}
            </p>

            <p className="text-center text-green-400 mt-4">
              {user.role}
            </p>

          </div>

          {/* Right Section */}

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">
                Personal Information
              </h3>

              <div className="space-y-3">
                <p>Email: {user.email}</p>
                <p>Student ID: {user.studentId}</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">
                GitHub Profile
              </h3>

              <a
                href={user.github}
                target="_blank"
                className="text-green-400"
              >
                {user.github}
              </a>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">
                Internship Preference
              </h3>

              <p>{user.internshipType}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">
                Skills
              </h3>

              <div className="flex flex-wrap gap-3">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-green-500 text-black px-4 py-2 rounded-full font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">
                Resume
              </h3>

              <button className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold">
                Upload Resume
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}