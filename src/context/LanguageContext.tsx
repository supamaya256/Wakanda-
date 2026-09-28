import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 
  | 'en' // English
  | 'at' // Ateso
  | 'sw' // Kiswahili
  | 'lg' // Luganda
  | 'luo' // Luo / Acholi
  | 'nyn' // Runyankole
  | 'ha' // Hausa
  | 'yo' // Yoruba
  | 'ig' // Igbo
  | 'zu' // isiZulu
  | 'ln' // Lingala
  | 'am' // Amharic
  | 'so' // Somali
  | 'om'; // Oromo

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  region: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global / International', flag: '🇬🇧' },
  { code: 'at', name: 'Ateso', nativeName: 'Ateso', region: 'Uganda (Teso) & Kenya', flag: '🇺🇬' },
  { code: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili', region: 'East & Central Africa', flag: '🇹🇿' },
  { code: 'lg', name: 'Luganda', nativeName: 'Oluganda', region: 'Uganda (Buganda)', flag: '🇺🇬' },
  { code: 'luo', name: 'Luo / Acholi', nativeName: 'Dholuo / Leb Acholi', region: 'Northern Uganda & Kenya', flag: '🇺🇬' },
  { code: 'nyn', name: 'Runyankole', nativeName: 'Runyankore-Rukiga', region: 'Western Uganda', flag: '🇺🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', region: 'Nigeria & West Africa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', region: 'Nigeria & Benin', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', region: 'Nigeria & West Africa', flag: '🇳🇬' },
  { code: 'zu', name: 'isiZulu', nativeName: 'isiZulu', region: 'South Africa', flag: '🇿🇦' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála', region: 'DR Congo & Congo', flag: '🇨🇩' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Ethiopia & Horn of Africa', flag: '🇪🇹' },
  { code: 'so', name: 'Somali', nativeName: 'Af-Soomaali', region: 'Somalia & Horn of Africa', flag: '🇸🇴' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', region: 'Ethiopia & Kenya', flag: '🇪🇹' },
];

interface Translations {
  [key: string]: Partial<Record<Language, string>>;
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    at: 'Ere',
    sw: 'Nyumbani',
    lg: 'Awaka',
    luo: 'Paco',
    nyn: 'Omuka',
    ha: 'Gida',
    yo: 'Ilé',
    ig: 'Ụlọ',
    zu: 'Ekhaya',
    ln: 'Ndako',
    am: 'ዋና ገጽ',
    so: 'Hoyga',
    om: 'Mana',
  },
  'nav.mixes': {
    en: 'Nonstops & Mixes',
    at: 'Ikosio Luko Nonstop',
    sw: 'Mchanganyiko wa Nonstop',
    lg: 'Ennyimba Ezitazikiza',
    luo: 'Wer Mar Nonstop',
    nyn: 'Ebizina Byona',
    ha: 'Wakoki Ba Tsayawa',
    yo: 'Orin Àìdúró',
    ig: 'Egwu Na-akwụsịghị',
    zu: 'Umculo Onganqamuki',
    ln: 'Miziki ya Kotala',
    am: 'ያልተቋረጡ ሙዚቃዎች',
    so: 'Heeso Isdaba Joog ah',
    om: 'Sirba Walirraa Hin Cinne',
  },
  'nav.top10': {
    en: 'TOP 10 Shows',
    at: 'Itunga 10 Kosi',
    sw: 'Maonyesho 10 Bora',
    lg: 'Ennyimba 10 Ezisinze',
    luo: 'Top 10 Gi',
    nyn: 'Ebyakutano 10',
    ha: 'Wakoki 10 na Farko',
    yo: 'Àwọn 10 Tó Tayọ',
    ig: 'Nke 10 Kacha Mma',
    zu: 'Izingoma Eziyi-10 Eziphezulu',
    ln: 'Miziki 10 ya Liboso',
    am: 'ምርጥ 10 ዝግጅቶች',
    so: '10-ka Heesood ee Ugu Sarreeya',
    om: 'Sagantaalee 10n Filatamo',
  },
  'nav.drops': {
    en: 'DJ Voice Drops',
    at: 'Apororot Naka DJ',
    sw: 'Sauti za DJ Drops',
    lg: 'Eddoboozi Lya DJ Drops',
    luo: 'Dwol Mar DJ Drops',
    nyn: 'Eiraka rya DJ',
    ha: 'Muryar DJ Drops',
    yo: 'Ohùn DJ Drops',
    ig: 'Olu DJ Drops',
    zu: 'Amazwi e-DJ',
    ln: 'Mongongo ya DJ',
    am: 'የዲጄ ድምፅ ድሮፕስ',
    so: 'Codadka DJ Drops',
    om: 'Sagalee DJ Drops',
  },
  'nav.logos': {
    en: '3D Logos',
    at: '3D Logo Studio',
    sw: 'Nembo za 3D',
    lg: 'Ebipande bya 3D',
    luo: 'Logo mag 3D',
    nyn: 'Ebipande bya 3D',
    ha: 'Tambarin 3D',
    yo: 'Àwọn Logo 3D',
    ig: 'Akara 3D',
    zu: 'Ama-Logo e-3D',
    ln: 'Bilembo ya 3D',
    am: '3D ሎጎዎች',
    so: 'Calaamadaha 3D',
    om: 'Mallattoolee 3D',
  },
  'nav.orders': {
    en: 'My Orders',
    at: 'Aitutet Naka Ikaali',
    sw: 'Maagizo Yangu',
    lg: 'Oda Zange',
    luo: 'Chika Mara',
    nyn: 'Oda Zangye',
    ha: 'Odojina',
    yo: 'Àwọn Àṣẹ Mi',
    ig: 'Ihe M Pụtara',
    zu: 'Ama-oda Ami',
    ln: 'Batindeli na Ngai',
    am: 'የእኔ ትዕዛዞች',
    so: 'Dalabyadayda',
    om: 'Ajajawwan Kiyya',
  },
  'nav.softwares': {
    en: 'DJ Softwares',
    at: 'Sofwares Loka DJ',
    sw: 'Programu za DJ',
    lg: 'Purogulaamu za DJ',
    luo: 'Malam mag DJ',
    nyn: 'Puroguraamu za DJ',
    ha: 'Manhajojin DJ',
    yo: 'Àwọn Ètò DJ',
    ig: 'Ngwa DJ Kọmputa',
    zu: 'Izinhlelo ze-DJ',
    ln: 'Ba Program ya DJ',
    am: 'የዲጄ ሶፍትዌሮች',
    so: 'Barnaamijyada DJ',
    om: 'Meejjiiwwan DJ',
  },
  'nav.movies': {
    en: 'Watch Ateso Movies',
    at: 'Icur Loka Ateso',
    sw: 'Tazama Filamu za Ateso',
    lg: 'Laba Firimu z’Ateso',
    luo: 'Ne Filim mag Ateso',
    nyn: 'Reba Za Firimu z’Ateso',
    ha: 'Kalli Fina-finan Ateso',
    yo: 'Wo Àwọn Fíìmù Ateso',
    ig: 'Lee Ihe nkiri Ateso',
    zu: 'Buka Ama-Movie e-Ateso',
    ln: 'Tala Ba Filme ya Ateso',
    am: 'አቴሶ ፊልሞችን ይመልከቱ',
    so: 'Daawo Aflaanta Ateso',
    om: 'Fiilmiiwwan Ateso Daawwadhaa',
  },
  'nav.portal': {
    en: 'Client Portal',
    at: 'Aitutet Naka Ikaali',
    sw: 'Lango la Wateja',
    lg: 'Ekifo Ky’abaguzi',
    luo: 'Kar Jowidho',
    nyn: 'Omwanya gw’Abaguzi',
    ha: 'Tashar Abokan Ciniki',
    yo: 'Ibùdó Oníbàárà',
    ig: 'Ọnụ Ụzọ Ndị Ahịa',
    zu: 'Isango Lamakhasimende',
    ln: 'Esika ya Basombi',
    am: 'የደንበኞች ፖርታል',
    so: 'Albaabka Macaamiisha',
    om: 'Balbala Maamiltootaa',
  },
  'nav.studio': {
    en: 'Studio Manager',
    at: 'Aitutet Naka Studio',
    sw: 'Msimamizi wa Studio',
    lg: 'Omukulu we Situdiyo',
    luo: 'Jatelo Mar Studio',
    nyn: 'Omukuru wa Situdio',
    ha: 'Manajan Studio',
    yo: 'Olùṣàkóso Situdio',
    ig: 'Onye Isi Studio',
    zu: 'Umphathi We-Studio',
    ln: 'Mokonzi ya Studio',
    am: 'የስቱዲዮ አስተዳዳሪ',
    so: 'Maamulaha Studio-ga',
    om: 'Hogganaa Istuudiyoo',
  },
  'nav.login': {
    en: 'Client Login',
    at: 'Lomari',
    sw: 'Ingia Akaunti',
    lg: 'Yingira Wano',
    luo: 'Dony Eye',
    nyn: 'Taaha Amu',
    ha: 'Shiga Ciki',
    yo: 'Wọlé',
    ig: 'Banye',
    zu: 'Ngena Lapha',
    ln: 'Kɔtá',
    am: 'ግባ',
    so: 'Gal',
    om: 'Seeni',
  },
  'nav.trust': {
    en: 'Verified Proof',
    at: 'Aiyuun Keda Aikeun',
    sw: 'Uthibitisho Uliothibitishwa',
    lg: 'Obukakafu Obukakasiddwa',
    luo: 'Ranyisi Maiketo Kanyi',
    nyn: 'Obukakafu Obuhikire',
    ha: 'Tabbacin da Aka Tabbatar',
    yo: 'Èrí Tí A Fọwọ́ Sí',
    ig: 'Ihe Akaebe Kwadoro',
    zu: 'Ubufakazi Obuqinisekisiwe',
    ln: 'Emoniseli ya Solo',
    am: 'የተረጋገጠ ማስረጃ',
    so: 'Caddayn La Xaqiijiyay',
    om: 'Ragaa Mirkanaa’e',
  },
  
  // Hero Billboard
  'hero.play': {
    en: 'Play Mix',
    at: 'Kogol Ekosio',
    sw: 'Cheza Mchanganyiko',
    lg: 'Zannya Oluyimba',
    luo: 'Goo Wer',
    nyn: 'Zaaniisa Ekizina',
    ha: 'Kanna Waka',
    yo: 'Tẹ Orin',
    ig: 'Kpọọ Egwu',
    zu: 'Dlala Umculo',
    ln: 'Béta Miziki',
    am: 'ሙዚቃ አጫውት',
    so: 'Daar Heesta',
    om: 'Sirba Taphaasiisi',
  },
  'hero.info': {
    en: 'More Info',
    at: 'Akiro Naepol',
    sw: 'Habari Zaidi',
    lg: 'Ebisingawo',
    luo: 'Weche Mamoko',
    nyn: 'Ebikukwataho',
    ha: 'Karin Bayani',
    yo: 'Àlàyé Síwájú',
    ig: 'Ozi Ndị Ọzọ',
    zu: 'Ulwazi Oluthe Xaxa',
    ln: 'Makambo Misusu',
    am: 'ተጨማሪ መረጃ',
    so: 'Faahfaahin Dheeraad ah',
    om: 'Odeeffannoo Dabalataa',
  },
  'hero.download': {
    en: 'Download to Phone',
    at: 'Adownloada Kasiimu',
    sw: 'Pakua Kwenye Simu',
    lg: 'Tekako Ku Ssimu',
    luo: 'Ket E Simu',
    nyn: 'Ta Aha Simu Yaawe',
    ha: 'Sauke a Wayarka',
    yo: 'Gba Sórí Fóònù',
    ig: 'Budata na Ekwentị',
    zu: 'Landa Efoni',
    ln: 'Tia na Telefone',
    am: 'ስልክዎ ላይ ያውርዱ',
    so: 'Ku Degso Telefoonka',
    om: 'Bilbila Keessatti Buufadhaa',
  },

  // Sections / Rows
  'row.trending': {
    en: 'Trending Now',
    at: 'Nuebeit Kwana',
    sw: 'Inayovuma Sasa',
    lg: 'Ebiriwo Kuno',
    luo: 'Mawuog Sani',
    nyn: 'Eby’omutaano Hati',
    ha: 'Wanda Yafi Fice Yanzu',
    yo: 'Tó Ń Gbajúmọ̀ Lọ́wọ́lọ́wọ́',
    ig: 'Nke Na-ewu Ewu Ugbu A',
    zu: 'Okuhamba Phambili Manje',
    ln: 'Oyo Ezo Tambola Sikoyo',
    am: 'አሁን በስፋት የሚደመጡ',
    so: 'Heesaha Hadda Socda',
    om: 'Amma Kan Heedduu Jaallatamu',
  },
  'row.trendingSub': {
    en: 'Anyone can play and download directly to their phone',
    at: 'Tupuc itunganan da kogol keda adownload kasiimu',
    sw: 'Mtu yeyote anaweza kucheza na kupakua moja kwa moja kwenye simu yake',
    lg: 'Buli omu asobola okuzannya n’okuteeka ku ssimu ye',
    luo: 'Ngato ka ngato nyalo goyo kendo keto e simune',
    nyn: 'Omuntu weena nabaasa kuzaaniisa n’okuta aha simu ye',
    ha: 'Kowa na iya saurare da saukewa kai tsaye a wayarsa',
    yo: 'Ẹnikẹ́ni lè tẹ̀ ẹ́ kí ó sì gbà á sí orí fóònù rẹ̀ tààràtà',
    ig: 'Onye ọ bụla nwere ike ịkpọ ma budata ya na ekwentị ya',
    zu: 'Noma ngubani angadlala futhi alande ngqo efonini yakhe',
    ln: 'Moto nyonso akoki koyoka mpe kokitisa na telefone na ye',
    am: 'ማንኛውም ሰው ስልኩ ላይ ማጫወትና ማውረድ ይችላል',
    so: 'Qof walba wuu dhagaysan karaa kuna degsan karaa taleefankiisa',
    om: 'Namni kamiyyuu taphisiisuu fi gara bilbila isaatti buufachuu danda’a',
  },
  
  // Footer
  'footer.questions': {
    en: 'Questions? Call DJ Emma Pro FX.',
    at: 'Iboiki aingiseta? Konyar DJ Emma Pro FX.',
    sw: 'Maswali? Piga simu kwa DJ Emma Pro FX.',
    lg: 'Oina ebibuuzo? Kubira DJ Emma Pro FX.',
    luo: 'In gi penjo? Luong DJ Emma Pro FX.',
    nyn: 'Oine ebibuuzo? Teera esimu DJ Emma Pro FX.',
    ha: 'Kuna da tambayoyi? Kira DJ Emma Pro FX.',
    yo: 'Ṣe o ní ìbéèrè? Pe DJ Emma Pro FX.',
    ig: 'Ajụjụ ọ bụla? Kpọọ DJ Emma Pro FX.',
    zu: 'Unemibuzo? Shayela i-DJ Emma Pro FX.',
    ln: 'Ozali na mituna? Benga DJ Emma Pro FX.',
    am: 'ጥያቄ አለዎት? ለዲጄ ኤማ ፕሮ ኤፍ ኤክስ ይደውሉ።',
    so: 'Su’aalo ma qabtaa? Wac DJ Emma Pro FX.',
    om: 'Gaaffii qabduu? DJ Emma Pro FX bilbilaa.',
  },
  
  // General UI
  'ui.search': {
    en: 'Search mixes, artists...',
    at: 'Komon ekosio, itunga...',
    sw: 'Tafuta mchanganyiko, wasanii...',
    lg: 'Noonya ennyimba, abayimbi...',
    luo: 'Many wer, jogoyo...',
    nyn: 'Sherura ebizina, abazini...',
    ha: 'Nemi wakoki, mawaka...',
    yo: 'Wá orin, àwọn olórin...',
    ig: 'Chọọ egwu, ndị na-agụ egwu...',
    zu: 'Sesha izingoma, abaculi...',
    ln: 'Luka miziki, bayembi...',
    am: 'ሙዚቃዎችን፣ ከያኒያንን ፈልግ...',
    so: 'Raadi heesaha, fanaaniinta...',
    om: 'Sirba, weellistoota barbaadaa...',
  },
  'ui.subscribe': {
    en: 'Subscribe to Watch',
    at: 'Isayina Kogol',
    sw: 'Jiunge Kutazama',
    lg: 'Weewandiise Okulaba',
    luo: 'Ndikri mondo ine',
    nyn: 'Handiika Kureeba',
    ha: 'Yi Rajista Don Kallo',
    yo: 'Forúkọ Sílẹ̀ Láti Wo',
    ig: 'Debanye Aha Ka I Lee',
    zu: 'Bhalisa Ukuze Ubuke',
    ln: 'Komisa Nkombo Mpo na Kotala',
    am: 'ለመመልከት ሰብስክራይብ ያድርጉ',
    so: 'Isdiiwaangeli Si Aad U Daawato',
    om: 'Daawachuudhaaf Galmaa’aa',
  },
  'ui.telegram': {
    en: 'Watch on Telegram',
    at: 'Kogol ko Telegram',
    sw: 'Tazama kwenye Telegram',
    lg: 'Laba ku Telegram',
    luo: 'Ne e Telegram',
    nyn: 'Reba aha Telegram',
    ha: 'Kalla a Telegram',
    yo: 'Wo lórí Telegram',
    ig: 'Lee na Telegram',
    zu: 'Buka ku-Telegram',
    ln: 'Tala na Telegram',
    am: 'በቴሌግራም ይመልከቱ',
    so: 'Ku Daawo Telegram',
    om: 'Telegram irratti Daawwadhaa',
  },
  'ui.locked': {
    en: 'LOCKED',
    at: 'EMONIO',
    sw: 'IMEKUFULIWA',
    lg: 'KISIIBWE',
    luo: 'OLOR',
    nyn: 'KIKINGIRWE',
    ha: 'A KULLE',
    yo: 'TÍ A TÌ',
    ig: 'EKPOCHIRO',
    zu: 'KUVALIWE',
    ln: 'EKANGAMI',
    am: 'የተቆለፈ',
    so: 'XIDHAN',
    om: 'CUFFAMEERA',
  },
  'ui.unlocked': {
    en: 'UNLOCKED',
    at: 'ANGAA',
    sw: 'IMEKOMBOLEWA',
    lg: 'KIGGUDDWA',
    luo: 'OYAW',
    nyn: 'KIKOMORORWE',
    ha: 'BUDE',
    yo: 'ṢÍ',
    ig: 'MEGHEPURO',
    zu: 'KUVULEKILE',
    ln: 'EFUNGWAMI',
    am: 'የተከፈተ',
    so: 'FURIAN',
    om: 'BANAMEERA',
  },
  'ui.watchNow': {
    en: 'Watch Now',
    at: 'Kogol Kwana',
    sw: 'Tazama Sasa',
    lg: 'Laba Kati',
    luo: 'Ne Koro',
    nyn: 'Reba Hati',
    ha: 'Kalla Yanzu',
    yo: 'Wo Nísinsìnyí',
    ig: 'Lee Ya Ugbu A',
    zu: 'Buka Manje',
    ln: 'Tala Sikoyo',
    am: 'አሁን ይመልከቱ',
    so: 'Daawo Hadda',
    om: 'Amma Daawwadhaa',
  },
  'ui.signOut': {
    en: 'Sign Out',
    at: 'Lomutu',
    sw: 'Toka Akaunti',
    lg: 'Vaamu',
    luo: 'Wuog Oko',
    nyn: 'Ruga Amu',
    ha: 'Fita Waje',
    yo: 'Wọlé Jáde',
    ig: 'Pụọ',
    zu: 'Phuma Lapha',
    ln: 'Bima',
    am: 'ውጣ',
    so: 'Ka Bax',
    om: 'Ba’aa',
  },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  supportedLanguages: LanguageOption[];
  currentLanguageInfo: LanguageOption;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('djemmapro_language') as Language;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('djemmapro_language', lang);
    } catch {
      // ignore
    }
  };

  // Quick toggle between primary languages: English <-> Ateso
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'at' : 'en');
  };

  const currentLanguageInfo = 
    SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, fallback?: string): string => {
    if (translations[key]) {
      const translated = translations[key][language];
      if (translated) return translated;
      // Fallback to English if translation key is missing in that dialect
      if (translations[key]['en']) return translations[key]['en']!;
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        toggleLanguage, 
        setLanguage, 
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageInfo,
        t 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

