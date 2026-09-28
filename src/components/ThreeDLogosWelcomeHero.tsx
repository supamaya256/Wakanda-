/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  MessageCircle,
  Eye,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { THREE_D_LOGOS_REVEAL_DATA, ThreeDLogoRevealItem, ensure360pLogoUrl } from '../data/threeDLogosRevealData';

interface ThreeDLogosWelcomeHeroProps {
  onOpenLogosReveal: () => void;
}

export default function ThreeDLogosWelcomeHero({ onOpenLogosReveal }: ThreeDLogosWelcomeHeroProps) {
  // Active welcome video (defaults to Edition #01 or #11)
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeLogo: ThreeDLogoRevealItem = THREE_D_LOGOS_REVEAL_DATA[activeIndex] || THREE_D_LOGOS_REVEAL_DATA[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Play next / prev logo
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % THREE_D_LOGOS_REVEAL_DATA.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + THREE_D_LOGOS_REVEAL_DATA.length) % THREE_D_LOGOS_REVEAL_DATA.length);
  };

  // Synchronize video when activeLogo changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [activeIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowToast('Direct download is restricted. Order your customized 3D logo via WhatsApp!');
    setTimeout(() => setShowToast(null), 4000);
  };

  const handleScrollToBillboard = () => {
    const el = document.getElementById('billboard-section') || document.querySelector('section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="welcome-3d-logos-hero"
      className="relative z-30 pt-3 pb-6 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#0a0a0f] via-[#101018] to-transparent border-b border-white/10"
      onContextMenu={handleContextMenu}
      aria-label="Welcome 3D Logo Reveal Showcase"
    >
      {/* Anti-Download Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] bg-[#1a1724]/95 border border-amber-500/50 rounded-xl px-4 py-2.5 shadow-2xl text-xs text-amber-200 flex items-center gap-2 backdrop-blur-md"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="flex-1">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1750px] mx-auto">
        {/* Top Welcome Announcement Badge Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E50914]"></span>
            </span>
            <span className="text-white font-black uppercase tracking-wider text-xs sm:text-sm">
              WELCOME TO DJ EMMA PRO FX
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-amber-400 font-bold uppercase text-[11px] sm:text-xs">
              3D LOGO REVEAL SHOWCASE
            </span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="text-zinc-400 text-[11px] hidden sm:inline font-mono">
              {THREE_D_LOGOS_REVEAL_DATA.length} Master Motion Editions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogosReveal}
              className="text-xs font-bold text-red-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explore Full 3D Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Welcome Showcase Card (Split Cinema Layout) */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#14121e] via-[#0d0d14] to-[#120d18] border border-red-500/30 p-4 sm:p-6 shadow-2xl overflow-hidden">
          {/* Ambient Video Light Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Welcome Introduction & Video Info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Welcome Greeting • Active 3D Reveal</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 font-mono">
                    {String(activeIndex + 1).padStart(2, '0')} of {THREE_D_LOGOS_REVEAL_DATA.length}
                  </span>
                </div>

                {/* Primary Title strictly "3D LOGO REVEAL" per user instruction */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
                  {activeLogo.title}
                </h2>
                
                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-amber-400 font-bold">{activeLogo.edition}</span>
                  <span>·</span>
                  <span className="text-zinc-300 font-medium">{activeLogo.styleTag}</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-mono">{activeLogo.resolution}</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeLogo.description} Engineered with explosive 3D extrusion, lighting sweeps, and heavy bass impact sound FX.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenLogosReveal}
                  className="px-4 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-red-950/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Eye className="w-4 h-4 text-white" />
                  <span>Enter 3D Logos Reveal Room</span>
                </button>

                <a
                  href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX%20I%20want%20to%20order%20the%203D%20LOGO%20REVEAL%20${encodeURIComponent(activeLogo.edition)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Order Custom 3D Logo</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('app:open-google-search', {
                        detail: { query: `${activeLogo.styleTag} 3D Logo Reveal DJ Emma` }
                      })
                    );
                  }}
                  className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Search this 3D logo reveal style on Google"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Check on Google</span>
                </button>
              </div>

              {/* Protection & Resolution Notice */}
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-2 border-t border-white/5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Protected Video Preview • Direct Downloads Disabled</span>
              </div>
            </div>

            {/* Right Column: Interactive Video Player Stage */}
            <div className="lg:col-span-7">
              <div 
                className="relative rounded-xl overflow-hidden bg-black border border-white/15 aspect-video w-full flex items-center justify-center shadow-2xl group select-none"
                onContextMenu={handleContextMenu}
              >
                {/* 3D Logo Reveal Video (Delivered in fast 360p Data Saver quality) */}
                <video
                  ref={videoRef}
                  key={activeLogo.videoUrl}
                  src={ensure360pLogoUrl(activeLogo.videoUrl)}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  controls={false}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={handleContextMenu}
                  className="w-full h-full object-contain max-h-[420px]"
                  onClick={togglePlay}
                />

                {/* Studio Watermark Overlay */}
                <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-zinc-200 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>DJ EMMA PRO FX • 3D LOGO REVEAL</span>
                </div>

                <div className="absolute top-3 right-3 pointer-events-none bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                  {activeLogo.edition}
                </div>

                {/* Center Play Overlay on Hover */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <div className="w-14 h-14 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-2xl transition-transform transform group-hover:scale-110">
                    {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
                  </div>
                </button>

                {/* Player Bottom Control Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Previous 3D Logo Reveal"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Next 3D Logo Reveal"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isMuted
                          ? 'bg-white/10 text-zinc-300 hover:bg-white/20'
                          : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 animate-pulse'
                      }`}
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{isMuted ? 'Sound Off' : 'Sound Live'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenLogosReveal}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="View in Full Room Theater"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Thumbnail Fast Switcher Ribbon */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Select from all {THREE_D_LOGOS_REVEAL_DATA.length} 3D Logo Reveal Editions:
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                Click any thumbnail to preview
              </span>
            </div>

            <div
              ref={ribbonRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar"
            >
              {THREE_D_LOGOS_REVEAL_DATA.map((item, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isCurrent
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/60 scale-105'
                        : 'bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white border-white/10'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-amber-300">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{item.edition}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
