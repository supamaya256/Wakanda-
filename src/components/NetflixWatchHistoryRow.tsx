import React, { useRef, useState, useMemo } from 'react';
import { 
  Play, Pause, Trash2, History, ChevronLeft, ChevronRight, 
  Film, Music, Info, X, RotateCcw, Clock, Sparkles, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWatchHistory, WatchHistoryItem } from '../context/WatchHistoryContext';
import { useAudio } from '../context/AudioContext';
import { AtesoMovie, ATESO_MOVIES_DATA } from '../data/atesoMoviesData';
import { AudioTrack } from '../context/AudioContext';

interface NetflixWatchHistoryRowProps {
  onWatchMovie: (movie: AtesoMovie) => void;
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
  onWatchMovie,
  onOpenTrackModal,
  isLoading = false
}: NetflixWatchHistoryRowProps) {
  const { watchHistory, removeFromWatchHistory, clearWatchHistory, restoreSampleHistory, recordMixtapePlayed, recordMoviePlayed } = useWatchHistory();
  const { tracks, isPlaying, currentTrack, playTrackById, togglePlay } = useAudio();

  const rowRef = useRef<HTMLDivElement | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'mixtapes' | 'movies'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filter items based on active pill
  const filteredHistory = useMemo(() => {
    if (filterType === 'mixtapes') return watchHistory.filter(i => i.type === 'mixtape');
    if (filterType === 'movies') return watchHistory.filter(i => i.type === 'movie');
    return watchHistory;
  }, [watchHistory, filterType]);

  const mixtapeCount = useMemo(() => watchHistory.filter(i => i.type === 'mixtape').length, [watchHistory]);
  const movieCount = useMemo(() => watchHistory.filter(i => i.type === 'movie').length, [watchHistory]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const handlePlayItem = (item: WatchHistoryItem) => {
    if (item.type === 'movie') {
      // Find full movie data or construct fallback
      const foundMovie = ATESO_MOVIES_DATA.find(m => m.id === String(item.itemId)) || item.movieData || {
        id: String(item.itemId),
        title: item.title,
        vj: item.vj || item.artistOrVj || 'ATESO MOVIES',
        year: item.year || 2026,
        duration: item.duration || '1h 30m',
        genre: item.genre || 'Ateso Translated Movie',
        quality: item.quality || '320p Fast Stream',
        thumbnail: item.thumbnail,
        videoUrl: item.videoUrl || '',
        videoUrl320: item.videoUrl || '',
        telegramUrl: 'https://t.me/atesomoviesbox',
        youtubeUrl: item.youtubeId ? `https://youtu.be/${item.youtubeId}` : '',
        youtubeId: item.youtubeId,
        description: `Watched on DJ Emma Pro FX Cinema: ${item.title}`,
        matchScore: item.matchScore || 98
      };

      recordMoviePlayed(foundMovie);
      onWatchMovie(foundMovie);
    } else {
      // Mixtape
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
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    removeFromWatchHistory(id);
    setActionFeedback(`Removed "${title.slice(0, 22)}..." from Watch History`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleClearAll = () => {
    clearWatchHistory();
    setShowClearConfirm(false);
    setActionFeedback('Watch history cleared and updated in local storage');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleRestore = () => {
    restoreSampleHistory();
    setActionFeedback('Sample watch history restored');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <section 
      id="watch-history-row" 
      className="relative my-6 px-4 sm:px-8 lg:px-12 select-none group/row"
      aria-label="User Watch History"
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
              <span>WATCH HISTORY</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Watch History</span>
              <span className="text-xs text-zinc-400 font-medium hidden md:inline">
                • Pick up where you left off
              </span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Tracks movies and mixtapes you've played • Persisted in your device's local storage
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Filter Pills */}
          {watchHistory.length > 0 && (
            <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-full p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  filterType === 'all' 
                    ? 'bg-[#E50914] text-white shadow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({watchHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('mixtapes')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'mixtapes' 
                    ? 'bg-[#E50914] text-white shadow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Music className="w-3 h-3" />
                <span>Mixtapes ({mixtapeCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('movies')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'movies' 
                    ? 'bg-[#E50914] text-white shadow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Movies ({movieCount})</span>
              </button>
            </div>
          )}

          {/* Clear or Restore History */}
          {watchHistory.length > 0 ? (
            showClearConfirm ? (
              <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 rounded-lg px-2 py-1 text-xs">
                <span className="text-red-300 font-bold">Clear history?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-0.5 rounded text-[11px] cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-zinc-400 hover:text-white text-[11px] px-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                title="Clear all played items from local storage"
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors bg-zinc-900/80 hover:bg-zinc-850 px-2.5 py-1 rounded-lg border border-zinc-800 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleRestore}
              className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg border border-zinc-700 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#E50914]" />
              <span>Restore Sample History</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Cards Carousel or Empty State */}
      {filteredHistory.length > 0 ? (
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity backdrop-blur-xs rounded-r shadow-lg cursor-pointer"
            aria-label="Scroll watch history left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div
            ref={rowRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-2 scroll-smooth px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredHistory.map((item, index) => {
              const isMixtape = item.type === 'mixtape';
              const isThisTrackActive = isMixtape && currentTrack?.id === Number(item.itemId) && isPlaying;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="group/card relative flex-none w-[270px] sm:w-[320px] lg:w-[350px] bg-[#181818] rounded-lg overflow-hidden hover:z-25 hover:shadow-[0_12px_32px_rgba(0,0,0,0.85)] border border-white/10 hover:border-red-600/60 min-h-[290px] transition-all flex flex-col justify-between"
                >
                  {/* Top Thumbnail Section (16:9) */}
                  <div 
                    className="relative aspect-video w-full bg-zinc-900 overflow-hidden cursor-pointer"
                    onClick={() => handlePlayItem(item)}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/40" />

                    {/* Top Left Badges: Media Type & VJ */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20">
                      {isMixtape ? (
                        <span className="bg-blue-600/90 text-white text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase shadow backdrop-blur-sm flex items-center gap-1">
                          <Music className="w-2.5 h-2.5" />
                          <span>DJ MIX</span>
                        </span>
                      ) : (
                        <span className="bg-[#E50914] text-white text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase shadow backdrop-blur-sm flex items-center gap-1">
                          <Film className="w-2.5 h-2.5" />
                          <span>ATESO MOVIE</span>
                        </span>
                      )}

                      {item.vj && (
                        <span className="bg-black/80 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                          {item.vj}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Delete from History Icon */}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, item.id, item.title)}
                      title="Remove from Watch History"
                      className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-black/80 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer opacity-80 group-hover/card:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Center Resume Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-20 bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg shadow-red-900/60 transform group-hover/card:scale-110 transition-transform">
                        {isThisTrackActive ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Bottom Progress Bar & Watched Status */}
                    <div className="absolute bottom-0 left-0 right-0 z-20">
                      <div className="px-2 py-0.5 flex items-center justify-between text-[10px] text-zinc-300 font-mono bg-black/70 backdrop-blur-xs">
                        <span className="text-[#46d369] font-bold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatRelativeTime(item.playedAt)}</span>
                        </span>
                        <span className="text-zinc-400">
                          {item.progressPercent}% played
                        </span>
                      </div>
                      
                      {/* Red Progress Bar */}
                      <div className="h-1.5 w-full bg-zinc-800">
                        <div 
                          className="h-full bg-[#E50914] transition-all"
                          style={{ width: `${Math.min(100, Math.max(8, item.progressPercent))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Info & Details */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 
                        onClick={() => handlePlayItem(item)}
                        className="font-bold text-white text-sm line-clamp-1 mb-1 cursor-pointer hover:text-red-500 transition-colors" 
                        title={item.title}
                      >
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-xs font-medium truncate mb-2">
                        {item.artistOrVj}
                      </p>

                      <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono text-zinc-400 mb-2">
                        <span className="border border-zinc-700 px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300">
                          {item.duration}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {item.matchScore || 99}% Match
                        </span>
                        {item.quality && (
                          <span className="text-zinc-400 truncate max-w-[120px]">
                            {item.quality}
                          </span>
                        )}
                      </div>

                      {item.genre && (
                        <div className="inline-block text-[10px] text-zinc-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full mb-3">
                          {item.genre}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
                      <button
                        type="button"
                        onClick={() => handlePlayItem(item)}
                        className="flex items-center gap-1.5 text-xs font-bold bg-[#E50914] hover:bg-red-700 text-white px-3 py-1.5 rounded-md shadow-md transition-colors cursor-pointer"
                      >
                        {isThisTrackActive ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Playing</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {isMixtape && onOpenTrackModal && (
                          <button
                            type="button"
                            onClick={() => {
                              const trackId = Number(item.itemId);
                              const t = tracks.find(trk => trk.id === trackId) || item.trackData;
                              if (t) onOpenTrackModal(t);
                            }}
                            title="More Info"
                            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleRemove(e, item.id, item.title)}
                          title="Remove from History"
                          className="text-[11px] text-zinc-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity backdrop-blur-xs rounded-l shadow-lg cursor-pointer"
            aria-label="Scroll watch history right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-zinc-800/80 bg-gradient-to-r from-zinc-900/60 via-zinc-900/30 to-zinc-900/60 p-6 sm:p-8 text-center max-w-2xl mx-auto my-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <History className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-1">
            Your Watch History is Currently Empty
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-4 max-w-md mx-auto leading-relaxed">
            Whenever you stream any nonstop mixtape or Ateso translated movie on the website, it will automatically appear here so you can easily pick up where you left off.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestore}
              className="flex items-center gap-2 bg-[#E50914] hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample History</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('featured-video-premiere');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs px-4 py-2 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#E50914]" />
              <span>Explore Video Premiere</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
