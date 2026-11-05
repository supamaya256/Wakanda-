import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VoiceDropItem, VOICE_DROPS_DATA } from '../data/voiceDropsData';
import { LogoItem, LOGO_ITEMS_DATA } from '../data/logosData';

export interface CustomMediaFile {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'image' | 'document' | 'other';
  url: string;
  sizeFormatted: string;
  uploadedAt: string;
  description?: string;
}

const DEFAULT_CUSTOM_FILES: CustomMediaFile[] = [
  {
    id: 'asset-wallpaper-1',
    name: 'DJ Emma Pro 4K Cinematic Studio Wallpaper.png',
    type: 'image',
    url: '/wallpaper.png',
    sizeFormatted: '1.8 MB',
    uploadedAt: '2026-09-10',
    description: 'Main DJ EMMA PRO billboard backdrop'
  },
  {
    id: 'asset-dj-capecious-video',
    name: 'DJ Capecious 3D Master Loop.mp4',
    type: 'video',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/h_480,q_auto/v1789609383/DJ_CAPECIOUS.mp4',
    sizeFormatted: '4.2 MB',
    uploadedAt: '2026-09-12',
    description: '480p preview sample for 3D metallic logo'
  },
  {
    id: 'asset-ronnie-majje-drop',
    name: 'Ronnie Majje Boss Audio Tag.mp3',
    type: 'audio',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789610738/RONNIE_MAJJE_BOSS.mp3',
    sizeFormatted: '1.1 MB',
    uploadedAt: '2026-09-14',
    description: 'Voice drop sample in 320kbps'
  }
];

export const OFFICIAL_YOUTUBE_CHANNEL_URL = 'https://youtube.com/@djemmapro7231?si=ckcc0gJQHAjdv7CD';

interface ContentContextType {
  // YouTube Channel State
  isYoutubeSubscribed: boolean;
  setYoutubeSubscribed: (val: boolean) => void;

  // Voice Drops
  voiceDrops: VoiceDropItem[];
  addVoiceDrop: (drop: VoiceDropItem) => void;
  deleteVoiceDrop: (id: string) => void;
  resetVoiceDrops: () => void;

  // 3D Logos
  logos: LogoItem[];
  addLogo: (logo: LogoItem) => void;
  deleteLogo: (id: string) => void;
  resetLogos: () => void;

  // Custom Media & Files
  customFiles: CustomMediaFile[];
  addCustomFile: (file: CustomMediaFile) => void;
  deleteCustomFile: (id: string) => void;
  resetCustomFiles: () => void;

  // Global reset
  resetAllContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const DROPS_STORAGE_KEY = 'dj_emma_voice_drops_v1';
const LOGOS_STORAGE_KEY = 'dj_emma_logos_v2_electric_first';
const FILES_STORAGE_KEY = 'dj_emma_custom_files_v1';
const YT_SUBSCRIBED_KEY = 'dj_emma_yt_subscribed_v2';

export function ContentProvider({ children }: { children: ReactNode }) {
  // Initialize Voice Drops
  const [voiceDrops, setVoiceDrops] = useState<VoiceDropItem[]>(() => {
    try {
      const saved = localStorage.getItem(DROPS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((drop: any) => ({
            ...drop,
            id: drop.id || `drop-${Date.now()}`,
            title: drop.title || 'DJ Emma Exclusive Voice Drop',
            category: drop.category || 'Club Hype',
            audioUrl: drop.audioUrl || '',
            priceUgx: drop.priceUgx || '10,000 UGX',
            priceUsd: drop.priceUsd || '$5 USD',
            style: drop.style || 'Studio Laser Tag',
            tags: Array.isArray(drop.tags) ? drop.tags : ['Voice Drop', 'DJ Emma FX'],
            thumbnail: drop.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
            matchScore: drop.matchScore || 99,
            sampleScript: drop.sampleScript || `"${drop.title || 'Voice Drop'}" produced by DJ Emma Pro FX.`
          }));
        }
      }
    } catch (e) {
      console.warn('Failed reading voice drops from storage:', e);
    }
    return VOICE_DROPS_DATA;
  });

