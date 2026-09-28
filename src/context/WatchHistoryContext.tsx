import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AudioTrack, AUDIO_TRACKS } from './AudioContext';
import { AtesoMovie, ATESO_MOVIES_DATA } from '../data/atesoMoviesData';

export type WatchHistoryType = 'movie' | 'mixtape';

export interface WatchHistoryItem {
  id: string; // Unique key e.g. "mixtape-1" or "movie-poison-break-ep-1"
  itemId: string | number;
  type: WatchHistoryType;
  title: string;
  artistOrVj: string;
  thumbnail: string;
  duration: string;
  playedAt: number; // Timestamp in milliseconds
  progressPercent: number; // 0 - 100
  quality?: string;
  genre?: string;
  year?: number;
  matchScore?: number;
  youtubeId?: string;
  videoUrl?: string;
  audioTrackId?: number;
  vj?: string;
  partNumber?: number;
  episodeNumber?: number;
  trackData?: AudioTrack;
  movieData?: AtesoMovie;
}

export const WATCH_HISTORY_STORAGE_KEY = 'dj_emma_watch_history_v1';

// Initial demonstration items populated only on first visit if storage is uninitialized
const INITIAL_DEMO_WATCH_HISTORY: WatchHistoryItem[] = [
  {
    id: 'mixtape-1',
    itemId: 1,
    type: 'mixtape',
    title: 'ONE DROP REGGEA MIX VOL 1 BY DJ EMMA PRO',
    artistOrVj: 'DJ EMMA PRO FX',
    thumbnail: 'https://i.ytimg.com/vi/TcVAuZcXB5U/hqdefault.jpg',
    duration: '54:20',
    playedAt: Date.now() - 1000 * 60 * 22, // 22 minutes ago
    progressPercent: 68,
    quality: 'Ultra HD 4K • Spatial Audio',
    genre: 'One Drop Reggae',
    year: 2026,
    matchScore: 99,
    youtubeId: 'TcVAuZcXB5U',
    audioTrackId: 1
  },
  {
    id: 'movie-poison-break-ep-1',
    itemId: 'poison-break-ep-1',
    type: 'movie',
    title: 'POISON BREAK • Part 1 (Episode 1)',
    artistOrVj: 'VJ EMMA PRO FX',
    thumbnail: 'https://cdn4.telesco.pe/file/j6DYvvRuz7gbA1w3FFQMccU5YyR7AoYDf6odHdVJSr_z8x2jjLNX-TQyHDVrayN4DkBeoeYeQQEezNsbFLJgFa7_oawe3A8rzcJ7XAi2aiM0u7O6GcaOSZ-e66WJDajyrJyJNYhM2nWqtXmPScnBvE58lTKtApkhAwdaH4QWROykWLI-lOentGyUjPo9m39xmOusKfuqjhL8dIN4IVJCeOttxKG1EEN7Z7SappaAATzdQD0s2n4qwZXd3abii6b0J6tRlCnnV__O1Pp6Rqs0tPOpTaOOdkxqfuR-xa-G-aZKiUfp440OTTOL4J1Dx8ChhWdcw-k7WkwOBVK8Wzp-AA',
    duration: '43:17',
    playedAt: Date.now() - 1000 * 60 * 95, // ~1.5 hours ago
    progressPercent: 44,
    quality: '320p Fast Stream • Smooth Low Data',
    genre: 'Action / Prison Break / Ateso Translation',
    year: 2026,
    matchScore: 99,
    vj: 'VJ EMMA PRO FX',
    episodeNumber: 1,
    partNumber: 1
  },
  {
    id: 'movie-crazy-safari-vj-sultan',
    itemId: 'crazy-safari-vj-sultan',
    type: 'movie',
    title: 'CRAZY SAFARI • VJ Sultan 3',
    artistOrVj: 'VJ SULTAN',
    thumbnail: 'https://i.ytimg.com/vi/m1cfa_PY6AY/hqdefault.jpg',
    duration: '1h 36m',
    playedAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    progressPercent: 75,
    quality: 'HD 1080p • Direct YouTube Stream',
    genre: 'Ateso Translated Movie',
    year: 2026,
    matchScore: 99,
    youtubeId: 'm1cfa_PY6AY',
    vj: 'VJ SULTAN'
  },
  {
    id: 'mixtape-2',
    itemId: 2,
    type: 'mixtape',
    title: 'BEST OF ACHOLI NONSTOP TRADITIONAL',
    artistOrVj: 'DJ EMMA PRO FX',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    duration: '52:45',
    playedAt: Date.now() - 1000 * 60 * 60 * 26, // Yesterday
    progressPercent: 88,
    quality: 'Ultra HD 4K • Studio Master',
    genre: 'Acholi Traditional',
    year: 2026,
    matchScore: 99,
    audioTrackId: 2
  }
];

