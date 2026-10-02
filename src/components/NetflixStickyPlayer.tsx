import { Play, Pause, SkipForward, SkipBack, Volume, Volume1, Volume2, VolumeX, Download, Maximize2, PictureInPicture2, Keyboard, X, Sliders, Waves, Activity, MonitorPlay, Loader2, Check } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AudioWaveformVisualizer from './AudioWaveformVisualizer';
import VideoPlayerModal from './VideoPlayerModal';
import HeartLikeButton from './HeartLikeButton';

export default function NetflixStickyPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    formatTime,
    downloadTrack,
    downloadState,
    togglePiP
  } = useAudio();

  const [showMobileVolume, setShowMobileVolume] = useState(false);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const [showVisualizerTray, setShowVisualizerTray] = useState(false);
  const [showMobileVisualizer, setShowMobileVisualizer] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [swipeFeedback, setSwipeFeedback] = useState<'next' | 'prev' | null>(null);
  const mobileVolumeRef = useRef<HTMLDivElement>(null);

  // Swipe handling on the player for mobile (Prev/Next mix)
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchDeltaXRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchDeltaXRef.current = 0;
    touchDeltaYRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
    touchDeltaYRef.current = e.touches[0].clientY - touchStartYRef.current;
  };

  const handleTouchEnd = () => {
    const deltaX = touchDeltaXRef.current;
    const deltaY = touchDeltaYRef.current;
    // Only trigger if horizontal movement is clearly dominant (>40px and 1.3x vertical movement)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped Left -> Next Mix
        setSwipeFeedback('next');
        nextTrack();
        setTimeout(() => setSwipeFeedback(null), 700);
      } else {
        // Swiped Right -> Previous Mix
        setSwipeFeedback('prev');
        prevTrack();
        setTimeout(() => setSwipeFeedback(null), 700);
      }
    }
    touchDeltaXRef.current = 0;
    touchDeltaYRef.current = 0;
  };

  const effectiveVolume = isMuted ? 0 : volume;
  const effectivePercentage = Math.round(effectiveVolume * 100);

  // Close mobile volume popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | any) => {
      if (mobileVolumeRef.current && !mobileVolumeRef.current.contains(e.target)) {
        setShowMobileVolume(false);
      }
    };
    if (showMobileVolume) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMobileVolume]);

  // Global event listener for toggling Studio Waveform Visualizer
  useEffect(() => {
    const handleToggleWaveform = () => {
      setShowVisualizerTray((prev) => !prev);
    };
    window.addEventListener('app:toggle-waveform', handleToggleWaveform);
    return () => {
      window.removeEventListener('app:toggle-waveform', handleToggleWaveform);
    };
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    seek(pos * duration);
  };

  const renderVolumeIcon = (size = "w-4 h-4") => {
    if (isMuted || effectiveVolume === 0) {
      return <VolumeX className={`${size} text-[#E50914]`} />;
    }
    if (effectiveVolume < 0.4) {
      return <Volume1 className={`${size} text-zinc-300`} />;
    }
    return <Volume2 className={`${size} text-white group-hover:text-[#E50914] transition-colors`} />;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div
      id="netflix-mini-player"
      className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 bg-[#181818]/95 backdrop-blur-md border-t border-zinc-800 text-white shadow-2xl transition-all"
    >
      {/* Netflix Red Interactive Progress Bar along the top edge */}
      <div
        className="w-full h-1.5 bg-zinc-800 cursor-pointer relative group"
        onClick={handleProgressBarClick}
        title="Seek mix"
      >
        <div
          className="h-full bg-[#E50914] relative transition-all"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Scrubber Knob */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="max-w-[1800px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 touch-pan-y relative"
      >
        {/* Mobile Swipe Feedback Indicator Overlay */}
        {swipeFeedback && (
          <div className="absolute -top-7 left-4 px-2.5 py-0.5 rounded-full bg-[#E50914] text-white text-[11px] font-bold animate-pulse shadow-xl z-30 flex items-center gap-1 border border-white/20">
            <span>{swipeFeedback === 'next' ? 'Next Mix →' : '← Previous Mix'}</span>
          </div>
        )}

        {/* Left: Track Info & Poster Thumbnail */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[220px] sm:max-w-xs relative"
          title="Swipe left or right on mobile to change mix"
        >

          <div 
            onClick={() => setIsVideoModalOpen(true)}
            className="relative w-11 h-8 sm:w-14 sm:h-9 rounded overflow-hidden shrink-0 bg-zinc-900 border border-zinc-700 cursor-pointer shadow group/thumb"
          >
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-white text-xs sm:text-sm font-bold truncate block">
                {currentTrack.title}
              </span>
              {/* Mobile Compact Waveform Visualizer */}
              <div className="md:hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setShowMobileVisualizer(true)}
                  className="cursor-pointer transition-transform active:scale-95"
                  title="Open Audio Waveform Visualizer"
                >
                  <AudioWaveformVisualizer compact />
                </button>
              </div>
            </div>
            <div className="text-zinc-400 text-[10px] sm:text-[11px] truncate flex items-center gap-1.5">
              <span className="truncate">{currentTrack.artist}</span>
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="text-[9px] sm:text-xs bg-[#E50914] hover:bg-red-600 text-white px-1.5 py-0.5 rounded font-bold hidden sm:inline-flex items-center gap-1 transition-colors cursor-pointer shadow"
                title="Watch Full HD Video"
              >
                <MonitorPlay className="w-3 h-3" /> Watch
              </button>
            </div>
          </div>

          {/* Mobile Favorite Heart Button in track box */}
          <div className="sm:hidden shrink-0">
            <HeartLikeButton trackId={currentTrack.id} item={currentTrack} type="mixtape" size="sm" />
          </div>
        </div>

        {/* Center: Playback Controls & Time */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 shrink-0">
          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={prevTrack}
              title="Previous Track (← swipe right)"
              aria-label="Previous Track"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-white/80 active:scale-95 text-black flex items-center justify-center transition-all shadow-md cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              title="Next Track (→ swipe left)"
              aria-label="Next Track"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Time indicator: visible on both desktop & mobile */}
          <div className="text-[9px] sm:text-[10px] font-mono text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-0.5 sm:mx-1 text-zinc-600">/</span>
            <span>{duration > 0 ? formatTime(duration) : 'LIVE'}</span>
          </div>
        </div>

        {/* Center-Right: Visual Audio Waveform Component (Desktop & Tablet) */}
        <div className="hidden md:block flex-1 max-w-sm lg:max-w-md xl:max-w-xl min-w-[200px] mx-2 lg:mx-4">
          <AudioWaveformVisualizer height={34} />
        </div>

        {/* Right: Phone Download, Favorite & Volume */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Favorite Heart Button */}
          <div className="hidden sm:block">
            <HeartLikeButton trackId={currentTrack.id} item={currentTrack} type="mixtape" size="md" />
          </div>

          {/* Prominent Direct Download to Phone Button with Clear Download State */}
          <button
            type="button"
            disabled={downloadState.status === 'downloading'}
            onClick={() => downloadTrack(currentTrack)}
            title={downloadState.status === 'downloading' ? 'Downloading...' : `Download ${currentTrack.title} directly to phone`}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap ${
              downloadState.status === 'downloading'
                ? 'bg-amber-600 text-white animate-pulse'
                : downloadState.status === 'completed'
                  ? 'bg-emerald-600 text-white shadow-emerald-950/50'
                  : 'bg-[#E50914] hover:bg-[#b80710] text-white shadow-[#E50914]/20 hover:scale-105 active:scale-95'
            }`}
          >
            {downloadState.status === 'downloading' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">SAVING {downloadState.progress}%</span>
                <span className="sm:hidden">{downloadState.progress}%</span>
              </>
            ) : downloadState.status === 'completed' ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">SAVED</span>
                <span className="sm:hidden">DONE</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">DOWNLOAD TO PHONE</span>
                <span className="sm:hidden">GET</span>
              </>
            )}
          </button>

          {/* Enhanced Volume Control & Audio Sliders */}
          <div 
            ref={mobileVolumeRef}
            className="relative flex items-center"
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
          >
            {/* Desktop & Tablet Volume Section */}
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-800/80 hover:border-zinc-700 transition-all">
              {/* Mute / Unmute Toggle Button */}
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer group"
                title={isMuted || effectiveVolume === 0 ? 'Unmute Audio (Press M)' : 'Mute Audio (Press M)'}
                aria-label={isMuted || effectiveVolume === 0 ? 'Unmute' : 'Mute'}
              >
                {renderVolumeIcon('w-4 h-4')}
              </button>

              {/* Responsive Volume Slider Track */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={effectiveVolume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                  }}
                  onDoubleClick={() => setVolume(1)}
                  style={{
                    background: `linear-gradient(to right, #E50914 0%, #E50914 ${effectivePercentage}%, #3f3f46 ${effectivePercentage}%, #3f3f46 100%)`,
                  }}
                  className="w-16 md:w-24 lg:w-28 h-1.5 hover:h-2 rounded-full appearance-none cursor-pointer accent-[#E50914] transition-all focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                  title={`Volume: ${effectivePercentage}% (Double-click for 100%, or use ↑/↓ keys)`}
                  aria-label="Volume Slider"
                  aria-valuenow={effectivePercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              {/* Volume Percentage Readout */}
              <span
                onClick={toggleMute}
                className={`text-[10px] font-mono font-bold select-none cursor-pointer w-7 text-right transition-colors ${
                  isMuted || effectiveVolume === 0
                    ? 'text-red-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Click to Mute/Unmute"
              >
                {isMuted || effectiveVolume === 0 ? '0%' : `${effectivePercentage}%`}
              </span>
            </div>

            {/* Mobile-Only Volume Trigger Button */}
            <button
              type="button"
              onClick={() => setShowMobileVolume((prev) => !prev)}
              className="sm:hidden p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
              title="Adjust Volume & Mute"
              aria-label="Adjust Volume"
            >
              {renderVolumeIcon('w-4 h-4')}
              <span className="text-[10px] font-mono font-bold text-zinc-400">
                {isMuted || effectiveVolume === 0 ? '0%' : `${effectivePercentage}%`}
              </span>
            </button>

            {/* Mobile Touch-Friendly Volume Popover Drawer */}
            <AnimatePresence>
              {showMobileVolume && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="sm:hidden absolute bottom-full right-0 mb-3 w-64 p-4 rounded-xl bg-[#1c1c1c] border border-zinc-700 shadow-[0_10px_35px_rgba(0,0,0,0.9)] z-50 text-white"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#E50914]" />
                      <span className="text-xs font-bold text-zinc-200">Audio Volume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${
                        isMuted || effectiveVolume === 0 ? 'text-red-400' : 'text-[#46d369]'
                      }`}>
                        {isMuted || effectiveVolume === 0 ? 'MUTED' : `${effectivePercentage}%`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowMobileVolume(false)}
                        className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Large Touch Range Slider */}
                  <div className="py-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={effectiveVolume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #E50914 0%, #E50914 ${effectivePercentage}%, #3f3f46 ${effectivePercentage}%, #3f3f46 100%)`,
                      }}
                      className="w-full h-2.5 rounded-full appearance-none cursor-pointer accent-[#E50914] transition-all"
                      aria-label="Mobile Volume Slider"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-zinc-800 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className={`py-1 px-1.5 rounded text-center transition-colors ${
                        isMuted || effectiveVolume === 0
                          ? 'bg-[#E50914] text-white font-bold'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {isMuted || effectiveVolume === 0 ? 'Unmute' : 'Mute'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolume(0.5)}
                      className="py-1 px-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-center transition-colors"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolume(1.0)}
                      className="py-1 px-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-center transition-colors"
                    >
                      100%
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {currentTrack?.isVideo && (
              <button
                onClick={togglePiP}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 ml-1"
                title="Picture in Picture (I)"
              >
                <PictureInPicture2 className="w-4 h-4" />
              </button>
            )}

            {/* Studio Waveform Visualizer Button */}
            <button
              type="button"
              onClick={() => setShowVisualizerTray((prev) => !prev)}
              className={`p-1 ml-0.5 rounded transition-colors cursor-pointer ${
                showVisualizerTray ? 'text-[#E50914] bg-white/10' : 'text-zinc-400 hover:text-white'
              }`}
              title="Studio Audio Waveform Visualizer Monitor"
              aria-label="Studio Audio Waveform Visualizer Monitor"
            >
              <Waves className="w-4 h-4" />
            </button>

            {/* Keyboard Shortcuts button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('app:toggle-shortcuts'))}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 ml-0.5"
              title="Keyboard Shortcuts Cheat Sheet (Press ?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Studio Audio Waveform Visualizer Tray */}
      <AnimatePresence>
        {showVisualizerTray && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="border-t border-zinc-800 bg-[#121212]/95 backdrop-blur-xl px-4 sm:px-8 py-3 text-white overflow-hidden shadow-2xl"
          >
            <div className="max-w-[1800px] mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-zinc-200 uppercase">
                    STUDIO WAVEFORM MONITOR & FREQUENCY SPECTRUM
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                    • {currentTrack.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVisualizerTray(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Close Visualizer Monitor"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* High-Resolution Wide Visualizer Canvas */}
              <AudioWaveformVisualizer height={68} showControls={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Waveform Drawer */}
      <AnimatePresence>
        {showMobileVisualizer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:hidden p-4"
            onClick={() => setShowMobileVisualizer(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-[#181818] border border-zinc-800 rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-[#E50914]" />
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">Audio Waveform Visualizer</h3>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate max-w-[220px]">{currentTrack.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileVisualizer(false)}
                  className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AudioWaveformVisualizer height={80} showControls={true} />

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : 'LIVE'}</span>
                <span className="text-[#46d369] font-bold">TOUCH & DRAG TO SEEK</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoPlayerModal
        track={currentTrack}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
