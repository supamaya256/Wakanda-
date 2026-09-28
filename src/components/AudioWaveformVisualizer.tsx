import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useAudio } from '../context/AudioContext';
import { 
  Activity, 
  BarChart3, 
  Waves, 
  Disc, 
  Maximize2, 
  Minimize2, 
  Flame, 
  Sparkles,
  Volume2,
  Sliders,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type WaveformVisualizerMode = 'bars' | 'waveform' | 'scope';
export type VisualizerTheme = 'netflix' | 'cyberpunk' | 'classic' | 'sunset';

interface AudioWaveformVisualizerProps {
  compact?: boolean;
  className?: string;
  showControls?: boolean;
  height?: number;
}

// Global singletons for Web Audio API nodes so we don't recreate them per render
let sharedAudioCtx: AudioContext | null = null;
let sharedSourceNode: MediaElementAudioSourceNode | null = null;
let sharedAnalyserNode: AnalyserNode | null = null;

export default function AudioWaveformVisualizer({
  compact = false,
  className = '',
  showControls = true,
  height = 42
}: AudioWaveformVisualizerProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    seek,
    formatTime,
    audioRef
  } = useAudio();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [mode, setMode] = useState<WaveformVisualizerMode>('waveform');
  const [theme, setTheme] = useState<VisualizerTheme>('netflix');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Live audio metrics state
  const [metrics, setMetrics] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
    peakLeft: 0,
    peakRight: 0,
    isRealAudio: false
  });

  // Keep peak hold values for bars visualizer
  const peakHoldRef = useRef<number[]>([]);
  const peakDecayRef = useRef<number[]>([]);

  // Initialize or resume Web Audio API
  const getAnalyser = useCallback((): AnalyserNode | null => {
    const videoEl = audioRef?.current;
    if (!videoEl) return null;

    if (sharedAnalyserNode) {
      if (sharedAudioCtx && sharedAudioCtx.state === 'suspended' && isPlaying) {
        sharedAudioCtx.resume().catch(() => {});
      }
      return sharedAnalyserNode;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;

      sharedAudioCtx = new AudioCtxClass();
      sharedSourceNode = sharedAudioCtx.createMediaElementSource(videoEl);
      sharedAnalyserNode = sharedAudioCtx.createAnalyser();
      sharedAnalyserNode.fftSize = 256; // 128 frequency bands
      sharedAnalyserNode.smoothingTimeConstant = 0.75;

      sharedSourceNode.connect(sharedAnalyserNode);
      sharedAnalyserNode.connect(sharedAudioCtx.destination);

      if (sharedAudioCtx.state === 'suspended' && isPlaying) {
        sharedAudioCtx.resume().catch(() => {});
      }

      return sharedAnalyserNode;
    } catch (err) {
      // In case of CORS or browser audio policy, fallback is used automatically
      return null;
    }
  }, [audioRef, isPlaying]);

  // Color palette definitions
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'cyberpunk':
        return {
          primary: '#00f0ff',
          secondary: '#ff007f',
          accent: '#7928ca',
          glow: 'rgba(0, 240, 255, 0.4)',
          unplayed: '#1e293b'
        };
      case 'classic':
        return {
          primary: '#46d369',
          secondary: '#22c55e',
          accent: '#eab308',
          glow: 'rgba(70, 211, 105, 0.4)',
          unplayed: '#27272a'
        };
      case 'sunset':
        return {
          primary: '#f97316',
          secondary: '#ec4899',
          accent: '#eab308',
          glow: 'rgba(249, 115, 22, 0.4)',
          unplayed: '#27272a'
        };
      case 'netflix':
      default:
        return {
          primary: '#E50914',
          secondary: '#ff3b30',
          accent: '#ff9500',
          glow: 'rgba(229, 9, 20, 0.45)',
          unplayed: '#2d1517'
        };
    }
  }, [theme]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFreqData = new Uint8Array(128);
    let localTimeData = new Uint8Array(128);

    // Track seed for continuous smooth waveforms
    let wavePhase = 0;

    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      const analyser = getAnalyser();
      let hasRealData = false;

      if (analyser && isPlaying) {
        try {
          analyser.getByteFrequencyData(localFreqData);
          analyser.getByteTimeDomainData(localTimeData);

          let sum = 0;
          for (let i = 0; i < 32; i++) {
            sum += localFreqData[i];
          }
          if (sum > 0) {
            hasRealData = true;
          }
        } catch (e) {
          hasRealData = false;
        }
      }

      // If no real Web Audio data is active, synthesize organic acoustic frequencies
      const effectiveVol = isMuted ? 0 : volume;
      if (!hasRealData) {
        wavePhase += isPlaying ? 0.08 : 0.01;
        const tempoMultiplier = Array.isArray(currentTrack?.genres) && currentTrack.genres.some(g => typeof g === 'string' && (g.toLowerCase().includes('dance') || g.toLowerCase().includes('party'))) ? 1.25 : 1.0;

        for (let i = 0; i < 64; i++) {
          if (isPlaying && effectiveVol > 0) {
            // Bass bins (0 to 12)
            const isBass = i < 12;
            const bassPulse = isBass ? (Math.sin(currentTime * 8 * tempoMultiplier) * 0.5 + 0.5) : 0;
            const harmonic = Math.sin(wavePhase * 2 + i * 0.25) * 0.5 + 0.5;
            const subNoise = Math.sin(wavePhase * 5 + i * 0.7) * 0.2;

            const baseAmp = isBass 
              ? (160 + bassPulse * 75 + subNoise * 40)
              : Math.max(20, (190 - i * 2.5) * harmonic + (Math.random() * 25));

            localFreqData[i] = Math.min(255, Math.floor(baseAmp * effectiveVol));
            localTimeData[i] = Math.floor(128 + (Math.sin(wavePhase * 3 + i * 0.3) * 60 * effectiveVol));
          } else {
            // Resting state when paused
            localFreqData[i] = Math.max(0, Math.floor(Math.sin(wavePhase + i * 0.2) * 8));
            localTimeData[i] = 128;
          }
        }
      }

      // Compute frequency band averages for UI meters
      let bassSum = 0;
      for (let i = 0; i < 8; i++) bassSum += localFreqData[i];
      const bassVal = Math.min(100, Math.round((bassSum / (8 * 255)) * 100));

      let midSum = 0;
      for (let i = 8; i < 32; i++) midSum += localFreqData[i];
      const midVal = Math.min(100, Math.round((midSum / (24 * 255)) * 100));

      let trebleSum = 0;
      for (let i = 32; i < 64; i++) trebleSum += localFreqData[i];
      const trebleVal = Math.min(100, Math.round((trebleSum / (32 * 255)) * 100));

      const peakL = Math.min(100, Math.round(bassVal * 0.95 + midVal * 0.05));
      const peakR = Math.min(100, Math.round(midVal * 0.7 + trebleVal * 0.3));

      // Throttle metric updates to every ~6 frames to avoid React overhead
      if (Math.random() < 0.2) {
        setMetrics({
          bass: bassVal,
          mid: midVal,
          treble: trebleVal,
          peakLeft: peakL,
          peakRight: peakR,
          isRealAudio: hasRealData
        });
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Playback progress ratio
      const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
      const progressX = progressRatio * width;

      // -------------------------------------------------------------
      // DRAW MODE 1: SOUNDWAVE (Symmetrical audio envelope with played fill)
      // -------------------------------------------------------------
      if (mode === 'waveform') {
        const barCount = Math.floor(width / (compact ? 5 : 4.5));
        const barWidth = compact ? 2.5 : 2.8;
        const barGap = (width - (barCount * barWidth)) / Math.max(1, barCount - 1);
        const centerY = height / 2;

        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + barGap);
          const isPlayed = x <= progressX;

          // Sample frequency bin mapping
          const binIndex = Math.floor((i / barCount) * 50);
          const rawAmp = (localFreqData[binIndex] || 0) / 255;

          // Soundwave contour profile (curved envelope)
          const envelope = Math.sin((i / barCount) * Math.PI);
          const dynamicMultiplier = isPlaying ? (0.6 + rawAmp * 0.65) : 0.28;
          const barHeight = Math.max(3, (height * 0.42) * (0.35 + envelope * 0.65) * dynamicMultiplier);

          // Color & Gradient
          ctx.beginPath();
          if (isPlayed) {
            const grad = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
            grad.addColorStop(0, themeColors.secondary);
            grad.addColorStop(0.5, themeColors.primary);
            grad.addColorStop(1, themeColors.secondary);
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = themeColors.unplayed;
          }

          // Draw rounded mirrored bar
          const radius = barWidth / 2;
          const topY = centerY - barHeight;
          const totalBarH = barHeight * 2;
          ctx.roundRect(x, topY, barWidth, totalBarH, radius);
          ctx.fill();
        }

        // Draw glowing playback playhead line
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = themeColors.glow;
        ctx.shadowBlur = 8;
        ctx.moveTo(progressX, 0);
        ctx.lineTo(progressX, height);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // -------------------------------------------------------------
      // DRAW MODE 2: BARS (Serato DJ Pro Equalizer Spectrum with Peak Hold)
      // -------------------------------------------------------------
      else if (mode === 'bars') {
        const numBars = compact ? 24 : (isExpanded ? 64 : 40);
        const barSpacing = 2;
        const totalSpacing = barSpacing * (numBars - 1);
        const barWidth = Math.max(2, (width - totalSpacing) / numBars);

        // Resize peak hold array if needed
        if (peakHoldRef.current.length !== numBars) {
          peakHoldRef.current = new Array(numBars).fill(0);
          peakDecayRef.current = new Array(numBars).fill(0);
        }

        for (let i = 0; i < numBars; i++) {
          const x = i * (barWidth + barSpacing);
          const binIndex = Math.floor((i / numBars) * 58);
          const rawAmp = (localFreqData[binIndex] || 0) / 255;
          const barH = Math.max(3, rawAmp * (height - 6));
          const y = height - barH;

          // Peak hold logic
          if (barH >= peakHoldRef.current[i]) {
            peakHoldRef.current[i] = barH;
            peakDecayRef.current[i] = 10; // hold frames
          } else {
            if (peakDecayRef.current[i] > 0) {
              peakDecayRef.current[i]--;
            } else {
              peakHoldRef.current[i] = Math.max(0, peakHoldRef.current[i] - 1.2);
            }
          }

          // Gradient for current bar
          const isPlayed = x <= progressX;
          const grad = ctx.createLinearGradient(0, height, 0, 0);
          if (isPlayed) {
            grad.addColorStop(0, themeColors.primary);
            grad.addColorStop(0.7, themeColors.secondary);
            grad.addColorStop(1, themeColors.accent);
          } else {
            grad.addColorStop(0, themeColors.unplayed);
            grad.addColorStop(1, '#3f3f46');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barH, [2, 2, 0, 0]);
          ctx.fill();

          // Draw Peak Hold Cap
          const peakY = height - peakHoldRef.current[i];
          if (peakY < height - 2) {
            ctx.fillStyle = isPlayed ? '#ffffff' : '#a1a1aa';
            ctx.fillRect(x, Math.max(0, peakY - 1.5), barWidth, 1.5);
          }
        }
      }

      // -------------------------------------------------------------
      // DRAW MODE 3: OSCILLOSCOPE (Electric Neon Beam Time-Domain Wave)
      // -------------------------------------------------------------
      else if (mode === 'scope') {
        // Draw Center Zero Grid Line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glow pass
        ctx.shadowColor = themeColors.primary;
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2.5;

        // Played vs unplayed segments
        const sliceWidth = width / 64;
        let x = 0;

        ctx.beginPath();
        for (let i = 0; i < 64; i++) {
          const v = localTimeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        const scopeGrad = ctx.createLinearGradient(0, 0, width, 0);
        scopeGrad.addColorStop(0, themeColors.primary);
        scopeGrad.addColorStop(Math.min(1, progressRatio), themeColors.secondary);
        scopeGrad.addColorStop(Math.min(1, progressRatio + 0.01), '#52525b');
        scopeGrad.addColorStop(1, '#27272a');

        ctx.strokeStyle = scopeGrad;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Highlight playhead dot on scope line
        const playheadIndex = Math.min(63, Math.floor(progressRatio * 64));
        const playheadV = localTimeData[playheadIndex] / 128.0;
        const playheadY = (playheadV * height) / 2;

        ctx.beginPath();
        ctx.arc(progressX, playheadY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = themeColors.primary;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw hover seek line if active
      if (hoverX !== null) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.moveTo(hoverX, 0);
        ctx.lineTo(hoverX, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mode, theme, isPlaying, currentTime, duration, volume, isMuted, hoverX, getAnalyser, themeColors, compact, isExpanded, currentTrack]);

  // Canvas Resize Observer
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = (isExpanded ? 110 : height) * dpr;

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height, isExpanded]);

  // Click & Drag to Seek on Waveform
  const handleSeekEvent = useCallback((clientX: number) => {
    if (!containerRef.current || !duration || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seek(pos * duration);
  }, [duration, seek]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeekEvent(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !duration) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = x / rect.width;
    setHoverX(x);
    setHoverTime(ratio * duration);

    if (isDragging) {
      handleSeekEvent(e.clientX);
    }
  };

  const handleMouseLeave = () => {
    setHoverX(null);
    setHoverTime(null);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mini Mobile Equalizer Badge Mode
  if (compact) {
    return (
      <div 
        id="compact-audio-waveform"
        className={`flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-white/10 ${className}`}
        title="Live Audio Waveform"
      >
        <div className="flex items-end gap-[2px] h-3.5 w-7">
          {[0.8, 0.4, 1.0, 0.6, 0.9, 0.3].map((multiplier, idx) => {
            const h = isPlaying ? Math.max(20, Math.min(100, metrics.bass * multiplier)) : 15;
            return (
              <span
                key={idx}
                className="w-1 bg-[#E50914] rounded-t-xs transition-all duration-75"
                style={{
                  height: `${h}%`,
                  opacity: isPlaying ? 1 : 0.4
                }}
              />
            );
          })}
        </div>
        <span className="text-[10px] font-mono font-bold text-zinc-300">
          {isPlaying ? 'ACTIVE' : 'IDLE'}
        </span>
      </div>
    );
  }

  return (
    <div 
      id="audio-waveform-visualizer" 
      className={`relative select-none ${className}`}
    >
      {/* Top Waveform Header Controls */}
      {showControls && (
        <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            {/* Visualizer Mode Switcher */}
            <div className="flex items-center bg-black/40 rounded p-0.5 border border-white/5">
              <button
                type="button"
                onClick={() => setMode('waveform')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'waveform' ? 'bg-[#E50914] text-white' : 'hover:text-white'
                }`}
                title="Symmetrical Soundwave with Played Progress"
              >
                <Waves className="w-3 h-3" />
                <span className="hidden md:inline">Wave</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('bars')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'bars' ? 'bg-[#E50914] text-white' : 'hover:text-white'
                }`}
                title="Serato DJ Pro EQ Frequency Bars"
              >
                <BarChart3 className="w-3 h-3" />
                <span className="hidden md:inline">Spectrum</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('scope')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'scope' ? 'bg-[#E50914] text-white' : 'hover:text-white'
                }`}
                title="Oscilloscope Beam"
              >
                <Activity className="w-3 h-3" />
                <span className="hidden md:inline">Scope</span>
              </button>
            </div>

            {/* Live Audio Energy Indicator */}
            {isPlaying && (
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800">
                <Flame className={`w-3 h-3 transition-colors ${metrics.bass > 65 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-zinc-500'}`} />
                <span className="text-[9px] font-bold text-zinc-300">
                  BASS {metrics.bass}%
                </span>
                <span className="text-zinc-600">•</span>
                <span className={`w-1.5 h-1.5 rounded-full ${metrics.isRealAudio ? 'bg-[#46d369]' : 'bg-amber-400 animate-ping'}`} />
                <span className="text-[9px] text-zinc-400">
                  {metrics.isRealAudio ? 'LIVE FFT' : 'DYNAMIC'}
                </span>
              </div>
            )}
          </div>

          {/* Right side: Stereo VU Meters and Expand Studio Monitor */}
          <div className="flex items-center gap-2">
            {/* Stereo VU Levels (L / R) */}
            <div className="hidden sm:flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-white/5" title="Stereo Peak VU Meters">
              <span className="text-[8px] font-bold text-zinc-500">L</span>
              <div className="w-8 sm:w-10 h-1.5 bg-zinc-800 rounded-xs overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-75 ${
                    metrics.peakLeft > 85 ? 'bg-red-500' : metrics.peakLeft > 60 ? 'bg-amber-400' : 'bg-[#46d369]'
                  }`}
                  style={{ width: `${isPlaying ? metrics.peakLeft : 0}%` }}
                />
              </div>
              <span className="text-[8px] font-bold text-zinc-500">R</span>
              <div className="w-8 sm:w-10 h-1.5 bg-zinc-800 rounded-xs overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-75 ${
                    metrics.peakRight > 85 ? 'bg-red-500' : metrics.peakRight > 60 ? 'bg-amber-400' : 'bg-[#46d369]'
                  }`}
                  style={{ width: `${isPlaying ? metrics.peakRight : 0}%` }}
                />
              </div>
            </div>

            {/* Expand / Minimize Studio Visualizer */}
            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse Visualizer' : 'Expand Studio Waveform Monitor'}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Waveform Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        className={`relative w-full rounded-lg overflow-hidden bg-gradient-to-b from-[#141414] to-[#0c0c0c] border border-zinc-800/80 shadow-inner cursor-pointer group transition-all ${
          isExpanded ? 'h-28 ring-1 ring-[#E50914]/40' : ''
        }`}
        style={{ height: isExpanded ? 112 : height }}
        title="Click or drag anywhere to scrub through mix"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Hover Time Scrubber Tooltip Badge */}
        {hoverTime !== null && hoverX !== null && (
          <div
            className="absolute top-1 pointer-events-none -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/90 border border-white/20 text-white text-[9px] font-mono font-bold shadow-lg z-20"
            style={{ left: hoverX }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Playhead Hover Overlay Cue Indicator */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-2 text-[9px] font-mono text-zinc-500">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : 'LIVE'}</span>
        </div>
      </div>

      {/* Expanded Studio Visualizer Theme Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="text-[11px] font-bold text-zinc-300">Studio Theme:</span>
              {(['netflix', 'cyberpunk', 'classic', 'sunset'] as VisualizerTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all cursor-pointer ${
                    theme === t 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'hover:text-zinc-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="text-zinc-500">FORMAT:</span>
              <span className="text-zinc-300">320kbps MP4 AAC</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300">44.1 kHz STEREO</span>
              <span className="text-zinc-500">•</span>
              <span className="text-[#46d369] font-bold">LOSSLESS LOW LATENCY</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
