import { Play, Pause, SkipForward, SkipBack, Volume2, RadioReceiver, Music2, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio } from '../context/AudioContext';

export default function StickyPlayer() {
  const {
    tracks,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    formatTime,
    downloadTrack
  } = useAudio();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#040404]/95 border-t border-[#00ffcc]/30 backdrop-blur-xl shadow-[0_-10px_35px_rgba(0,0,0,0.8)] font-mono">
      {/* Interactive Progress Bar */}
      <div 
        className="w-full h-1.5 bg-zinc-900 cursor-pointer relative group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          seek(ratio * (duration || 0));
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-[#00ffcc] to-cyan-400 relative transition-all"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#00ffcc]"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#111] border border-[#ff00ff]/50 flex items-center justify-center relative overflow-hidden flex-shrink-0 rounded-sm">
            {isPlaying && (
              <div className="absolute inset-0 bg-[#00ffcc]/15 animate-pulse"></div>
            )}
            <RadioReceiver className={`w-5 h-5 ${isPlaying ? 'text-[#00ffcc] animate-spin-slow' : 'text-zinc-500'}`} />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                {currentTrackIndex + 1}/{tracks.length}
              </span>
              <h4 className="text-[#00ffcc] text-xs sm:text-sm font-bold tracking-wider truncate">
                {currentTrack.title}
              </h4>
            </div>
            <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
              <span className="text-zinc-500 font-mono">
                {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : currentTrack.durationLabel}
              </span>
              <span className="text-zinc-600">•</span>
              <span className={`tracking-widest ${isPlaying ? 'text-green-400 font-bold' : 'text-zinc-500'}`}>
                {isPlaying ? 'NOW PLAYING' : 'AUDIO READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Controls */}
        <div className="flex items-center gap-4 sm:gap-6 justify-center">
          <button 
            onClick={prevTrack} 
            title="Previous Track"
            className="p-1.5 text-zinc-400 hover:text-[#00ffcc] transition-colors"
          >
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button 
            onClick={nextTrack} 
            title="Next Track"
            className="p-1.5 text-zinc-400 hover:text-[#00ffcc] transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <a 
            href={currentTrack.downloadUrl}
            download={currentTrack.filename}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => downloadTrack(currentTrack)}
            title={`Download ${currentTrack.title} to phone`}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#00ffcc] hover:bg-white text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,255,204,0.3)] hover:scale-105 active:scale-95 cursor-pointer ml-1"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="hidden md:inline">DOWNLOAD NONSTOP</span>
          </a>
        </div>

        {/* Visualizer & Volume */}
        <div className="hidden sm:flex items-center gap-5 w-1/3 justify-end">
          {/* Animated EQ Bars */}
          <div className="h-5 flex items-end justify-center gap-[2px]">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { 
                  height: [`${Math.max(15, Math.random() * 95)}%`, `${Math.max(20, Math.random() * 100)}%`, `${Math.max(15, Math.random() * 95)}%`] 
                } : { height: '15%' }}
                transition={{ duration: 0.35 + (i * 0.04), repeat: Infinity, repeatType: "mirror" }}
                className="w-1 bg-[#ff00ff] rounded-t-sm"
                style={{ filter: 'drop-shadow(0 0 3px #ff00ff)' }}
              ></motion.div>
            ))}
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-2.5 bg-[#111] border border-white/10 px-3 py-1.5 rounded-sm">
            <Volume2 className="w-3.5 h-3.5 text-[#00ffcc]" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.02" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Audio Volume"
              className="w-16 accent-[#00ffcc] h-1 bg-zinc-800 appearance-none cursor-pointer rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
