'use client';

import React, { useState } from 'react';
import { ExternalLink, Clock, ShieldCheck, AlertCircle, Sparkles, Share2 } from 'lucide-react';
import { NewsItem } from '@/app/api/news/route';

interface BreakingNewsSectionProps {
  newsItems: NewsItem[];
  loading: boolean;
  language: 'bn' | 'en';
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onShareItem: (title: string, url: string) => void;
}

export default function BreakingNewsSection({
  newsItems,
  loading,
  language,
  activeCategory,
  onSelectCategory,
  onShareItem
}: BreakingNewsSectionProps) {
  const [now] = useState(() => Date.now());

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMinutes = Math.floor((now - date.getTime()) / (1000 * 60));
      if (diffMinutes < 1) return language === 'bn' ? 'এইমাত্র' : 'Just now';
      if (diffMinutes < 60) return language === 'bn' ? `${diffMinutes} মিনিট আগে` : `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return language === 'bn' ? `${diffHours} ঘণ্টা আগে` : `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return language === 'bn' ? `${diffDays} দিন আগে` : `${diffDays}d ago`;
    } catch (e) {
      return language === 'bn' ? 'সাম্প্রতিক' : 'Recent';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {language === 'bn' ? '🔴 সরাসরি সংবাদ ও হালনাগাদ তথ্য' : '🔴 Breaking News & Live Updates'}
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {newsItems.length} {language === 'bn' ? 'টি তথ্য' : 'items'}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-full"></div>
              <div className="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : newsItems.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="font-bold text-sm">
            {language === 'bn' ? 'কোনো বিষয় পাওয়া যায়নি' : 'No items matched your filter'}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            {language === 'bn' ? 'অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বা সার্চ কিওয়ার্ড দিয়ে চেষ্টা করুন।' : 'Try selecting another category or clearing search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-sm hover:shadow-md transition-all relative ${
                item.urgency === 'high'
                  ? 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              {/* Category & Urgency Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.category === 'সতর্কতা'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : item.category === 'অর্থনীতি'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : item.category === 'শিক্ষা'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {item.category}
                  </span>

                  {item.location && (
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                      📍 {item.location}
                    </span>
                  )}

                  {item.urgency === 'high' && (
                    <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-md animate-pulse">
                      {language === 'bn' ? 'জরুরি' : 'URGENT'}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                </span>
              </div>

              {/* Title */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors leading-snug">
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {item.title}
                </a>
              </h4>

              {/* Short Summary (Transformed / AI Cleaned) */}
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {item.summary}
              </p>

              {/* Footer Attribution & Action Buttons */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">{item.sourceName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400">{language === 'bn' ? 'যাচাইকৃত সোর্স' : 'Verified Source'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onShareItem(item.title, item.sourceUrl)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                    title="Share item"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl transition-all border border-emerald-200"
                  >
                    <span>{language === 'bn' ? 'মূল উৎস দেখুন' : 'View Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
