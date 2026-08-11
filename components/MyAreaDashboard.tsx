'use client';

import React, { useState } from 'react';
import { MapPin, CloudSun, AlertTriangle, PhoneCall, Briefcase, Bookmark, Check, ShieldCheck } from 'lucide-react';
import { findDistrict, BANGLADESH_DIVISIONS } from '@/lib/bangladeshData';
import { NewsItem } from '@/app/api/news/route';
import { PublicAlert } from '@/app/api/alerts/route';
import { Opportunity } from '@/app/api/opportunities/route';

interface MyAreaDashboardProps {
  currentDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
  language: 'bn' | 'en';
  newsItems: NewsItem[];
  alerts: PublicAlert[];
  opportunities: Opportunity[];
}

export default function MyAreaDashboard({
  currentDistrictId,
  onSelectDistrict,
  language,
  newsItems,
  alerts,
  opportunities
}: MyAreaDashboardProps) {
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const district = findDistrict(currentDistrictId) || findDistrict('dhaka')!;
  const division = BANGLADESH_DIVISIONS.find(d => d.districts.some(dist => dist.id === district.id));

  const districtAlerts = alerts.filter(a => a.affectedDistricts.includes(district.id) || a.affectedDistricts.includes('all'));

  const handleSaveArea = () => {
    localStorage.setItem('bd_hub_saved_district', district.id);
    if (selectedUpazila) {
      localStorage.setItem('bd_hub_saved_upazila', selectedUpazila);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Area Selector Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 border border-emerald-800/40 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-800/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl">
              <MapPin className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-300">
                {language === 'bn' ? 'আমার এলাকা ড্যাশবোর্ড' : 'My Area Dashboard'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {language === 'bn' ? `${district.nameBn} জেলা` : `${district.nameEn} District`}
                <span className="text-xs font-medium text-slate-300 ml-2">({language === 'bn' ? division?.nameBn : division?.nameEn} বিভাগ)</span>
              </h2>
            </div>
          </div>

          <button
            onClick={handleSaveArea}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isSaved
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 border border-emerald-600/50'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? (language === 'bn' ? 'সংরক্ষিত হয়েছে!' : 'Saved!') : (language === 'bn' ? 'আমার এলাকা সেভ করুন' : 'Save My Area')}</span>
          </button>
        </div>

        {/* Upazila Selector */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-300 shrink-0">
            {language === 'bn' ? 'উপজেলা/থানা:' : 'Upazila:'}
          </span>
          <button
            onClick={() => setSelectedUpazila('')}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
              selectedUpazila === ''
                ? 'bg-emerald-500 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {language === 'bn' ? 'সকল উপজেলা' : 'All Upazilas'}
          </button>
          {district.upazilasBn.map((upazila, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedUpazila(upazila)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedUpazila === upazila
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {language === 'bn' ? upazila : district.upazilasEn[idx]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout for Local Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Local Emergency Helplines & Alerts */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Emergency Helpline Widget */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 mb-3">
              <PhoneCall className="w-5 h-5 text-red-600" />
              <span>{language === 'bn' ? 'জরুরি হেল্পলাইন নম্বর' : 'Emergency Helplines'}</span>
            </h3>

            <div className="space-y-2">
              <a href="tel:999" className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">
                <span className="text-xs font-bold text-red-900">জাতীয় জরুরি সেবা</span>
                <span className="text-sm font-black text-red-600">৯৯৯ (999)</span>
              </a>

              <a href="tel:333" className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors">
                <span className="text-xs font-bold text-emerald-900">সরকারি তথ্য ও সেবা</span>
                <span className="text-sm font-black text-emerald-600">৩৩৩ (333)</span>
              </a>

              <a href="tel:109" className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors">
                <span className="text-xs font-bold text-purple-900">নারী ও শিশু সহায়তা</span>
                <span className="text-sm font-black text-purple-600">১০৯ (109)</span>
              </a>

              <a href="tel:1090" className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors">
                <span className="text-xs font-bold text-amber-900">দুর্যোগের আগাম বার্তা</span>
                <span className="text-sm font-black text-amber-600">১০৯০ (1090)</span>
              </a>
            </div>
          </div>

          {/* Active Local District Alerts */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{language === 'bn' ? `${district.nameBn} জেলার সতর্কতা` : `Alerts for ${district.nameEn}`}</span>
            </h3>

            {districtAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-2xl">
                {language === 'bn' ? 'বর্তমানে আপনার এলাকায় কোনো সতর্কতা নেই।' : 'No active weather alerts for this area.'}
              </p>
            ) : (
              <div className="space-y-2">
                {districtAlerts.map(alert => (
                  <div key={alert.id} className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs">
                    <p className="font-bold text-amber-900">{alert.titleBn}</p>
                    <p className="text-[11px] text-amber-800 mt-1">{alert.summaryBn}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Local Feed & Local Opportunities */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-3 pb-2 border-b border-slate-200">
              {language === 'bn' ? `📍 ${district.nameBn} এলাকা ও আশেপাশের তাজা আপডেট` : `📍 Live Local Feed for ${district.nameEn}`}
            </h3>

            <div className="space-y-3">
              {newsItems.slice(0, 4).map(item => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1.5">
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item.title}
                    </a>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{item.summary}</p>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{item.sourceName}</span>
                    <span>📍 {district.nameBn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
