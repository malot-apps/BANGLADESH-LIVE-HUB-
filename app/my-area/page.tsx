// File: client/app/my-area/page.tsx
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MyAreaDashboard from '@/components/MyAreaDashboard';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import PersonalizationModal from '@/components/PersonalizationModal';

export default function MyAreaPage() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currentDistrictId, setCurrentDistrictId] = useState<string>('dhaka');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
        <MyAreaDashboard
          currentDistrictId={currentDistrictId}
          onSelectDistrict={setCurrentDistrictId}
          language={language}
          newsItems={[]}
          alerts={[]}
          opportunities={[]}
        />
      </main>

      <BottomNav
        activeTab="area"
        onChangeTab={(tab) => {
          if (tab === 'home') window.location.href = '/';
          else if (tab === 'tv') window.location.href = '/tv';
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
