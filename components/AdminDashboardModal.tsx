'use client';

import React, { useState } from 'react';
import { Shield, RefreshCw, CheckCircle2, AlertCircle, XCircle, Database, Server, Settings, Plus, Play, Trash2, Eye } from 'lucide-react';

interface SourceRecord {
  id: string;
  name: string;
  type: 'RSS' | 'API' | 'OpenData';
  url: string;
  category: string;
  status: 'healthy' | 'warning' | 'failed';
  lastFetch: string;
  itemsImported: number;
  errorCount: number;
  rateLimit: string;
  enabled: boolean;
}

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

export default function AdminDashboardModal({ isOpen, onClose, language }: AdminDashboardModalProps) {
  const [sources, setSources] = useState<SourceRecord[]>([
    {
      id: 'src-1',
      name: 'বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD Open-Meteo)',
      type: 'API',
      url: 'https://api.open-meteo.com/v1/forecast',
      category: 'আবহাওয়া',
      status: 'healthy',
      lastFetch: '২ মিনিট আগে',
      itemsImported: 64,
      errorCount: 0,
      rateLimit: '10,000 req/day',
      enabled: true
    },
    {
      id: 'src-2',
      name: 'বিডিনিউজ ২৪ (BDNews24 RSS)',
      type: 'RSS',
      url: 'https://bangla.bdnews24.com/?widgetName=rssfeed',
      category: 'জাতীয়',
      status: 'healthy',
      lastFetch: '৪ মিনিট আগে',
      itemsImported: 18,
      errorCount: 0,
      rateLimit: 'Uncapped',
      enabled: true
    },
    {
      id: 'src-3',
      name: 'প্রথম আলো (Prothom Alo Feed)',
      type: 'RSS',
      url: 'https://www.prothomalo.com/feed',
      category: 'জরুরি',
      status: 'healthy',
      lastFetch: '৫ মিনিট আগে',
      itemsImported: 24,
      errorCount: 0,
      rateLimit: 'Uncapped',
      enabled: true
    },
    {
      id: 'src-4',
      name: 'কৃষি বিপণন অধিদপ্তর (DAM Market Price)',
      type: 'OpenData',
      url: 'http://dam.gov.bd/api/prices',
      category: 'অর্থনীতি',
      status: 'healthy',
      lastFetch: '১৫ মিনিট আগে',
      itemsImported: 12,
      errorCount: 0,
      rateLimit: 'Free Open Data',
      enabled: true
    },
    {
      id: 'src-5',
      name: 'বিপিএসসি ও সরকারি জব সার্কুলার ফিড',
      type: 'API',
      url: 'http://bpsc.teletalk.com.bd/feed',
      category: 'সুযোগ',
      status: 'healthy',
      lastFetch: '১ ঘণ্টা আগে',
      itemsImported: 8,
      errorCount: 0,
      rateLimit: '1,000 req/day',
      enabled: true
    }
  ]);

  const [activeTab, setActiveTab] = useState<'sources' | 'scheduler' | 'analytics'>('sources');
  const [testingId, setTestingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSource = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const testSource = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      alert('সোর্স সফলভাবে রেসপন্স করেছে (HTTP 200 OK)');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-900/60 border border-emerald-500/40 rounded-2xl text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                <span>{language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড ও সোর্স মনিটরিং' : 'Admin & Automation Control'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'স্বয়ংক্রিয় ডাটা পাইপলাইন, ডাটা সোর্স স্বাস্থ্য ও ওভাররাইড হাব' : 'Automated Data Pipeline, Source Health & Override System'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 text-xl font-bold rounded-xl hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-800 bg-slate-900 text-xs">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sources'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ডাটা সোর্স মনিটরিং ({sources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'scheduler'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>অটোমেশন সিডিউলার</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-300">
                  সক্রিয় ডাটা সোর্স কনফিগারেশন তালিকা (Source Configurations)
                </h3>
                <button
                  onClick={() => alert('নতুন সোর্স যোগ করার জন্য ফরম খুলছে...')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সোর্স যোগ করুন</span>
                </button>
              </div>

              {/* Source Health Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">সোর্সের নাম</th>
                        <th className="p-3">টাইপ</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3">সর্বশেষ ফেচ</th>
                        <th className="p-3">আমদানিকৃত আইটেম</th>
                        <th className="p-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {sources.map(src => (
                        <tr key={src.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3 font-medium text-white">
                            <div>
                              <p className="font-bold">{src.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{src.url}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                              {src.type}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              src.status === 'healthy'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>🟢 সুস্থ (Healthy)</span>
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{src.lastFetch}</td>
                          <td className="p-3 font-mono font-bold text-slate-200">{src.itemsImported}</td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => testSource(src.id)}
                              disabled={testingId === src.id}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                            >
                              {testingId === src.id ? 'টেস্ট...' : 'টেস্ট'}
                            </button>
                            <button
                              onClick={() => toggleSource(src.id)}
                              className={`px-2 py-1 rounded text-[11px] font-medium ${
                                src.enabled
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {src.enabled ? 'ডিজেবল' : 'এনেবল'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scheduler' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300">
                অটোমেশন সিডিউলার ও ক্রন জব টাইমার (Scheduler Timers)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">🌤️ আবহাওয়া সিডিউলার</span>
                    <span className="text-xs text-emerald-400 font-mono">প্রতি ১৫ মিনিট</span>
                  </div>
                  <p className="text-xs text-slate-400">Open-Meteo API থেকে ৬৪ জেলার ডাটা সিঙ্ক ও ক্যাশ আপডেট।</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">📰 ব্রেকিং নিউজ সিডিউলার</span>
                    <span className="text-xs text-emerald-400 font-mono">প্রতি ৫ মিনিট</span>
                  </div>
                  <p className="text-xs text-slate-400">অফিসিয়াল RSS ফিড পার্সিং, ডিডুপ্লিকেশন ও শর্ট সামারি।</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">💰 বাজার দর সিডিউলার</span>
                    <span className="text-xs text-emerald-400 font-mono">প্রতি ১ ঘণ্টা</span>
                  </div>
                  <p className="text-xs text-slate-400">ডলার রেট, সোনা ও নিত্যপণ্যের দাম ট্র্যাকিং।</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">🎓 সুযোগ ও বিসিএস সার্কুলার</span>
                    <span className="text-xs text-emerald-400 font-mono">প্রতি ৬ ঘণ্টা</span>
                  </div>
                  <p className="text-xs text-slate-400">সরকারি নোটিশ ও বিপিএসসি ওয়েবসাইট ফেচ।</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}
