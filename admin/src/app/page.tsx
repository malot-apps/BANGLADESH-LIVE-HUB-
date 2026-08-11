// File: admin/src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Tv, Database, Activity, RefreshCw, Upload, Play, Server } from 'lucide-react';

export default function AdminDashboardPage() {
  const [channels, setChannels] = useState([
    { id: 'ch-1', name: 'সময় টিভি (Somoy News)', category: 'সংবাদ', status: 'online', proxyEnabled: true, resolution: '1080p', pingMs: 42 },
    { id: 'ch-2', name: 'যমুনা টিভি (Jamuna TV)', category: 'সংবাদ', status: 'online', proxyEnabled: true, resolution: '1080p', pingMs: 58 },
    { id: 'ch-3', name: 'একাত্তর টিভি (Ekattor TV)', category: 'সংবাদ', status: 'slow', proxyEnabled: true, resolution: '720p', pingMs: 320 },
    { id: 'ch-4', name: 'বিটিভি জাতীয় (BTV National)', category: 'জাতীয়', status: 'online', proxyEnabled: false, resolution: '1080p', pingMs: 25 },
    { id: 'ch-5', name: 'টি স্পোর্টস (T Sports)', category: 'খেলাধুলা', status: 'offline', proxyEnabled: true, resolution: '1080p', pingMs: 0 },
  ]);

  const [isM3UModalOpen, setIsM3UModalOpen] = useState(false);
  const [m3uContent, setM3uContent] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-rose-500" />
          <div>
            <h1 className="text-2xl font-black text-white">বাংলাদেশ লাইভ হাব — এডমিন প্যানেল (admin/)</h1>
            <p className="text-xs text-slate-400">লাইভ টিভি চ্যানেল ও অটোমেশন কন্ট্রোল সেন্টার</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">মোট চ্যানেল</p>
            <p className="text-3xl font-black text-white">{channels.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Edge Proxy</p>
            <p className="text-3xl font-black text-emerald-400">সক্রিয় (HTTPS)</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">অটোমেশন হেলথ</p>
            <p className="text-3xl font-black text-sky-400">100% Normal</p>
          </div>
        </div>
      </main>
    </div>
  );
}
