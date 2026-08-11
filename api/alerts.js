// File: api/alerts.js
// Vercel Serverless Function for Emergency Notices & Public Alerts

let alertsStore = [
  {
    id: 'alt-101',
    title: 'চট্টগ্রাম ও কক্সবাজার সমুদ্রবন্দরে ৩ নম্বর স্থানীয় সতর্ক সংকেত',
    description: 'উত্তর বঙ্গোপসাগরে সৃষ্টি হওয়া গভীর নিম্নচাপের কারণে সকল মাছ ধরার ট্রলারকে পরবর্তী নির্দেশ না দেওয়া পর্যন্ত উপকূলের কাছাকাছি থাকতে বলা হয়েছে।',
    area: 'চট্টগ্রাম, কক্সবাজার, পায়রা ও মোংলা',
    level: 'danger',
    badge: '🚨 বিপদ সংকেত',
    date: '১০ আগস্ট ২০২৬',
    isActive: true
  },
  {
    id: 'alt-102',
    title: 'সিলেট ও সুনামগঞ্জ জেলায় নদীসমূহের পানি দ্রুত বৃদ্ধির পূর্বাভাস',
    description: 'উজান থেকে নেমে আসা পাহাড়ি ঢলে সুরমা ও কুশিয়ারা নদীর পানি বিপৎসীমার কাছাকাছি প্রবাহিত হচ্ছে। নিম্নাঞ্চলের বাসিন্দাদের সতর্ক থাকার পরামর্শ দেওয়া হয়েছে।',
    area: 'সিলেট, সুনামগঞ্জ, মৌলভীবাজার',
    level: 'warning',
    badge: '⚠️ সতর্কবার্তা',
    date: '১০ আগস্ট ২০২৬',
    isActive: true
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: alertsStore.length,
      alerts: alertsStore
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, description, area, level } = body || {};

      if (!title) {
        return res.status(400).json({ error: 'Alert title is required' });
      }

      const newAlert = {
        id: `alt-${Date.now()}`,
        title,
        description: description || '',
        area: area || 'সারাদেশ',
        level: level || 'warning',
        badge: level === 'danger' ? '🚨 বিপদ সংকেত' : '⚠️ সতর্কবার্তা',
        date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        isActive: true
      };

      alertsStore.unshift(newAlert);
      return res.status(201).json({ success: true, alert: newAlert });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create alert', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
