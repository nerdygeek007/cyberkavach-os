// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export interface GlobalTelemetry {
  total_users: number;
  total_events: number;
  total_registrations: number;
  active_sessions: number;
}

export interface EventSummary {
  event_id: string;
  title: string;
  status: 'OPEN' | 'FULL' | 'ARCHIVED';
  event_date: string;
  current_occupancy: number;
  max_capacity: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<GlobalTelemetry | null>(null);
  const [eventsList, setEventsList] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const syncDashboardData = async () => {
      try {
        const token = localStorage.getItem('cyber_jwt_token');

        // [*] DYNAMIC NETWORK ROUTING: Automatically adapts to your current IP
        const API_BASE = `http://${window.location.hostname}:5000/api/v1`;

        const [metricsRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE}/system/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE}/events/summary-list`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        setMetrics(await metricsRes.json());
        setEventsList(await eventsRes.json());
      } catch (err) {
        console.error("Telemetry Retrieval Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    syncDashboardData();
  }, []);

  return (
    <div className="flex bg-[#0a0f1c] min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8">
          {loading ? (
            <div className="text-green-400 font-mono animate-pulse border border-green-500/20 bg-[#111827] p-6 rounded-xl inline-block">
              [*] INITIALIZING SECURE DATABASE TUNNEL...
            </div>
          ) : (
            <>
              {/* CORE 4 METRICS DISPLAY */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20 shadow-md">
                  <h3 className="text-gray-400">Total Users</h3>
                  <p className="text-4xl font-bold text-green-400 mt-2">{metrics?.total_users ?? 0}</p>
                </div>
                <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20 shadow-md">
                  <h3 className="text-gray-400">Events</h3>
                  <p className="text-4xl font-bold text-cyan-400 mt-2">{metrics?.total_events ?? 0}</p>
                </div>
                <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20 shadow-md">
                  <h3 className="text-gray-400">Registrations</h3>
                  <p className="text-4xl font-bold text-green-400 mt-2">{metrics?.total_registrations ?? 0}</p>
                </div>
                <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20 shadow-md">
                  <h3 className="text-gray-400">Active Sessions</h3>
                  <p className="text-4xl font-bold text-red-400 mt-2">{metrics?.active_sessions ?? 0}</p>
                </div>
              </div>

              {/* DYNAMIC EVENTS GRID */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">Managed Operations Infrastructure</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* The JSX loop is now fixed and clean */}
                  {eventsList.map((event) => (
                    <Link key={event.event_id} href={`/events/${event.event_id}`}>
                      <div className="border border-green-500/20 bg-[#111827] rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 shadow-lg group">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold tracking-wider ${
                              event.status === 'OPEN' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                              event.status === 'FULL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                              'bg-slate-800 text-slate-400'
                            }`}>{event.status}</span>
                          </div>
                          <p className="text-xs text-gray-400 font-mono mb-4">{new Date(event.event_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1.5 text-gray-400">
                            <span>Allocation Metrics</span>
                            <span>{event.current_occupancy} / {event.max_capacity} Users</span>
                          </div>
                          <div className="w-full bg-[#0a0f1c] rounded-full h-2 overflow-hidden border border-green-500/20">
                            <div 
                              className={`h-full transition-all duration-500 ${event.current_occupancy >= event.max_capacity ? 'bg-amber-500' : 'bg-cyan-500'}`}
                              style={{ width: `${Math.min((event.current_occupancy / event.max_capacity) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}