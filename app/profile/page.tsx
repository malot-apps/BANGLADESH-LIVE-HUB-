// File: client/app/profile/page.tsx
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import PersonalizationModal from '@/components/PersonalizationModal';

export default function ProfilePage() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currentDistrictId, setCurrentDistrictId] = useState<string>('dhaka');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 md:pb-12">
      <Navbar
        currentDistrictId={currentDistrictId}
        onSelectDistrict={setCurrentDistrictId}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
        searchQuery=""
        onSearchChange={() => {}}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadAlertCount={3}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-xl mx-auto shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {language === 'bn' ? 'ব্যক্তিগত প্রোফাইল ও সেটিংস' : 'Personal Profile & Settings'}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {language === 'bn' ? 'আপনার জেলা, ভাষা এবং নোটিফিকেশন পছন্দের সেটিং কাস্টমাইজ করুন।' : 'Customize district, language, and notification settings.'}
          </p>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shadow-md"
          >
            {language === 'bn' ? 'পছন্দসমূহ পরিবর্তন করুন' : 'Edit Preferences'}
          </button>
        </div>
      </main>

      <BottomNav
        activeTab="profile"
        onChangeTab={(tab) => {
          if (tab === 'home') window.location.href = '/';
          else if (tab === 'area') window.location.href = '/my-area';
          else if (tab === 'alerts') window.location.href = '/alerts';
          else if (tab === 'tv') window.location.href = '/tv';
          else if (tab === 'prices') window.location.href = '/prices';
          else if (tab === 'opportunities') window.location.href = '/opportunities';
        }}
        language={language}
        alertCount={3}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        language={language}
      />

      <PersonalizationModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
        currentDistrictId={currentDistrictId}
        onSelectDistrict={setCurrentDistrictId}
      />
    </div>
  );
}
