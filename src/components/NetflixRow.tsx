import React, { useRef, useState, MouseEvent } from 'react';
import { Play, Pause, Download, Plus, Check, Info, Sparkles, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio, AudioTrack } from '../context/AudioContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import HeartLikeButton from './HeartLikeButton';
import StarRating from './StarRating';
import { RowSkeleton } from './NetflixSkeleton';
import AutoScrollCarousel from './AutoScrollCarousel';

export interface NetflixRowProps {
  id?: string;
  title: string;
  subtitle?: string;
  tracks: AudioTrack[];
  onOpenModal: (track: AudioTrack) => void;
  isLoading?: boolean;
}

interface TrackCardItemProps {
  track: AudioTrack;
  index: number;
  isCenter?: boolean;
  isThisTrackPlaying: boolean;
  inMyList: boolean;
  hoveredCardId: number | null;
  onMouseEnter: (trackId: number) => void;
  onMouseLeave: () => void;
  onOpenModal: (track: AudioTrack) => void;
  toggleMyList: (trackId: number, e: MouseEvent) => void;
  isPlaying: boolean;
  playTrackById: (id: number) => void;
  togglePlay: () => void;
  downloadTrack: (track: AudioTrack) => void;
  duration: number;
  currentTime: number;
  recordMixtapePlayed?: (track: AudioTrack) => void;
}

function getPremiumLabel(track: AudioTrack) {
  if (track.topRank === 1 || track.id === 1 || track.title.includes('STREET ANTHEM 90')) {
    return { text: '🔥 TRENDING', className: 'bg-[#E50914] text-white shadow-md' };
  }
  if (track.year === 2026 && (track.title.includes('NEW') || track.title.includes('2026') || track.title.includes('FRESH'))) {
    return { text: 'NEW', className: 'bg-emerald-600 text-white shadow-md' };
  }
  if (track.matchScore && track.matchScore >= 99) {
    return { text: 'HOT', className: 'bg-gradient-to-r from-amber-500 to-red-500 text-white font-black shadow-md' };
  }
  if (track.isVideo) {
    return { text: 'EXCLUSIVE', className: 'bg-purple-600 text-white shadow-md' };
  }
  if (track.isTrending) {
    return { text: 'FEATURED', className: 'bg-blue-600 text-white shadow-md' };
  }
  return { text: 'MOST PLAYED', className: 'bg-zinc-800 text-zinc-300 border border-zinc-700' };
}

