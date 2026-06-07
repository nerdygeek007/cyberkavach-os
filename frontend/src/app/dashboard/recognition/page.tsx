// frontend/src/app/dashboard/recognition/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Trophy, Award, Gift, ArrowUpRight, ArrowDownRight, User, Users, Star, MessageSquare, Plus, Download } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  full_name: string;
  student_id: string | null;
  role: string;
  total_points: number;
  badges: string[];
}

interface PointTransaction {
  id: string;
  points: number;
  category: string;
  remarks: string;
  created_at: string;
  event_title: string | null;
  assigned_by_name: string | null;
}

interface MemberDashboard {
  user: {
    id: string;
    full_name: string;
    student_id: string | null;
    role_name: string;
  };
  total_points: number;
  badges: string[];
  attendance_count: number;
  history: PointTransaction[];
  participation_log?: Array<{
    id: string;
    event_id: string;
    event_title: string;
    event_date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    status: string;
  }>;
}

interface AllUserSummary {
  id: string;
  full_name: string;
  student_id: string | null;
}

export default function RecognitionPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [myStats, setMyStats] = useState<MemberDashboard | null>(null);
  const [allUsers, setAllUsers] = useState<AllUserSummary[]>([]);
  
  const [userRole, setUserRole] = useState<string>('Club Member');
  const [userClearance, setUserClearance] = useState<number>(2);
  const [userId, setUserId] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'my-points' | 'allocate'>('leaderboard');

  // Allocation Form State
  const [allocTargetUserId, setAllocTargetUserId] = useState('');
  const [allocPoints, setAllocPoints] = useState<number>(10);
  const [allocCategory, setAllocCategory] = useState('Best Volunteer');
  const [allocRemarks, setAllocRemarks] = useState('');
  const [allocEventId, setAllocEventId] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [submittingAlloc, setSubmittingAlloc] = useState(false);

  const isCoordinator = userClearance >= 3;

  useEffect(() => {
    // Sync user session details
    const token = localStorage.getItem('cyber_jwt_token');
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setUserClearance(payload.clearance);
        setUserId(payload.id);
      } else {
        setUserRole('Super Admin');
        setUserClearance(5);
        setUserId('ghost-dev-id');
      }
    } catch (e) {
      setUserRole('Super Admin');
      setUserClearance(5);
      setUserId('ghost-dev-id');
    }

    fetchLeaderboard();
    fetchMyPoints();
    fetchUsersList();
    fetchEvents();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      const res = await fetch(`${API_BASE}/points/leaderboard`);
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load points leaderboard:', err);
    }
  };

  const fetchMyPoints = async () => {
    try {
      const token = localStorage.getItem('cyber_jwt_token');
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      // Call endpoint that resolves current user's profile points details
      const res = await fetch(`${API_BASE}/points/my-points`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.user) {
        setMyStats(data);
      }
    } catch (err) {
      console.error('Failed to load user points dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      const token = localStorage.getItem('cyber_jwt_token');
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      // Simply check database health check or a mock endpoint for user lookup
      // In a real scenario we query users. For this mock verification, we extract users from the leaderboard payload.
      const res = await fetch(`${API_BASE}/points/leaderboard`);
      const data = await res.json();
      if (data.leaderboard) {
        const list = data.leaderboard.map((u: any) => ({
          id: u.id,
          full_name: u.full_name,
          student_id: u.student_id
        }));
        setAllUsers(list);
      }
    } catch (err) {
      console.error('Failed to load users lookup list:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      const res = await fetch(`${API_BASE}/events/summary-list`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePointAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocTargetUserId || allocPoints === undefined || !allocRemarks.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setSubmittingAlloc(true);

    try {
      const token = localStorage.getItem('cyber_jwt_token');
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      const res = await fetch(`${API_BASE}/points/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: allocTargetUserId,
          points: allocPoints,
          category: allocCategory,
          remarks: allocRemarks,
          event_id: allocEventId || null
        })
      });
      const data = await res.json();

      if (data.transaction) {
        alert('Points transaction logged successfully.');
        setAllocTargetUserId('');
        setAllocRemarks('');
        fetchLeaderboard();
        fetchMyPoints();
        setActiveTab('leaderboard');
      } else {
        alert(data.error || 'Failed to assign points.');
      }
    } catch (err) {
      console.error(err);
      alert('Network exception assigning points.');
    } finally {
      setSubmittingAlloc(false);
    }
  };

  const handleDownloadReport = () => {
    const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
    const token = localStorage.getItem('cyber_jwt_token');
    
    // We open a new window to trigger the CSV download attachment, attaching JWT as URL parameter or download link
    window.open(`${API_BASE}/points/report?token=${token}`, '_blank');
  };

  return (
    <div className="flex bg-[#0a0f1c] min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Trophy className="text-green-400 w-8 h-8" />
                Appreciation & Recognition Deck
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Gamified contribution leaderboard, milestones achievement badging, and secure coordinator points ledger.
              </p>
            </div>
            
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === 'leaderboard' ? 'bg-green-500 text-black' : 'text-slate-400 hover:text-white'}`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('my-points')}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === 'my-points' ? 'bg-green-500 text-black' : 'text-slate-400 hover:text-white'}`}
              >
                My Dashboard
              </button>
              {isCoordinator && (
                <button
                  onClick={() => setActiveTab('allocate')}
                  className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === 'allocate' ? 'bg-green-500 text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  Allocate points
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-green-400 font-mono animate-pulse border border-green-500/20 bg-[#111827] p-6 rounded-xl inline-block">
              [*] CONNECTING RECOGNITION DATABASE...
            </div>
          ) : (
            <>
              {/* LEADERBOARD VIEW */}
              {activeTab === 'leaderboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Top 3 Podium Cards */}
                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {leaderboard.slice(0, 3).map((user, idx) => (
                      <div 
                        key={user.id} 
                        className={`border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-48 shadow-lg ${
                          idx === 0 ? 'bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border-amber-500/30' :
                          idx === 1 ? 'bg-gradient-to-br from-slate-300/10 to-slate-400/5 border-slate-400/30' :
                          'bg-gradient-to-br from-amber-700/10 to-amber-900/5 border-amber-800/30'
                        }`}
                      >
                        <div className="absolute top-2 right-4 text-7xl font-black text-white/5 font-mono select-none">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                              idx === 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              idx === 1 ? 'bg-slate-400/10 text-slate-300 border border-slate-400/20' :
                              'bg-amber-800/10 text-amber-500 border border-amber-800/20'
                            }`}>
                              {idx === 0 ? 'Gold' : idx === 1 ? 'Silver' : 'Bronze'} Contributor
                            </span>
                          </div>
                          <h3 className="font-extrabold text-xl text-slate-100 mt-2">{user.full_name}</h3>
                          <p className="text-xs text-gray-400 font-mono mt-1">{user.role} • {user.student_id || 'GUEST'}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xs text-gray-500 font-mono">Accumulated Points</span>
                          <span className="text-3xl font-black text-green-400">{user.total_points} XP</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Leaderboard Table Ledger */}
                  <div className="lg:col-span-3 bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Top Active Contributors Ledger</h3>
                      {isCoordinator && (
                        <button
                          onClick={handleDownloadReport}
                          className="text-xs bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-lg text-green-400 font-mono hover:bg-green-500/10 hover:border-green-500/40 flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" /> EXPORT CSV REPORT
                        </button>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase bg-slate-950/60">
                            <th className="py-3 px-4">Rank</th>
                            <th className="py-3 px-4">Full Name</th>
                            <th className="py-3 px-4">Student ID</th>
                            <th className="py-3 px-4">Clearance Role</th>
                            <th className="py-3 px-4">Milestone Badges</th>
                            <th className="py-3 px-4">Total Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {leaderboard.map((user, idx) => (
                            <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{idx + 1}</td>
                              <td className="py-3.5 px-4 font-bold text-slate-200">{user.full_name}</td>
                              <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{user.student_id || 'N/A'}</td>
                              <td className="py-3.5 px-4 text-cyan-400">{user.role}</td>
                              <td className="py-3.5 px-4">
                                <div className="flex flex-wrap gap-1.5">
                                  {user.badges.length === 0 ? (
                                    <span className="text-[10px] text-gray-500 font-mono">No Badges</span>
                                  ) : (
                                    user.badges.map(badge => (
                                      <span key={badge} className="text-[10px] bg-cyan-950/30 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono font-semibold">
                                        {badge}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-black text-green-400 text-base">{user.total_points} XP</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* INDIVIDUAL DASHBOARD VIEW */}
              {activeTab === 'my-points' && myStats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Milestones and summary */}
                  <div className="space-y-6">
                    <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-100">{myStats.user.full_name}</h3>
                          <p className="text-xs text-gray-400 font-mono">{myStats.user.role_name} • {myStats.user.student_id || 'GUEST'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                        <div className="bg-[#0a0f1c] p-4 rounded-lg border border-slate-850">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">My XP Balance</span>
                          <p className="text-3xl font-black text-green-400 mt-1">{myStats.total_points}</p>
                        </div>
                        <div className="bg-[#0a0f1c] p-4 rounded-lg border border-slate-850">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">Events Attended</span>
                          <p className="text-3xl font-black text-cyan-400 mt-1">{myStats.attendance_count}</p>
                        </div>
                      </div>
                    </div>

                    {/* Milestones achieved card */}
                    <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl space-y-4">
                      <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-2 flex items-center gap-2">
                        <Star className="text-cyan-400 w-4 h-4" /> Earned Achievement Badges
                      </h3>
                      
                      <div className="space-y-2">
                        {['Bronze Contributor', 'Silver Contributor', 'Gold Contributor', 'Platinum Contributor', 'Cyber Sentinel'].map(badge => {
                          const achieved = myStats.badges.includes(badge);
                          return (
                            <div 
                              key={badge} 
                              className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono font-bold transition-colors ${
                                achieved ? 'bg-cyan-500/5 border-cyan-500/30 text-cyan-400' : 'bg-slate-950/20 border-slate-850 text-slate-500'
                              }`}
                            >
                              <span>{badge}</span>
                              <span>{achieved ? 'UNLOCKED' : 'LOCKED'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: History table & Event participation log */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Points ledger history */}
                    <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-850 pb-2">Appreciation points Ledger History</h3>
                      
                      {myStats.history.length === 0 ? (
                        <p className="text-sm font-mono text-gray-500 py-6 text-center border border-dashed border-slate-800 rounded-lg">
                          No points operations recorded for your identity.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {myStats.history.map(item => (
                            <div key={item.id} className="bg-[#0a0f1c] border border-slate-850 rounded-xl p-5 flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded font-mono ${
                                    item.points > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {item.category}
                                  </span>
                                  {item.event_title && (
                                    <span className="text-[10px] text-cyan-400 font-mono font-bold">@ {item.event_title}</span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-350">{item.remarks}</p>
                                <div className="text-[10px] text-gray-500 font-mono mt-2">
                                  Issued by: {item.assigned_by_name || 'System Registry'} • {new Date(item.created_at).toLocaleString()}
                                </div>
                              </div>
                              <div className={`text-xl font-black flex items-center font-mono ${
                                item.points > 0 ? 'text-green-400' : 'text-rose-400'
                              }`}>
                                {item.points > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                {Math.abs(item.points)} XP
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Event participation log */}
                    <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-850 pb-2">Event Ingress/Egress Participation Log</h3>
                      
                      {!myStats.participation_log || myStats.participation_log.length === 0 ? (
                        <p className="text-sm font-mono text-gray-500 py-6 text-center border border-dashed border-slate-800 rounded-lg">
                          No event participation check-in records found for your identity.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase bg-slate-950/60">
                                <th className="py-3 px-4">Event Operation</th>
                                <th className="py-3 px-4">Operation Date</th>
                                <th className="py-3 px-4">Check-In</th>
                                <th className="py-3 px-4">Check-Out</th>
                                <th className="py-3 px-4">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {myStats.participation_log.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="py-3.5 px-4 font-bold text-slate-200">{log.event_title}</td>
                                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{new Date(log.event_date).toLocaleDateString()}</td>
                                  <td className="py-3.5 px-4 font-mono text-xs text-green-400">
                                    {log.check_in_time ? new Date(log.check_in_time).toLocaleTimeString() : 'N/A'}
                                  </td>
                                  <td className="py-3.5 px-4 font-mono text-xs text-cyan-400">
                                    {log.check_out_time ? new Date(log.check_out_time).toLocaleTimeString() : 'In Progress'}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                                      log.status === 'PRESENT' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                      log.status === 'LATE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                      log.status === 'EARLY_EXIT' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                      'bg-slate-850 text-slate-400 border-slate-750'
                                    }`}>
                                      {log.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ALLOCATE POINTS (COORDINATORS ONLY) */}
              {activeTab === 'allocate' && isCoordinator && (
                <div className="max-w-2xl mx-auto bg-[#111827] border border-green-500/20 rounded-xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-850 pb-2 flex items-center gap-2">
                    <Gift className="text-green-400 w-5 h-5" /> Log Contribution Points
                  </h3>

                  <form onSubmit={handlePointAllocation} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Target Club Member</label>
                        <select
                          value={allocTargetUserId}
                          onChange={(e) => setAllocTargetUserId(e.target.value)}
                          required
                          className="w-full bg-[#0a0f1c] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-green-400 text-sm"
                        >
                          <option value="">-- Choose Member --</option>
                          {allUsers.map(u => (
                            <option key={u.id} value={u.id}>{u.full_name} ({u.student_id || 'No ID'})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Points Value (Positive/Negative)</label>
                        <input
                          type="number"
                          value={allocPoints}
                          onChange={(e) => setAllocPoints(parseInt(e.target.value))}
                          required
                          placeholder="e.g. 20 or -15"
                          className="w-full bg-[#0a0f1c] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-green-400 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Recognition Category</label>
                        <select
                          value={allocCategory}
                          onChange={(e) => setAllocCategory(e.target.value)}
                          className="w-full bg-[#0a0f1c] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-green-400 text-sm"
                        >
                          <option value="Best Volunteer">Best Volunteer</option>
                          <option value="Best Coordinator">Best Coordinator</option>
                          <option value="Technical Contribution">Technical Contribution</option>
                          <option value="Creative Contribution">Creative Contribution</option>
                          <option value="Event Management Excellence">Event Management Excellence</option>
                          <option value="Community Builder">Community Builder</option>
                          <option value="Innovation Award">Innovation Award</option>
                          <option value="Policy Violation">Policy Violation (Deduction)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Associated event (Optional)</label>
                        <select
                          value={allocEventId}
                          onChange={(e) => setAllocEventId(e.target.value)}
                          className="w-full bg-[#0a0f1c] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-green-400 text-sm"
                        >
                          <option value="">-- None --</option>
                          {events.map(ev => (
                            <option key={ev.event_id} value={ev.event_id}>{ev.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Transaction remarks</label>
                      <textarea
                        value={allocRemarks}
                        onChange={(e) => setAllocRemarks(e.target.value)}
                        required
                        placeholder="Provide detailed description of the contribution or policy violation..."
                        rows={4}
                        className="w-full bg-[#0a0f1c] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-green-400 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingAlloc}
                      className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-650 disabled:cursor-not-allowed text-black font-extrabold py-3.5 rounded-lg text-sm transition-all"
                    >
                      {submittingAlloc ? 'SUBMITTING LOG...' : 'ALLOCATE TRANSACTION POINTS'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
