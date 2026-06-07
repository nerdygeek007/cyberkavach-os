// frontend/src/app/verify/[code]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShieldCheck, ShieldAlert, Award, Calendar, User, UserCheck, ArrowLeft, Loader2 } from 'lucide-react';

interface VerificationPayload {
  verified: boolean;
  certificate?: {
    id: string;
    certificate_code: string;
    recipient_name: string;
    event_name: string;
    issued_at: string;
    issued_by_name: string | null;
  };
  error?: string;
}

export default function CertificateVerifyPage() {
  const params = useParams();
  const code = params?.code as string;
  const router = useRouter();
  
  const [data, setData] = useState<VerificationPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;

    const runVerification = async () => {
      try {
        const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
        const res = await fetch(`${API_BASE}/certificates/verify/${code}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Verification query failed:', err);
        setData({ verified: false, error: 'Target verification system was unreachable.' });
      } finally {
        setLoading(false);
      }
    };

    runVerification();
  }, [code]);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff6603_1px,transparent_1px),linear-gradient(to_bottom,#00ff6603_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-xl bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center text-xs font-mono text-slate-400 hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> RETURN HOME
          </button>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Verification Node: SECURE</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
            <p className="text-sm font-mono text-green-400">[*] INJECTING CRYPTOGRAPHIC VERIFICATION SEQUENCE...</p>
          </div>
        ) : data?.verified && data.certificate ? (
          // SUCCESS STATE
          <div className="space-y-6">
            <div className="text-center bg-green-500/5 border border-green-500/20 rounded-xl p-6">
              <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-3 animate-pulse" />
              <h2 className="text-2xl font-black text-green-400 tracking-wide">CERTIFICATE VERIFIED</h2>
              <p className="text-xs font-mono text-green-500/80 mt-1 uppercase tracking-wider">Authenticity Check Success (No Tamper Detected)</p>
            </div>

            <div className="bg-[#0a0f1c] border border-slate-850 rounded-xl p-5 space-y-4">
              {/* Recipient */}
              <div className="flex items-start gap-3.5">
                <User className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Recipient Name</span>
                  <p className="text-base font-bold text-slate-100">{data.certificate.recipient_name}</p>
                </div>
              </div>

              {/* Event Name */}
              <div className="flex items-start gap-3.5">
                <Award className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Event Operation</span>
                  <p className="text-base font-bold text-slate-100">{data.certificate.event_name}</p>
                </div>
              </div>

              {/* Verification Code */}
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Cryptographic ID</span>
                  <p className="text-sm font-mono text-green-400 select-all">{data.certificate.certificate_code}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3.5">
                <Calendar className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Date of Issuance</span>
                  <p className="text-sm font-bold text-slate-200">{new Date(data.certificate.issued_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Authority */}
              <div className="flex items-start gap-3.5">
                <UserCheck className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Issuing Authority</span>
                  <p className="text-sm font-bold text-slate-200">{data.certificate.issued_by_name || 'CyberKavach Board'}</p>
                </div>
              </div>
            </div>

            <div className="text-center font-mono text-[10px] text-gray-500">
              CyberKavach Smart Registry System. All rights reserved.
            </div>
          </div>
        ) : (
          // FAIL STATE
          <div className="space-y-6">
            <div className="text-center bg-rose-500/5 border border-rose-500/20 rounded-xl p-6">
              <ShieldAlert className="w-16 h-16 text-rose-400 mx-auto mb-3 animate-bounce" />
              <h2 className="text-2xl font-black text-rose-400 tracking-wide">VERIFICATION FAILURE</h2>
              <p className="text-xs font-mono text-rose-500/80 mt-1 uppercase tracking-wider">Tamper Vector Detected or Non-existent Record</p>
            </div>

            <div className="bg-[#0a0f1c] border border-slate-850 rounded-xl p-5 text-center font-mono text-sm text-slate-400">
              {data?.error || 'The entered certificate verification code does not match any authenticated record in the PostgreSQL registry.'}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => router.push('/')}
                className="flex-1 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 py-3 rounded-lg font-mono text-sm transition-all"
              >
                RETURN HOME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
