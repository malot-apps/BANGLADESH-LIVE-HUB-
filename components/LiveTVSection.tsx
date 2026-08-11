// File: components/LiveTVSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Tv, Play, Pause, Volume2, VolumeX, RefreshCw, Shield, AlertCircle } from 'lucide-react';

export interface TVChannel {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'news' | 'sports' | 'entertainment' | 'islamic' | 'national';
  logo: string;
  streamUrl: string;
  fallbackUrl?: string;
  isOnline: boolean;
  resolution?: string;
  useProxy?: boolean;
}

const DEFAULT_CHANNELS: TVChannel[] = [
  {
    id: 'somoy-news',
    nameBn: 'সময় টিভি',
    nameEn: 'Somoy News',
    category: 'news',
    logo: '📺',
    streamUrl: 'https://cdn.somoynews.tv/live/somoynews/index.m3u8',
    fallbackUrl: 'https://stream.bdhub.org/hls/somoy.m3u8',
    isOnline: true,
    resolution: '1080p',
    useProxy: true,
  },
  {
    id: 'jamuna-tv',
    nameBn: 'যমুনা টিভি',
    nameEn: 'Jamuna TV',
    category: 'news',
    logo: '🔴',
    streamUrl: 'https://live-cdn.jamuna.tv/hls/jamunatv.m3u8',
    isOnline: true,
    resolution: '1080p',
    useProxy: true,
  },
  {
    id: 'ekattor-tv',
    nameBn: 'একাত্তর টিভি',
    nameEn: 'Ekattor TV',
    category: 'news',
    logo: '📰',
    streamUrl: 'https://stream.ekattor.tv/hls/live.m3u8',
    isOnline: true,
    resolution: '720p',
    useProxy: true,
  },
  {
    id: 'dbc-news',
    nameBn: 'ডিবিসি নিউজ',
    nameEn: 'DBC News',
    category: 'news',
    logo: '📡',
    streamUrl: 'https://dbcnews.tv/live/stream.m3u8',
    isOnline: true,
    resolution: '720p',
    useProxy: true,
  },
  {
    id: 'btv-national',
    nameBn: 'বিটিভি জাতীয়',
    nameEn: 'BTV National',
    category: 'national',
    logo: '🇧🇩',
    streamUrl: 'https://btvlive.gov.bd/hls/national.m3u8',
    isOnline: true,
    resolution: '1080p',
    useProxy: false,
  },
  {
    id: 'btv-news',
    nameBn: 'বিটিভি ওয়ার্ল্ড',
    nameEn: 'BTV World',
    category: 'national',
    logo: '🌏',
    streamUrl: 'https://btvlive.gov.bd/hls/world.m3u8',
    isOnline: true,
    resolution: '720p',
    useProxy: false,
  },
  {
    id: 't-sports',
    nameBn: 'টি স্পোর্টস',
    nameEn: 'T Sports',
    category: 'sports',
    logo: '⚽',
    streamUrl: 'https://tsports.live/hls/channel1.m3u8',
    isOnline: true,
    resolution: '1080p',
    useProxy: true,
  },
  {
    id: 'channel-i',
    nameBn: 'চ্যানেল আই',
    nameEn: 'Channel i',
    category: 'entertainment',
    logo: '🎭',
    streamUrl: 'https://channeli.tv/live/stream.m3u8',
    isOnline: true,
    resolution: '720p',
    useProxy: true,
  },
  {
    id: 'atn-bangla',
    nameBn: 'এটিএন বাংলা',
    nameEn: 'ATN Bangla',
    category: 'entertainment',
    logo: '🎬',
    streamUrl: 'https://atnbangla.tv/hls/live.m3u8',
    isOnline: true,
    resolution: '720p',
    useProxy: true,
  },
  {
    id: 'peace-tv-bangla',
    nameBn: 'পিস টিভি বাংলা',
    nameEn: 'Peace TV Bangla',
    category: 'islamic',
    logo: '🌙',
    streamUrl: 'https://peacetv.tv/hls/bangla.m3u8',
    isOnline: true,
    resolution: '720p',
    useProxy: true,
  },
  {
    id: 'quran-live',
    nameBn: 'মক্কা মদিনা লাইভ',
    nameEn: 'Makkah Live Quran',
    category: 'islamic',
    logo: '🕌',
    streamUrl: 'https://saudi.gov.sa/hls/makkah.m3u8',
    isOnline: true,
    resolution: '1080p',
    useProxy: true,
  },
];

interface LiveTVSectionProps {
  language?: 'bn' | 'en';
}

