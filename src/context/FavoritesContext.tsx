import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AudioTrack, AUDIO_TRACKS } from './AudioContext';
import { AtesoMovie, ATESO_MOVIES_DATA } from '../data/atesoMoviesData';
import { VoiceDropItem, VOICE_DROPS_DATA } from '../data/voiceDropsData';

export type FavoriteType = 'mixtape' | 'song' | 'movie' | 'drop';

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
  toggleFavorite: (item: FavoriteItem | AudioTrack | AtesoMovie | VoiceDropItem, type?: FavoriteType) => void;
  removeFavorite: (id: string | number) => void;
  clearFavorites: () => void;
  favoriteMixtapes: FavoriteItem[];
  favoriteMovies: FavoriteItem[];
  favoriteDrops: FavoriteItem[];
  isSyncing: boolean;
}

const FAVORITES_STORAGE_KEY = 'dj_emma_universal_favorites_v2';
const LEGACY_AUDIO_FAV_KEY = 'dj_emma_favorites';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }

      // Fallback to legacy numeric ID favorites if universal key is empty
      const legacy = localStorage.getItem(LEGACY_AUDIO_FAV_KEY);
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          const converted: FavoriteItem[] = [];
          parsedLegacy.forEach((id: number) => {
            const track = AUDIO_TRACKS.find(t => t.id === id);
            if (track) {
              converted.push({
                id: track.id,
                type: 'mixtape',
                title: track.title,
                artistOrVj: track.artist,
                thumbnail: track.thumbnail,
                duration: track.durationLabel,
                category: track.genres?.[0] || 'Mixtape',
                year: track.year,
                matchScore: track.matchScore,
                downloadUrl: track.downloadUrl,
                addedAt: Date.now()
              });
            }
          });
          return converted;
        }
      }
    } catch (e) {
      console.warn('Failed to load local favorites:', e);
    }
    return [];
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      // Also keep legacy number IDs in sync for backward compatibility
      const numericIds = favorites.filter(f => typeof f.id === 'number').map(f => f.id as number);
      localStorage.setItem(LEGACY_AUDIO_FAV_KEY, JSON.stringify(numericIds));
    } catch (e) {
      console.warn('Failed to save local favorites:', e);
    }
  }, [favorites]);

  // Synchronize favorites with user's Firebase Firestore account when authenticated
  useEffect(() => {
    if (!user || user.isDemo || !user.uid) return;

    let isMounted = true;
    async function syncWithAccount() {
      setIsSyncing(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const remoteFavorites: FavoriteItem[] = userDocSnap.data()?.savedFavorites || [];
          if (Array.isArray(remoteFavorites) && remoteFavorites.length > 0) {
            setFavorites(currentLocal => {
              // Merge local + remote uniquely by item id
              const map = new Map<string | number, FavoriteItem>();
              remoteFavorites.forEach(item => map.set(item.id, item));
              currentLocal.forEach(item => map.set(item.id, item));
              const merged = Array.from(map.values());
              
              // Persist back merged list to Firestore
              setDoc(userDocRef, { savedFavorites: merged }, { merge: true }).catch(console.error);
              return merged;
            });
          } else {
            // Upload current local favorites to new user doc
            if (favorites.length > 0) {
              await setDoc(userDocRef, { savedFavorites: favorites }, { merge: true });
            }
          }
        } else {
          // Create initial user doc with current favorites
          await setDoc(userDocRef, { savedFavorites: favorites }, { merge: true });
        }
      } catch (err) {
        console.warn('Firestore favorites sync skipped or offline:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    syncWithAccount();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const favoriteIds = useMemo(() => favorites.map(f => f.id), [favorites]);

  const isFavorite = (id: string | number) => {
    return favoriteIds.includes(id) || favoriteIds.includes(Number(id));
  };

  const toggleFavorite = (rawItem: FavoriteItem | AudioTrack | AtesoMovie | VoiceDropItem, explicitType?: FavoriteType) => {
    let item: FavoriteItem;

    if ('addedAt' in rawItem && 'type' in rawItem) {
      item = rawItem as FavoriteItem;
    } else if ('artist' in rawItem && 'durationLabel' in rawItem) {
      // AudioTrack
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
    } else if ('vj' in rawItem || 'episodeNumber' in rawItem) {
      // AtesoMovie
      const movie = rawItem as AtesoMovie;
      item = {
        id: movie.id,
        type: 'movie',
        title: movie.title,
        artistOrVj: movie.vj || 'VJ Emma Pro',
        thumbnail: movie.thumbnail,
        duration: movie.duration,
        category: movie.genre || 'Ateso Movie',
        year: movie.year || 2026,
        matchScore: 99,
        addedAt: Date.now()
      };
    } else if ('priceUgx' in rawItem || 'style' in rawItem) {
      // VoiceDropItem
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
      // Generic fallback
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

      // If user logged in, async update Firestore
      if (user && !user.isDemo && user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        setDoc(userDocRef, { savedFavorites: updated }, { merge: true }).catch(console.error);
      }

      return updated;
    });
  };

  const removeFavorite = (id: string | number) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id && String(f.id) !== String(id));
      if (user && !user.isDemo && user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        setDoc(userDocRef, { savedFavorites: updated }, { merge: true }).catch(console.error);
      }
      return updated;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    if (user && !user.isDemo && user.uid) {
      const userDocRef = doc(db, 'users', user.uid);
      setDoc(userDocRef, { savedFavorites: [] }, { merge: true }).catch(console.error);
    }
  };

  const favoriteMixtapes = useMemo(() => favorites.filter(f => f.type === 'mixtape' || f.type === 'song'), [favorites]);
  const favoriteMovies = useMemo(() => favorites.filter(f => f.type === 'movie'), [favorites]);
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
        favoriteMovies,
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