  // Initialize 3D Logos
  const [logos, setLogos] = useState<LogoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOGOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading logos from storage:', e);
    }
    return LOGO_ITEMS_DATA;
  });

  // Initialize Custom Files
  const [customFiles, setCustomFiles] = useState<CustomMediaFile[]>(() => {
    try {
      const saved = localStorage.getItem(FILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed reading custom files from storage:', e);
    }
    return DEFAULT_CUSTOM_FILES;
  });

  const [isYoutubeSubscribed, setIsYoutubeSubscribed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(YT_SUBSCRIBED_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const setYoutubeSubscribed = (val: boolean) => {
    setIsYoutubeSubscribed(val);
    try {
      if (val) {
        localStorage.setItem(YT_SUBSCRIBED_KEY, 'true');
      } else {
        localStorage.removeItem(YT_SUBSCRIBED_KEY);
      }
    } catch (e) {
      console.warn('Could not persist youtube subscribe state:', e);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(DROPS_STORAGE_KEY, JSON.stringify(voiceDrops));
    } catch (e) {
      console.warn('Could not save voice drops:', e);
    }
  }, [voiceDrops]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGOS_STORAGE_KEY, JSON.stringify(logos));
    } catch (e) {
      console.warn('Could not save logos:', e);
    }
  }, [logos]);

  useEffect(() => {
    try {
      localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(customFiles));
    } catch (e) {
      console.warn('Could not save custom files:', e);
    }
  }, [customFiles]);

  const addVoiceDrop = (drop: VoiceDropItem) => {
    const cleanDrop: VoiceDropItem = {
      ...drop,
      id: drop.id || `drop-${Date.now()}`,
      title: drop.title || 'DJ Emma Exclusive Voice Drop',
      category: drop.category || 'Club Hype',
      audioUrl: drop.audioUrl || '',
      priceUgx: drop.priceUgx || '10,000 UGX',
      priceUsd: drop.priceUsd || '$5 USD',
      style: drop.style || drop.category || 'Studio Laser Tag',
      tags: Array.isArray(drop.tags) ? drop.tags : ['Voice Drop', 'DJ Emma FX'],
      thumbnail: drop.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      matchScore: drop.matchScore || 99,
      sampleScript: drop.sampleScript || `"${drop.title || 'Voice Drop'}" produced by DJ Emma Pro FX.`
    };
    setVoiceDrops(prev => [cleanDrop, ...prev]);
  };

  const deleteVoiceDrop = (id: string) => {
    setVoiceDrops(prev => prev.filter(item => item.id !== id));
  };

  const resetVoiceDrops = () => {
    setVoiceDrops(VOICE_DROPS_DATA);
    localStorage.removeItem(DROPS_STORAGE_KEY);
  };

  const addLogo = (logo: LogoItem) => {
    setLogos(prev => [logo, ...prev]);
  };

  const deleteLogo = (id: string) => {
    setLogos(prev => prev.filter(item => item.id !== id));
  };

  const resetLogos = () => {
    setLogos(LOGO_ITEMS_DATA);
    localStorage.removeItem(LOGOS_STORAGE_KEY);
  };

  const addCustomFile = (file: CustomMediaFile) => {
    setCustomFiles(prev => [file, ...prev]);
  };

  const deleteCustomFile = (id: string) => {
    setCustomFiles(prev => prev.filter(item => item.id !== id));
  };

  const resetCustomFiles = () => {
    setCustomFiles(DEFAULT_CUSTOM_FILES);
    localStorage.removeItem(FILES_STORAGE_KEY);
  };

  const resetAllContent = () => {
    resetVoiceDrops();
    resetLogos();
    resetCustomFiles();
  };

  return (
    <ContentContext.Provider
      value={{
        isYoutubeSubscribed,
        setYoutubeSubscribed,
        voiceDrops,
        addVoiceDrop,
        deleteVoiceDrop,
        resetVoiceDrops,
        logos,
        addLogo,
        deleteLogo,
        resetLogos,
        customFiles,
        addCustomFile,
        deleteCustomFile,
        resetCustomFiles,
        resetAllContent
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
