'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, CheckCircle, ExternalLink, ShieldCheck, GraduationCap, Award, Search, Sparkles } from 'lucide-react';
import { Opportunity } from '@/app/api/opportunities/route';

interface OpportunitySectionProps {
  opportunities: Opportunity[];
  loading: boolean;
  language: 'bn' | 'en';
}

export default function OpportunitySection({ opportunities, loading, language }: OpportunitySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [now] = useState(() => Date.now());

  const categories = [
    { id: 'all', labelBn: 'সব সুযোগ', labelEn: 'All Opportunities' },
    { id: 'job', labelBn: '💼 চাকরি', labelEn: 'Jobs' },
    { id: 'scholarship', labelBn: '🎓 স্কলারশিপ & ফেলোশিপ', labelEn: 'Scholarships' },
    { id: 'competition', labelBn: '🏆 প্রতিযোগিতা & হ্যাকাথন', labelEn: 'Competitions' },
    { id: 'internship', labelBn: '🚀 ইন্টার্নশিপ', labelEn: 'Internships' },
    { id: 'training', labelBn: '📚 ফ্রী ট্রেনিং', labelEn: 'Training' },
  ];

  const deadlineOptions = [
    { id: 'all', labelBn: 'সব সময়সীমা', labelEn: 'All Deadlines' },
    { id: 'today', labelBn: '🔥 আজ শেষ!', labelEn: 'Ends Today' },
    { id: 'tomorrow', labelBn: '⏰ কাল শেষ', labelEn: 'Ends Tomorrow' },
    { id: 'this_week', labelBn: '📅 এই সপ্তাহে', labelEn: 'This Week' },
  ];

  const filteredOpps = opportunities.filter(opp => {
    const matchesCat = selectedCategory === 'all' || opp.category === selectedCategory;
    const matchesSearch = opp.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.orgNameBn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const formatDaysRemaining = (deadlineIso: string) => {
    try {
      const d = new Date(deadlineIso);
      const diffMs = d.getTime() - now;
      const diffDays = Math.ceil(diffMs / (1000 * 3600 * 24));
      if (diffDays <= 0) return language === 'bn' ? 'আজ শেষ তারিখ!' : 'Deadline Today!';
      if (diffDays === 1) return language === 'bn' ? 'আর ১ দিন বাকি (কাল শেষ)' : '1 day left (Tomorrow)';
      return language === 'bn' ? `আর ${diffDays} দিন বাকি` : `${diffDays} days remaining`;
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              {language === 'bn' ? '🎓 অপরচুনিটি হাব ও ডেডলাইন হান্টার' : '🎓 Opportunity Hub & Deadline Hunter'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'সরকারি ও নির্ভরযোগ্য প্রতিষ্ঠানের আসল চাকরি, স্কলারশিপ ও ট্রেনিং' : 'Official jobs, scholarships, internships & competitions'}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-48">
          <input
            type="text"
            placeholder={language === 'bn' ? 'খুঁজুন...' : 'Search opportunities...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Deadline Hunter Quick Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {deadlineOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setDeadlineFilter(opt.id)}
              className={`shrink-0 text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all ${
                deadlineFilter === opt.id
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'bn' ? opt.labelBn : opt.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunity Cards List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="p-5 bg-slate-100 rounded-2xl animate-pulse h-32"></div>
          ))}
        </div>
      ) : filteredOpps.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
          {language === 'bn' ? 'কোনো ক্যাটাগরির সুযোগ পাওয়া যায়নি।' : 'No opportunities matched your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    🏢 {opp.orgNameBn}
                  </span>

                  {/* Deadline status */}
                  <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    <span>{formatDaysRemaining(opp.deadline)}</span>
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-base text-slate-900 leading-snug">
                  {opp.titleBn}
                </h4>

                {/* Eligibility & Benefits */}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <span className="font-semibold text-slate-800">যোগ্যতা:</span> {opp.eligibilityBn}
                </p>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <span className="font-semibold text-slate-800">সুবিধা:</span> {opp.benefitsBn}
                </p>
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{opp.source}</span>
                </div>

                <a
                  href={opp.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>{language === 'bn' ? 'আবেদন লিংক' : 'Apply Now'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
