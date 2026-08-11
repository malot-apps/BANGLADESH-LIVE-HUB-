import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface PublicAlert {
  id: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  severity: 'severe' | 'warning' | 'advisory' | 'info';
  color: string; // red, orange, yellow, blue
  layer: 'cyclone' | 'storm' | 'flood' | 'river' | 'transport' | 'public';
  affectedDistricts: string[]; // district ids
  issuedAt: string;
  expiresAt: string;
  source: string;
  officialLink?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district');

  const now = new Date();
  const alerts: PublicAlert[] = [
    {
      id: 'alert-101',
      titleBn: 'উত্তর বঙ্গোপসাগরে ৩ নম্বর স্থানীয় সতর্ক সংকেত',
      titleEn: 'Local Cautionary Signal No. 3 over North Bay',
      summaryBn: 'উত্তর বঙ্গোপসাগর ও তৎসংলগ্ন উপকূলীয় এলাকায় গভীর মেঘমালা সৃষ্টি অব্যাহত রয়েছে। চট্টগ্রাম, কক্সবাজার, মংলা ও পায়রা সমুদ্রবন্দরসমূহকে ৩ নম্বর স্থানীয় সতর্ক সংকেত দেখিয়ে যেতে বলা হয়েছে।',
      summaryEn: 'Deep convective clouds continue over North Bay. Maritime ports advised to keep signal No. 3 hoisted.',
      severity: 'warning',
      color: '#f97316', // Orange
      layer: 'storm',
      affectedDistricts: ['chittagong', 'coxsbazar', 'bhola', 'noakhali', 'satkhira', 'barisal'],
      issuedAt: new Date(now.getTime() - 2 * 360 * 1000).toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      source: 'বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD)',
      officialLink: 'http://bmd.gov.bd'
    },
    {
      id: 'alert-102',
      titleBn: 'সিলেট ও সুনামগঞ্জ অঞ্চলে পাহাড়ি ঢল ও নদীর পানি বৃদ্ধির পূর্বাভাস',
      titleEn: 'Flash Flood Advisory for Sylhet and Sunamganj',
      summaryBn: 'সুরমা ও কুশিয়ারা নদীর পানি প্রধান প্রধান পয়েন্টে বিপৎসীমার কাছাকাছি প্রবাহিত হচ্ছে। নিম্নাঞ্চলের বাসিন্দাদের সতর্ক থাকার পরামর্শ দিয়েছে বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র।',
      summaryEn: 'Surma and Kushiyara river water levels nearing danger marks due to upstream rain.',
      severity: 'severe',
      color: '#ef4444', // Red
      layer: 'flood',
      affectedDistricts: ['sylhet', 'sunamganj', 'moulvibazar'],
      issuedAt: new Date(now.getTime() - 5 * 3600 * 1000).toISOString(),
      expiresAt: new Date(now.getTime() + 48 * 3600 * 1000).toISOString(),
      source: 'বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র (FFWC)',
      officialLink: 'http://ffwc.gov.bd'
    },
    {
      id: 'alert-103',
      titleBn: 'ঢাকা-চট্টগ্রাম মহাসড়কে সংস্কার কাজ চলাকালীন ধীরগতির নোটিশ',
      titleEn: 'Traffic Slowdown Advisory on Dhaka-Chittagong Highway',
      summaryBn: 'কাঁচপুর ও মেঘনা ব্রিজ সংলগ্ন এলাকায় সড়ক মেরামতের কাজ চলায় যান চলাচল কিছুটা ধীরগতি হতে পারে। দূরপাল্লার যানবাহনকে অতিরিক্ত ২৫ মিনিট হাতে নিয়ে বের হওয়ার পরামর্শ।',
      summaryEn: 'Road maintenance near Kanchpur Bridge causing minor traffic slowdown.',
      severity: 'advisory',
      color: '#eab308', // Yellow
      layer: 'transport',
      affectedDistricts: ['dhaka', 'narayanganj', 'comilla'],
      issuedAt: new Date(now.getTime() - 1 * 3600 * 1000).toISOString(),
      expiresAt: new Date(now.getTime() + 12 * 3600 * 1000).toISOString(),
      source: 'হাইওয়ে পুলিশ বুলেটিন',
      officialLink: 'https://police.gov.bd'
    },
    {
      id: 'alert-104',
      titleBn: 'সারাদেশে আইসিটি শিক্ষানবিস কর্মসূচির অনলাইন আবেদন গ্রহণ শুরু',
      titleEn: 'ICT Apprenticeship Program Online Registration Open',
      summaryBn: 'সরকারি মেধা প্রকল্পের অধীনে যুবকদের জন্য বিনামূল্যে তথ্যপ্রযুক্তি প্রশিক্ষণ সুযোগ। কোনো নিবন্ধন ফি নেই।',
      summaryEn: 'Free ICT training application open for young talents.',
      severity: 'info',
      color: '#3b82f6', // Blue
      layer: 'public',
      affectedDistricts: ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal', 'rangpur', 'mymensingh'],
      issuedAt: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
      expiresAt: new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString(),
      source: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ',
      officialLink: 'https://ict.gov.bd'
    }
  ];

  let filtered = alerts;
  if (district) {
    filtered = alerts.filter(a => a.affectedDistricts.includes(district.toLowerCase()) || a.affectedDistricts.includes('all'));
  }

  return NextResponse.json({
    total: filtered.length,
    alerts: filtered,
    updatedAt: new Date().toISOString()
  });
}
