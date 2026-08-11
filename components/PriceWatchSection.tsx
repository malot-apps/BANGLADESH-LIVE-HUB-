'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, ShieldCheck, DollarSign, Coins, Fuel, ShoppingBag } from 'lucide-react';
import { CommodityPrice } from '@/app/api/prices/route';

interface PriceWatchSectionProps {
  prices: CommodityPrice[];
  loading: boolean;
  language: 'bn' | 'en';
}

export default function PriceWatchSection({ prices, loading, language }: PriceWatchSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'all', labelBn: 'সব দরদাম', labelEn: 'All Prices', icon: ShoppingBag },
    { id: 'currency', labelBn: '💱 মুদ্রা বিনিময় (Dollar/Riyal)', labelEn: 'Currencies', icon: DollarSign },
    { id: 'metal', labelBn: '🪙 সোনা ও রূপা (Gold/Silver)', labelEn: 'Gold & Metals', icon: Coins },
    { id: 'fuel', labelBn: '⛽ জ্বালানি (Fuel)', labelEn: 'Fuel', icon: Fuel },
    { id: 'essential', labelBn: '🌾 নিত্যপণ্য (Nityaponno)', labelEn: 'Commodities', icon: ShoppingBag },
  ];

  const filteredPrices = prices.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              {language === 'bn' ? '💰 প্রাইজ ওয়াচ ও বাজার দর' : '💰 Price Watch & Market Economy'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'বাংলাদেশ ব্যাংক, বাজুস ও কৃষি বিপণন অধিদপ্তরের দরদাম' : 'Official rates from Bangladesh Bank, BAJUS & DAM'}
            </p>
          </div>
        </div>

        {/* Search input inside section */}
        <div className="relative w-full sm:w-48">
          <input
            type="text"
            placeholder={language === 'bn' ? 'পণ্যের নাম খুঁজুন...' : 'Search items...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? cat.labelBn : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Price Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-4 bg-slate-100 rounded-2xl animate-pulse h-24"></div>
          ))}
        </div>
      ) : filteredPrices.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
          {language === 'bn' ? 'কোনো পণ্যের বাজার দর পাওয়া যায়নি।' : 'No price data available for this search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPrices.map((item) => {
            const isIncrease = item.changePercent > 0;
            const isDecrease = item.changePercent < 0;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                      {item.unitBn}
                    </span>
                    
                    {/* Price Change Badge */}
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                        isIncrease
                          ? 'bg-red-100 text-red-700'
                          : isDecrease
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isIncrease ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : isDecrease ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                      <span>
                        {isIncrease ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                    {language === 'bn' ? item.nameBn : item.nameEn}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                      {item.currency} {item.currentPrice.toLocaleString('bn-BD')}
                    </span>
                    {item.previousPrice !== item.currentPrice && (
                      <p className="text-[10px] text-slate-400 line-through">
                        আগে: {item.currency} {item.previousPrice.toLocaleString('bn-BD')}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span>{item.source}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
