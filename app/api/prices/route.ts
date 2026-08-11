import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface CommodityPrice {
  id: string;
  nameBn: string;
  nameEn: string;
  unitBn: string;
  unitEn: string;
  category: 'currency' | 'metal' | 'fuel' | 'essential';
  currentPrice: number;
  previousPrice: number;
  currency: string;
  changePercent: number;
  lastUpdated: string;
  source: string;
}

export async function GET(req: NextRequest) {
  const prices: CommodityPrice[] = [
    {
      id: 'usd-bdt',
      nameBn: 'মার্কিন ডলার (USD)',
      nameEn: 'US Dollar',
      unitBn: '১ ডলার',
      unitEn: '1 USD',
      category: 'currency',
      currentPrice: 121.50,
      previousPrice: 121.20,
      currency: '৳',
      changePercent: 0.25,
      lastUpdated: new Date().toISOString(),
      source: 'বাংলাদেশ ব্যাংক রেট'
    },
    {
      id: 'sar-bdt',
      nameBn: 'সৌদি রিয়াল (SAR)',
      nameEn: 'Saudi Riyal',
      unitBn: '১ রিয়াল',
      unitEn: '1 SAR',
      category: 'currency',
      currentPrice: 32.38,
      previousPrice: 32.35,
      currency: '৳',
      changePercent: 0.09,
      lastUpdated: new Date().toISOString(),
      source: 'বাংলাদেশ ব্যাংক রেট'
    },
    {
      id: 'aed-bdt',
      nameBn: 'ইউএই দিরহাম (AED)',
      nameEn: 'UAE Dirham',
      unitBn: '১ দিরহাম',
      unitEn: '1 AED',
      category: 'currency',
      currentPrice: 33.08,
      previousPrice: 33.05,
      currency: '৳',
      changePercent: 0.09,
      lastUpdated: new Date().toISOString(),
      source: 'বাংলাদেশ ব্যাংক রেট'
    },
    {
      id: 'gold-22k',
      nameBn: '২২ ক্যারেট সোনা (ভরি)',
      nameEn: '22K Gold (Bhori)',
      unitBn: '১ ভরি (১১.৬৬৪ গ্রাম)',
      unitEn: '1 Bhori',
      category: 'metal',
      currentPrice: 142200,
      previousPrice: 141000,
      currency: '৳',
      changePercent: 0.85,
      lastUpdated: new Date().toISOString(),
      source: 'বাজুস (BAJUS)'
    },
    {
      id: 'silver-22k',
      nameBn: '২২ ক্যারেট রূপা (ভরি)',
      nameEn: '22K Silver (Bhori)',
      unitBn: '১ ভরি',
      unitEn: '1 Bhori',
      category: 'metal',
      currentPrice: 2100,
      previousPrice: 2100,
      currency: '৳',
      changePercent: 0.00,
      lastUpdated: new Date().toISOString(),
      source: 'বাজুস (BAJUS)'
    },
    {
      id: 'octane',
      nameBn: 'অকটেন (প্রতি লিটার)',
      nameEn: 'Octane (Liter)',
      unitBn: '১ লিটার',
      unitEn: '1 Liter',
      category: 'fuel',
      currentPrice: 125.00,
      previousPrice: 125.00,
      currency: '৳',
      changePercent: 0.00,
      lastUpdated: new Date().toISOString(),
      source: 'বিপিসি (BPC)'
    },
    {
      id: 'diesel',
      nameBn: 'ডিজেল (প্রতি লিটার)',
      nameEn: 'Diesel (Liter)',
      unitBn: '১ লিটার',
      unitEn: '1 Liter',
      category: 'fuel',
      currentPrice: 105.50,
      previousPrice: 105.50,
      currency: '৳',
      changePercent: 0.00,
      lastUpdated: new Date().toISOString(),
      source: 'বিপিসি (BPC)'
    },
    {
      id: 'rice-miniket',
      nameBn: 'সরু চাল / মিনিকেট',
      nameEn: 'Miniket Rice',
      unitBn: '১ কেজি',
      unitEn: '1 Kg',
      category: 'essential',
      currentPrice: 72.00,
      previousPrice: 74.00,
      currency: '৳',
      changePercent: -2.70,
      lastUpdated: new Date().toISOString(),
      source: 'কৃষি বিপণন অধিদপ্তর (DAM)'
    },
    {
      id: 'potato',
      nameBn: 'আলু (ডালু/দেশি)',
      nameEn: 'Potato',
      unitBn: '১ কেজি',
      unitEn: '1 Kg',
      category: 'essential',
      currentPrice: 35.00,
      previousPrice: 38.00,
      currency: '৳',
      changePercent: -7.89,
      lastUpdated: new Date().toISOString(),
      source: 'কৃষি বিপণন অধিদপ্তর (DAM)'
    },
    {
      id: 'onion-local',
      nameBn: 'দেশি পেঁয়াজ',
      nameEn: 'Local Onion',
      unitBn: '১ কেজি',
      unitEn: '1 Kg',
      category: 'essential',
      currentPrice: 85.00,
      previousPrice: 90.00,
      currency: '৳',
      changePercent: -5.55,
      lastUpdated: new Date().toISOString(),
      source: 'কৃষি বিপণন অধিদপ্তর (DAM)'
    },
    {
      id: 'egg-farm',
      nameBn: 'ফার্মের ডিম (হালি)',
      nameEn: 'Farm Egg (4 pcs)',
      unitBn: '১ হালি (৪টি)',
      unitEn: '4 Pcs',
      category: 'essential',
      currentPrice: 52.00,
      previousPrice: 54.00,
      currency: '৳',
      changePercent: -3.70,
      lastUpdated: new Date().toISOString(),
      source: 'কৃষি বিপণন অধিদপ্তর (DAM)'
    },
    {
      id: 'broiler-chicken',
      nameBn: 'ব্রয়লার মুরগি',
      nameEn: 'Broiler Chicken',
      unitBn: '১ কেজি',
      unitEn: '1 Kg',
      category: 'essential',
      currentPrice: 175.00,
      previousPrice: 180.00,
      currency: '৳',
      changePercent: -2.77,
      lastUpdated: new Date().toISOString(),
      source: 'কৃষি বিপণন অধিদপ্তর (DAM)'
    }
  ];

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    items: prices
  });
}