export default function LiveTVSection({ language = 'bn' }: LiveTVSectionProps) {
  const [channels, setChannels] = useState<TVChannel[]>(DEFAULT_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<TVChannel>(DEFAULT_CHANNELS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usingProxy, setUsingProxy] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Load and play channel
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedChannel) return;

    setIsLoading(true);
    setHasError(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    let targetUrl = selectedChannel.streamUrl;

    if (usingProxy && selectedChannel.useProxy) {
      targetUrl = `/api/tv-proxy?url=${encodeURIComponent(selectedChannel.streamUrl)}`;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(targetUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) {
          video.play().catch(() => {
            video.muted = true;
            setIsMuted(true);
            video.play().catch((err) => console.log('Autoplay error:', err));
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setHasError(true);
              setIsLoading(false);
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = targetUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (isPlaying) {
          video.play().catch(() => {});
        }
      });
    } else {
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedChannel, usingProxy]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const categories = [
    { id: 'all', nameBn: 'সব চ্যানেল', nameEn: 'All Channels' },
    { id: 'news', nameBn: 'সংবাদ', nameEn: 'News' },
    { id: 'sports', nameBn: 'খেলাধুলা', nameEn: 'Sports' },
    { id: 'entertainment', nameBn: 'বিনোদন', nameEn: 'Entertainment' },
    { id: 'islamic', nameBn: 'ইসলামিক', nameEn: 'Islamic' },
    { id: 'national', nameBn: 'জাতীয়', nameEn: 'National' },
  ];

  const filteredChannels = activeCategory === 'all'
    ? channels
    : channels.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-6">
      
      {/* Header Badge */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-rose-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Tv className="w-48 h-48 text-rose-500" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                {language === 'bn' ? 'সরাসরি ডিজিটাল সম্প্রচার' : 'Live Digital Broadcast'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700">
                <Shield className="w-3 h-3 text-emerald-400" />
                {usingProxy ? 'Cloudflare Proxy (HTTPS)' : 'Direct Connection'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'bn' ? '🔴 বাংলাদেশ লাইভ টিভি চ্যানেল' : '🔴 Bangladesh Live TV Stream'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {language === 'bn'
                ? 'অনুমোদিত উন্মুক্ত এইচএলএস স্ট্রিমিং ও ক্লাউডফ্লেয়ার এয প্রক্সির মাধ্যমে নিরবচ্ছিন্ন সরাসরি টেলিভিশন সম্প্রচার।'
                : 'Buffer-free HD streams powered by Cloudflare Edge proxy and HLS technology.'}
            </p>
          </div>

          <button
            onClick={() => setUsingProxy(!usingProxy)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border shadow-md ${
              usingProxy
                ? 'bg-rose-600/80 hover:bg-rose-500 text-white border-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {usingProxy ? (language === 'bn' ? 'প্রক্সি সক্রিয়' : 'Proxy Active') : (language === 'bn' ? 'প্রক্সি নিষ্ক্রিয়' : 'Proxy Off')}
          </button>
        </div>
      </div>

      {/* Main Video Player Container */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <div className="relative aspect-video bg-black flex items-center justify-center group">
          
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            controls={false}
          />

          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3 z-20">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-rose-300">
                {language === 'bn' ? `${selectedChannel.nameBn} লোড হচ্ছে...` : `Connecting to ${selectedChannel.nameEn}...`}
              </p>
            </div>
          )}

          {hasError && !isLoading && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 text-white space-y-3 z-20">
              <AlertCircle className="w-12 h-12 text-rose-500 animate-bounce" />
              <h3 className="text-base font-bold text-slate-100">
                {language === 'bn' ? 'লাইভ স্ট্রিম সংযোগ বিচ্ছিন্ন' : 'Live Stream Unavailable'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                {language === 'bn'
                  ? 'চ্যানেল স্ট্রিম লিংকটিতে অস্থায়ী সমস্যা হতে পারে। ক্লাউডফ্লেয়ার প্রক্সি সুইচ টিপুন বা অন্য চ্যানেল চেষ্টা করুন।'
                  : 'Upstream connection timed out. Toggle Cloudflare Proxy or choose another channel.'}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedChannel({ ...selectedChannel })}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
                >
                  {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry Stream'}
                </button>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-black text-white">LIVE</span>
              <span className="text-xs text-slate-300 font-bold ml-1 border-l border-slate-700 pl-2">
                {language === 'bn' ? selectedChannel.nameBn : selectedChannel.nameEn}
              </span>
            </div>

            {selectedChannel.resolution && (
              <span className="text-[10px] font-extrabold bg-rose-600 text-white px-2.5 py-1 rounded-full shadow-md">
                {selectedChannel.resolution}
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white">
                  {language === 'bn' ? selectedChannel.nameBn : selectedChannel.nameEn}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {selectedChannel.category} Channel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChannel({ ...selectedChannel })}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-sm'
            }`}
          >
            {language === 'bn' ? cat.nameBn : cat.nameEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredChannels.map((channel) => {
          const isSelected = selectedChannel.id === channel.id;
          return (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-950 to-slate-900 border-rose-500 ring-2 ring-rose-500/50 shadow-xl'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{channel.logo}</span>
                {channel.isOnline ? (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                )}
              </div>

              <div>
                <h4 className={`text-xs font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? channel.nameBn : channel.nameEn}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className={`capitalize font-semibold ${isSelected ? 'text-rose-300' : 'text-slate-500'}`}>
                    {channel.category}
                  </span>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-rose-900/60 text-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                    {channel.resolution || 'HD'}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-md">
                  <Play className="w-3 h-3 fill-current" />
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
