'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import HeroHeader from '@/components/HeroHeader';
import CategoryScroller from '@/components/CategoryScroller';
import WeatherWidget from '@/components/WeatherWidget';
import BreakingNewsSection from '@/components/BreakingNewsSection';
import AlertMapSection from '@/components/AlertMapSection';
import PriceWatchSection from '@/components/PriceWatchSection';
import OpportunitySection from '@/components/OpportunitySection';
import MyAreaDashboard from '@/components/MyAreaDashboard';
import LiveTVSection from '@/components/LiveTVSection';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import PersonalizationModal from '@/components/PersonalizationModal';
import ShareModal from '@/components/ShareModal';
import { findDistrict } from '@/lib/bangladeshData';

export default function HomePage() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currentDistrictId, setCurrentDistrictId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bd_hub_saved_district') || 'dhaka';
    }
    return 'dhaka';
  });
  const [activeTab, setActiveTab] = useState<'home' | 'area' | 'alerts' | 'tv' | 'prices' | 'opportunities' | 'profile'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // API Data States
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);

  const [pricesData, setPricesData] = useState<any[]>([]);
  const [pricesLoading, setPricesLoading] = useState<boolean>(true);

  const [alertsData, setAlertsData] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState<boolean>(true);

  const [opportunitiesData, setOpportunitiesData] = useState<any[]>([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState<boolean>(true);

  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Modal States
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{ title: string; url: string }>({ title: '', url: '' });

  // Fetch Weather Data
  const fetchWeather = useCallback(async (districtId: string) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather?district=${districtId}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch (err) {
      console.error('Failed to fetch weather', err);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // Fetch News Data
  const fetchNews = useCallback(async (cat: string, search: string) => {
    setNewsLoading(true);
    try {
      const res = await fetch(`/api/news?category=${cat}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setNewsItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch news', err);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // Fetch Prices
  const fetchPrices = useCallback(async () => {
    setPricesLoading(true);
    try {
      const res = await fetch('/api/prices');
      if (res.ok) {
        const data = await res.json();
        setPricesData(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch prices', err);
    } finally {
      setPricesLoading(false);
    }
  }, []);

  // Fetch Alerts
  const fetchAlerts = useCallback(async (districtId: string) => {
    setAlertsLoading(true);
    try {
      const res = await fetch(`/api/alerts?district=${districtId}`);
      if (res.ok) {
        const data = await res.json();
        setAlertsData(data.alerts || []);
      }
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  // Fetch Opportunities
  const fetchOpportunities = useCallback(async () => {
    setOpportunitiesLoading(true);
    try {
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunitiesData(data.opportunities || []);
      }
    } catch (err) {
      console.error('Failed to fetch opportunities', err);
    } finally {
      setOpportunitiesLoading(false);
    }
  }, []);

  // Fetch Trending Topics
  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch('/api/trending');
      if (res.ok) {
        const data = await res.json();
        setTrendingTopics(data.topics || []);
      }
    } catch (err) {
      console.error('Failed to fetch trending', err);
    }
  }, []);

  // Master Refresh
  const handleMasterRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchWeather(currentDistrictId),
      fetchNews(activeCategory, searchQuery),
      fetchPrices(),
      fetchAlerts(currentDistrictId),
      fetchOpportunities(),
      fetchTrending()
    ]);
    setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsRefreshing(false);
  }, [currentDistrictId, activeCategory, searchQuery, fetchWeather, fetchNews, fetchPrices, fetchAlerts, fetchOpportunities, fetchTrending]);

  // Initial load
  useEffect(() => {
    let ignore = false;
    const init = async () => {
      if (!ignore) {
        await handleMasterRefresh();
      }
    };
    init();
    return () => {
      ignore = true;
    };
  }, [handleMasterRefresh]);

  // Handle District Change
  const handleSelectDistrict = (districtId: string) => {
    setCurrentDistrictId(districtId);
    fetchWeather(districtId);
    fetchAlerts(districtId);
  };

  // Handle Category Change
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    fetchNews(cat, searchQuery);
  };

  // Handle Search Input Change with Debounce
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    fetchNews(activeCategory, q);
  };

  // Handle Share Modal Trigger
  const handleShareItem = (title: string, url: string) => {
    setShareData({ title, url });
    setIsShareOpen(true);
  };

  const district = findDistrict(currentDistrictId) || findDistrict('dhaka')!;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 md:pb-12 selection:bg-emerald-200">
      
      {/* Top Fixed Navbar */}
      <Navbar
        currentDistrictId={currentDistrictId}
        onSelectDistrict={handleSelectDistrict}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadAlertCount={alertsData.length}
      />

      {/* Main Container */}
      <main>
        {activeTab === 'home' && (
          <>
            {/* Dynamic Hero Section */}
            <HeroHeader
              language={language}
              districtNameBn={district.nameBn}
              districtNameEn={district.nameEn}
              trendingTopics={trendingTopics}
              lastUpdatedTime={lastUpdatedTime || 'এখনই'}
              onRefresh={handleMasterRefresh}
              isRefreshing={isRefreshing}
              onShare={() => handleShareItem('বাংলাদেশ লাইভ ইনফরমেশন হাব - সরাসরি আপডেট', 'https://bangladesh-live-hub.org')}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Persistent Horizontal Category Filter Scroller */}
            <CategoryScroller
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              language={language}
              totalNewsCount={newsItems.length}
            />

            {/* Dashboard Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
              
              {/* Top Highlights Grid (Weather + Emergency Alert) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5">
                  <WeatherWidget
                    weather={weatherData}
                    loading={weatherLoading}
                    language={language}
                    onOpenDistrictModal={() => setIsProfileOpen(true)}
                  />
                </div>

                {/* Live Urgency Alert Banner if active alerts exist */}
                <div className="lg:col-span-7">
                  {alertsData.length > 0 ? (
                    <div className="bg-gradient-to-br from-red-900 via-slate-900 to-orange-950 text-white rounded-2xl p-5 border border-red-700/50 shadow-xl flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-red-800/80">
                          <span className="flex items-center gap-1.5 text-xs font-extrabold text-red-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 live-pulse"></span>
                            <span>{language === 'bn' ? '🚨 সরাসরি আবহাওয়া ও দুর্যোগ সতর্কতা' : '🚨 Active Emergency Alert'}</span>
                          </span>
                          <span className="text-[10px] text-slate-300 font-medium">
                            {alertsData[0].source}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base sm:text-lg text-white mt-3">
                          {language === 'bn' ? alertsData[0].titleBn : alertsData[0].titleEn}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                          {language === 'bn' ? alertsData[0].summaryBn : alertsData[0].summaryEn}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-red-900/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setActiveTab('alerts')}
                          className="text-red-300 hover:text-white font-bold underline underline-offset-2"
                        >
                          {language === 'bn' ? 'সব আ্যলার্ট মানচিত্র দেখুন →' : 'View Full Alert Map →'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between h-full">
                      <div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          🟢 আবহাওয়া ও এলাকা স্বাভাবিক
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 mt-2">
                          {language === 'bn' ? `${district.nameBn} এলাকায় বর্তমানে কোনো দুর্যোগের সংকেত নেই` : `No active warnings for ${district.nameEn}`}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'bn' ? 'আবহাওয়া দপ্তর ও বন্যা পূর্বাভাস কেন্দ্রের সরাসরি আপডেট মনিটর করা হচ্ছে।' : 'Continuously monitoring official BMD and FFWC feeds.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Primary Column: Breaking News & Updates */}
                <div className="lg:col-span-8 space-y-6">
                  <BreakingNewsSection
                    newsItems={newsItems}
                    loading={newsLoading}
                    language={language}
                    activeCategory={activeCategory}
                    onSelectCategory={handleSelectCategory}
                    onShareItem={handleShareItem}
                  />
                </div>

                {/* Right Secondary Column: Price Watch & Opportunity Quick Cards */}
                <div className="lg:col-span-4 space-y-6">
                  <PriceWatchSection
                    prices={pricesData}
                    loading={pricesLoading}
                    language={language}
                  />

                  <OpportunitySection
                    opportunities={opportunitiesData}
                    loading={opportunitiesLoading}
                    language={language}
                  />
                </div>

              </div>

              {/* Bangladesh Alert Map Full Section */}
              <AlertMapSection
                alerts={alertsData}
                language={language}
                currentDistrictId={currentDistrictId}
                onSelectDistrict={handleSelectDistrict}
              />

            </div>
          </>
        )}

        {/* Tab 2: My Area */}
        {activeTab === 'area' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <MyAreaDashboard
              currentDistrictId={currentDistrictId}
              onSelectDistrict={handleSelectDistrict}
              language={language}
              newsItems={newsItems}
              alerts={alertsData}
              opportunities={opportunitiesData}
            />
          </div>
        )}

        {/* Tab 3: Disaster & Alert Map */}
        {activeTab === 'alerts' && (
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <AlertMapSection
              alerts={alertsData}
              language={language}
              currentDistrictId={currentDistrictId}
              onSelectDistrict={handleSelectDistrict}
            />
          </div>
        )}

        {/* Tab 4: Live TV Streaming */}
        {activeTab === 'tv' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <LiveTVSection language={language} />
          </div>
        )}

        {/* Tab 5: Commodity Prices */}
        {activeTab === 'prices' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <PriceWatchSection
              prices={pricesData}
              loading={pricesLoading}
              language={language}
            />
          </div>
        )}

        {/* Tab 5: Opportunities & Jobs */}
        {activeTab === 'opportunities' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <OpportunitySection
              opportunities={opportunitiesData}
              loading={opportunitiesLoading}
              language={language}
            />
          </div>
        )}

        {/* Tab 6: Profile & Notifications */}
        {activeTab === 'profile' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-xl mx-auto shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {language === 'bn' ? 'ব্যক্তিগত প্রোফাইল ও পছন্দসমূহ' : 'Personal Profile & Settings'}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {language === 'bn' ? 'আপনার এলাকা, ভাষা এবং পছন্দের নোটিফিকেশন কনফিগার করুন।' : 'Manage saved area, language, and custom alerts.'}
              </p>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shadow-md"
              >
                {language === 'bn' ? 'সেটিংস প্যানেল খুলুন' : 'Open Settings Panel'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        alertCount={alertsData.length}
      />

      {/* Admin Control Panel Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        language={language}
      />

      {/* Personalization Modal */}
      <PersonalizationModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
        currentDistrictId={currentDistrictId}
        onSelectDistrict={handleSelectDistrict}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={shareData.title}
        url={shareData.url}
        language={language}
      />

      {/* Footer Branding */}
      <footer className="mt-12 bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-extrabold text-slate-200 text-sm">
            বাংলাদেশ লাইভ ইনফরমেশন হাব | Bangladesh Live Information Hub
          </p>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            এটি একটি স্বাধীন ও স্বয়ংক্রিয় নাগরিক তথ্য হাব। সকল আবহাওয়া, বার্তা ও দরদাম অফিসিয়াল উন্মুক্ত তথ্য সোর্স ও আরএসএস ফিড থেকে সংগৃহীত।
          </p>
          <p className="text-slate-600 text-[11px] pt-2">
            © 2026 BD Live Hub. Mobile-first, fast, and automated citizen platform for Bangladesh.
          </p>
        </div>
      </footer>

    </div>
  );
}
