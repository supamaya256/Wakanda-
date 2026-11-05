import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AudioTrack, AUDIO_TRACKS } from './AudioContext';

export type WatchHistoryType = 'mixtape' | 'video';

export interface WatchHistoryItem {
  id: string; // Unique key e.g. "mixtape-1"
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
  trackData?: AudioTrack;
}

export const WATCH_HISTORY_STORAGE_KEY = 'dj_emma_watch_history_v3_r2';

const INITIAL_DEMO_WATCH_HISTORY: WatchHistoryItem[] = [
  {
    id: 'mixtape-1',
    itemId: 1,
    type: 'mixtape',
    title: 'STREET ANTHEM 90 • DJ EMMA PRO & WAKANDA DJs',
    artistOrVj: 'DJ EMMA PRO x DIVINE DEEJAY UG',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/WhatsApp%20Image%202026-06-17%20at%2012.23.24%20PM.jpeg',
    duration: '58:40',
    playedAt: Date.now() - 1000 * 60 * 22,
    progressPercent: 70,
    quality: 'Ultra HD 4K • Studio Master',
    genre: 'Street Anthem',
    year: 2026,
    matchScore: 99,
    audioTrackId: 1
  },
  {
    id: 'mixtape-2',
    itemId: 2,
    type: 'mixtape',
    title: '2024 ATESO VIDEO MIX VOL 1 VS AFROBEATS & UGANDAN HITS',
    artistOrVj: 'DJ EMMA PRO',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000bda08211910e147fbb531635.png',
    duration: '50:15',
    playedAt: Date.now() - 1000 * 60 * 60 * 3,
    progressPercent: 55,
    quality: 'Ultra HD 4K',
    genre: 'Ateso Video Mix',
    year: 2026,
    matchScore: 99,
    audioTrackId: 2
  }
];

interface WatchHistoryContextType {
  watchHistory: WatchHistoryItem[];
  recordMixtapePlayed: (track: AudioTrack, progressPercent?: number) => void;
  recordMoviePlayed?: (movie: any, progressPercent?: number) => void;
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
          return parsed.filter((item: any) => item.type !== 'movie');
        }
      }
    } catch (e) {
      console.warn('Failed to load watch history from localStorage:', e);
    }
    return INITIAL_DEMO_WATCH_HISTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATCH_HISTORY_STORAGE_KEY, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Failed to persist watch history to localStorage:', e);
    }
  }, [watchHistory]);

  const recordMixtapePlayed = useCallback((track: AudioTrack, progressPercent: number = 0) => {
    if (!track) return;
    const historyId = `mixtape-${track.id}`;

    setWatchHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== historyId);
      const newItem: WatchHistoryItem = {
        id: historyId,
        itemId: track.id,
        type: 'mixtape',
        title: track.title,
        artistOrVj: track.artist,
        thumbnail: track.thumbnail || 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/WhatsApp%20Image%202026-06-17%20at%2012.23.24%20PM.jpeg',
        duration: track.durationLabel || 'Master Nonstop',
        playedAt: Date.now(),
        progressPercent: Math.min(100, Math.max(0, Math.round(progressPercent))),
        quality: track.quality || 'Ultra HD 4K • Studio Master 320kbps',
        genre: track.genres?.[0] || 'Mixtape',
        year: track.year || 2026,
        matchScore: track.matchScore || 99,
        audioTrackId: track.id,
        trackData: track
      };
      return [newItem, ...filtered].slice(0, 30);
    });
  }, []);

  const recordMoviePlayed = useCallback((_movie: any, _progressPercent?: number) => {
    // No-op for backward compatibility
  }, []);

  const removeFromWatchHistory = useCallback((id: string) => {
    setWatchHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearWatchHistory = useCallback(() => {
    setWatchHistory([]);
    try {
      localStorage.removeItem(WATCH_HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear watch history from storage:', e);
    }
  }, []);

  const restoreSampleHistory = useCallback(() => {
    setWatchHistory(INITIAL_DEMO_WATCH_HISTORY);
  }, []);

  return (
    <WatchHistoryContext.Provider
      value={{
        watchHistory,
        recordMixtapePlayed,
        recordMoviePlayed,
        removeFromWatchHistory,
        clearWatchHistory,
        restoreSampleHistory,
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  const context = useContext(WatchHistoryContext);
  if (!context) {
    throw new Error('useWatchHistory must be used within a WatchHistoryProvider');
  }
  return context;
}
