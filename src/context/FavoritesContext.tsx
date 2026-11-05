import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AudioTrack, AUDIO_TRACKS } from './AudioContext';
import { VoiceDropItem, VOICE_DROPS_DATA } from '../data/voiceDropsData';

export type FavoriteType = 'mixtape' | 'song' | 'drop';

export interface FavoriteItem {
  id: string | number;
  type: FavoriteType;
  title: string;
  artistOrVj?: string;
  thumbnail: string;
  duration?: string;
  category?: string;
  year?: number;
  url?: string;
  downloadUrl?: string;
  matchScore?: number;
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  favoriteIds: (string | number)[];
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (item: FavoriteItem | AudioTrack | VoiceDropItem, type?: FavoriteType) => void;
  removeFavorite: (id: string | number) => void;
  clearFavorites: () => void;
  favoriteMixtapes: FavoriteItem[];
  favoriteDrops: FavoriteItem[];
  isSyncing: boolean;
}

const FAVORITES_STORAGE_KEY = 'dj_emma_universal_favorites_v3';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter((f: any) => f.type !== 'movie');
      }
    } catch (e) {
      console.warn('Failed loading favorites from localStorage:', e);
    }
    return [];
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed saving favorites to localStorage:', e);
    }
  }, [favorites]);

  const favoriteIds = useMemo(() => favorites.map(f => f.id), [favorites]);

  const isFavorite = (id: string | number) => {
    return favoriteIds.includes(id) || favoriteIds.includes(Number(id));
  };

  const toggleFavorite = (rawItem: FavoriteItem | AudioTrack | VoiceDropItem, explicitType?: FavoriteType) => {
    let item: FavoriteItem;

    if ('addedAt' in rawItem && 'type' in rawItem) {
      item = rawItem as FavoriteItem;
    } else if ('artist' in rawItem && 'durationLabel' in rawItem) {
      const track = rawItem as AudioTrack;
      item = {
        id: track.id,
        type: explicitType || 'mixtape',
        title: track.title,
        artistOrVj: track.artist,
        thumbnail: track.thumbnail,
        duration: track.durationLabel,
        category: track.genres?.[0] || 'Mixtape',
        year: track.year,
        matchScore: track.matchScore,
        downloadUrl: track.downloadUrl,
        addedAt: Date.now()
      };
    } else if ('priceUgx' in rawItem || 'style' in rawItem) {
      const drop = rawItem as VoiceDropItem;
      item = {
        id: drop.id,
        type: 'drop',
        title: drop.title,
        artistOrVj: 'DJ Emma Pro FX',
        thumbnail: drop.thumbnail,
        duration: (drop as any).duration || '0:05',
        category: drop.category || drop.style || 'Voice Drop',
        year: 2026,
        matchScore: 99,
        addedAt: Date.now()
      };
    } else {
      const generic = rawItem as any;
      item = {
        id: generic.id || Date.now(),
        type: explicitType || 'mixtape',
        title: generic.title || 'Favorite Item',
        artistOrVj: generic.artist || generic.artistOrVj || 'DJ Emma Pro',
        thumbnail: generic.thumbnail || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
        addedAt: Date.now()
      };
    }

    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id || String(f.id) === String(item.id));
      let updated: FavoriteItem[];
      if (exists) {
        updated = prev.filter(f => f.id !== item.id && String(f.id) !== String(item.id));
      } else {
        updated = [item, ...prev];
      }
      return updated;
    });
  };

  const removeFavorite = (id: string | number) => {
    setFavorites(prev => prev.filter(f => f.id !== id && String(f.id) !== String(id)));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const favoriteMixtapes = useMemo(() => favorites.filter(f => f.type === 'mixtape' || f.type === 'song'), [favorites]);
  const favoriteDrops = useMemo(() => favorites.filter(f => f.type === 'drop'), [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        favoriteMixtapes,
        favoriteDrops,
        isSyncing
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
