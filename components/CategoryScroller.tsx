'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter, RotateCcw } from 'lucide-react';

export interface CategoryItem {
  id: string;
  labelBn: string;
  labelEn: string;
  icon: string;
  color?: string;
}

interface CategoryScrollerProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  language: 'bn' | 'en';
  totalNewsCount?: number;
}

export const NEWS_CATEGORIES: CategoryItem[] = [
  { id: 'all', labelBn: 'সব খবর', labelEn: 'All News', icon: '🔴' },
  { id: 'রাজনীতি', labelBn: 'রাজনীতি', labelEn: 'Politics', icon: '🗳️' },
  { id: 'জলবায়ু', labelBn: 'জলবায়ু ও পরিবেশ', labelEn: 'Climate', icon: '⛈️' },
  { id: 'খেলাধুলা', labelBn: 'খেলাধুলা', labelEn: 'Sports', icon: '⚽' },
  { id: 'জাতীয়', labelBn: 'জাতীয়', labelEn: 'National', icon: '📰' },
  { id: 'অর্থনীতি', labelBn: 'অর্থনীতি ও বাজার', labelEn: 'Economy', icon: '💰' },
  { id: 'শিক্ষা', labelBn: 'শিক্ষা', labelEn: 'Education', icon: '🎓' },
  { id: 'প্রযুক্তি', labelBn: 'প্রযুক্তি', labelEn: 'Tech', icon: '💻' },
  { id: 'সতর্কতা', labelBn: 'জরুরি সতর্কতা', labelEn: 'Alerts', icon: '🚨' }
];

export default function CategoryScroller({
  activeCategory,
  onSelectCategory,
  language,
  totalNewsCount
}: CategoryScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 z-30 bg-slate-900/95 backdrop-blur-md border-y border-slate-800 text-white shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-1.5 py-2">
        
        {/* Left Filter Icon / Label */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-800 text-slate-400 text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
        </div>

        {/* Left Scroll Nav Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="shrink-0 p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors hidden sm:flex items-center justify-center border border-slate-700/60"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Main Horizontal Category Scroller */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-1"
        >
          {NEWS_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-150 border select-none ${
                  isActive
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950/50 scale-[1.02]'
                    : 'bg-slate-800/90 border-slate-700/80 text-slate-300 hover:bg-slate-750 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className="text-sm leading-none">{cat.icon}</span>
                <span>{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Nav Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="shrink-0 p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors hidden sm:flex items-center justify-center border border-slate-700/60"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Quick Reset Button if filtered */}
        {activeCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold transition-all ml-1"
            title="Reset Filter"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
        )}

      </div>
    </div>
  );
}
