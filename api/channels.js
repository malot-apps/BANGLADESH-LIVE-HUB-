// File: api/channels.js
// Vercel Serverless Function for Live TV Channels CRUD

let channelsStore = [
  {
    id: 'ch-1',
    nameBn: 'সময় টিভি',
    nameEn: 'Somoy News',
    category: 'সংবাদ',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
    streamUrl: 'https://cdn.somoynews.tv/live/somoynews/index.m3u8',
    backupUrl: 'https://live-somoy.stream.bd/hls/live.m3u8',
    proxyEnabled: true,
    resolution: '1080p',
    isOnline: true,
    pingMs: 42,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ch-2',
    nameBn: 'যমুনা টিভি',
    nameEn: 'Jamuna TV',
    category: 'সংবাদ',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80',
    streamUrl: 'https://live-cdn.jamuna.tv/hls/jamunatv.m3u8',
    backupUrl: '',
    proxyEnabled: true,
    resolution: '1080p',
    isOnline: true,
    pingMs: 58,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ch-3',
    nameBn: 'একাত্তর টিভি',
    nameEn: 'Ekattor TV',
    category: 'সংবাদ',
    logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop&q=80',
    streamUrl: 'https://stream.ekattor.tv/hls/live.m3u8',
    backupUrl: '',
    proxyEnabled: true,
    resolution: '720p',
    isOnline: true,
    pingMs: 120,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ch-4',
    nameBn: 'ডিবিসি নিউজ',
    nameEn: 'DBC News',
    category: 'সংবাদ',
    logo: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=100&auto=format&fit=crop&q=80',
    streamUrl: 'https://dbcnews.tv/live/stream.m3u8',
    backupUrl: '',
    proxyEnabled: true,
    resolution: '1080p',
    isOnline: true,
    pingMs: 35,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ch-5',
    nameBn: 'বিটিভি জাতীয়',
    nameEn: 'BTV National',
    category: 'জাতীয়',
    logo: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=100&auto=format&fit=crop&q=80',
    streamUrl: 'https://btvlive.gov.bd/hls/national.m3u8',
    backupUrl: '',
    proxyEnabled: false,
    resolution: '1080p',
    isOnline: true,
    pingMs: 25,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ch-6',
    nameBn: 'টি স্পোর্টস',
    nameEn: 'T Sports',
    category: 'খেলাধুলা',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    streamUrl: 'https://tsports.live/hls/channel1.m3u8',
    backupUrl: '',
    proxyEnabled: true,
    resolution: '1080p',
    isOnline: true,
    pingMs: 48,
    updatedAt: new Date().toISOString()
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  if (method === 'GET') {
    const { category } = req.query || {};
    let filtered = [...channelsStore];
    if (category && category !== 'সব') {
      filtered = filtered.filter(c => c.category === category);
    }
    return res.status(200).json({
      success: true,
      count: filtered.length,
      channels: filtered
    });
  }

  if (method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { nameBn, nameEn, category, streamUrl, backupUrl, proxyEnabled } = body || {};

      if (!nameBn || !streamUrl) {
        return res.status(400).json({ error: 'nameBn and streamUrl are required' });
      }

      const newChannel = {
        id: `ch-${Date.now()}`,
        nameBn,
        nameEn: nameEn || nameBn,
        category: category || 'সংবাদ',
        logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
        streamUrl,
        backupUrl: backupUrl || '',
        proxyEnabled: proxyEnabled !== undefined ? Boolean(proxyEnabled) : true,
        resolution: '1080p',
        isOnline: true,
        pingMs: Math.floor(Math.random() * 40) + 20,
        updatedAt: new Date().toISOString()
      };

      channelsStore.unshift(newChannel);
      return res.status(201).json({ success: true, channel: newChannel });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create channel', details: err.message });
    }
  }

  if (method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, ...updates } = body || {};
      if (!id) return res.status(400).json({ error: 'Channel ID required for update' });

      const idx = channelsStore.findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Channel not found' });

      channelsStore[idx] = {
        ...channelsStore[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return res.status(200).json({ success: true, channel: channelsStore[idx] });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update channel', details: err.message });
    }
  }

  if (method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'Channel ID parameter is required' });

    channelsStore = channelsStore.filter(c => c.id !== id);
    return res.status(200).json({ success: true, message: 'Channel deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
