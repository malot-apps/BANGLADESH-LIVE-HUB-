// File: admin/src/app/audit/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Shield, FileText } from 'lucide-react';

export default function AdminAuditPage() {
  const logs = [
    { id: '1', action: 'TV Channel Proxy Toggled', user: 'Admin', timestamp: '১০ আগস্ট ২০২৬ ২১:১৫', details: 'Somoy News proxy state changed to ON' },
    { id: '2', action: 'Weather Sync Automated', user: 'System Cron', timestamp: '১০ আগস্ট ২০২৬ ২১:০০', details: 'Open-Meteo 64 districts updated successfully' },
    { id: '3', name: 'RSS News Parsing Completed', user: 'RSS Worker', timestamp: '১০ আগস্ট ২০২৬ ২০:৪৫', details: '18 items fetched from Prothom Alo & BDNews24' },
    { id: '4', action: 'M3U Playlist Imported', user: 'Admin', timestamp: '১০ আগস্ট ২০২৬ ২০:৩০', details: 'Imported 12 channels via bulk M3U parser' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-sky-400" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">অটোমেশন ও অ্যাকশন অডিট মনিটরিং (Audit Log)</h1>
            <p className="text-xs text-slate-400">সিস্টেম সিকিউরিটি, ক্রন জব রান ও অ্যাডমিন কার্যক্রমের লগ</p>
          </div>
        </div>

        <Link href="/admin" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">
          ← অ্যাডমিন প্যানেল
        </Link>
      </header>

      <main className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">টাইমস্ট্যাম্প</th>
                <th className="p-3.5">অ্যাকশন / ইভেন্ট</th>
                <th className="p-3.5">ইউজার / অ্যাক্টর</th>
                <th className="p-3.5">বিস্তারিত (Details)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-white">{log.action || log.name}</td>
                  <td className="p-3.5 text-emerald-400">{log.user}</td>
                  <td className="p-3.5 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
