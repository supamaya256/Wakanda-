import React from 'react';
import { Play, RotateCcw, Clock, Sparkles, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../context/AudioContext';

interface ContinueListeningBannerProps {
  onOpenModal?: (track: any) => void;
}

export default function ContinueListeningBanner({ onOpenModal }: ContinueListeningBannerProps) {
  const { continueListeningItem, resumeTrack, isPlaying, currentTrack } = useAudio();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // If dismissed or currently playing this exact track and past the start, or no resume item
  if (!continueListeningItem || isDismissed) {
    return null;
  }

  const { track, position, formattedPosition, formattedDuration, progressPercent } = continueListeningItem;
  const isThisItemActive = isPlaying && currentTrack?.id === track.id;

  return (
    <div className="relative px-4 sm:px-8 lg:px-12 my-4 sm:my-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1c1214] via-[#161616] to-[#121212] border border-red-500/30 p-3 sm:p-4 shadow-xl backdrop-blur-md"
      >
        {/* Subtle red ambient glow in background */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Thumbnail & Mix Meta */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div 
              onClick={() => onOpenModal ? onOpenModal(track) : resumeTrack(track.id, position)}
              className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/10 cursor-pointer group/art shadow-md"
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover group-hover/art:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover/art:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg group-hover/art:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Progress overlay along bottom of art */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                <div className="h-full bg-[#E50914]" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#E50914] text-white shadow-xs">
                  <Clock className="w-2.5 h-2.5" />
                  Continue Listening
                </span>
                <span className="text-[11px] font-mono text-zinc-400 hidden xs:inline">
                  Stopped at {formattedPosition}
                </span>
              </div>

              <h4 
                onClick={() => onOpenModal ? onOpenModal(track) : resumeTrack(track.id, position)}
                className="text-white text-xs sm:text-sm font-bold truncate hover:text-[#E50914] transition-colors cursor-pointer"
                title={track.title}
              >
                {track.title}
              </h4>

              <p className="text-zinc-400 text-[11px] truncate mt-0.5">
                {track.artist} • <span className="text-zinc-300 font-mono font-medium">{formattedDuration} mix</span>
              </p>
            </div>
          </div>

          {/* Right: Progress bar & One-Click Resume Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
            {/* Visual Progress Pill */}
            <div className="hidden md:flex flex-col items-end gap-1 w-32">
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-[#E50914] rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {progressPercent}% completed
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => resumeTrack(track.id, position)}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-950/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={`Resume ${track.title} at ${formattedPosition}`}
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span>Resume {formattedPosition}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss continue listening"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
