'use client';

import React, { useState } from 'react';
import { CloudSun, Droplets, Wind, Compass, Calendar, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';

interface WeatherData {
  district: { id: string; nameBn: string; nameEn: string };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    precipitation: number;
    conditionBn: string;
    conditionEn: string;
    icon: string;
  };
  daily: Array<{
    date: string;
    dayBn: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    conditionBn: string;
    icon: string;
  }>;
  source: string;
  updatedAt: string;
}

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  language: 'bn' | 'en';
  onOpenDistrictModal?: () => void;
}

export default function WeatherWidget({ weather, loading, language, onOpenDistrictModal }: WeatherWidgetProps) {
  const [show7DayModal, setShow7DayModal] = useState(false);

  if (loading || !weather) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white border border-slate-800 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-1/3 mb-3"></div>
        <div className="h-10 bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-slate-700 rounded w-full"></div>
      </div>
    );
  }

  const { district, current, daily, source } = weather;

  return (
    <>
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-4 sm:p-5 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
        {/* Background Subtle Accent Glow */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top District Row */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">{current.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base sm:text-lg text-emerald-300">
                  {language === 'bn' ? `${district.nameBn} আবহাওয়া` : `${district.nameEn} Weather`}
                </h3>
                {onOpenDistrictModal && (
                  <button
                    onClick={onOpenDistrictModal}
                    className="text-[10px] text-slate-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-0.5"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'bn' ? 'পরিবর্তন' : 'Change'}</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300">{language === 'bn' ? current.conditionBn : current.conditionEn}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {current.temp}°C
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'bn' ? `অনুভূত: ${current.feelsLike}°C` : `Feels like: ${current.feelsLike}°C`}
            </p>
          </div>
        </div>

        {/* Weather Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-1">
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800/80 text-center">
            <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-0.5" />
            <p className="text-[10px] text-slate-400">{language === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</p>
            <p className="text-xs font-bold text-slate-200">{current.humidity}%</p>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800/80 text-center">
            <Wind className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
            <p className="text-[10px] text-slate-400">{language === 'bn' ? 'বাতাস' : 'Wind'}</p>
            <p className="text-xs font-bold text-slate-200">{current.windSpeed} km/h</p>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800/80 text-center">
            <CloudSun className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
            <p className="text-[10px] text-slate-400">{language === 'bn' ? 'বৃষ্টির প্রভাব' : 'Precip'}</p>
            <p className="text-xs font-bold text-slate-200">{current.precipitation} mm</p>
          </div>
        </div>

        {/* Footer Link to 7-Day Forecast */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{source}</span>
          </span>

          <button
            onClick={() => setShow7DayModal(true)}
            className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-0.5 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50"
          >
            <span>{language === 'bn' ? '৭ দিনের পূর্বাভাস' : '7-Day Forecast'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7-Day Forecast Modal */}
      {show7DayModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">
                  {language === 'bn' ? `${district.nameBn} - ৭ দিনের আবহাওয়া পূর্বাভাস` : `${district.nameEn} 7-Day Weather`}
                </h3>
              </div>
              <button
                onClick={() => setShow7DayModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {daily.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-slate-100">{item.dayBn} ({item.date})</p>
                      <p className="text-[11px] text-slate-400">{item.conditionBn}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-emerald-300">{item.maxTemp}°C / <span className="text-slate-400 font-medium">{item.minTemp}°C</span></p>
                    {item.rainProb > 0 && (
                      <p className="text-[10px] text-cyan-400 font-medium">🌧️ {item.rainProb}% বৃষ্টি</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShow7DayModal(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
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
