// frontend/src/app/verify/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Search } from 'lucide-react';

export default function VerifySearchPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/verify/${code.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff6603_1px,transparent_1px),linear-gradient(to_bottom,#00ff6603_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center text-xs font-mono text-slate-400 hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> RETURN HOME
          </button>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">REGISTRY GATEWAY</span>
        </div>

        <div className="text-center mb-6">
          <ShieldAlert className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Verify Certificate</h1>
          <p className="text-xs text-gray-400 mt-1">Verify CyberKavach credential registry authenticity and check for modifications.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Certificate Verification Code</label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CK-CSCT-5D2B-1"
                className="w-full bg-[#0a0f1c] border border-slate-700 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-green-400 text-slate-150 font-mono text-sm"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black font-extrabold py-3.5 rounded-lg text-sm transition-all"
          >
            VERIFY CREDENTIAL
          </button>
        </form>
      </div>
    </div>
  );
}
