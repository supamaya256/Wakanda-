import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Play, Maximize2, 
  Download, Volume2, VolumeX, Sparkles, Film, Image as ImageIcon, 
  Share2, Check, X, ZoomIn, ZoomOut
} from 'lucide-react';

export interface MediaSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  hdUrl: string;
  poster?: string;
  title: string;
  subtitle: string;
  category: string;
  resolution: string;
  aspectRatio: string;
  alt: string;
}

export const OFFICIAL_HD_SLIDES: MediaSlide[] = [
  {
    id: 'slide-1',
    type: 'image',
    url: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg',
    hdUrl: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg',
    title: 'DJ Emma Pro FX Live In Action',
    subtitle: 'High-energy turntable mastery, club crowd hype & master audio mixing',
    category: 'Live Performance',
    resolution: '1080p Full HD',
    aspectRatio: '3:4',
    alt: 'DJ Emma Pro FX Live turntable mixing and performance on stage'
  },
  {
    id: 'slide-2',
    type: 'image',
    url: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg',
    hdUrl: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg',
    title: 'Festival Stage & DJ Booth Energy',
    subtitle: 'Unstoppable basslines, crowd vibrations & live acoustic transitions',
    category: 'Concert Stage',
    resolution: '1080p Full HD',
    aspectRatio: '9:16',
    alt: 'DJ Emma performing live on stage at major festival venue'
  },
  {
    id: 'slide-3',
    type: 'video',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1790550676/945f6977f27aae2b2d2b3b53d986c69b.mp4',
    hdUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1790550676/945f6977f27aae2b2d2b3b53d986c69b.mp4',
    poster: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
    title: 'DJ Emma Studio Motion Reel',
    subtitle: 'High-definition video teaser, dynamic lighting & studio motion graphics',
    category: 'Motion HD Video',
    resolution: '1080p Motion Reel',
    aspectRatio: '9:16',
    alt: 'DJ Emma Pro FX studio motion video reel in high definition'
  },
  {
    id: 'slide-4',
    type: 'image',
    url: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png',
    hdUrl: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png',
    title: 'DJ Emma Pro FX Master Artwork',
    subtitle: 'High-fidelity typography, signature logo & promotional brand identity',
    category: 'Official Artwork',
    resolution: 'Full HD Original',
    aspectRatio: '3:4',
    alt: 'DJ Emma Pro FX master artwork and typography branding'
  },
  {
    id: 'slide-5',
    type: 'image',
    url: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
    hdUrl: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
    title: 'Official Studio Portrait & Press Kit',
    subtitle: 'Crystal clear studio portrait & signature DJ Emma identity',
    category: 'Studio Portrait',
    resolution: 'Ultra HD 1667px',
    aspectRatio: '9:16',
    alt: 'DJ Emma official studio portrait for press and promotional releases'
  },
  {
    id: 'slide-6',
    type: 'image',
    url: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
    hdUrl: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
    title: 'DJ Emma Pro FX Signature Visual Showcase',
    subtitle: 'Ultra-sharp studio presentation & entertainment portfolio visual',
    category: 'Master Visual',
    resolution: 'Ultra HD 1477px',
    aspectRatio: '3:4',
    alt: 'DJ Emma Pro FX signature high-resolution visual showcase'
  },
];

interface HdMediaSlideshowProps {
  id?: string;
  variant?: 'hero' | 'cinema' | 'studio' | 'section';
  title?: string;
  subtitle?: string;
  className?: string;
  autoPlayInterval?: number;
}

