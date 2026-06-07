// frontend/src/app/dashboard/certificates/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Award, Upload, FileSpreadsheet, Eye, Play, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface Certificate {
  id: string;
  certificate_code: string;
  recipient_name: string;
  event_name: string;
  issued_at: string;
  file_url: string;
  recipient_email?: string;
}

interface EventSummary {
  event_id: string;
  title: string;
  status: string;
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [userRole, setUserRole] = useState<string>('Club Member');
  const [userClearance, setUserClearance] = useState<number>(2);
  const [userName, setUserName] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-certs' | 'generate'>('my-certs');

  // Generator State
  const [selectedEventId, setSelectedEventId] = useState('');
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateFilename, setTemplateFilename] = useState('');
  const [templateUrl, setTemplateUrl] = useState('');
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [mapping, setMapping] = useState({ name: '', email: '' });
  
  // Placement coordinates
  const [coords, setCoords] = useState({
    name_x: 200, name_y: 350, name_size: 32,
    event_x: 200, event_y: 250, event_size: 20,
    date_x: 200, date_y: 180, date_size: 14,
    code_x: 200, code_y: 120, code_size: 12
  });

  // Job progress state
  const [jobId, setJobId] = useState('');
  const [jobProgress, setJobProgress] = useState({ current: 0, total: 0, status: '', zipPath: '' });
  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCoordinator = userClearance >= 3;

  useEffect(() => {
    // Read user details from local storage
    const token = localStorage.getItem('cyber_jwt_token');
    
    // Fallback info if JWT bypass is active
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setUserClearance(payload.clearance);
      } else {
        // Fallback for development bypass
        setUserRole('Super Admin');
        setUserClearance(5);
      }
    } catch (e) {
      setUserRole('Super Admin');
      setUserClearance(5);
    }

    fetchCertificates();
    fetchEvents();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('cyber_jwt_token');
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      const res = await fetch(`${API_BASE}/certificates/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.certificates) {
        setCerts(data.certificates);
      }
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
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
      console.error('Failed to load events:', err);
    }
  };

  // Upload certificate template
  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setTemplateFile(file);
    setUploadingTemplate(true);

    const formData = new FormData();
    formData.append('template', file);

    try {
      const token = localStorage.getItem('cyber_jwt_token');
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      const res = await fetch(`${API_BASE}/certificates/upload-template`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.filename) {
        setTemplateFilename(data.filename);
        setTemplateUrl(data.path);
      } else {
        alert(data.error || 'Failed to upload template.');
      }
    } catch (err) {
      console.error('Template upload error:', err);
      alert('Network exception uploading template.');
    } finally {
      setUploadingTemplate(false);
    }
  };

  // Import Excel/CSV data using sheetJS
  const handleDataImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);
        
        if (rawData.length === 0) {
          setValidationErrors(['The spreadsheet contains no data rows.']);
          return;
        }

        setParsedData(rawData);
        
        // Auto map properties if they match name or email
        const firstRow = rawData[0] as any;
        const keys = Object.keys(firstRow);
        const nameKey = keys.find(k => k.toLowerCase().includes('name')) || '';
        const emailKey = keys.find(k => k.toLowerCase().includes('email')) || '';
        setMapping({ name: nameKey, email: emailKey });
        
        validateData(rawData, nameKey, emailKey);
      } catch (err) {
        console.error('Data import failed:', err);
        setValidationErrors(['Failed to parse file. Ensure it is a valid Excel or CSV file.']);
      }
    };
    reader.readAsBinaryString(file);
  };

  const validateData = (dataList: any[], nameKey: string, emailKey: string) => {
    const errors: string[] = [];
    if (!nameKey) errors.push('Missing Name mapping.');
    
    dataList.forEach((row, i) => {
      if (!row[nameKey]) errors.push(`Row ${i + 2}: Name field is empty.`);
      if (emailKey && row[emailKey] && !row[emailKey].includes('@')) {
        errors.push(`Row ${i + 2}: Invalid email format "${row[emailKey]}".`);
      }
    });

    setValidationErrors(errors);
  };

  const handleMappingChange = (field: 'name' | 'email', value: string) => {
    const newMapping = { ...mapping, [field]: value };
    setMapping(newMapping);
    validateData(parsedData, newMapping.name, newMapping.email);
  };

  // Trigger Bulk Generation Job
  const triggerGeneration = async () => {
    if (!selectedEventId) {
      alert('Please select an event.');
      return;
    }
    if (!templateFilename) {
      alert('Please upload a template background.');
      return;
    }
    if (parsedData.length === 0) {
      alert('Please import participant data.');
      return;
    }
    if (validationErrors.length > 0) {
      if (!confirm('There are validation issues. Do you wish to proceed anyway?')) return;
    }

    const formattedParticipants = parsedData.map(row => ({
      name: row[mapping.name],
      email: row[mapping.email] || ''
    }));

    try {
      const token = localStorage.getItem('cyber_jwt_token');
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      const res = await fetch(`${API_BASE}/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: selectedEventId,
          template_filename: templateFilename,
          options: coords,
          participants: formattedParticipants
        })
      });
      const data = await res.json();
      
      if (data.jobId) {
        setJobId(data.jobId);
        setJobProgress({ current: 0, total: formattedParticipants.length, status: 'GENERATING', zipPath: '' });
        
        // Start polling progress
        const interval = setInterval(() => pollJobProgress(data.jobId, interval), 1500);
        setProgressTimer(interval);
      } else {
        alert(data.error || 'Failed to initialize certificate generation.');
      }
    } catch (err) {
      console.error(err);
      alert('Error triggering certificate generation.');
    }
  };

  const pollJobProgress = async (id: string, interval: NodeJS.Timeout) => {
    try {
      const token = localStorage.getItem('cyber_jwt_token');
      const API_BASE = `http://${window.location.hostname}:5000/api/v1`;
      const res = await fetch(`${API_BASE}/certificates/job/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      setJobProgress(data);
      
      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        clearInterval(interval);
        setProgressTimer(null);
        fetchCertificates(); // Reload main certificate listing
      }
    } catch (err) {
      console.error('Error polling job progress:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [progressTimer]);

  const handleCoordChange = (field: string, val: number) => {
    setCoords(prev => ({ ...prev, [field]: val }));
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
                <Award className="text-green-400 w-8 h-8" />
                Certificate Management Console
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Automated bulk certificate overlay, secure storage, and tamper-proof public verification keys.
              </p>
            </div>
            
            {/* Tab selector */}
            {isCoordinator && (
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('my-certs')}
                  className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === 'my-certs' ? 'bg-green-500 text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  Issued Ledger
                </button>
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === 'generate' ? 'bg-green-500 text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  Bulk Generator
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-green-400 font-mono animate-pulse border border-green-500/20 bg-[#111827] p-6 rounded-xl inline-block">
              [*] CONNECTING CERTIFICATE REGISTRY...
            </div>
          ) : activeTab === 'my-certs' ? (
            <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-white">Issued Certificates</h2>
              {certs.length === 0 ? (
                <p className="text-sm font-mono text-gray-500 py-6 text-center border border-dashed border-slate-800 rounded-lg">
                  No certificate records registered to your identity.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase bg-slate-950/60">
                        <th className="py-3 px-4">Recipient</th>
                        {isCoordinator && <th className="py-3 px-4">Email</th>}
                        <th className="py-3 px-4">Event Operation</th>
                        <th className="py-3 px-4">Verification ID</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">File download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {certs.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-200">{cert.recipient_name}</td>
                          {isCoordinator && <td className="py-3.5 px-4 font-mono text-xs text-gray-400">{cert.recipient_email || 'N/A'}</td>}
                          <td className="py-3.5 px-4 text-cyan-400">{cert.event_name}</td>
                          <td className="py-3.5 px-4 font-mono text-green-400 text-xs select-all">{cert.certificate_code}</td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{new Date(cert.issued_at).toLocaleDateString()}</td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`http://${window.location.hostname}:5000${cert.file_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-cyan-400 font-mono hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all"
                            >
                              Open PDF
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            // GENERATION SUITE
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN: Data & Template upload */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Selection & Upload */}
                <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl space-y-5">
                  <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-2">1. Operation Parameters</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Target Club Event</label>
                      <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full bg-[#0a0f1c] border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-green-400 text-sm"
                      >
                        <option value="">-- Select Published Event --</option>
                        {events.map(ev => (
                          <option key={ev.event_id} value={ev.event_id}>{ev.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-xs font-mono uppercase text-gray-400">Upload Certificate Template (PDF/PNG/JPG)</label>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-between bg-[#0a0f1c] border border-slate-700 rounded px-3 py-2 text-slate-400 text-sm cursor-pointer hover:border-green-400/50 transition-colors">
                          <span className="truncate">{templateFile ? templateFile.name : 'Choose template...'}</span>
                          <Upload className="w-4 h-4 text-green-400" />
                          <input type="file" onChange={handleTemplateUpload} accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
                        </label>
                        {uploadingTemplate && <RefreshCw className="w-5 h-5 text-green-400 animate-spin self-center" />}
                      </div>
                      {templateUrl && (
                        <p className="text-[10px] text-green-400 font-mono mt-1">Uploaded: {templateFilename}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Spreadsheet Import */}
                <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl space-y-5">
                  <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-2">2. Participant Dataset Ingestion</h3>
                  
                  <div className="bg-[#0a0f1c] border border-slate-850 rounded-lg p-6 text-center border-dashed hover:border-green-500/30 transition-all">
                    <FileSpreadsheet className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold mb-1 text-slate-300">Import Excel Spreadsheet or CSV File</p>
                    <p className="text-xs text-gray-500 mb-4 font-mono">Required columns: Participant Name. Optional: Participant Email</p>
                    
                    <label className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-colors">
                      CHOOSE SPREADSHEET
                      <input type="file" ref={fileInputRef} onChange={handleDataImport} accept=".csv,.xlsx,.xls" className="hidden" />
                    </label>
                  </div>

                  {/* Field Mapping UI */}
                  {parsedData.length > 0 && (
                    <div className="bg-[#0a0f1c] border border-slate-800 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-sm font-mono text-slate-350">Mapped Data Columns ({parsedData.length} records)</span>
                        {validationErrors.length > 0 ? (
                          <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {validationErrors.length} Warnings Detected
                          </span>
                        ) : (
                          <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Validation Integrity Check Passed
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 font-mono mb-1">MAP NAME FIELD TO COLUMN:</label>
                          <select
                            value={mapping.name}
                            onChange={(e) => handleMappingChange('name', e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 w-full text-xs"
                          >
                            <option value="">-- Choose Name Column --</option>
                            {Object.keys(parsedData[0] || {}).map(k => (
                              <option key={k} value={k}>{k}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 font-mono mb-1">MAP EMAIL FIELD TO COLUMN (OPTIONAL):</label>
                          <select
                            value={mapping.email}
                            onChange={(e) => handleMappingChange('email', e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 w-full text-xs"
                          >
                            <option value="">-- Choose Email Column --</option>
                            {Object.keys(parsedData[0] || {}).map(k => (
                              <option key={k} value={k}>{k}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {validationErrors.length > 0 && (
                        <div className="bg-amber-950/20 border border-amber-900/30 text-amber-300 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto space-y-1">
                          {validationErrors.slice(0, 10).map((err, idx) => (
                            <p key={idx}>[!] {err}</p>
                          ))}
                          {validationErrors.length > 10 && <p>... and {validationErrors.length - 10} more warnings</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Coordinates Configuration & Generation Control */}
              <div className="space-y-6">
                
                {/* 3. Text Overlay Coordinates Settings */}
                <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl space-y-5">
                  <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-2">3. Layout Coordinates</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    Define pixel offsets on certificate background canvas [0 - 800].
                  </p>
                  
                  <div className="space-y-4 text-xs font-mono">
                    {/* Name Placement */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-350">
                        <span>Recipient Name (X, Y)</span>
                        <span className="text-cyan-400">({coords.name_x}, {coords.name_y}, {coords.name_size}pt)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="number" value={coords.name_x} onChange={(e) => handleCoordChange('name_x', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                        <input type="number" value={coords.name_y} onChange={(e) => handleCoordChange('name_y', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                        <input type="number" value={coords.name_size} onChange={(e) => handleCoordChange('name_size', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                      </div>
                    </div>

                    {/* Event Title Placement */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-350">
                        <span>Event Title (X, Y)</span>
                        <span className="text-cyan-400">({coords.event_x}, {coords.event_y}, {coords.event_size}pt)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="number" value={coords.event_x} onChange={(e) => handleCoordChange('event_x', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                        <input type="number" value={coords.event_y} onChange={(e) => handleCoordChange('event_y', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                        <input type="number" value={coords.event_size} onChange={(e) => handleCoordChange('event_size', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                      </div>
                    </div>

                    {/* Verification ID Code Placement */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-350">
                        <span>Verify Code (X, Y)</span>
                        <span className="text-cyan-400">({coords.code_x}, {coords.code_y}, {coords.code_size}pt)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="number" value={coords.code_x} onChange={(e) => handleCoordChange('code_x', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                        <input type="number" value={coords.code_y} onChange={(e) => handleCoordChange('code_y', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                        <input type="number" value={coords.code_size} onChange={(e) => handleCoordChange('code_size', parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 text-center rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Generation Execution Deck */}
                <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-2">4. Pipeline Execution</h3>
                  
                  {jobId ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-mono text-gray-400">
                        <span>Job Progress</span>
                        <span>{jobProgress.current} / {jobProgress.total}</span>
                      </div>
                      
                      <div className="w-full bg-[#0a0f1c] border border-slate-800 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${jobProgress.total > 0 ? (jobProgress.current / jobProgress.total) * 100 : 0}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={`px-2 py-1 rounded font-bold ${
                          jobProgress.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          jobProgress.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
                        }`}>{jobProgress.status}</span>
                        
                        {jobProgress.status === 'COMPLETED' && jobProgress.zipPath && (
                          <a
                            href={`http://${window.location.hostname}:5000${jobProgress.zipPath}`}
                            className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5"
                          >
                            DOWNLOAD ZIP FILE
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={triggerGeneration}
                      className="w-full bg-green-500 hover:bg-green-400 text-black font-extrabold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      TRIGGER CERTIFICATE OVERLAY
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