function TrackCardItem({
  track,
  index,
  isCenter = false,
  isThisTrackPlaying,
  inMyList,
  hoveredCardId,
  onMouseEnter,
  onMouseLeave,
  onOpenModal,
  toggleMyList,
  isPlaying,
  playTrackById,
  togglePlay,
  downloadTrack,
  duration,
  currentTime,
  recordMixtapePlayed
}: TrackCardItemProps) {
  const isHovered = hoveredCardId === track.id;
  const labelBadge = getPremiumLabel(track);

  return (
    <div
      onMouseEnter={() => onMouseEnter(track.id)}
      onMouseLeave={onMouseLeave}
      className={`group/card relative flex flex-col justify-between w-[270px] sm:w-[320px] lg:w-[350px] bg-[#181818] rounded-lg overflow-hidden transition-all duration-200 ease-out min-h-[340px] border active:scale-[0.97] touch-manipulation ${
        isThisTrackPlaying 
          ? 'border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.55)] ring-1 ring-[#E50914] scale-[1.02] z-10' 
          : isCenter
            ? 'border-white/20 shadow-[0_8px_25px_rgba(0,0,0,0.6)] z-10'
            : 'border-white/5 hover:border-zinc-500 hover:shadow-[0_12px_32px_rgba(0,0,0,0.85)] hover:scale-[1.03] hover:z-20'
      }`}
    >
      {/* 16:9 Thumbnail Image Header */}
      <div 
        className="relative aspect-video w-full bg-zinc-900 overflow-hidden cursor-pointer shrink-0" 
        onClick={() => onOpenModal(track)}
      >
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Video Preview on Hover if available */}
        {isHovered && track.url && (
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

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30 pointer-events-none" />

        {/* Top Left Badges: N Brand & Single Premium Label Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20">
          <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px] shadow">
            N
          </span>
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow ${labelBadge.className}`}>
            {labelBadge.text}
          </span>
        </div>

        {/* Top Right: Duration */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="bg-black/75 backdrop-blur-sm text-zinc-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10">
            {track.durationLabel}
          </span>
        </div>

        {/* Bottom Left Quality & Match */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-20">
          <span className="bg-black/80 backdrop-blur-sm text-[#46d369] font-bold text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">
            {track.matchScore || 99}% Match
          </span>
          <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10 uppercase">
            320K LOSSLESS
          </span>
        </div>

        {/* Active Audio Waveform Overlay if this track is playing */}
        {isThisTrackPlaying && (
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-[1px] flex items-center justify-center z-15 pointer-events-none">
            <div className="flex items-center gap-1 bg-black/70 px-3 py-1.5 rounded-full border border-red-500/50">
              <span className="w-1 h-3.5 bg-[#E50914] rounded-full animate-bounce" />
              <span className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-2.5 bg-[#E50914] rounded-full animate-bounce [animation-delay:0.3s]" />
              <span className="text-[11px] font-bold text-white ml-1.5 font-mono">NOW PLAYING</span>
            </div>
          </div>
        )}

        {/* Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-20">
          <div
            className="h-full bg-[#E50914] transition-all"
            style={{
              width: isThisTrackPlaying && duration > 0 ? `${(currentTime / duration) * 100}%` : `${((index % 6) + 1) * 16}%`
            }}
          />
        </div>
      </div>

      {/* Card Details & Hover Action Bar */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 
            className="font-bold text-white text-sm truncate mb-1 cursor-pointer hover:text-red-500 transition-colors" 
            title={track.title} 
            onClick={() => onOpenModal(track)}
          >
            {track.title}
          </h3>
          <p className="text-zinc-400 text-xs font-medium truncate mb-2">{track.artist}</p>
          
          <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono text-zinc-400 mb-2">
            <span className="border border-zinc-700 px-1 rounded">{track.ageRating || 'All Ages'}</span>
            <span>{track.year || 2026}</span>
            <span className="text-[#46d369] font-bold">LOSSLESS 320K</span>
          </div>

          <div className="mb-2.5">
            <StarRating trackId={track.id} size="sm" readonly={true} showCount={false} />
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {(track.genres || []).slice(0, 3).map((genre: string, gIdx: number) => (
              <span key={gIdx} className="text-[10px] text-zinc-300 bg-white/5 px-2 py-0.5 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
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
              title={isThisTrackPlaying ? 'Pause Playback' : 'Play Direct on Website'} 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isThisTrackPlaying 
                  ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/50 scale-105' 
                  : 'bg-white text-black hover:bg-white/85 hover:scale-105 active:scale-95'
              }`}
            >
              {isThisTrackPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Direct Download Button */}
            <a 
              href={track.downloadUrl || track.url} 
              download={track.filename} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => downloadTrack(track)} 
              title="Download Nonstop MP3 to Phone" 
              className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer group/dl"
            >
              <Download className="w-3.5 h-3.5 group-hover/dl:text-[#E50914] transition-colors" />
            </a>

            {/* Add to My List Button */}
            <button 
              type="button" 
              onClick={(e) => toggleMyList(track.id, e)} 
              title={inMyList ? 'In My List' : 'Add to My List'} 
              className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              {inMyList ? <Check className="w-3.5 h-3.5 text-[#46d369]" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            {/* Heart Like */}
            <HeartLikeButton trackId={track.id} />
          </div>

          {/* Details / Modal Info Button */}
          <button 
            type="button" 
            onClick={() => onOpenModal(track)} 
            title="More details & tracklist" 
            className="w-8 h-8 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-white hover:bg-zinc-700 flex items-center justify-center text-white transition-all cursor-pointer ml-auto"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NetflixRow({
  id,
  title,
  subtitle,
  tracks,
  onOpenModal,
  isLoading = false
}: NetflixRowProps) {
  const { isPlaying, currentTrack, playTrackById, togglePlay, downloadTrack, duration, currentTime } = useAudio();
  const { recordMixtapePlayed } = useWatchHistory();
  const [myList, setMyList] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('netflix_my_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (trackId: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCardId(trackId);
    }, 450);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCardId(null);
  };

  const toggleMyList = (trackId: number, e: MouseEvent) => {
    e.stopPropagation();
    setMyList((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const updated = list.includes(trackId) ? list.filter((i) => i !== trackId) : [...list, trackId];
      try {
        localStorage.setItem('netflix_my_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  if (isLoading) {
    return <RowSkeleton title={title} subtitle={subtitle} />;
  }

  if (!tracks || tracks.length === 0) {
    return null;
  }

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
              Auto-Sliding &rsaquo;
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800/80 hover:bg-[#E50914] text-white text-xs font-bold transition-all border border-zinc-700 hover:border-[#E50914] shadow-sm hover:shadow-lg hover:shadow-[#E50914]/20 self-start sm:self-auto cursor-pointer"
            title="Download all visible tracks to your device"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Tracks</span>
          </motion.button>
        )}
      </div>

      {/* Smooth Horizontal Auto-Scroll Content Carousel */}
      <AutoScrollCarousel<AudioTrack>
        id={id ? `${id}-carousel` : undefined}
        items={tracks}
        getItemKey={(t) => t.id}
        speed={0.65}
        resumeDelay={2500}
        ariaLabel={`${title} carousel`}
        renderItem={(track, index, _key, isCenter) => {
          const isThisTrackPlaying = isPlaying && currentTrack?.id === track.id;
          const inList = Array.isArray(myList) && myList.includes(track.id);

          return (
            <TrackCardItem
              track={track}
              index={index}
              isCenter={isCenter}
              isThisTrackPlaying={isThisTrackPlaying}
              inMyList={inList}
              hoveredCardId={hoveredCardId}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onOpenModal={onOpenModal}
              toggleMyList={toggleMyList}
              isPlaying={isPlaying}
              playTrackById={playTrackById}
              togglePlay={togglePlay}
              downloadTrack={downloadTrack}
              duration={duration}
              currentTime={currentTime}
              recordMixtapePlayed={recordMixtapePlayed}
            />
          );
        }}
      />
    </section>
  );
}
