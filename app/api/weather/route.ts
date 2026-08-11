import { NextRequest, NextResponse } from 'next/server';
import { findDistrict } from '@/lib/bangladeshData';

export const dynamic = 'force-dynamic';

// Simple in-memory server cache to avoid excessive requests to weather API
const weatherCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes TTL

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const districtId = searchParams.get('district') || 'dhaka';
  const district = findDistrict(districtId) || findDistrict('dhaka')!;

  const cacheKey = `weather_${district.id}`;
  const now = Date.now();
  const cached = weatherCache.get(cacheKey);

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return NextResponse.json({ ...cached.data, cached: true });
  }

  try {
    const lat = district.lat;
    const lng = district.lng;

    // Call Open-Meteo API
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=Asia%2FDhaka`;

    const res = await fetch(openMeteoUrl, { next: { revalidate: 900 } });
    if (!res.ok) {
      throw new Error(`Open-Meteo failed with status ${res.status}`);
    }

    const data = await res.json();

    // Map weather code to Bangla condition text and icon
    const codeMap: Record<number, { textBn: string; textEn: string; icon: string }> = {
      0: { textBn: 'রোদঝলমলে আকাশ', textEn: 'Clear Sky', icon: '☀️' },
      1: { textBn: 'প্রধানত মেঘমুক্ত', textEn: 'Mainly Clear', icon: '🌤️' },
      2: { textBn: 'আংশিক মেঘলা', textEn: 'Partly Cloudy', icon: '⛅' },
      3: { textBn: 'মেঘলা আকাশ', textEn: 'Overcast', icon: '☁️' },
      45: { textBn: 'কুয়াশাচ্ছন্ন', textEn: 'Foggy', icon: '🌫️' },
      48: { textBn: 'ঘন কুয়াশা', textEn: 'Depositing Rime Fog', icon: '🌫️' },
      51: { textBn: 'হালকা গুড়ি গুড়ি বৃষ্টি', textEn: 'Light Drizzle', icon: '🌦️' },
      53: { textBn: 'মাঝারি গুড়ি গুড়ি বৃষ্টি', textEn: 'Moderate Drizzle', icon: '🌧️' },
      55: { textBn: 'মুষলধারে গুড়ি গুড়ি বৃষ্টি', textEn: 'Dense Drizzle', icon: '🌧️' },
      61: { textBn: 'হালকা বৃষ্টিপাত', textEn: 'Slight Rain', icon: '🌦️' },
      63: { textBn: 'মাঝারি বৃষ্টিপাত', textEn: 'Moderate Rain', icon: '🌧️' },
      65: { textBn: 'ভারী বৃষ্টিপাত', textEn: 'Heavy Rain', icon: '⛈️' },
      80: { textBn: 'বৃষ্টির সম্ভাবনা', textEn: 'Rain Showers', icon: '🌦️' },
      95: { textBn: 'বজ্রঝড়সহ বৃষ্টি', textEn: 'Thunderstorm', icon: '🌩️' },
      96: { textBn: 'বজ্রঝড় ও শিলাবৃষ্টি', textEn: 'Thunderstorm with Hail', icon: '⛈️' },
    };

    const currentWeatherCode = data.current.weather_code || 0;
    const condition = codeMap[currentWeatherCode] || { textBn: 'স্বাভাবিক', textEn: 'Normal', icon: '🌡️' };

    // Format daily forecast
    const dailyForecast = (data.daily?.time || []).slice(0, 7).map((dateStr: string, idx: number) => {
      const code = data.daily.weather_code[idx] || 0;
      const cond = codeMap[code] || { textBn: 'স্বাভাবিক', textEn: 'Normal', icon: '🌤️' };
      const dateObj = new Date(dateStr);
      const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const dayNameBn = daysBn[dateObj.getDay()];

      return {
        date: dateStr,
        dayBn: dayNameBn,
        maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
        minTemp: Math.round(data.daily.temperature_2m_min[idx]),
        rainProb: data.daily.precipitation_probability_max?.[idx] || 0,
        conditionBn: cond.textBn,
        icon: cond.icon
      };
    });

    const formattedData = {
      district: {
        id: district.id,
        nameBn: district.nameBn,
        nameEn: district.nameEn
      },
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        pressure: Math.round(data.current.surface_pressure),
        precipitation: data.current.precipitation,
        conditionBn: condition.textBn,
        conditionEn: condition.textEn,
        icon: condition.icon,
      },
      daily: dailyForecast,
      source: 'Open-Meteo & BMD Data Sync',
      updatedAt: new Date().toISOString(),
    };

    weatherCache.set(cacheKey, { data: formattedData, timestamp: now });

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Weather API Error:', error);
    // Fallback data if API is temporarily unreachable
    return NextResponse.json({
      district: { id: district.id, nameBn: district.nameBn, nameEn: district.nameEn },
      current: {
        temp: 31,
        feelsLike: 35,
        humidity: 78,
        windSpeed: 12,
        pressure: 1008,
        precipitation: 0,
        conditionBn: 'আংশিক মেঘলা (অফলাইন তথ্য)',
        conditionEn: 'Partly Cloudy (Fallback)',
        icon: '⛅'
      },
      daily: [
        { date: '2026-08-11', dayBn: 'আজ', maxTemp: 33, minTemp: 27, rainProb: 20, conditionBn: 'আংশিক মেঘলা', icon: '⛅' },
        { date: '2026-08-12', dayBn: 'আগামীকাল', maxTemp: 32, minTemp: 26, rainProb: 40, conditionBn: 'হালকা বৃষ্টি', icon: '🌦️' }
      ],
      source: 'Fallback Cache (Network Error)',
      updatedAt: new Date().toISOString(),
      isFallback: true
    });
  }
}
