// File: client/app/tv/page.tsx
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import LiveTVSection from '@/components/LiveTVSection';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import PersonalizationModal from '@/components/PersonalizationModal';

export default function TVPage() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currentDistrictId, setCurrentDistrictId] = useState<string>('dhaka');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 md:pb-12 selection:bg-emerald-200">
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
        <LiveTVSection language={language} />
      </main>

      <BottomNav
        activeTab="tv"
        onChangeTab={(tab) => {
          if (tab === 'home') window.location.href = '/';
          else if (tab === 'area') window.location.href = '/my-area';
          else if (tab === 'alerts') window.location.href = '/alerts';
          else if (tab === 'prices') window.location.href = '/prices';
          else if (tab === 'opportunities') window.location.href = '/opportunities';
          else if (tab === 'profile') window.location.href = '/profile';
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
