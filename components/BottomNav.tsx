// File: components/BottomNav.tsx
'use client';

import React from 'react';
import { Home, MapPin, AlertTriangle, Tv, TrendingUp, Briefcase, User } from 'lucide-react';

export type NavTabId = 'home' | 'area' | 'alerts' | 'tv' | 'prices' | 'opportunities' | 'profile';

export interface BottomNavProps {
  activeTab: NavTabId;
  onChangeTab: (tab: NavTabId) => void;
  language?: 'bn' | 'en';
  alertCount?: number;
}

interface NavTab {
  id: NavTabId;
  icon: React.ElementType;
  labelBn: string;
  labelEn: string;
  badge?: number;
  isCenteredLiveTv?: boolean;
}

export default function BottomNav({
  activeTab,
  onChangeTab,
  language = 'bn',
  alertCount = 0,
}: BottomNavProps) {
  const tabs: NavTab[] = [
    { id: 'home', icon: Home, labelBn: 'হোম', labelEn: 'Home' },
    { id: 'area', icon: MapPin, labelBn: 'আমার এলাকা', labelEn: 'My Area' },
    { id: 'alerts', icon: AlertTriangle, labelBn: 'সতর্কতা', labelEn: 'Alerts', badge: alertCount },
    {
      id: 'tv',
      icon: Tv,
      labelBn: 'লাইভ টিভি',
      labelEn: 'Live TV',
      isCenteredLiveTv: true,
    },
    { id: 'prices', icon: TrendingUp, labelBn: 'দরদাম', labelEn: 'Prices' },
    { id: 'opportunities', icon: Briefcase, labelBn: 'সুযোগ', labelEn: 'Jobs' },
    { id: 'profile', icon: User, labelBn: 'প্রোফাইল', labelEn: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 text-slate-400 py-1 px-1 sm:px-2 md:hidden shadow-2xl">
      <div className="grid grid-cols-7 gap-0.5 max-w-lg mx-auto items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // Special treatment for centered Live TV item (#4)
          if (tab.isCenteredLiveTv) {
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex flex-col items-center justify-center -top-3 py-1 px-1 rounded-2xl transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-b from-rose-600 to-red-700 text-white shadow-lg shadow-rose-900/50 ring-2 ring-rose-400'
                    : 'bg-slate-800/90 text-rose-400 hover:text-rose-300 border border-rose-500/30 shadow-md'
                }`}
                title={language === 'bn' ? tab.labelBn : tab.labelEn}
              >
                {/* Ping/Pulse Indicator for Live TV */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-slate-900"></span>
                </span>

                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 animate-pulse' : ''}`} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5 tracking-tight truncate max-w-full">
                  {language === 'bn' ? tab.labelBn : tab.labelEn}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-emerald-400 font-bold bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-extrabold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-bounce">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {language === 'bn' ? tab.labelBn : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
