'use client';

import React, { useState } from 'react';
import { Radio, MapPin, Search, Bell, Globe, Shield, Bookmark, SlidersHorizontal, Sparkles } from 'lucide-react';
import { BANGLADESH_DIVISIONS, findDistrict } from '@/lib/bangladeshData';

interface NavbarProps {
  currentDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
  language: 'bn' | 'en';
  onToggleLanguage: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  unreadAlertCount: number;
}

export default function Navbar({
  currentDistrictId,
  onSelectDistrict,
  language,
  onToggleLanguage,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  onOpenProfile,
  unreadAlertCount
}: NavbarProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedDivId, setSelectedDivId] = useState('dhaka');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const currentDistrict = findDistrict(currentDistrictId) || findDistrict('dhaka')!;
  const currentDivision = BANGLADESH_DIVISIONS.find(d => d.districts.some(dist => dist.id === currentDistrict.id));

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-md shadow-emerald-900/30">
              <Radio className="w-5 h-5 animate-pulse text-emerald-200" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 live-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                  {language === 'bn' ? 'বাংলাদেশ লাইভ হাব' : 'BD Live Hub'}
                </h1>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {language === 'bn' ? 'সরাসরি তথ্য, আবহাওয়া ও আপডেট' : 'Real-time News & Data Hub'}
              </p>
            </div>
          </div>

          {/* Location Picker pill */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-emerald-500/50 shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">
              {language === 'bn' ? currentDistrict.nameBn : currentDistrict.nameEn}
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              ({language === 'bn' ? currentDivision?.nameBn : currentDivision?.nameEn})
            </span>
          </button>

          {/* Search & Utility Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Inline Search Bar on larger screens */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <input
                type="text"
                placeholder={language === 'bn' ? 'কী খুঁজছেন? (যেমন: বৃষ্টি, বিসিএস, আলু)' : 'Search news, weather, jobs...'}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-xs text-white rounded-full pl-8 pr-3 py-1.5 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-2 rounded-full hover:bg-slate-800 text-slate-300"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenProfile}
              className="relative p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
              title="Notifications & Profile"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
              )}
            </button>

            {/* Admin Panel Trigger */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/40 border border-emerald-600/40 hover:bg-emerald-800/50 text-xs font-medium text-emerald-300 transition-all"
              title="Admin & Automation Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Expanded Bar */}
        {isSearchExpanded && (
          <div className="md:hidden px-4 py-2 border-t border-slate-800 bg-slate-900">
            <div className="relative">
              <input
                type="text"
                placeholder={language === 'bn' ? 'খবর, আবহাওয়া, চাকরি খুঁজুন...' : 'Search news, weather, jobs...'}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-slate-800 border border-emerald-500 text-xs text-white rounded-full pl-8 pr-3 py-2 focus:outline-none"
              />
              <Search className="w-4 h-4 text-emerald-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        )}
      </header>

      {/* Location Selector Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">
                  {language === 'bn' ? 'আপনার এলাকা নির্বাচন করুন' : 'Select Your Area'}
                </h3>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Division Tabs */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-400 mb-2 block">
                {language === 'bn' ? 'বিভাগ বেছে নিন:' : 'Select Division:'}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {BANGLADESH_DIVISIONS.map(div => (
                  <button
                    key={div.id}
                    onClick={() => setSelectedDivId(div.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      selectedDivId === div.id
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {language === 'bn' ? div.nameBn : div.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* District Grid */}
            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-400 mb-2 block">
                {language === 'bn' ? 'জেলা বেছে নিন:' : 'Select District:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {BANGLADESH_DIVISIONS.find(d => d.id === selectedDivId)?.districts.map(dist => (
                  <button
                    key={dist.id}
                    onClick={() => {
                      onSelectDistrict(dist.id);
                      setIsLocationModalOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      currentDistrictId === dist.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {language === 'bn' ? dist.nameBn : dist.nameEn}
                    </span>
                    {currentDistrictId === dist.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
