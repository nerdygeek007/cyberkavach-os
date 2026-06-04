// src/app/events/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Users, Terminal } from 'lucide-react';

// SELF-CONTAINED TYPE CONTRACTS
export interface AttendeeRecord {
  full_name: string;
  email: string;
  registration_status: string;
  registered_at: string;
}

export interface SingleEventDashboardPayload {
  status: string;
  event_telemetry: {
    title: string;
    max_capacity: number;
    current_occupancy: number;
    event_date: string;
  };
  total_attendees: number;
  attendee_ledger: AttendeeRecord[];
}

type DashboardTabs = 'telemetry' | 'ledger' | 'subsystems';

export default function EventDashboardDrillDown() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTabs>('ledger');
  const [data, setData] = useState<SingleEventDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!id) return;
    const extractEventData = async () => {
      try {
        const token = localStorage.getItem('cyber_jwt_token');

        // [*] DYNAMIC NETWORK ROUTING: Automatically adapts to your current IP
        const API_BASE = `http://${window.location.hostname}:5000/api/v1`;

        const res = await fetch(`${API_BASE}/events/${id}/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const payload = await res.json();
        setData(payload);
      } catch (err) {
        console.error("Telemetry Retrieval Pipeline Broken:", err);
      } finally {
        setLoading(false);
      }
    };
    extractEventData();
  }, [id]);

  if (loading) return <div className="p-8 text-cyan-400 font-mono animate-pulse">Running Dynamic Target Parsing Loop...</div>;
  if (!data) return <div className="p-8 text-rose-500 font-mono">CRITICAL EXCEPTION: Targeted Endpoint Unreachable.</div>;

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <button onClick={() => router.push('/dashboard')} className="flex items-center text-xs font-mono text-slate-400 hover:text-cyan-400 mb-6 group transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" /> TERMINATE INSPECTION VIEW
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">{data.event_telemetry.title}</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">UUID Verification: <span className="text-cyan-500">{id}</span></p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4 text-xs font-mono">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            Date: <span className="text-slate-300 font-bold">{new Date(data.event_telemetry.event_date).toLocaleDateString()}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            Capacity: <span className="text-emerald-400 font-bold">{data.total_attendees} / {data.event_telemetry.max_capacity}</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-800 mb-6 gap-2">
        <TabButton id="telemetry" label="Context Overview" active={activeTab} setActive={setActiveTab} icon={<Shield className="w-3.5 h-3.5" />} />
        <TabButton id="ledger" label="Attendee Entry Ledger" active={activeTab} setActive={setActiveTab} icon={<Users className="w-3.5 h-3.5" />} />
        <TabButton id="subsystems" label="CTF Subsystem Engine" active={activeTab} setActive={setActiveTab} icon={<Terminal className="w-3.5 h-3.5" />} />
      </div>

      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 shadow-xl">
        {activeTab === 'telemetry' && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-lg font-bold text-cyan-400">Tactical Node Specification</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              This operational workspace configures parameters matching active records in your Postgres layer.
            </p>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase bg-slate-950/60">
                  <th className="py-3 px-4">Operator Name</th>
                  <th className="py-3 px-4">Secure Email Contact</th>
                  <th className="py-3 px-4">Network Clearance</th>
                  <th className="py-3 px-4">Ingress Date Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {data.attendee_ledger.map((attendee: AttendeeRecord, index: number) => (
                  <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-200">{attendee.full_name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{attendee.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        {attendee.registration_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{new Date(attendee.registered_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'subsystems' && (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            <p className="text-sm text-slate-400 font-mono">CTF Infrastructure Pipeline Switched Offline.</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Awaiting Challenge Engine Activation Sequence.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ id, label, active, setActive, icon }: { id: DashboardTabs; label: string; active: DashboardTabs; setActive: (id: DashboardTabs) => void; icon: React.ReactNode }) {
  const isSelected = active === id;
  return (
    <button 
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 -mb-0.5 ${
        isSelected ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
      }`}
    >
      {icon} {label}
    </button>
  );
}