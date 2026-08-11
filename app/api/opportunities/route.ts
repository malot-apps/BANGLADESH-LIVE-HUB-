import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface Opportunity {
  id: string;
  titleBn: string;
  titleEn: string;
  orgNameBn: string;
  orgNameEn: string;
  category: 'job' | 'internship' | 'scholarship' | 'competition' | 'training';
  eligibilityBn: string;
  locationBn: string;
  deadline: string; // ISO date string
  benefitsBn: string;
  source: string;
  applyUrl: string;
  isOfficialGovt?: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'all';
  const filter = searchParams.get('filter') || 'all'; // 'today', 'tomorrow', 'this_week', 'this_month'
  const query = searchParams.get('search') || '';

  const now = new Date();
  const opportunities: Opportunity[] = [
    {
      id: 'opp-1',
      titleBn: '৪৬তম বিসিএস ক্যাডার ও নন-ক্যাডার বিশেষ নিয়োগ বিজ্ঞপ্তি',
      titleEn: '46th BCS Exam Official Notification',
      orgNameBn: 'বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)',
      orgNameEn: 'Bangladesh Public Service Commission',
      category: 'job',
      eligibilityBn: 'স্বীকৃত বিশ্ববিদ্যালয় থেকে স্নাতক বা সমমানের ডিগ্রিধারীরা আবেদন করতে পারবেন। বয়সসীমা ২১-৩০ বছর।',
      locationBn: 'সারাদেশ',
      deadline: new Date(now.getTime() + 5 * 24 * 3600 * 1000).toISOString(),
      benefitsBn: 'সরকারি ৯ম গ্রেড স্কেল এবং জাতীয় বেতন স্কেল অনুযায়ী সুবিধা।',
      source: 'বিপিএসসি অফিসিয়াল পোর্টাল',
      applyUrl: 'http://bpsc.teletalk.com.bd',
      isOfficialGovt: true
    },
    {
      id: 'opp-2',
      titleBn: 'বাংলাদেশ ব্যাংক সহকারী পরিচালক (এডি) নিয়োগ পরীক্ষা',
      titleEn: 'Bangladesh Bank Assistant Director Recruitment',
      orgNameBn: 'বাংলাদেশ ব্যাংক',
      orgNameEn: 'Bangladesh Bank',
      category: 'job',
      eligibilityBn: 'যেকোনো বিষয়ে স্নাতকোত্তর অথবা চার বছর মেয়াদী স্নাতক ডিগ্রি। ন্যূনতম দুটি প্রথম বিভাগ/শ্রেণী থাকতে হবে।',
      locationBn: 'ঢাকা',
      deadline: new Date(now.getTime() + 2 * 24 * 3600 * 1000).toISOString(),
      benefitsBn: 'জাতীয় ব্যাংকিং স্কেল ৯ম গ্রেড ও চিকিৎসা ভাতাসহ অন্যান্য সরকারি সুবিধা।',
      source: 'ই-রিক্রুটমেন্ট পোর্টাল',
      applyUrl: 'https://erecruitment.bb.org.bd',
      isOfficialGovt: true
    },
    {
      id: 'opp-3',
      titleBn: 'আইসিটি প্রফেশনাল ফেলোশিপ ও স্কিল ডেভেলপমেন্ট স্কলারশিপ ২০২৬',
      titleEn: 'ICT Professional Fellowship & Skill Scholarship 2026',
      orgNameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ',
      orgNameEn: 'ICT Division Bangladesh',
      category: 'scholarship',
      eligibilityBn: 'সিএসই/ইইই বা আইটি সংশ্লিষ্ট বিষয়ে অধ্যায়নরত ৩য়/৪র্থ বর্ষের শিক্ষার্থী বা সদ্য স্নাতক।',
      locationBn: 'অনলাইন ও কালিয়াকৈর হাইটেক পার্ক',
      deadline: new Date(now.getTime() + 1 * 24 * 3600 * 1000).toISOString(), // Tomorrow
      benefitsBn: 'সম্পূর্ণ বিনামূল্যে ৩ মাসের প্র্যাকটিক্যাল কোডিং বুটক্যাম্প ও প্রতি মাসে ১৫,০০০ টাকা স্টাইপেন্ড।',
      source: 'আইসিটি প্রজেক্ট হাব',
      applyUrl: 'https://ict.gov.bd',
      isOfficialGovt: true
    },
    {
      id: 'opp-4',
      titleBn: 'ন্যাশনাল এআই অ্যান্ড ডেটা সায়েন্স হ্যাকাথন ২০২৬',
      titleEn: 'National AI & Data Science Hackathon 2026',
      orgNameBn: 'বাংলাদেশ কম্পিউটার কাউন্সিল (BCC)',
      orgNameEn: 'Bangladesh Computer Council',
      category: 'competition',
      eligibilityBn: 'বিশ্ববিদ্যালয় বা পলিটেকনিকের ১-৪ জনের টিম। প্রোগ্রামিং ও ডাটা এনালিসিসে প্রাথমিক অভিজ্ঞতা।',
      locationBn: 'আইসিটি টাওয়ার, আগারগাঁও, ঢাকা',
      deadline: new Date(now.getTime() + 12 * 3600 * 1000).toISOString(), // Today
      benefitsBn: 'প্রথম পুরস্কার ৫ লক্ষ টাকা, সেরা ৩টি প্রজেক্টকে সরকারি স্টার্টআপ ফান্ডিং।',
      source: 'বিসিসি ইভেন্ট হাব',
      applyUrl: 'https://bcc.gov.bd',
      isOfficialGovt: true
    },
    {
      id: 'opp-5',
      titleBn: 'ব্র্যাক ব্যাংক ফিউচার লিডার্স ইন্টার্নশিপ প্রোগ্রাম',
      titleEn: 'BRAC Bank Future Leaders Internship Program',
      orgNameBn: 'ব্র্যাক ব্যাংক পিএলসি',
      orgNameEn: 'BRAC Bank PLC',
      category: 'internship',
      eligibilityBn: 'যেকোনো স্বীকৃত বিশ্ববিদ্যালয়ের ব্যবসায় প্রশাসন বা প্রযুক্তির শেষ বর্ষের শিক্ষার্থী।',
      locationBn: 'ঢাকা (হেড অফিস)',
      deadline: new Date(now.getTime() + 10 * 24 * 3600 * 1000).toISOString(),
      benefitsBn: 'মাসিক ২০,০০০ টাকা সম্মানী ও ৩ মাস পর স্থায়ী নিয়োগের সুযোগ।',
      source: 'ব্র্যাক ব্যাংক ক্যারিয়ার',
      applyUrl: 'https://bracbank.com/careers'
    },
    {
      id: 'opp-6',
      titleBn: 'নারী উদ্যোক্তা দক্ষতা উন্নয়ন ও ডিজিটাল মার্কেটিং প্রশিক্ষণ',
      titleEn: 'Women Entrepreneur Skill & Digital Marketing Training',
      orgNameBn: 'ক্ষুদ্র ও মাঝারি শিল্প (SME) ফাউন্ডেশন',
      orgNameEn: 'SME Foundation',
      category: 'training',
      eligibilityBn: 'এইচএসসি পাস এবং নতুন ব্যবসা শুরু করতে আগ্রহী নারী উদ্যোক্তা।',
      locationBn: 'সকল বিভাগীয় শহর',
      deadline: new Date(now.getTime() + 18 * 24 * 3600 * 1000).toISOString(),
      benefitsBn: 'ফ্রি কোর্স, সার্টিফিকেট ও এসএমই ঋণের বিশেষ সংযোগ সহায়তা।',
      source: 'এসএমই ফাউন্ডেশন পোর্টাল',
      applyUrl: 'http://smef.gov.bd',
      isOfficialGovt: true
    }
  ];

  let filtered = opportunities;

  if (category && category !== 'all') {
    filtered = filtered.filter(o => o.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(o =>
      o.titleBn.toLowerCase().includes(q) ||
      o.titleEn.toLowerCase().includes(q) ||
      o.orgNameBn.toLowerCase().includes(q)
    );
  }

  if (filter && filter !== 'all') {
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const tomorrowEnd = new Date(now);
    tomorrowEnd.setDate(now.getDate() + 1);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    filtered = filtered.filter(o => {
      const d = new Date(o.deadline);
      if (filter === 'today') return d <= todayEnd;
      if (filter === 'tomorrow') return d <= tomorrowEnd;
      if (filter === 'this_week') return d <= weekEnd;
      return true;
    });
  }

  return NextResponse.json({
    total: filtered.length,
    opportunities: filtered,
    updatedAt: new Date().toISOString()
  });
}
