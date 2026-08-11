// File: admin/src/app/alerts/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Plus, BellRing, MapPin } from 'lucide-react';

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'চট্টগ্রাম ও কক্সবাজার সমুদ্রবন্দরে ৩ নম্বর স্থানীয় সতর্ক সংকেত', area: 'চট্টগ্রাম, কক্সবাজার', level: 'danger', date: '১০ আগস্ট ২০২৬' },
    { id: '2', title: 'সিলেট ও সুনামগঞ্জ জেলায় নদীসমূহের পানি বৃদ্ধিপাপ্তির পূর্বাভাস', area: 'সিলেট, সুনামগঞ্জ', level: 'warning', date: '১০ আগস্ট ২০২৬' },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">জরুরি নোটিশ ও দুর্যোগ সংকেত ব্যবস্থাপনা</h1>
            <p className="text-xs text-slate-400">জেলা ভিত্তিক রিয়েল-টাইম পুশ অ্যালার্ট ও সতর্কবার্তা নোটিফিকেশন</p>
          </div>
        </div>

        <Link href="/admin" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">
          ← অ্যাডমিন প্যানেল
        </Link>
      </header>

      <main className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">সক্রিয় অ্যালার্ট তালিকা</h3>
            <button
              onClick={() => alert('নতুন জরুরি অ্যালার্ট ফর্ম খুলছে...')}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              + নতুন অ্যালার্ট তৈরি করুন
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      🚨 বিপদ সংকেত
                    </span>
                    <span className="text-[10px] text-slate-400">{a.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{a.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>প্রভাবিত এলাকা: {a.area}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
