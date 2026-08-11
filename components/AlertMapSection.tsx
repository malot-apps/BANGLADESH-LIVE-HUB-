'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Layers, MapPin, Clock, ExternalLink } from 'lucide-react';
import { PublicAlert } from '@/app/api/alerts/route';
import { BANGLADESH_DIVISIONS } from '@/lib/bangladeshData';

interface AlertMapSectionProps {
  alerts: PublicAlert[];
  language: 'bn' | 'en';
  currentDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
}

export default function AlertMapSection({ alerts, language, currentDistrictId, onSelectDistrict }: AlertMapSectionProps) {
  const [selectedLayer, setSelectedLayer] = useState<string>('all');

  const layers = [
    { id: 'all', labelBn: 'সব সতর্কতা', labelEn: 'All Alerts' },
    { id: 'storm', labelBn: '⛈️ ঝড় ও আবহাওয়া', labelEn: 'Storm & Weather' },
    { id: 'flood', labelBn: '🌊 পাহাড়ি ঢল ও বন্যা', labelEn: 'Flood & River' },
    { id: 'transport', labelBn: '🚦 পরিবহন ও সড়ক', labelEn: 'Transport' },
    { id: 'public', labelBn: '📢 সাধারণ সতর্কতা', labelEn: 'Public Alert' },
  ];

  const filteredAlerts = selectedLayer === 'all'
    ? alerts
    : alerts.filter(a => a.layer === selectedLayer);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-100 text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              {language === 'bn' ? '🚨 বাংলাদেশ জাতীয় আ্যলার্ট ও দুর্যোগ মানচিত্র' : '🚨 Bangladesh Disaster & Alert Map'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'আবহাওয়া দপ্তর ও বন্যা পূর্বাভাস কেন্দ্রের সরাসরি বুলেটিন' : 'Official weather & flood warning bulletins'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>{alerts.length} {language === 'bn' ? 'টি সংকেত বহাল' : 'Active Signals'}</span>
          </span>
        </div>
      </div>

      {/* Layer selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
        </span>
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => setSelectedLayer(layer.id)}
            className={`shrink-0 text-xs px-3 py-1 rounded-xl font-medium transition-all ${
              selectedLayer === layer.id
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? layer.labelBn : layer.labelEn}
          </button>
        ))}
      </div>

      {/* Interactive Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        
        {/* Left Column: Visual Vector Map of 8 Divisions */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-4 text-white border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {language === 'bn' ? 'বিভাগভিত্তিক সংকেত মানচিত্র' : 'Division-wise Signal Map'}
            </h4>
            <p className="text-[11px] text-slate-300">
              {language === 'bn' ? 'যেকোনো বিভাগে ক্লিক করে স্থানীয় সতর্কতা জানুন' : 'Click any division to select area'}
            </p>
          </div>

          {/* Clean Stylized Interactive Bangladesh Map Grid Representation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 my-2">
            {BANGLADESH_DIVISIONS.map((div) => {
              // Check if any alert affects districts in this division
              const divDistrictIds = div.districts.map(d => d.id);
              const activeDivAlert = alerts.find(a =>
                a.affectedDistricts.some(dId => divDistrictIds.includes(dId) || dId === 'all')
              );

              const colorClass = activeDivAlert?.severity === 'severe'
                ? 'bg-red-950/90 border-red-500 text-red-200 ring-1 ring-red-500'
                : activeDivAlert?.severity === 'warning'
                ? 'bg-orange-950/90 border-orange-500 text-orange-200'
                : activeDivAlert?.severity === 'advisory'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500';

              return (
                <button
                  key={div.id}
                  onClick={() => onSelectDistrict(div.districts[0].id)}
                  className={`p-3 rounded-xl border text-left transition-all ${colorClass} hover:scale-[1.02] cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs">
                      {language === 'bn' ? div.nameBn : div.nameEn}
                    </span>
                    {activeDivAlert && (
                      <span className="w-2.5 h-2.5 rounded-full live-pulse" style={{ backgroundColor: activeDivAlert.color }}></span>
                    )}
                  </div>
                  <p className="text-[10px] opacity-80 mt-1">
                    {div.districts.length} {language === 'bn' ? 'টি জেলা' : 'Districts'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Severity Legend */}
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-4 gap-1 text-[10px] text-center">
            <span className="flex items-center justify-center gap-1 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> 🔴 মহাবিপদ
            </span>
            <span className="flex items-center justify-center gap-1 text-orange-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> 🟠 সতর্কতা
            </span>
            <span className="flex items-center justify-center gap-1 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> 🟡 পরামর্শ
            </span>
            <span className="flex items-center justify-center gap-1 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 🔵 তথ্য
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Active Alert Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-500 text-xs">
              {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো সক্রিয় সতর্কতা নেই।' : 'No active alerts in this category.'}
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                style={{ borderColor: alert.color }}
              >
                {/* Left Colored Accent Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: alert.color }}
                ></div>

                <div className="pl-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span
                      className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: alert.color }}
                    >
                      {alert.severity === 'severe' ? '🔴 মহাবিপদ সংকেত' : alert.severity === 'warning' ? '🟠 সতর্কতা সংকেত' : alert.severity === 'advisory' ? '🟡 বিশেষ পরামর্শ' : '🔵 সাধারণ তথ্য'}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{language === 'bn' ? 'মেয়াদ:' : 'Expires:'} {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                    {language === 'bn' ? alert.titleBn : alert.titleEn}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {language === 'bn' ? alert.summaryBn : alert.summaryEn}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">
                      উৎস: {alert.source}
                    </span>

                    {alert.officialLink && (
                      <a
                        href={alert.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <span>{language === 'bn' ? 'অফিসিয়াল তথ্য' : 'Official Page'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
