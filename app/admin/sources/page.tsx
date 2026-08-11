// File: admin/src/app/sources/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Database, Plus, RefreshCw, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState([
    { id: '1', name: 'বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD Open-Meteo)', type: 'API', category: 'আবহাওয়া', enabled: true, lastFetch: '২ মিনিট আগে' },
    { id: '2', name: 'বিডিনিউজ ২৪ (BDNews24 RSS)', type: 'RSS', category: 'জাতীয়', enabled: true, lastFetch: '৪ মিনিট আগে' },
    { id: '3', name: 'প্রথম আলো (Prothom Alo RSS)', type: 'RSS', category: 'জরুরি', enabled: true, lastFetch: '৫ মিনিট আগে' },
    { id: '4', name: 'কৃষি বিপণন অধিদপ্তর (DAM Market Price)', type: 'OpenData', category: 'অর্থনীতি', enabled: true, lastFetch: '১৫ মিনিট আগে' },
    { id: '5', name: 'বিপিএসসি ও সরকারি জব সার্কুলার ফিড', type: 'API', category: 'সুযোগ', enabled: true, lastFetch: '১ ঘণ্টা আগে' },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">উন্মুক্ত সোর্স ও আরএসএস ফিড কনফিগারেশন</h1>
            <p className="text-xs text-slate-400">সরকারি ওপেন ডাটা, RSS ফিড ও এপিআই সোর্স হাব</p>
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
                <th className="p-3.5">সোর্সের নাম</th>
                <th className="p-3.5">টাইপ</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">সর্বশেষ ফেচ</th>
                <th className="p-3.5 text-right">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white">{s.name}</td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400">{s.type}</td>
                  <td className="p-3.5 text-slate-300">{s.category}</td>
                  <td className="p-3.5 text-slate-400">{s.lastFetch}</td>
                  <td className="p-3.5 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      🟢 Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
