export interface District {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  upazilasBn: string[];
  upazilasEn: string[];
}

export interface Division {
  id: string;
  nameBn: string;
  nameEn: string;
  districts: District[];
}

export const BANGLADESH_DIVISIONS: Division[] = [
  {
    id: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    districts: [
      { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125, upazilasBn: ['মিরপুর', 'ধানমন্ডি', 'গুলশান', 'উত্তরা', 'মোহাম্মদপুর', 'সাভার', 'ধামরাই', 'কেরানীগঞ্জ'], upazilasEn: ['Mirpur', 'Dhanmondi', 'Gulshan', 'Uttara', 'Mohammadpur', 'Savar', 'Dhamrai', 'Keraniganj'] },
      { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur', lat: 23.9999, lng: 90.4203, upazilasBn: ['গাজীপুর সদর', 'কালিয়াকৈর', 'কালীগঞ্জ', 'কাপাসিয়া', 'শ্রীপুর'], upazilasEn: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'] },
      { id: 'narayanganj', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', lat: 23.6238, lng: 90.5000, upazilasBn: ['নারায়ণগঞ্জ সদর', 'আড়াইহাজার', 'বন্দর', 'রূপগঞ্জ', 'সোনারগাঁও'], upazilasEn: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'] },
      { id: 'tangail', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', lat: 24.2513, lng: 89.9167, upazilasBn: ['টাঙ্গাইল সদর', 'বাসাইল', 'ভূঞাপুর', 'ঘাটাইল', 'গোপালপুর', 'কালিহাতী', 'মধুপুর', 'মির্জাপুর'], upazilasEn: ['Tangail Sadar', 'Basail', 'Bhuapur', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur'] },
      { id: 'faridpur', nameBn: 'ফরিদপুর', nameEn: 'Faridpur', lat: 23.6071, lng: 89.8425, upazilasBn: ['ফরিদপুর সদর', 'আলফাডাঙ্গা', 'ভাঙ্গা', 'বোয়ালমারী', 'চরভদ্রাসন', 'মধুখালী', 'নগরকান্দা'], upazilasEn: ['Faridpur Sadar', 'Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Madhukhali', 'Nagarkanda'] }
    ]
  },
  {
    id: 'chittagong',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chittagong',
    districts: [
      { id: 'chittagong', nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong', lat: 22.3569, lng: 91.7832, upazilasBn: ['পতেঙ্গা', 'পাঁচলাইশ', 'পটিয়া', 'হাঠহাজারী', 'সীতাকুণ্ড', 'সন্দ্বীপ', 'রাউজান'], upazilasEn: ['Patenga', 'Panchlaish', 'Patiya', 'Hathazari', 'Sitakunda', 'Sandwip', 'Raozan'] },
      { id: 'coxsbazar', nameBn: 'কক্সবাজার', nameEn: 'Cox\'s Bazar', lat: 21.4272, lng: 92.0058, upazilasBn: ['কক্সবাজার সদর', 'চকোরিয়া', 'মহেশখালী', 'টেকনাফ', 'উখিয়া', 'কুতুবদিয়া'], upazilasEn: ['Cox\'s Bazar Sadar', 'Chakaria', 'Moheshkhali', 'Teknaf', 'Ukhia', 'Kutubdia'] },
      { id: 'comilla', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', lat: 23.4607, lng: 91.1809, upazilasBn: ['কুমিল্লা সদর', 'দাউদকান্দি', 'চৌদ্দগ্রাম', 'লাকসাম', 'দেবীদ্বার', 'মুরাদনগর'], upazilasEn: ['Cumilla Sadar', 'Daudkandi', 'Chauddagram', 'Laksam', 'Debidwar', 'Muradnagar'] },
      { id: 'noakhali', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', lat: 22.8696, lng: 91.0994, upazilasBn: ['নোয়াখালী সদর', 'বেগমগঞ্জ', 'হাতিয়া', 'কোম্পানীগঞ্জ', 'সেনবাগ'], upazilasEn: ['Noakhali Sadar', 'Begumganj', 'Hatiya', 'Companiganj', 'Senbagh'] }
    ]
  },
  {
    id: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    districts: [
      { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687, upazilasBn: ['সিলেট সদর', 'জৈন্তাপুর', 'কানাইঘাট', 'গোয়াইনঘাট', 'কোম্পানীগঞ্জ', 'জকিগঞ্জ'], upazilasEn: ['Sylhet Sadar', 'Jaintiapur', 'Kanaighat', 'Gowainghat', 'Companiganj', 'Zakiganj'] },
      { id: 'moulvibazar', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', lat: 24.4829, lng: 91.7774, upazilasBn: ['মৌলভীবাজার সদর', 'শ্রীমঙ্গল', 'কমলগঞ্জ', 'কুলাউড়া', 'বড়লেখা'], upazilasEn: ['Moulvibazar Sadar', 'Sreemangal', 'Kamalganj', 'Kulaura', 'Barlekha'] },
      { id: 'sunamganj', nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', lat: 25.0658, lng: 91.4073, upazilasBn: ['সুনামগঞ্জ সদর', 'ছাতক', 'জগন্নাথপুর', 'তাহিরপুর', 'ধর্মপাশা'], upazilasEn: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Tahirpur', 'Dharmapasha'] }
    ]
  },
  {
    id: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    districts: [
      { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3745, lng: 88.6042, upazilasBn: ['বোয়ালিয়া', 'রাজপাড়া', 'পবা', 'গোদাগাড়ী', 'তানোর', 'বাঘমারা'], upazilasEn: ['Boalia', 'Rajpara', 'Paba', 'Godagari', 'Tanor', 'Baghmara'] },
      { id: 'bogra', nameBn: 'বগুড়া', nameEn: 'Bogra', lat: 24.8481, lng: 89.3730, upazilasBn: ['বগুড়া সদর', 'শেরপুর', 'শিবগঞ্জ', 'ধুনট', 'গাবতলী'], upazilasEn: ['Bogra Sadar', 'Sherpur', 'Shibganj', 'Dhunat', 'Gabtali'] },
      { id: 'pabna', nameBn: 'পাবনা', nameEn: 'Pabna', lat: 24.0108, lng: 89.2312, upazilasBn: ['পাবনা সদর', 'ঈশ্বরদী', 'সাঁথিয়া', 'বেড়া', 'চাটমোহর'], upazilasEn: ['Pabna Sadar', 'Ishwardi', 'Santhia', 'Bera', 'Chatmohar'] }
    ]
  },
  {
    id: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    districts: [
      { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403, upazilasBn: ['খুলনা সদর', 'ডুমুরিয়া', 'বটিয়াঘাটা', 'রূপসা', 'পাইকগাছা', 'কয়রা'], upazilasEn: ['Khulna Sadar', 'Dumuria', 'Batiaghata', 'Rupsha', 'Paikgachha', 'Koyra'] },
      { id: 'jessore', nameBn: 'যশোর', nameEn: 'Jessore', lat: 23.1664, lng: 89.2081, upazilasBn: ['যশোর সদর', 'ঝিকরগাছা', 'শার্শা', 'মনিরামপুর', 'কেশবপুর'], upazilasEn: ['Jessore Sadar', 'Jhikargachha', 'Sharsha', 'Manirampur', 'Keshabpur'] },
      { id: 'satkhira', nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', lat: 22.7185, lng: 89.0705, upazilasBn: ['সাতক্ষীরা সদর', 'শ্যামনগর', 'আশাশুনি', 'কালীগঞ্জ', 'কোলারোয়া'], upazilasEn: ['Satkhira Sadar', 'Shyamnagar', 'Assasuni', 'Kaliganj', 'Kalaroa'] }
    ]
  },
  {
    id: 'barisal',
    nameBn: 'বরিশাল',
    nameEn: 'Barishal',
    districts: [
      { id: 'barisal', nameBn: 'বরিশাল', nameEn: 'Barishal', lat: 22.7010, lng: 90.3535, upazilasBn: ['বরিশাল সদর', 'বাকেরগঞ্জ', 'বাবুগঞ্জ', 'গৌরনদী', 'মেহেন্দিগঞ্জ'], upazilasEn: ['Barishal Sadar', 'Bakerganj', 'Babuganj', 'Gournadi', 'Mehendiganj'] },
      { id: 'bhola', nameBn: 'ভোলা', nameEn: 'Bhola', lat: 22.6859, lng: 90.6481, upazilasBn: ['ভোলা সদর', 'বোরহানউদ্দিন', 'চরফ্যাশন', 'দৌলতখান', 'লালমোহন', 'মনপুরা'], upazilasEn: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Monpura'] }
    ]
  },
  {
    id: 'rangpur',
    nameBn: 'রংপুর',
    nameEn: 'Rangpur',
    districts: [
      { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lng: 89.2752, upazilasBn: ['রংপুর সদর', 'কাউনিয়া', 'গঙ্গাচড়া', 'মিঠাপুকুর', 'পীরগঞ্জ'], upazilasEn: ['Rangpur Sadar', 'Kaunia', 'Gangachhara', 'Mithapukur', 'Pirganj'] },
      { id: 'dinajpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', lat: 25.6217, lng: 88.6354, upazilasBn: ['দিনাজপুর সদর', 'বীরগঞ্জ', 'ফুলবাড়ী', 'পার্বতীপুর', 'নবাবগঞ্জ'], upazilasEn: ['Dinajpur Sadar', 'Birganj', 'Fulbari', 'Parbatipur', 'Nawabganj'] }
    ]
  },
  {
    id: 'mymensingh',
    nameBn: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    districts: [
      { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lng: 90.4203, upazilasBn: ['ময়মনসিংহ সদর', 'ত্রিশাল', 'মুক্তাগাছা', 'ফুলবাড়ীয়া', 'গফরগাঁও', 'ভালুকা'], upazilasEn: ['Mymensingh Sadar', 'Trishal', 'Muktagachha', 'Fulbaria', 'Gaffargaon', 'Bhaluka'] },
      { id: 'jamalpur', nameBn: 'জামালপুর', nameEn: 'Jamalpur', lat: 24.9375, lng: 89.9377, upazilasBn: ['জামালপুর সদর', 'ইসলামপুর', 'মেলান্দহ', 'সরিসাবাড়ী', 'দেওয়ানগঞ্জ'], upazilasEn: ['Jamalpur Sadar', 'Islampur', 'Melandaha', 'Sarishabari', 'Dewanganj'] }
    ]
  }
];

export function findDistrict(districtId: string): District | undefined {
  for (const div of BANGLADESH_DIVISIONS) {
    const found = div.districts.find(d => d.id === districtId || d.nameEn.toLowerCase() === districtId.toLowerCase() || d.nameBn === districtId);
    if (found) return found;
  }
  return BANGLADESH_DIVISIONS[0].districts[0]; // fallback to Dhaka
}
