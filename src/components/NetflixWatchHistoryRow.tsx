import React, { useRef, useState, useMemo } from 'react';
import { 
  Play, Pause, Trash2, History, ChevronLeft, ChevronRight, 
  Music, Info, X, Clock, Sparkles, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWatchHistory, WatchHistoryItem } from '../context/WatchHistoryContext';
import { useAudio, AudioTrack } from '../context/AudioContext';

interface NetflixWatchHistoryRowProps {
  onOpenTrackModal?: (track: AudioTrack) => void;
  isLoading?: boolean;
}

function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return 'Recently';
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));
  
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function NetflixWatchHistoryRow({
  onOpenTrackModal,
  isLoading = false
}: NetflixWatchHistoryRowProps) {
  const { watchHistory, removeFromWatchHistory, clearWatchHistory, recordMixtapePlayed } = useWatchHistory();
  const { tracks, isPlaying, currentTrack, playTrackById, togglePlay } = useAudio();

  const rowRef = useRef<HTMLDivElement | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredHistory = watchHistory;

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const handlePlayItem = (item: WatchHistoryItem) => {
    const trackId = Number(item.itemId || item.audioTrackId || 1);
    const foundTrack = tracks.find(t => t.id === trackId) || item.trackData;

    if (foundTrack) {
      recordMixtapePlayed(foundTrack);
    }

    if (currentTrack?.id === trackId && isPlaying) {
      togglePlay();
    } else {
      playTrackById(trackId);
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    removeFromWatchHistory(id);
    setActionFeedback(`Removed "${title.slice(0, 22)}..." from History`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleClearAll = () => {
    clearWatchHistory();
    setShowClearConfirm(false);
    setActionFeedback('History cleared and updated in local storage');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  if (filteredHistory.length === 0) return null;

  return (
    <section 
      id="watch-history-row" 
      className="relative my-6 px-4 sm:px-8 lg:px-12 select-none group/row"
      aria-label="User Listening & Watch History"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-50 bg-zinc-900/95 border border-red-500/50 text-white text-xs px-4 py-2 rounded-lg shadow-xl shadow-black/80 flex items-center gap-2 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <History className="w-3 h-3" />
              <span>RECENTLY STREAMED</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Listening & Watch History</span>
              <span className="text-xs text-zinc-400 font-medium hidden md:inline">
                • Resume where you stopped
              </span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Tracks audio nonstops and video shows you've streamed • Saved directly to your device
          </p>
        </div>

        {/* Clear History */}
        <div className="flex items-center gap-2 shrink-0">
          {showClearConfirm ? (
            <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/50 px-2.5 py-1 rounded-md text-xs">
              <span className="text-red-200 text-[11px] font-medium">Clear history?</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded text-[10px] cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="text-zinc-300 hover:text-white px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-zinc-400 hover:text-red-400 px-2.5 py-1 rounded border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Slider Carousel Container */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-28 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
        >
          {filteredHistory.map((item) => {
            const isThisTrackActive = currentTrack.id === Number(item.itemId) && isPlaying;

            return (
              <div
                key={item.id}
                className="flex-none w-[260px] sm:w-[280px] bg-zinc-950/90 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 overflow-hidden flex flex-col justify-between group/card transition-all duration-200"
              >
                {/* Poster & Progress */}
                <div 
                  onClick={() => handlePlayItem(item)}
                  className="aspect-video w-full relative bg-zinc-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover/card:bg-black/10 transition-colors" />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover/card:scale-110 transition-transform">
                      {isThisTrackActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-mono font-bold text-red-500 border border-red-500/30">
                      {item.duration || 'Nonstop'}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, item.id, item.title)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/80 hover:bg-black text-zinc-400 hover:text-white transition"
                    title="Remove from history"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-900">
                    <div
                      className="h-full bg-red-600 transition-all"
                      style={{ width: `${Math.min(100, Math.max(10, item.progressPercent || 25))}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => handlePlayItem(item)}
                      className="font-bold text-xs sm:text-sm text-white line-clamp-1 hover:text-red-400 transition cursor-pointer"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                      {item.artistOrVj || 'DJ EMMA PRO FX'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-red-500" />
                      {formatRelativeTime(item.playedAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayItem(item)}
                      className="text-xs font-bold text-red-500 hover:text-red-400 transition cursor-pointer"
                    >
                      {isThisTrackActive ? 'Playing' : 'Resume'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-28 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
