/* File: admin/admin.js */

// Shared Admin State and Mock Store
window.AdminStore = {
  stats: {
    totalUsers: 14280,
    activeUsers: 3840,
    totalChannels: 18,
    activeStreams: 16,
    healthySources: 8,
    failedSources: 1,
    pendingAlerts: 2,
    systemUptime: '৯৯.৯%'
  },
  channels: [
    {
      id: 'somoy-tv',
      nameBn: 'সময় টিভি',
      nameEn: 'Somoy TV',
      category: 'NEWS',
      status: 'ACTIVE',
      streamType: 'hls',
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      useProxy: true,
      health: 'ONLINE',
      failureCount: 0,
      responseTimeMs: 140
    },
    {
      id: 'ekattor-tv',
      nameBn: 'একাত্তর টিভি',
      nameEn: 'Ekattor TV',
      category: 'NEWS',
      status: 'ACTIVE',
      streamType: 'hls',
      streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      useProxy: true,
      health: 'ONLINE',
      failureCount: 0,
      responseTimeMs: 210
    },
    {
      id: 'jamuna-tv',
      nameBn: 'যমুনা টিভি',
      nameEn: 'Jamuna TV',
      category: 'NEWS',
      status: 'ACTIVE',
      streamType: 'hls',
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      useProxy: true,
      health: 'ONLINE',
      failureCount: 0,
      responseTimeMs: 180
    },
    {
      id: 't-sports',
      nameBn: 'টি স্পোর্টস',
      nameEn: 'T Sports',
      category: 'SPORTS',
      status: 'ACTIVE',
      streamType: 'hls',
      streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      useProxy: true,
      health: 'SLOW',
      failureCount: 1,
      responseTimeMs: 980
    }
  ],
  sources: [
    {
      id: 'src-101',
      name: 'প্রথম আলো আরএসএস ফিড',
      type: 'RSS',
      endpoint: 'https://www.prothomalo.com/feed',
      intervalMins: 15,
      status: 'HEALTHY',
      lastRun: '১০ মিনিট আগে',
      itemsCount: 142
    },
    {
      id: 'src-102',
      name: 'বাংলাদেশ আবহাওয়া অধিদপ্তর খোলা ডাটা',
      type: 'WEATHER_API',
      endpoint: 'https://api.bmd.gov.bd/v1/forecast',
      intervalMins: 30,
      status: 'HEALTHY',
      lastRun: '২০ মিনিট আগে',
      itemsCount: 64
    },
    {
      id: 'src-103',
      name: 'সরকারি জব অ্যান্ড ইন্টার্ন পোর্টাল',
      type: 'OPPORTUNITY_SOURCE',
      endpoint: 'https://jobs.gov.bd/api/openings',
      intervalMins: 60,
      status: 'FAILED',
      lastRun: '১ ঘণ্টা আগে (Error 503)',
      itemsCount: 0
    }
  ],
  alerts: [
    {
      id: 'alt-1',
      title: 'বঙ্গোপসাগরে ৩ নম্বর সতর্ক সংকেত',
      level: 'WARNING',
      division: 'চট্টগ্রাম',
      district: 'কক্সবাজার',
      status: 'PUBLISHED',
      createdAt: '২০২৬-০৮-১০ ১০:৩০'
    },
    {
      id: 'alt-2',
      title: 'সুরমা ও কুশিয়ারা নদীর পানির সমতল বৃদ্ধি',
      level: 'ADVISORY',
      division: 'সিলেট',
      district: 'সুনামগঞ্জ',
      status: 'PUBLISHED',
      createdAt: '২০২৬-০৮-১০ ১১:১৫'
    }
  ],
  auditLogs: [
    {
      id: 'log-101',
      admin: 'tonmoymalot@gmail.com',
      action: 'UPDATE_STREAM',
      resource: 'tv_channels / somoy-tv',
      time: 'আজ ১১:৪৫ AM',
      ip: '103.205.12.44'
    },
    {
      id: 'log-102',
      admin: 'admin@bangladesh-live-hub.org',
      action: 'CREATE_ALERT',
      resource: 'public_alerts / alt-1',
      time: 'আজ ১০:৩০ AM',
      ip: '103.205.12.18'
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
