// File: admin/src/app/channels/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Tv, Plus, Trash2, Edit3, RefreshCw, CheckCircle2, XCircle, AlertCircle, Play } from 'lucide-react';
import { logAdminAction } from '@/lib/auditLogger';

export default function AdminChannelsPage() {
  const [channels, setChannels] = useState([
    { id: '1', nameBn: 'সময় টিভি', nameEn: 'Somoy News', category: 'সংবাদ', streamUrl: 'https://cdn.somoynews.tv/live/somoynews/index.m3u8', proxy: true, isOnline: true },
    { id: '2', nameBn: 'যমুনা টিভি', nameEn: 'Jamuna TV', category: 'সংবাদ', streamUrl: 'https://live-cdn.jamuna.tv/hls/jamunatv.m3u8', proxy: true, isOnline: true },
    { id: '3', nameBn: 'একাত্তর টিভি', nameEn: 'Ekattor TV', category: 'সংবাদ', streamUrl: 'https://stream.ekattor.tv/hls/live.m3u8', proxy: true, isOnline: true },
    { id: '4', nameBn: 'ডিবিসি নিউজ', nameEn: 'DBC News', category: 'সংবাদ', streamUrl: 'https://dbcnews.tv/live/stream.m3u8', proxy: true, isOnline: true },
    { id: '5', nameBn: 'বিটিভি জাতীয়', nameEn: 'BTV National', category: 'জাতীয়', streamUrl: 'https://btvlive.gov.bd/hls/national.m3u8', proxy: false, isOnline: true },
    { id: '6', nameBn: 'টি স্পোর্টস', nameEn: 'T Sports', category: 'খেলাধুলা', streamUrl: 'https://tsports.live/hls/channel1.m3u8', proxy: true, isOnline: true },
  ]);

  const [newChannel, setNewChannel] = useState({ nameBn: '', nameEn: '', category: 'সংবাদ', streamUrl: '' });
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddChannel = async () => {
    if (!newChannel.nameBn || !newChannel.streamUrl) return;
    const addedChannelName = newChannel.nameBn;
    setChannels([
      ...channels,
      {
        id: Date.now().toString(),
        nameBn: newChannel.nameBn,
        nameEn: newChannel.nameEn || newChannel.nameBn,
        category: newChannel.category,
        streamUrl: newChannel.streamUrl,
        proxy: true,
        isOnline: true,
      },
    ]);

    // Record audit log entry in audit_logs
    await logAdminAction({
      userId: 'admin-operator',
      action: 'TV Channel Added',
      details: `New TV Channel '${addedChannelName}' (${newChannel.category}) created with stream ${newChannel.streamUrl}`,
      severity: 'info',
    });

    setNewChannel({ nameBn: '', nameEn: '', category: 'সংবাদ', streamUrl: '' });
    setIsAddOpen(false);
  };

  const handleDeleteChannel = async (id: string) => {
    const targetChannel = channels.find(c => c.id === id);
    if (confirm('আপনি কি এই চ্যানেলটি মুছে ফেলতে চান?')) {
      setChannels(channels.filter(c => c.id !== id));
      if (targetChannel) {
        await logAdminAction({
          userId: 'admin-operator',
          action: 'TV Channel Deleted',
          details: `TV Channel '${targetChannel.nameBn}' (ID: ${id}) was deleted from channel list`,
          severity: 'warning',
        });
      }
    }
  };

  const handleToggleProxy = async (ch: typeof channels[0]) => {
    const newProxyState = !ch.proxy;
    setChannels(channels.map(c => c.id === ch.id ? { ...c, proxy: newProxyState } : c));
    await logAdminAction({
      userId: 'admin-operator',
      action: 'TV Channel Proxy Toggled',
      details: `Edge proxy state for '${ch.nameBn}' set to ${newProxyState ? 'ON' : 'OFF'}`,
      severity: 'info',
    });
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Tv className="w-8 h-8 text-rose-500" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">লাইভ টিভি চ্যানেল সিআরইউডি (CRUD)</h1>
            <p className="text-xs text-slate-400">নতুন টিভি চ্যানেল যোগ, এডিট, ডিলিট এবং স্ট্রিম প্রক্সি ম্যানেজমেন্ট</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">
            ← অ্যাডমিন প্যানেল
          </Link>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন চ্যানেল যোগ করুন</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">চ্যানেল বাংলা</th>
                  <th className="p-3.5">English Name</th>
                  <th className="p-3.5">ক্যাটাগরি</th>
                  <th className="p-3.5">M3U8 Stream URL</th>
                  <th className="p-3.5">Edge Proxy</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {channels.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white">{ch.nameBn}</td>
                    <td className="p-3.5 text-slate-300">{ch.nameEn}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-rose-300 font-mono text-[10px]">
                        {ch.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400 max-w-xs truncate">{ch.streamUrl}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleProxy(ch)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          ch.proxy ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ch.proxy ? 'HTTPS Proxy ON' : 'Proxy OFF'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteChannel(ch.id)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-slate-100 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">নতুন চ্যানেল এনট্রি</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">চ্যানেলের নাম (বাংলা)</label>
                <input
                  type="text"
                  value={newChannel.nameBn}
                  onChange={(e) => setNewChannel({ ...newChannel, nameBn: e.target.value })}
                  placeholder="যেমন: চ্যানেল ২৪"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">English Name</label>
                <input
                  type="text"
                  value={newChannel.nameEn}
                  onChange={(e) => setNewChannel({ ...newChannel, nameEn: e.target.value })}
                  placeholder="e.g. Channel 24"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ক্যাটাগরি</label>
                <select
                  value={newChannel.category}
                  onChange={(e) => setNewChannel({ ...newChannel, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="সংবাদ">সংবাদ</option>
                  <option value="খেলাধুলা">খেলাধুলা</option>
                  <option value="বিনোদন">বিনোদন</option>
                  <option value="ইসলামিক">ইসলামিক</option>
                  <option value="জাতীয়">জাতীয়</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">HLS / M3U8 Stream URL</label>
                <input
                  type="text"
                  value={newChannel.streamUrl}
                  onChange={(e) => setNewChannel({ ...newChannel, streamUrl: e.target.value })}
                  placeholder="https://example.com/live/stream.m3u8"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={handleAddChannel}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
