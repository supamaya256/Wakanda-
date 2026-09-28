/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Layers,
  LayoutGrid,
  Maximize2,
  ArrowLeft,
  MessageCircle,
  Film,
  Zap,
  CheckCircle2,
  X,
  Gauge,
  RotateCcw,
  Sliders,
  Send,
  Eye
} from 'lucide-react';
import { THREE_D_LOGOS_REVEAL_DATA, ThreeDLogoRevealItem, ensure360pLogoUrl } from '../data/threeDLogosRevealData';

interface ThreeDLogosRevealPageProps {
  onBackToStore: () => void;
  onOpenStudioManager?: () => void;
  onOpenAtesoMovies?: () => void;
}

type StagePerspective = 'spatial-tilt' | 'center-stage' | 'cinematic-wide';
type GalleryViewMode = 'carousel' | 'grid';

export default function ThreeDLogosRevealPage({
  onBackToStore,
  onOpenStudioManager,
  onOpenAtesoMovies
}: ThreeDLogosRevealPageProps) {
  // Active selected video in center Holo-Deck
  const [activeItem, setActiveItem] = useState<ThreeDLogoRevealItem>(THREE_D_LOGOS_REVEAL_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [perspective, setPerspective] = useState<StagePerspective>('spatial-tilt');
  const [viewMode, setViewMode] = useState<GalleryViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio equalizer simulation state
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  // Anti-download toast
  const [protectedToast, setProtectedToast] = useState<string | null>(null);

  // Custom 3D Logo Order modal
  const [orderModalItem, setOrderModalItem] = useState<ThreeDLogoRevealItem | null>(null);
  const [orderBrandName, setOrderBrandName] = useState<string>('');
  const [orderPhone, setOrderPhone] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  // Main stage video ref
  const stageVideoRef = useRef<HTMLVideoElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  // Categories
  const categories = useMemo(() => {
    return ['All', 'Metallic & Gold', 'Studio Master', 'Electric & Laser', 'Neon & Cyber', 'Pyro & Impact'];
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return THREE_D_LOGOS_REVEAL_DATA.filter(item => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        item.edition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.styleTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Active index
  const activeIndex = useMemo(() => {
    return THREE_D_LOGOS_REVEAL_DATA.findIndex(i => i.id === activeItem.id);
  }, [activeItem]);

  // Navigate next/prev
  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % THREE_D_LOGOS_REVEAL_DATA.length;
    setActiveItem(THREE_D_LOGOS_REVEAL_DATA[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + THREE_D_LOGOS_REVEAL_DATA.length) % THREE_D_LOGOS_REVEAL_DATA.length;
    setActiveItem(THREE_D_LOGOS_REVEAL_DATA[prevIdx]);
  };

  // Synchronize playback speed
  useEffect(() => {
    if (stageVideoRef.current) {
      stageVideoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeItem]);

  // Auto-play when active item changes
  useEffect(() => {
    if (stageVideoRef.current) {
      stageVideoRef.current.currentTime = 0;
      stageVideoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [activeItem]);

  // Toggle stage play/pause
  const togglePlay = () => {
    if (!stageVideoRef.current) return;
    if (stageVideoRef.current.paused) {
      stageVideoRef.current.play();
      setIsPlaying(true);
    } else {
      stageVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (!stageVideoRef.current) return;
    stageVideoRef.current.muted = !stageVideoRef.current.muted;
    setIsMuted(stageVideoRef.current.muted);
    setIsAudioActive(!stageVideoRef.current.muted);
  };

  // Cycle speed
  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25];
    const currIdx = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currIdx + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  // Trigger anti-download security notification
  const triggerAntiDownloadNotice = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setProtectedToast(
      'Visual Protected: Direct download is restricted for official 3D Logo Reveals. Order your customized high-resolution animation below!'
    );
    setTimeout(() => {
      setProtectedToast(null);
    }, 4500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (orderModalItem) {
        if (e.key === 'Escape') setOrderModalItem(null);
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isPlaying, isMuted, orderModalItem]);

  // Handle custom order form submit
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderBrandName.trim()) return;

    const textMsg = `Hello DJ Emma Pro FX! I would like to order a Custom 3D Logo Reveal.%0A%0A*Selected Style:* ${orderModalItem?.title} (${orderModalItem?.edition} - ${orderModalItem?.styleTag})%0A*My Brand/DJ Name:* ${encodeURIComponent(orderBrandName)}%0A*Phone/WhatsApp:* ${encodeURIComponent(orderPhone || 'Not specified')}%0A*Special Notes:* ${encodeURIComponent(orderNotes || 'Standard HD 3D Render')}`;

    window.open(`https://wa.me/256780527361?text=${textMsg}`, '_blank');
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setOrderModalItem(null);
      setOrderBrandName('');
      setOrderPhone('');
      setOrderNotes('');
    }, 1500);
  };

  return (
    <div
      className="min-h-screen bg-[#07070a] text-zinc-100 font-sans selection:bg-[#E50914] selection:text-white pb-24 overflow-x-hidden"
      onContextMenu={triggerAntiDownloadNotice}
    >
      {/* Anti-Download Toast Notification */}
      <AnimatePresence>
        {protectedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] bg-[#181820]/95 border border-amber-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-xl text-center text-xs sm:text-sm text-zinc-200 flex items-start gap-3"
          >
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-left flex-1">
              <p className="font-bold text-amber-400">Download Restricted</p>
              <p className="mt-1 text-zinc-300 text-xs leading-relaxed">{protectedToast}</p>
            </div>
            <button
              type="button"
              onClick={() => setProtectedToast(null)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar Contract (3 Zones) */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Zone 1: Brand & Back */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Store</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black tracking-tight text-white uppercase">
              3D LOGOS REVEAL
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Vault
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('holo-stage');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Holo-Deck Stage
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('logos-collection');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            All {THREE_D_LOGOS_REVEAL_DATA.length} Editions
          </button>
          {onOpenAtesoMovies && (
            <button
              type="button"
              onClick={onOpenAtesoMovies}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Ateso Cinema</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOrderModalItem(activeItem)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-bold rounded-lg shadow-lg shadow-red-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Order Custom 3D Logo</span>
          </button>
        </div>
      </header>

      {/* Hero Header & Overview */}
      <section className="relative px-4 sm:px-8 max-w-7xl mx-auto pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive 3D Motion Chamber</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{THREE_D_LOGOS_REVEAL_DATA.length} Master Motion Editions</span>
              <span className="text-zinc-600">·</span>
              <span className="text-red-400 font-medium">Direct Downloads Restricted</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              3D LOGOS REVEAL
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl text-balance">
              Explore high-energy 3D video logo reveals engineered for club DJs, festival stages, YouTube intros,
              and VIP visual identities. Experience real-time audio playback, interactive 3D spatial tilts, and studio-grade previewing.
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('holo-stage');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-red-500" />
              <span>Jump to Stage</span>
            </button>
            <a
              href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX%20I%20want%20to%20order%20a%203D%20Logo%20Reveal"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Studio</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE 3D STAGE HOLO-DECK (DOMINANT FOCAL ANCHOR) */}
      <section id="holo-stage" className="relative px-4 sm:px-8 max-w-7xl mx-auto my-6">
        <div className="relative rounded-2xl bg-[#0d0d14] border border-white/10 p-3 sm:p-6 shadow-2xl overflow-hidden">
          {/* Ambient Video Glow Backdrop */}
          <div
            className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-all duration-700"
            style={{
              background: `radial-gradient(circle at 50% 50%, #E50914 0%, #1e1b4b 50%, transparent 80%)`
            }}
          />

          {/* Top Bar of the Holo-Deck */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  {activeItem.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-amber-400 font-semibold">{activeItem.edition}</span>
                  <span>·</span>
                  <span>{activeItem.styleTag}</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-mono">{activeItem.resolution}</span>
                </div>
              </div>
            </div>

            {/* Stage Perspective & Speed Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Perspective Selector */}
              <div className="flex items-center p-1 bg-black/60 rounded-lg border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setPerspective('spatial-tilt')}
                  className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                    perspective === 'spatial-tilt'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="3D Spatial Perspective Tilt"
                >
                  3D Tilt
                </button>
                <button
                  type="button"
                  onClick={() => setPerspective('center-stage')}
                  className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                    perspective === 'center-stage'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Center Stage Direct View"
                >
                  Flat Stage
                </button>
                <button
                  type="button"
                  onClick={() => setPerspective('cinematic-wide')}
                  className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                    perspective === 'cinematic-wide'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Cinematic Anamorphic Wide"
                >
                  Cinema Wide
                </button>
              </div>

              {/* Speed Button */}
              <button
                type="button"
                onClick={cycleSpeed}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Playback Speed"
              >
                <Gauge className="w-3.5 h-3.5 text-zinc-400" />
                <span>{playbackSpeed}x</span>
              </button>

              {/* Sound Audio Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    : 'bg-emerald-600/90 text-white shadow-md shadow-emerald-900/40 animate-pulse'
                }`}
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'Sound Muted' : 'Sound ON'}</span>
              </button>
            </div>
          </div>

          {/* 3D Holo-Deck Screen Container */}
          <div
            className="relative w-full rounded-xl overflow-hidden bg-black flex items-center justify-center transition-all duration-500 select-none group"
            style={{
              perspective: perspective === 'spatial-tilt' ? '1200px' : 'none',
              minHeight: perspective === 'cinematic-wide' ? '380px' : '440px',
              maxHeight: perspective === 'cinematic-wide' ? '460px' : '580px'
            }}
            onContextMenu={triggerAntiDownloadNotice}
          >
            {/* 3D Screen Surface */}
            <div
              className={`relative w-full h-full flex items-center justify-center transition-transform duration-700 ${
                perspective === 'spatial-tilt'
                  ? 'transform rotateX(4deg) rotateY(-2deg) scale(0.97) shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                  : perspective === 'cinematic-wide'
                  ? 'scale-100'
                  : 'scale-100'
              }`}
            >
              {/* Live Video Element - Strictly Protected Against Downloading in fast 360p Data Saver quality */}
              <video
                ref={stageVideoRef}
                key={activeItem.videoUrl}
                src={ensure360pLogoUrl(activeItem.videoUrl)}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                onContextMenu={triggerAntiDownloadNotice}
                className="w-full h-full object-contain max-h-[540px] pointer-events-auto"
                onClick={togglePlay}
              />

              {/* Watermark Overlay (Studio Proof & Security) */}
              <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-[10px] font-mono tracking-wider text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>DJ EMMA PRO FX • 3D LOGO REVEAL</span>
                <span className="text-zinc-500">|</span>
                <span className="text-emerald-400 font-bold">360p</span>
              </div>

              <div className="absolute top-3 right-4 pointer-events-none flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/30 text-[10px] font-medium text-amber-400">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Protected Preview</span>
              </div>

              {/* Holographic Scanline Overlay (Subtle) */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

              {/* Center Play/Pause Overlay Indicator on Hover */}
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                <div className="w-16 h-16 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-2xl transition-transform transform group-hover:scale-110">
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
                  )}
                </div>
              </button>

              {/* Previous / Next Arrow Floaters */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-red-600 text-white border border-white/20 transition-all cursor-pointer opacity-70 hover:opacity-100 shadow-xl"
                aria-label="Previous 3D Logo Reveal"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-red-600 text-white border border-white/20 transition-all cursor-pointer opacity-70 hover:opacity-100 shadow-xl"
                aria-label="Next 3D Logo Reveal"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Holo-Deck Bottom Bar: Details, Index Indicator, & Actions */}
          <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(THREE_D_LOGOS_REVEAL_DATA.length).padStart(2, '0')}
                </span>
                <span className="text-zinc-600">·</span>
                <h3 className="text-sm font-bold text-white uppercase">{activeItem.title}</h3>
                <span className="text-zinc-600">·</span>
                <span className="text-xs text-amber-400 font-semibold">{activeItem.edition}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  360p Data Saver
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">{activeItem.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrderModalItem(activeItem)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-950/40 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Get This 3D Logo Style</span>
              </button>

              <a
                href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX%20I%20want%20to%20order%20the%203D%20LOGO%20REVEAL%20${encodeURIComponent(activeItem.edition)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Quote</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3D SPATIAL RIBBON CAROUSEL (UNIQUE HORIZONTAL ARC DECK) */}
      <section className="relative px-4 sm:px-8 max-w-7xl mx-auto my-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>3D Spatial Ribbon Deck</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Swipe or click any 3D Logo Reveal to load it directly into the center Holo-Deck.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (carouselTrackRef.current) {
                  carouselTrackRef.current.scrollBy({ left: -340, behavior: 'smooth' });
                }
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (carouselTrackRef.current) {
                  carouselTrackRef.current.scrollBy({ left: 340, behavior: 'smooth' });
                }
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={carouselTrackRef}
          className="flex items-center gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
          onContextMenu={triggerAntiDownloadNotice}
        >
          {THREE_D_LOGOS_REVEAL_DATA.map((item, idx) => {
            const isSelected = item.id === activeItem.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveItem(item);
                  const stage = document.getElementById('holo-stage');
                  stage?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                className={`relative shrink-0 w-[240px] sm:w-[280px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 select-none ${
                  isSelected
                    ? 'ring-2 ring-red-500 scale-[1.03] bg-[#1a1824] shadow-xl shadow-red-950/50'
                    : 'bg-[#101016] border border-white/10 hover:border-white/30 hover:scale-[1.01]'
                }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Video Preview thumbnail loop (360p Data Saver) */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <video
                    src={ensure360pLogoUrl(item.videoUrl)}
                    muted
                    loop
                    playsInline
                    autoPlay
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={triggerAntiDownloadNotice}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Watermark Tag */}
                  <div className="absolute bottom-2 left-2 pointer-events-none text-[9px] font-mono text-zinc-300 bg-black/60 px-1.5 py-0.5 rounded">
                    {item.edition}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>ON STAGE</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{item.styleTag}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-white/5">
                    <span>{item.category}</span>
                    <span className="font-mono text-amber-400">#{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: ALL EDITIONS MATRIX GRID WITH ADVANCED FILTERS */}
      <section id="logos-collection" className="relative px-4 sm:px-8 max-w-7xl mx-auto my-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>All {THREE_D_LOGOS_REVEAL_DATA.length} 3D Logo Reveal Editions</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Every edition carries the official name <strong className="text-white">3D LOGO REVEAL</strong> with unique studio FX.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          onContextMenu={triggerAntiDownloadNotice}
        >
          {filteredItems.map((item, index) => {
            const isCurrentlyActive = item.id === activeItem.id;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`group relative rounded-xl overflow-hidden bg-[#101017] border transition-all duration-300 flex flex-col justify-between ${
                  isCurrentlyActive
                    ? 'border-red-500 shadow-xl shadow-red-950/40 ring-1 ring-red-500'
                    : 'border-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-black'
                }`}
              >
                {/* Top Video Preview (360p Data Saver) */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <video
                    src={ensure360pLogoUrl(item.videoUrl)}
                    loop
                    muted
                    autoPlay
                    playsInline
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={triggerAntiDownloadNotice}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Watermark Tag */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300 border border-white/10 pointer-events-none">
                    {item.edition}
                  </div>

                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-medium text-amber-400 border border-amber-500/20 pointer-events-none">
                    {item.category}
                  </div>

                  {/* Center Play Button on Hover */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItem(item);
                      const el = document.getElementById('holo-stage');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label={`Load ${item.edition} onto Holo-Deck`}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-lg transform group-hover:scale-105 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Focus on Stage</span>
                    </div>
                  </button>
                </div>

                {/* Card Metadata & Action Buttons */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-amber-400">{item.edition}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">60 FPS • 480p</span>
                    </div>
                    {/* Strictly Named "3D LOGO REVEAL" */}
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.styleTag}
                    </p>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveItem(item);
                        const el = document.getElementById('holo-stage');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-red-500" />
                      <span>Inspect</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderModalItem(item)}
                      className="flex-1 py-1.5 px-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: HOW CUSTOM 3D LOGO ORDERS WORK */}
      <section className="relative px-4 sm:px-8 max-w-7xl mx-auto my-12">
        <div className="rounded-2xl bg-[#0e0e14] border border-white/10 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Custom Animation Service</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                Want Your Own Brand In 3D LOGO REVEAL?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl text-balance">
                DJ Emma Pro FX crafts custom personalized 3D logo reveals with your DJ name, record label,
                or company branding. Delivered in uncompressed Full HD & 4K ProRes with alpha transparency for club LED screens and YouTube.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>24-Hour Turnaround</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Pro Audio Impact SFX Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Affordable Rates: 18,000 UGX / $5 USD</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setOrderModalItem(activeItem)}
                className="px-6 py-3 bg-[#E50914] hover:bg-[#b80710] text-white text-sm font-bold rounded-xl shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start 3D Logo Order</span>
              </button>
              <button
                type="button"
                onClick={onBackToStore}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: CUSTOM 3D LOGO ORDER FORM */}
      <AnimatePresence>
        {orderModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#14141d] border border-white/15 p-6 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-bold text-white uppercase">Order 3D Logo Reveal</h3>
                    <p className="text-xs text-zinc-400">
                      Based on <strong className="text-amber-400">{orderModalItem.edition}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderModalItem(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Form */}
              <form onSubmit={handleOrderSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Your DJ / Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={orderBrandName}
                    onChange={(e) => setOrderBrandName(e.target.value)}
                    placeholder="e.g. DJ MASTERMIND or EMPIRE SOUNDS"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Your WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    placeholder="+256 700 000 000"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Style Notes & Custom Colors (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Add blue neon edges, include sub-bass boom, or transparent background"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-400">
                  <p className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Price & Delivery Info</span>
                  </p>
                  <p>Starting at 18,000 UGX / $5 USD. Rendered in 480p/1080p within 24 hours.</p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Order to WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderModalItem(null)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
