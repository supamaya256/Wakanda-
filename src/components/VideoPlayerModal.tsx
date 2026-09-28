import { X, Download, Play, Pause, Volume2, VolumeX, Maximize2, MonitorPlay } from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioTrack } from '../context/AudioContext';

interface VideoPlayerModalProps {
  track: AudioTrack | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ track, isOpen, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Auto-play prevented or failed:', err);
        setIsPlaying(false);
      });
    }
  }, [isOpen, track]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (!isOpen || !track) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-6"
        onMouseMove={handleMouseMove}
      >
        {/* Top Header Bar */}
        <div className={`absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
              <MonitorPlay className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white text-base sm:text-lg font-bold tracking-wide truncate max-w-xs sm:max-w-md">
                {track.title}
              </h2>
              <p className="text-zinc-400 text-xs font-mono">{track.artist} • <span className="text-[#46d369] font-semibold">{track.quality || 'HD 4K Video'}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={track.downloadUrl || track.url}
              download={track.filename || 'dj_emma_video.mp4'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-zinc-700 transition-colors cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4 text-[#E50914]" />
              <span className="hidden sm:inline">Download Video</span>
            </a>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-zinc-800/80 hover:bg-[#E50914] text-white transition-all cursor-pointer border border-zinc-700 hover:border-[#E50914]"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
          {track.youtubeId ? (
            <div className="w-full h-full aspect-video bg-black flex items-center justify-center">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={track.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={track.url}
                className="w-full h-full object-contain cursor-pointer"
                playsInline
                onClick={togglePlay}
                onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
                onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Center Play/Pause Indicator on Click */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-[#E50914]/90 flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Bottom Control Bar */}
              <div className={`absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Progress Scrubber */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-300 w-12 text-right">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
                  />
                  <span className="text-xs font-mono text-zinc-400 w-12">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2.5 rounded-xl bg-[#E50914] hover:bg-red-600 text-white transition-colors cursor-pointer shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button onClick={toggleMute} className="text-zinc-300 hover:text-white cursor-pointer">
                        {isMuted ? <VolumeX className="w-5 h-5 text-[#E50914]" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : 1}
                        onChange={(e) => {
                          if (videoRef.current) {
                            videoRef.current.volume = parseFloat(e.target.value);
                            setIsMuted(parseFloat(e.target.value) === 0);
                          }
                        }}
                        className="w-20 h-1 bg-zinc-700 rounded cursor-pointer accent-[#E50914] hidden sm:block"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-zinc-800 text-[11px] font-mono text-[#46d369] font-bold border border-zinc-700">
                      {track.quality || 'Ultra HD 4K'}
                    </span>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
