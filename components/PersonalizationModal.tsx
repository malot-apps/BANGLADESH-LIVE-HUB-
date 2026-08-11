'use client';

import React, { useState, useEffect } from 'react';
import { User, Bell, Bookmark, MapPin, Check, Globe, Shield, Sparkles } from 'lucide-react';
import { findDistrict, BANGLADESH_DIVISIONS } from '@/lib/bangladeshData';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
  onToggleLanguage: () => void;
  currentDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
}

export default function PersonalizationModal({
  isOpen,
  onClose,
  language,
  onToggleLanguage,
  currentDistrictId,
  onSelectDistrict
}: PersonalizationModalProps) {
  const [notifBreaking, setNotifBreaking] = useState(true);
  const [notifWeather, setNotifWeather] = useState(true);
  const [notifJobs, setNotifJobs] = useState(true);
  const [notifPrices, setNotifPrices] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const district = findDistrict(currentDistrictId) || findDistrict('dhaka')!;

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    localStorage.setItem('bd_hub_notif_breaking', String(notifBreaking));
    localStorage.setItem('bd_hub_notif_weather', String(notifWeather));
    localStorage.setItem('bd_hub_notif_jobs', String(notifJobs));
    localStorage.setItem('bd_hub_notif_prices', String(notifPrices));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-950 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {language === 'bn' ? 'ব্যক্তিগত প্রোফাইল ও নোটিফিকেশন' : 'Personal Profile & Settings'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'আপনার এলাকা ও পছন্দের অ্যালার্ট কনফিগার করুন' : 'Custom alerts and saved local area'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold p-1">
            ✕
          </button>
        </div>

        {/* Selected Area Summary */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'bn' ? 'সংরক্ষিত এলাকা:' : 'Saved Area:'}
            </span>
            <button
              onClick={() => {
                onClose();
              }}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              {language === 'bn' ? 'পরিবর্তন করুন' : 'Change'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? `${district.nameBn} জেলা` : `${district.nameEn} District`}</span>
          </div>
        </div>

        {/* Language Switcher Row */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-200">
              {language === 'bn' ? 'পছন্দের ভাষা:' : 'Preferred Language:'}
            </span>
          </div>
          <button
            onClick={onToggleLanguage}
            className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
          >
            {language === 'bn' ? 'বাংলা (বর্তমান)' : 'English (Current)'}
          </button>
        </div>

        {/* Notification Category Toggles */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'নোটিফিকেশন অ্যালার্ট নির্বাচন' : 'Notification Category Alerts'}</span>
          </h4>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span>🔴 ব্রেকিং খবর ও জরুরি আপডেট</span>
              <input
                type="checkbox"
                checked={notifBreaking}
                onChange={(e) => setNotifBreaking(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span>🌦️ ঘূর্ণিঝড় ও বৃষ্টিপাতের সতর্কতা</span>
              <input
                type="checkbox"
                checked={notifWeather}
                onChange={(e) => setNotifWeather(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span>💼 চাকরি ও বিসিএস ডেডলাইন রিমাইন্ডার</span>
              <input
                type="checkbox"
                checked={notifJobs}
                onChange={(e) => setNotifJobs(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span>💰 বাজার দর ও ডলার দামের পরিবর্তন</span>
              <input
                type="checkbox"
                checked={notifPrices}
                onChange={(e) => setNotifPrices(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="pt-2">
          <button
            onClick={handleSavePreferences}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? (language === 'bn' ? 'সেভ হয়েছে!' : 'Saved!') : (language === 'bn' ? 'পছন্দসমূহ সেভ করুন' : 'Save Preferences')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
