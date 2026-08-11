// File: admin/src/app/audit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, Shield, RefreshCw, Server, AlertCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'danger';
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/audit')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.logs) {
          setLogs(data.logs);
        }
      })
      .catch(err => console.error('Error fetching audit logs:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-sky-400" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">অটোমেশন ও অ্যাকশন অডিট মনিটরিং (Audit Logs Table)</h1>
            <p className="text-xs text-slate-400">IP এড্রেস, ইউজার আইডি এবং বিস্তারিত অ্যাকশন ট্র্যাকিং সিস্টেমে সংসংরক্ষিত</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ লবস</span>
          </button>
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700">
            ← অ্যাডমিন প্যানেল
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>রিয়েল-টাইম অডিট লগ ডাটাবেস (`audit_logs`)</span>
            </h3>
            <span className="text-xs text-slate-400">মোট রেকর্ড: {logs.length} টি</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">টাইমস্ট্যাম্প</th>
                  <th className="p-3.5">ইউজার ID</th>
                  <th className="p-3.5">IP এড্রেস</th>
                  <th className="p-3.5">অ্যাকশন / ইভেন্ট</th>
                  <th className="p-3.5">লেভেল</th>
                  <th className="p-3.5">বিস্তারিত (Details)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('bn-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="p-3.5 text-emerald-400 font-bold">{log.userId}</td>
                    <td className="p-3.5 text-sky-400">{log.ipAddress}</td>
                    <td className="p-3.5 font-bold text-white">{log.action}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          log.severity === 'danger'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : log.severity === 'warning'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {log.severity || 'info'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

