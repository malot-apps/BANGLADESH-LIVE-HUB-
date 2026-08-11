/* File: client/main.js */

// Mock Data for Client Portal
window.BDHubData = {
  weather: {
    district: 'ঢাকা',
    temp: '৩২°সে',
    condition: 'আংশিক মেঘলা',
    humidity: '৭২%',
    wind: '১২ কিমি/ঘন্টা',
    updateTime: 'এইমাত্র আপডেট করা হয়েছে'
  },
  alerts: [
    {
      id: 'alt-101',
      title: 'বঙ্গোপসাগরে ৩ নম্বর দূরবর্তী সতর্ক সংকেত অব্যাহত',
      level: 'WARNING', // INFO, ADVISORY, WARNING, SEVERE
      region: 'উপকূলীয় অঞ্চল ও চট্টগ্রাম বন্দর',
      time: '১০ মিনিট আগে',
      desc: 'উত্তর বঙ্গোপসাগর ও সংলগ্ন বাংলাদেশের উপকূলীয় এলাকায় গভীর সঞ্চালনশীল মেঘমালা সৃষ্টি হচ্ছে।'
    },
    {
      id: 'alt-102',
      title: 'সিলেট ও সুনামগঞ্জ জেলায় ভারী বৃষ্টির পূর্বাভাস',
      level: 'ADVISORY',
      region: 'সিলেট বিভাগ',
      time: '২৫ মিনিট আগে',
      desc: 'আগামী ২৪ ঘণ্টায় সুরমা ও কুশিয়ারা নদীর পানি সাময়িকভাবে বৃদ্ধি পেতে পারে।'
    }
  ],
  news: [
    {
      id: 'n-1',
      titleBn: 'মেট্রোরেলের নতুন সময়সূচি প্রকাশ: আগামী সপ্তাহ থেকে রাত ১০টা পর্যন্ত চলবে',
      category: 'জাতীয়',
      source: 'প্রথম আলো',
      time: '১৫ মিনিট আগে',
      readTime: '৩ মিনিট পাঠ',
      image: 'https://picsum.photos/seed/metro/600/350'
    },
    {
      id: 'n-2',
      titleBn: 'বাংলাদেশ ব্যাংক বাণিজ্যিক ব্যাংকগুলোর জন্য রেপো রেট বৃদ্ধি করেছে',
      category: 'অর্থনীতি',
      source: 'ডেইলি স্টার',
      time: '৪০ মিনিট আগে',
      readTime: '৪ মিনিট পাঠ',
      image: 'https://picsum.photos/seed/bank/600/350'
    },
    {
      id: 'n-3',
      titleBn: 'এশিয়া কাপের জন্য বাংলাদেশ জাতীয় ক্রিকেট দল চূড়ান্ত ঘোষণা',
      category: 'খেলাধুলা',
      source: 'বিডিনিউজ২৪',
      time: '১ ঘণ্টা আগে',
      readTime: '২ মিনিট পাঠ',
      image: 'https://picsum.photos/seed/cricket/600/350'
    }
  ],
  channels: [
    {
      id: 'somoy-tv',
      nameBn: 'সময় টিভি',
      nameEn: 'Somoy TV',
      category: 'news',
      logo: 'https://picsum.photos/seed/somoy/120/120',
      isFeatured: true,
      status: 'ONLINE',
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      type: 'hls'
    },
    {
      id: 'ekattor-tv',
      nameBn: 'একাত্তর টিভি',
      nameEn: 'Ekattor TV',
      category: 'news',
      logo: 'https://picsum.photos/seed/ekattor/120/120',
      isFeatured: true,
      status: 'ONLINE',
      streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      type: 'hls'
    },
    {
      id: 'jamuna-tv',
      nameBn: 'যমুনা টিভি',
      nameEn: 'Jamuna TV',
      category: 'news',
      logo: 'https://picsum.photos/seed/jamuna/120/120',
      isFeatured: true,
      status: 'ONLINE',
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      type: 'hls'
    },
    {
      id: 't-sports',
      nameBn: 'টি স্পোর্টস',
      nameEn: 'T Sports',
      category: 'sports',
      logo: 'https://picsum.photos/seed/tsports/120/120',
      isFeatured: false,
      status: 'ONLINE',
      streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      type: 'hls'
    },
    {
      id: 'channel-i',
      nameBn: 'চ্যানেল আই',
      nameEn: 'Channel i',
      category: 'entertainment',
      logo: 'https://picsum.photos/seed/channeli/120/120',
      isFeatured: false,
      status: 'ONLINE',
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      type: 'hls'
    },
    {
      id: 'peace-tv',
      nameBn: 'পিস টিভি বাংলা',
      nameEn: 'Peace TV Bangla',
      category: 'islamic',
      logo: 'https://picsum.photos/seed/peacetv/120/120',
      isFeatured: false,
      status: 'ONLINE',
      streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      type: 'hls'
    }
  ]
};

// HLS Player Controller Class
class TVStreamPlayer {
  constructor(videoElementId) {
    this.videoEl = document.getElementById(videoElementId);
    this.hls = null;
  }

  loadStream(url) {
    if (!this.videoEl) return;

    if (Hls.isSupported()) {
      if (this.hls) {
        this.hls.destroy();
      }
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      this.hls.loadSource(url);
      this.hls.attachMedia(this.videoEl);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoEl.play().catch(e => console.log('Autoplay prevented:', e));
      });
    } else if (this.videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoEl.src = url;
      this.videoEl.addEventListener('loadedmetadata', () => {
        this.videoEl.play().catch(e => console.log('Autoplay prevented:', e));
      });
    }
  }

  stop() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.videoEl) {
      this.videoEl.pause();
      this.videoEl.src = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
