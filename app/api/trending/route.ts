import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const trendingTopics = [
    { tag: '#বঙ্গোপসাগরসতর্কতা', count: 1420, category: 'আবহাওয়া', growth: '+35%' },
    { tag: '#৪৬তমবিসিএস', count: 980, category: 'চাকরি', growth: '+18%' },
    { tag: '#আলুওতেলেরদর', count: 850, category: 'অর্থনীতি', growth: '+22%' },
    { tag: '#বাংলাদেশক্রিকেট', count: 720, category: 'খেলাধুলা', growth: '+12%' },
    { tag: '#আইসিটিবৃত্তি২০২৬', count: 640, category: 'শিক্ষা', growth: '+40%' },
    { tag: '#ঢাকাট্রাফিক', count: 510, category: 'পরিবহন', growth: '+8%' },
  ];

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    topics: trendingTopics
  });
}
