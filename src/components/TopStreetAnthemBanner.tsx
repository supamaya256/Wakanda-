import React from 'react';
import { Play, Pause, Download, Flame, Disc3, Radio, Volume2, Sparkles, Info } from 'lucide-react';
import { useAudio, AudioTrack } from '../context/AudioContext';

interface TopStreetAnthemBannerProps {
  onOpenModal: (track: AudioTrack) => void;
}

export default function TopStreetAnthemBanner({ onOpenModal }: TopStreetAnthemBannerProps) {
  const { tracks, currentTrackIndex, isPlaying, togglePlay, playTrack, currentTime, duration, formatTime, downloadTrack } = useAudio();

  // Find Street Anthem 90 track (or fallback to track 0)
  const streetAnthemTrack = tracks.find(t => t.url.includes('STREET_ANTHEM_90') || t.title.includes('STREET ANTHEM 90')) || tracks[0];
  const streetAnthemIndex = tracks.findIndex(t => t.id === streetAnthemTrack?.id || t.url === streetAnthemTrack?.url);

  const isThisPlaying = isPlaying && currentTrackIndex === (streetAnthemIndex >= 0 ? streetAnthemIndex : 0);
  const isThisActive = currentTrackIndex === (streetAnthemIndex >= 0 ? streetAnthemIndex : 0);

  if (!streetAnthemTrack) return null;

  const handleToggle = () => {
    if (isThisPlaying) {
      togglePlay();
    } else {
      playTrack(streetAnthemIndex >= 0 ? streetAnthemIndex : 0);
    }
  };

  return (
    <div className="relative z-30 w-full bg-gradient-to-r from-black via-zinc-950/95 to-black border-y border-red-600/40 shadow-[0_4px_30px_rgba(229,9,20,0.35)] backdrop-blur-xl select-none">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Top Display Badge & Info */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          {/* Street Anthem 90 Album Art with Interactive Play Overlay */}
          <div 
            className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-red-500/60 shadow-xl shadow-red-950/70 group cursor-pointer" 
            onClick={handleToggle}
            title={isThisPlaying ? 'Pause Street Anthem 90' : 'Play Street Anthem 90 at Top'}
          >
            <img 
              src={streetAnthemTrack.thumbnail} 
              alt={streetAnthemTrack.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isThisPlaying ? 'scale-105 filter brightness-105' : 'group-hover:scale-105'}`}
            />
            {/* Play/Pause Button Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all ${isThisPlaying ? 'bg-black/30' : 'bg-black/40 group-hover:bg-black/20'}`}>
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                isThisPlaying 
                  ? 'bg-[#E50914] text-white scale-100 shadow-lg shadow-red-600/70' 
                  : 'bg-black/75 text-white group-hover:scale-110 group-hover:bg-[#E50914]'
              }`}>
                {isThisPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </div>
            </div>
            {isThisPlaying && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </div>

          {/* Text Information */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow">
                <Flame className="w-3 h-3 fill-current text-yellow-300" />
                #1 TOP DISPLAY AT THE TOP
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold hidden sm:inline flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                OFFICIAL 2026 MASTER STREAM
              </span>
              <span className="text-zinc-500 text-xs hidden lg:inline">•</span>
              <span className="text-zinc-400 text-xs font-mono hidden lg:inline">58:40 Nonstop</span>
            </div>

            <h2 className="text-white font-black text-sm sm:text-base lg:text-lg tracking-tight truncate flex items-center gap-2">
              <span className="hover:text-red-400 transition-colors cursor-pointer" onClick={handleToggle}>
                {streetAnthemTrack.title}
              </span>
            </h2>
            <p className="text-zinc-400 text-xs font-medium truncate">
              {streetAnthemTrack.artist} • <span className="text-zinc-300 font-semibold">Wakanda DJs & Divine Deejay UG Fire Flames DJs</span>
            </p>
          </div>
        </div>

        {/* Center / Right: Live Waveform Visualizer & Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Pulsing Audio Waveform Bars */}
          <div 
            onClick={handleToggle}
            className="flex items-center gap-1 h-8 px-2 cursor-pointer opacity-85 hover:opacity-100 transition-opacity hidden sm:flex"
            title="Click to toggle playback"
          >
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isThisPlaying 
                    ? 'bg-gradient-to-t from-red-600 via-rose-500 to-yellow-400' 
                    : 'bg-zinc-700'
                }`}
                style={{
                  height: isThisPlaying
                    ? `${Math.max(15, ((Math.sin(i * 0.9 + currentTime * 4) + 1) / 2) * 85 + 15)}%`
                    : `${20 + Math.sin(i * 0.7) * 20}%`
                }}
              />
            ))}
            {isThisActive && duration > 0 && (
              <span className="text-[11px] font-mono text-zinc-400 ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Stream Audio Button */}
            <button
              type="button"
              onClick={handleToggle}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black tracking-wide transition-all cursor-pointer shadow-md ${
                isThisPlaying
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600'
                  : 'bg-[#E50914] hover:bg-[#b80710] text-white hover:scale-105 active:scale-95 shadow-red-950/50'
              }`}
            >
              {isThisPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isThisPlaying ? 'PAUSE' : 'STREAM'}</span>
            </button>

            {/* Direct 1-Click Download Button */}
            <a
              href={streetAnthemTrack.downloadUrl}
              download={streetAnthemTrack.filename}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => downloadTrack(streetAnthemTrack)}
              title="Download Street Anthem 90 directly to your phone"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-black tracking-wider transition-all duration-200 shadow-md shadow-emerald-950/40 hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>DOWNLOAD MP3</span>
            </a>

            {/* Info Button */}
            <button
              type="button"
              onClick={() => onOpenModal(streetAnthemTrack)}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60 cursor-pointer"
              title="View track details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
