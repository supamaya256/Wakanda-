import { useRef, useState, MouseEvent, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Download, Plus, Check, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio, AudioTrack } from '../context/AudioContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import HeartLikeButton from './HeartLikeButton';
import StarRating from './StarRating';
import { RowSkeleton, CardSkeleton } from './NetflixSkeleton';

interface NetflixRowProps {
  id?: string;
  title: string;
  subtitle?: string;
  tracks: AudioTrack[];
  onOpenModal: (track: AudioTrack) => void;
  isLoading?: boolean;
}

function LazyTrackCard({ 
  track, index, isThisTrackPlaying, inMyList, hoveredCardId,
  handleMouseEnter, handleMouseLeave, onOpenModal,
  toggleMyList, isPlaying, playTrackById, downloadTrack, duration, currentTime, togglePlay, currentTrack,
  recordMixtapePlayed
}: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => handleMouseEnter(track.id)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group/card relative flex-none w-[260px] sm:w-[320px] lg:w-[360px] bg-[#181818] rounded-md overflow-hidden hover:z-25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/5 hover:border-zinc-700 min-h-[280px]"
    >
      {isVisible ? (
        <>
          {/* 16:9 Thumbnail Image */}
          <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden cursor-pointer" onClick={() => onOpenModal(track)}>
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            
            {hoveredCardId === track.id && (
              <video
                src={track.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover object-center animate-fadeIn z-10"
              />
            )}

            {/* Gradient Vignette over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />

            {/* Top Badges: N Series & Duration */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px] shadow">
                N
              </span>
              <span className="bg-black/70 backdrop-blur-sm text-zinc-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                {track.durationLabel}
              </span>
            </div>

            {/* Top Right: Match Score */}
            <div className="absolute top-2.5 right-2.5 z-20">
              <span className="bg-black/80 backdrop-blur-sm text-[#46d369] font-bold text-[11px] px-2 py-0.5 rounded-full border border-green-500/20">
                {track.matchScore}% Match
              </span>
            </div>

            {/* Category Badges */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-20">
              {track.isVideo ? (
                <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-blue-400/30 uppercase shadow">
                  VIDEO
                </span>
              ) : (
                <span className="bg-[#E50914]/90 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-[#E50914]/50 uppercase shadow">
                  DJ MIX
                </span>
              )}
              {track.isTrending && (
                <span className="bg-amber-500/90 backdrop-blur-sm text-black text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-amber-300/50 uppercase shadow">
                  EXCLUSIVE
                </span>
              )}
            </div>

            {/* Bottom Progress Bar (Netflix Resume Style) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-20">
              <div
                className="h-full bg-[#E50914]"
                style={{
                  width: isThisTrackPlaying && duration > 0 ? `${(currentTime / duration) * 100}%` : `${(index + 1) * 23}%`
                }}
              />
            </div>
          </div>

          {/* Card Details & Hover Action Bar */}
          <div className="p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-sm truncate mb-1 cursor-pointer hover:text-red-500 transition-colors" title={track.title} onClick={() => onOpenModal(track)}>{track.title}</h3>
              <p className="text-zinc-400 text-xs font-medium truncate mb-2">{track.artist}</p>
              <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono text-zinc-400 mb-2">
                <span className="border border-zinc-700 px-1 rounded">{track.ageRating}</span>
                <span>{track.year}</span>
                <span className="text-[#46d369] font-bold">LOSSLESS 320K</span>
              </div>
              <div className="mb-3">
                <StarRating trackId={track.id} size="sm" readonly={true} showCount={false} />
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {track.genres.slice(0, 3).map((genre: string, gIdx: number) => (
                  <span key={gIdx} className="text-[10px] text-zinc-300 bg-white/5 px-2 py-0.5 rounded">{genre}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={() => {
                    if (isThisTrackPlaying) {
                      togglePlay();
                    } else {
                      if (recordMixtapePlayed) recordMixtapePlayed(track);
                      playTrackById(track.id);
                    }
                  }} 
                  title={isThisTrackPlaying ? 'Pause' : 'Play Direct on Dashboard'} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${isThisTrackPlaying ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40 animate-pulse' : 'bg-white text-black hover:bg-white/80'}`}
                >
                  {isThisTrackPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
                <a href={track.downloadUrl} download={track.filename} target="_blank" rel="noopener noreferrer" onClick={(e) => { downloadTrack(track); }} title="Download Nonstop to Phone" className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer group/dl">
                  <Download className="w-3.5 h-3.5 group-hover/dl:text-[#E50914] transition-colors" />
                </a>
                <button type="button" onClick={(e) => toggleMyList(track.id, e)} title={inMyList ? 'In My List' : 'Add to My List'} className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer">
                  {inMyList ? <Check className="w-3.5 h-3.5 text-[#46d369]" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
                <HeartLikeButton trackId={track.id} />
              </div>
              <button type="button" onClick={() => onOpenModal(track)} title="More details & tracklist" className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer ml-auto">
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full animate-shimmer">
          <div className="aspect-video w-full bg-zinc-850/80" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-zinc-800/80 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-zinc-800/60 animate-pulse" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function NetflixRow({ id, title, subtitle, tracks, onOpenModal, isLoading = false }: NetflixRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [myList, setMyList] = useState<number[]>([1, 2]);

  const { isPlaying, currentTrack, playTrackById, togglePlay, downloadTrack, currentTime, duration } = useAudio();
  const { recordMixtapePlayed } = useWatchHistory();
  
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (trackId: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCardId(trackId);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCardId(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  if (isLoading) {
    return <RowSkeleton title={title} subtitle={subtitle} />;
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const toggleMyList = (trackId: number, e: MouseEvent) => {
    e.stopPropagation();
    setMyList(prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.includes(trackId) ? list.filter(id => id !== trackId) : [...list, trackId];
    });
  };

  return (
    <section id={id} className="relative my-6 lg:my-10 px-4 sm:px-8 lg:px-12 select-none group">
      {/* Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-baseline gap-3 group"
        >
          <motion.h2 
            className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide hover:text-[#E50914] transition-colors cursor-pointer flex items-center gap-2"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-white to-zinc-400 drop-shadow-sm group-hover:from-white group-hover:to-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
              {title}
            </span>
            <motion.span 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs text-[#E50914] font-normal tracking-normal group-hover:translate-x-1 transition-transform inline-flex items-center"
            >
              Explore All &rsaquo;
            </motion.span>
          </motion.h2>
          {subtitle && <span className="text-xs text-zinc-400 hidden sm:inline opacity-80">{subtitle}</span>}
        </motion.div>

        {id === 'mixes' && tracks.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={() => {
              tracks.forEach((track, index) => {
                setTimeout(() => {
                  downloadTrack(track);
                }, index * 800);
              });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800/80 hover:bg-[#E50914] text-white text-xs font-bold transition-all border border-zinc-700 hover:border-[#E50914] shadow-sm hover:shadow-lg hover:shadow-[#E50914]/20 self-start sm:self-auto"
            title="Download all visible tracks to your device"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Tracks</span>
          </motion.button>
        )}
      </div>

      {/* Row Container with Left/Right Netflix Chevrons */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-r cursor-pointer backdrop-blur-xs shadow-lg"
            title="Scroll Left"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Scrollable Cards Track */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-4"
        >
          {(tracks || []).map((track, index) => {
            const isThisTrackPlaying = isPlaying && currentTrack?.id === track.id;
            const inMyList = Array.isArray(myList) && myList.includes(track.id);
            return (
              <LazyTrackCard
                key={track.id}
                track={track}
                index={index}
                isThisTrackPlaying={isThisTrackPlaying}
                inMyList={inMyList}
                hoveredCardId={hoveredCardId}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                onOpenModal={onOpenModal}
                toggleMyList={toggleMyList}
                isPlaying={isPlaying}
                playTrackById={playTrackById}
                togglePlay={togglePlay}
                currentTrack={currentTrack}
                downloadTrack={downloadTrack}
                duration={duration}
                currentTime={currentTime}
                recordMixtapePlayed={recordMixtapePlayed}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-l cursor-pointer backdrop-blur-xs shadow-lg"
            title="Scroll Right"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
}
