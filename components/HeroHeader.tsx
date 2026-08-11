'use client';

import React from 'react';
import { Flame, Sparkles, Clock, RefreshCw, ShieldCheck, Share2 } from 'lucide-react';

interface HeroHeaderProps {
  language: 'bn' | 'en';
  districtNameBn: string;
  districtNameEn: string;
  trendingTopics: { tag: string; count: number; category: string }[];
  lastUpdatedTime: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onShare: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function HeroHeader({
  language,
  districtNameBn,
  districtNameEn,
  trendingTopics,
  lastUpdatedTime,
  onRefresh,
  isRefreshing,
  onShare,
  activeCategory,
  onSelectCategory
}: HeroHeaderProps) {
  const categories = [
    { id: 'all', labelBn: '🔴 সব লাইভ', labelEn: 'All Live' },
    { id: 'রাজনীতি', labelBn: '🗳️ রাজনীতি', labelEn: 'Politics' },
    { id: 'জলবায়ু', labelBn: '⛈️ জলবায়ু', labelEn: 'Climate' },
    { id: 'খেলাধুলা', labelBn: '⚽ খেলাধুলা', labelEn: 'Sports' },
    { id: 'জাতীয়', labelBn: '📰 জাতীয়', labelEn: 'National' },
    { id: 'অর্থনীতি', labelBn: '💰 দরদাম', labelEn: 'Prices' },
    { id: 'শিক্ষা', labelBn: '🎓 শিক্ষা', labelEn: 'Education' },
    { id: 'প্রযুক্তি', labelBn: '💻 প্রযুক্তি', labelEn: 'Tech' },
    { id: 'সতর্কতা', labelBn: '🚨 সতর্কতা', labelEn: 'Alerts' },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-5 pb-4 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Badge & Live Ticker Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
            <span>
              {language === 'bn' ? `${districtNameBn} এলাকা ও জাতীয় লাইভ আপডেট` : `Live Updates for ${districtNameEn} & BD`}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'bn' ? 'সর্বশেষ:' : 'Updated:'} {lastUpdatedTime}</span>
            </span>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="text-[11px]">{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>

            <button
              onClick={onShare}
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors bg-emerald-900/50 px-2 py-0.5 rounded-md border border-emerald-700/50"
            >
              <Share2 className="w-3 h-3" />
              <span className="text-[11px] font-medium">{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Main Hero Headline Question */}
        <div className="my-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            {language === 'bn' ? 'বাংলাদেশে এখন গুরুত্বপূর্ণ কী হচ্ছে?' : 'What is happening in Bangladesh right now?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {language === 'bn'
              ? 'বাংলাদেশ আবহাওয়া অধিদপ্তর, সরকারি ওপেন-ডাটা, আন্তর্জাতিক পূর্বাভাস ও মূল সংবাদপত্রের যাচাইকৃত স্বয়ংক্রিয় আপডেট।'
              : 'Continuous automated feed from verified BMD weather, open-data portals, market prices, and public notifications.'}
          </p>
        </div>

        {/* Trending Tags Ticker */}
        {trendingTopics.length > 0 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{language === 'bn' ? 'ট্রেন্ডিং:' : 'Trending:'}</span>
            </span>
            {trendingTopics.map((item, idx) => (
              <span
                key={idx}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-200 font-medium hover:border-amber-500/50 hover:text-amber-300 transition-all cursor-pointer"
              >
                {item.tag} <span className="text-[10px] text-slate-400">({item.count})</span>
              </span>
            ))}
          </div>
        )}

        {/* Category Pills Slider */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 border border-emerald-400'
                  : 'bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:bg-slate-750 hover:text-white'
              }`}
            >
              {language === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
