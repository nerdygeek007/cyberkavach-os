import {
    LayoutDashboard,
    Users,
    CalendarDays,
    UserCircle,
    Shield
  } from "lucide-react";
  
  export default function Sidebar() {
    return (
      <div className="w-full md:w-72 min-h-screen bg-[#111827] border-r border-green-500/20 p-4 md:p-6">
  
        <div className="mb-6 md:mb-10">
  
          <p className="text-green-400 font-mono text-xs">
            CYBERKAVACH_OS
          </p>
  
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
            CyberKavach
          </h1>
  
        </div>
  
        <div className="space-y-3">
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10">
            <Users size={20} />
            Users
          </button>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10">
            <CalendarDays size={20} />
            Events
          </button>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10">
            <Shield size={20} />
            Roles
          </button>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10">
            <UserCircle size={20} />
            Profile
          </button>
  
        </div>
  
      </div>
    );
  }