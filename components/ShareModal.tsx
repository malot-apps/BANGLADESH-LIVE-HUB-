'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Send, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  language: 'bn' | 'en';
}

export default function ShareModal({ isOpen, onClose, title, url, language }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `📌 ${title}\n\nসরাসরি আপডেট জানতে দেখুন: ${url || 'https://bangladesh-live-hub.org'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url || 'https://bangladesh-live-hub.org');

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base">
              {language === 'bn' ? 'শেয়ার করুন' : 'Share Information'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold p-1">
            ✕
          </button>
        </div>

        {/* Share Card Preview */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
          <p className="font-bold text-emerald-300">{title}</p>
          <p className="text-[10px] text-slate-400 font-mono truncate">{url || 'https://bangladesh-live-hub.org'}</p>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <a
            href={`https://api.whatsapp.com/send?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Facebook</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </a>

          <button
            onClick={handleCopy}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি লিংক' : 'Copy Link')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