interface WatchHistoryContextType {
  watchHistory: WatchHistoryItem[];
  recordMixtapePlayed: (track: AudioTrack, progressPercent?: number) => void;
  recordMoviePlayed: (movie: AtesoMovie, progressPercent?: number) => void;
  removeFromWatchHistory: (id: string) => void;
  clearWatchHistory: () => void;
  restoreSampleHistory: () => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

export function WatchHistoryProvider({ children }: { children: ReactNode }) {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(WATCH_HISTORY_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading watch history from localStorage:', e);
    }
    // Default seed for fresh visits
    return INITIAL_DEMO_WATCH_HISTORY;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WATCH_HISTORY_STORAGE_KEY, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Failed writing watch history to localStorage:', e);
    }
  }, [watchHistory]);

  const recordMixtapePlayed = useCallback((track: AudioTrack, progressPercent?: number) => {
    if (!track) return;
    const historyId = `mixtape-${track.id}`;
    
    setWatchHistory(prev => {
      const existing = prev.find(item => item.id === historyId);
      // Calculate realistic progress if not specified
      const progress = progressPercent !== undefined 
        ? Math.min(100, Math.max(5, progressPercent))
        : (existing ? Math.min(95, existing.progressPercent + 15) : 35);

      const newItem: WatchHistoryItem = {
        id: historyId,
        itemId: track.id,
        type: 'mixtape',
        title: track.title,
        artistOrVj: track.artist || 'DJ EMMA PRO FX',
        thumbnail: track.thumbnail || track.backdrop || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
        duration: track.durationLabel || '50:00',
        playedAt: Date.now(),
        progressPercent: progress,
        quality: track.quality || 'Lossless 320k',
        genre: Array.isArray(track.genres) && track.genres.length > 0 ? track.genres[0] : 'Nonstop Mixtape',
        year: track.year || 2026,
        matchScore: track.matchScore || 99,
        youtubeId: track.youtubeId,
        audioTrackId: track.id,
        trackData: track
      };

      const filtered = prev.filter(item => item.id !== historyId);
      return [newItem, ...filtered].slice(0, 30);
    });
  }, []);

  const recordMoviePlayed = useCallback((movie: AtesoMovie, progressPercent?: number) => {
    if (!movie) return;
    const historyId = `movie-${movie.id}`;

    setWatchHistory(prev => {
      const existing = prev.find(item => item.id === historyId);
      const progress = progressPercent !== undefined 
        ? Math.min(100, Math.max(5, progressPercent))
        : (existing ? Math.min(95, existing.progressPercent + 20) : 40);

      const newItem: WatchHistoryItem = {
        id: historyId,
        itemId: movie.id,
        type: 'movie',
        title: movie.title,
        artistOrVj: movie.vj || 'ATESO MOVIES ALL TESO VJS',
        thumbnail: movie.thumbnail || 'https://i.ytimg.com/vi/m1cfa_PY6AY/hqdefault.jpg',
        duration: movie.duration || '1h 30m',
        playedAt: Date.now(),
        progressPercent: progress,
        quality: movie.quality || '320p Fast Stream',
        genre: movie.genre || 'Ateso Translated Movie',
        year: movie.year || 2026,
        matchScore: movie.matchScore || 98,
        youtubeId: movie.youtubeId,
        videoUrl: movie.videoUrl320 || movie.videoUrl,
        vj: movie.vj,
        partNumber: movie.partNumber,
        episodeNumber: movie.episodeNumber,
        movieData: movie
      };

      const filtered = prev.filter(item => item.id !== historyId);
      return [newItem, ...filtered].slice(0, 30);
    });
  }, []);

  const removeFromWatchHistory = useCallback((id: string) => {
    setWatchHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearWatchHistory = useCallback(() => {
    setWatchHistory([]);
  }, []);

  const restoreSampleHistory = useCallback(() => {
    setWatchHistory(INITIAL_DEMO_WATCH_HISTORY);
  }, []);

  // Listen to cross-component custom events for loose coupling
  useEffect(() => {
    const handleTrackPlayedEvent = (e: any) => {
      if (e.detail) {
        recordMixtapePlayed(e.detail);
      }
    };

    const handleMoviePlayedEvent = (e: any) => {
      if (e.detail) {
        recordMoviePlayed(e.detail);
      }
    };

    window.addEventListener('app:track-played', handleTrackPlayedEvent);
    window.addEventListener('app:movie-played', handleMoviePlayedEvent);

    return () => {
      window.removeEventListener('app:track-played', handleTrackPlayedEvent);
      window.removeEventListener('app:movie-played', handleMoviePlayedEvent);
    };
  }, [recordMixtapePlayed, recordMoviePlayed]);

  return (
    <WatchHistoryContext.Provider
      value={{
        watchHistory,
        recordMixtapePlayed,
        recordMoviePlayed,
        removeFromWatchHistory,
        clearWatchHistory,
        restoreSampleHistory
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory(): WatchHistoryContextType {
  const context = useContext(WatchHistoryContext);
  if (!context) {
    throw new Error('useWatchHistory must be used within a WatchHistoryProvider');
  }
  return context;
}