export default function HdMediaSlideshow({
  id = 'hd-slides-showcase',
  variant = 'section',
  title,
  subtitle,
  className = '',
}: HdMediaSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [failedSlides, setFailedSlides] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement | null>(null);

  const currentSlide = OFFICIAL_HD_SLIDES[currentIndex] || OFFICIAL_HD_SLIDES[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % OFFICIAL_HD_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + OFFICIAL_HD_SLIDES.length) % OFFICIAL_HD_SLIDES.length);
  }, []);

  const handleSelectSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // When changing slides, immediately stop any video so it doesn't play in background
  useEffect(() => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
    }
  }, [currentIndex]);

  // Keyboard navigation (Esc to exit fullscreen, Left/Right to flip slides)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen]);

  // Swipe support for mobile touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keep active thumbnail visible in scroll view
  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const activeEl = thumbnailScrollRef.current.children[currentIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(currentSlide.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // clipboard access fallback
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentSlide.url;
    a.download = `dj_emma_pro_fx_${currentSlide.id}.${currentSlide.type === 'video' ? 'mp4' : 'jpg'}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleMediaError = (id: string) => {
    setFailedSlides((prev) => ({ ...prev, [id]: true }));
  };

  // Safe manual user play action with error boundary
  const handleTogglePlayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch(() => {
            // Autoplay policy or interruption fallback: mute and retry
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
            }
          });
      }
    }
  };

  // Section default titles by variant
  const sectionTitle = title || (
    variant === 'cinema' 
      ? 'DJ Emma Official Cinema & Visual Gallery' 
      : variant === 'studio' 
      ? 'Official Studio Visual Assets & HD Slides' 
      : 'DJ Emma Pro FX • Full HD Slides Showcase'
  );

  const sectionSubtitle = subtitle || (
    variant === 'cinema'
      ? 'Explore official full HD promotional photos, studio visuals, and motion teaser slides from the producer of Poison Break'
      : variant === 'studio'
      ? 'Master high-definition photography, stage performance captures, and signature branding media assets'
      : 'Official full HD live performance captures, studio portraits, master branding artwork, and motion video slides'
  );

  return (
    <section 
      id={id}
      aria-label="DJ Emma Pro FX Full HD Slideshow"
      className={`relative z-20 px-4 sm:px-8 lg:px-12 py-6 max-w-[1800px] mx-auto ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-zinc-400">
            <span className="text-[#E50914] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
              Official Media Slides
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-amber-400 font-medium">Full HD 1080p</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="font-mono tabular-nums text-zinc-400">{OFFICIAL_HD_SLIDES.length} Master Slides</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300 font-medium flex items-center gap-1.5 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Manual Showcase (Non-Playing)</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{sectionTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl mt-1 leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Global Slide Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/60 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Previous Slide"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/60 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Next Slide"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-950/40 active:scale-95 whitespace-nowrap"
            title="Open in Fullscreen Cinema HD Lightbox"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full HD View</span>
          </button>
        </div>
      </div>

      {/* Main Slideshow Stage */}
      <div 
        className="relative bg-black rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-black/80 aspect-[16/10] sm:aspect-[21/9] min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-center select-none group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Blurred Background (uses static image only - no background video decoders) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={currentSlide.poster || currentSlide.url}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover blur-3xl opacity-25 scale-125 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
        </div>

        {/* Foreground Full HD Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-6"
          >
            {failedSlides[currentSlide.id] ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-400 bg-zinc-900/90 rounded-2xl border border-zinc-800 max-w-md shadow-2xl">
                <Sparkles className="w-10 h-10 text-[#E50914] mb-3" />
                <h4 className="text-white font-bold text-sm sm:text-base">{currentSlide.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{currentSlide.subtitle}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFailedSlides((prev) => ({ ...prev, [currentSlide.id]: false }))}
                    className="px-3.5 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Retry Loading
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Next Slide
                  </button>
                </div>
              </div>
            ) : currentSlide.type === 'video' ? (
              <div className="relative max-h-full max-w-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={currentSlide.url}
                  poster={currentSlide.poster}
                  playsInline
                  autoPlay={false}
                  preload="metadata"
                  loop
                  muted={isMuted}
                  onError={() => handleMediaError(currentSlide.id)}
                  className="max-h-[340px] sm:max-h-[420px] lg:max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-zinc-700/50 cursor-pointer"
                  onClick={handleTogglePlayVideo}
                  title={isVideoPlaying ? 'Click to Pause' : 'Click to Play'}
                />

                {/* Big Center Play Button Overlay on Video when paused */}
                {!isVideoPlaying && (
                  <button
                    type="button"
                    onClick={handleTogglePlayVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-all cursor-pointer group/vid"
                    title="Play Video Reel"
                    aria-label="Play Video Reel"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-2xl transition-transform transform group-hover/vid:scale-110">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                  </button>
                )}

                {/* Video Audio Mute/Unmute Overlay indicator */}
                {isVideoPlaying && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted((m) => !m);
                    }}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95 z-20"
                    title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                )}
              </div>
            ) : (
              <div className="relative max-h-full max-w-full flex items-center justify-center">
                <img
                  src={currentSlide.url}
                  alt={currentSlide.alt}
                  referrerPolicy="no-referrer"
                  onError={() => handleMediaError(currentSlide.id)}
                  className="max-h-[340px] sm:max-h-[420px] lg:max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-zinc-700/50 transition-transform duration-300 hover:scale-[1.01] cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                  title="Click to open Full HD zoom"
                  loading="eager"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Top Badges Overlay */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-6 right-3 sm:right-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            <span className="font-bold text-white text-[11px] sm:text-xs tracking-wider">
              {currentSlide.category}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="font-mono text-[11px] text-amber-300 font-semibold">
              {currentSlide.resolution}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
              title="Copy HD Image Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
              title="Download Full HD File"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-black/70 hover:bg-[#E50914] text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
              title="View in Cinema Lightbox"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Previous & Next Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-[#E50914] text-white backdrop-blur-md border border-white/15 transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-lg active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-[#E50914] text-white backdrop-blur-md border border-white/15 transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-lg active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Slide Info Overlay with Scrim */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-4 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-1">
              <span className="text-[#E50914] font-bold">SLIDE {String(currentIndex + 1).padStart(2, '0')}</span>
              <span aria-hidden="true" className="text-zinc-600">/</span>
              <span>{String(OFFICIAL_HD_SLIDES.length).padStart(2, '0')}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-300">{currentSlide.type === 'video' ? 'MP4 Video' : 'HD Image'}</span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight drop-shadow-md">
              {currentSlide.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl drop-shadow line-clamp-1 sm:line-clamp-none mt-0.5">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Quick Click Indicator Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {OFFICIAL_HD_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 sm:w-8 h-2 bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,0.8)]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Jump to slide ${idx + 1}: ${slide.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation Strip */}
      <div className="mt-4">
        <div 
          ref={thumbnailScrollRef}
          className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 hide-scrollbar scroll-smooth"
        >
          {OFFICIAL_HD_SLIDES.map((slide, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group text-left ${
                  isActive
                    ? 'ring-2 ring-[#E50914] ring-offset-2 ring-offset-black scale-105 shadow-lg shadow-red-950/40'
                    : 'opacity-60 hover:opacity-100 hover:scale-102 border border-zinc-800'
                } w-24 sm:w-32 lg:w-36 aspect-[16/10] bg-zinc-900`}
                title={`Slide ${idx + 1}: ${slide.title}`}
              >
                <img
                  src={slide.poster || slide.url}
                  alt={slide.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to high-res wallpaper if network glitch
                    (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Mini badge on thumbnail */}
                <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white flex items-center gap-1">
                  {slide.type === 'video' ? <Film className="w-2.5 h-2.5 text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-red-400" />}
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                </div>

                <div className="absolute bottom-1 left-1.5 right-1.5 truncate text-[10px] font-semibold text-zinc-200">
                  {slide.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN HD CINEMA LIGHTBOX MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Top Lightbox Bar */}
            <div 
              className="flex items-center justify-between gap-4 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="bg-[#E50914] text-white font-black text-xs px-2.5 py-1 rounded tracking-wider uppercase">
                  FULL HD 1080P
                </span>
                <div>
                  <h4 className="text-white text-sm sm:text-base font-bold truncate max-w-md">
                    {currentSlide.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span>{currentSlide.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300">{currentSlide.resolution}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentIndex + 1} of {OFFICIAL_HD_SLIDES.length}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {currentSlide.type === 'image' && (
                  <button
                    type="button"
                    onClick={() => setIsZoomed((z) => !z)}
                    className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                    title={isZoomed ? 'Fit to Screen' : 'Zoom 100%'}
                  >
                    {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Download Master File"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreen(false);
                    setIsZoomed(false);
                  }}
                  className="p-2.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-white border border-zinc-700 hover:border-red-600 transition-colors cursor-pointer"
                  title="Close Fullscreen (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Stage */}
            <div 
              className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev / Next buttons in Lightbox */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-[#E50914] text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-2xl active:scale-95"
                title="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-[#E50914] text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-2xl active:scale-95"
                title="Next Slide"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {currentSlide.type === 'video' ? (
                <div className="relative max-h-full max-w-full flex items-center justify-center">
                  <video
                    ref={fullscreenVideoRef}
                    src={currentSlide.url}
                    poster={currentSlide.poster}
                    controls
                    autoPlay={false}
                    preload="metadata"
                    playsInline
                    className="max-h-[82vh] w-auto max-w-full rounded-2xl shadow-2xl border border-zinc-800 object-contain"
                  />
                </div>
              ) : (
                <div className="relative max-h-full max-w-full flex items-center justify-center overflow-auto">
                  <img
                    src={currentSlide.url}
                    alt={currentSlide.alt}
                    referrerPolicy="no-referrer"
                    className={`rounded-xl shadow-2xl border border-zinc-800 transition-all duration-300 ${
                      isZoomed 
                        ? 'max-h-none max-w-none scale-125 cursor-zoom-out' 
                        : 'max-h-[82vh] w-auto max-w-full object-contain cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed((z) => !z)}
                  />
                </div>
              )}
            </div>

            {/* Bottom Bar in Lightbox */}
            <div 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20 pt-2 border-t border-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
                {currentSlide.subtitle}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono">
                  Navigate with Left / Right Arrows · Esc to Exit
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
