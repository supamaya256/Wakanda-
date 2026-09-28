import { Volume2, VolumeX, Volume1, Play, Pause, RotateCcw, RotateCw, SkipForward, SkipBack, Maximize, Minimize, Download, Search, Tv, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HudMessage {
  id: number;
  type: 'volume' | 'mute' | 'unmute' | 'play' | 'pause' | 'seek' | 'track' | 'fullscreen' | 'pip' | 'download' | 'search' | 'waveform';
  title: string;
  subtitle?: string;
  value?: number; // percentage 0 - 100 for volume or progress
}

interface KeyboardHUDProps {
  message: HudMessage | null;
}

export default function KeyboardHUD({ message }: KeyboardHUDProps) {
  if (!message) return null;

  const renderIcon = () => {
    switch (message.type) {
      case 'volume':
        if (message.value === 0) return <VolumeX className="w-5 h-5 text-red-400" />;
        if ((message.value || 0) < 50) return <Volume1 className="w-5 h-5 text-zinc-300" />;
        return <Volume2 className="w-5 h-5 text-[#46d369]" />;
      case 'mute':
        return <VolumeX className="w-5 h-5 text-red-400" />;
      case 'unmute':
        return <Volume2 className="w-5 h-5 text-[#46d369]" />;
      case 'play':
        return <Play className="w-5 h-5 text-emerald-400 fill-current" />;
      case 'pause':
        return <Pause className="w-5 h-5 text-amber-400 fill-current" />;
      case 'seek':
        return (message.title && typeof message.title === 'string' && message.title.includes('-')) ? (
          <RotateCcw className="w-5 h-5 text-red-400" />
        ) : (
          <RotateCw className="w-5 h-5 text-red-400" />
        );
      case 'track':
        return (message.title && typeof message.title === 'string' && message.title.toLowerCase().includes('next')) ? (
          <SkipForward className="w-5 h-5 text-white" />
        ) : (
          <SkipBack className="w-5 h-5 text-white" />
        );
      case 'fullscreen':
        return <Maximize className="w-5 h-5 text-blue-400" />;
      case 'pip':
        return <Tv className="w-5 h-5 text-purple-400" />;
      case 'download':
        return <Download className="w-5 h-5 text-[#00ffcc]" />;
      case 'search':
        return <Search className="w-5 h-5 text-yellow-400" />;
      case 'waveform':
        return <Waves className="w-5 h-5 text-[#E50914]" />;
      default:
        return <Play className="w-5 h-5 text-white" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed top-12 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none select-none"
      >
        <div className="bg-black/90 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3.5 min-w-[200px] max-w-[420px]">
          <div className="shrink-0 p-1.5 rounded-full bg-white/10 flex items-center justify-center">
            {renderIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                {message.title}
              </span>
              {typeof message.value === 'number' && message.type === 'volume' && (
                <span className="text-xs font-mono font-bold text-zinc-300">
                  {Math.round(message.value)}%
                </span>
              )}
            </div>

            {/* Subtitle / track info */}
            {message.subtitle && (
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {message.subtitle}
              </p>
            )}

            {/* Visual Volume Bar Indicator */}
            {message.type === 'volume' && typeof message.value === 'number' && (
              <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#E50914] rounded-full transition-all duration-100"
                  style={{ width: `${Math.min(100, Math.max(0, message.value))}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
