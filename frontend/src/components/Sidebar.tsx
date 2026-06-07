import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    UserCircle,
    Shield,
    Award,
    Trophy
  } from "lucide-react";
  
  export default function Sidebar() {
    return (
      <div className="w-72 h-screen bg-[#111827] border-r border-green-500/20 p-6">
  
        <div className="mb-10">
  
          <p className="text-green-400 font-mono text-xs">
            CYBERKAVACH_OS
          </p>
  
          <h1 className="text-3xl font-bold text-white mt-2">
            CyberKavach
          </h1>
  
        </div>
  
        <div className="space-y-3">
  
          <Link href="/dashboard" className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10 transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
  
          <Link href="/dashboard/certificates" className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10 transition-colors">
            <Award size={20} />
            Certificates
          </Link>
  
          <Link href="/dashboard/recognition" className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10 transition-colors">
            <Trophy size={20} />
            Recognition
          </Link>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10 transition-colors cursor-not-allowed opacity-50">
            <Users size={20} />
            Users
          </button>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10 transition-colors cursor-not-allowed opacity-50">
            <CalendarDays size={20} />
            Events
          </button>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10 transition-colors cursor-not-allowed opacity-50">
            <Shield size={20} />
            Roles
          </button>
  
          <button className="flex items-center gap-3 text-white w-full p-3 rounded-lg hover:bg-green-500/10 transition-colors cursor-not-allowed opacity-50">
            <UserCircle size={20} />
            Profile
          </button>
  
        </div>
  
      </div>
    );
  }