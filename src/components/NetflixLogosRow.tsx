import React, { useRef, useState, useEffect, FormEvent, useMemo, ChangeEvent, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Sliders,
  Send,
  Sparkles,
  Film,
  Search,
  LayoutGrid,
  Columns4,
  GalleryHorizontal,
  X,
  Lock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio } from '../context/AudioContext';
import { useContent } from '../context/ContentContext';
import { useDataSaver } from '../context/DataSaverContext';
import { LogoItem, LOGO_ITEMS_DATA, ensure480pUrl } from '../data/logosData';
import { LogosRowSkeleton } from './NetflixSkeleton';

export type { LogoItem };
export { LOGO_ITEMS_DATA };

type ViewMode = 'four-rows' | 'grid' | 'single-row';

interface NetflixLogosRowProps {
  isLoading?: boolean;
}

export default function NetflixLogosRow({ isLoading = false }: NetflixLogosRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Layout view mode: defaults to 'four-rows' ("4 lines down showing many of them")
  const [viewMode, setViewMode] = useState<ViewMode>('four-rows');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { logos } = useContent();
  const { isDataSaver, shouldAutoplay, preloadStrategy, getOptimizedMediaUrl } = useDataSaver();

  // Helper for ultra-fast Cloudinary video posters (10KB vs 5MB video)
  const getCloudinaryPoster = (url: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && url.includes('/video/upload/')) {
      return url.replace(/\/video\/upload\/([^/]+)?\/?/, '/video/upload/so_0,w_360,h_200,c_fill,f_auto,q_auto:low/').replace(/\.mp4(\?.*)?$/i, '.jpg');
    }
    return '';
  };

  // Active / Center Stage 3D Video Player (Plays directly from the middle of the showcase without scrolling up)
  const [activeLogo, setActiveLogo] = useState<LogoItem>(() => {
    const list = Array.isArray(logos) && logos.length > 0 ? logos : LOGO_ITEMS_DATA;
    const electricLogo = list.find(l => l && (l.id === 'electric-shockwave-wa0011' || l.title?.toUpperCase().includes('ELECTRIC SHOCKWAVE')));
    return electricLogo || list[0] || LOGO_ITEMS_DATA[0];
  });
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const centerPlayerRef = useRef<HTMLDivElement>(null);
  const [isActivePlaying, setIsActivePlaying] = useState<boolean>(!isDataSaver);
  const [isActiveMuted, setIsActiveMuted] = useState<boolean>(true);
  const [activeCurrentTime, setActiveCurrentTime] = useState<number>(0);
  const [activeDuration, setActiveDuration] = useState<number>(0);
  const [showCenterPlayer, setShowCenterPlayer] = useState<boolean>(true);

  // Sync activeLogo if current logo was deleted
  useEffect(() => {
    const list = Array.isArray(logos) && logos.length > 0 ? logos : LOGO_ITEMS_DATA;
    if (!activeLogo || !list.find(l => l && l.id === activeLogo.id) || !activeLogo.videoUrl) {
      const electricLogo = list.find(l => l && (l.id === 'electric-shockwave-wa0011' || l.title?.toUpperCase().includes('ELECTRIC SHOCKWAVE')));
      setActiveLogo(electricLogo || list[0] || LOGO_ITEMS_DATA[0]);
    }
  }, [logos, activeLogo]);

  // Hover or active preview on card
  const [hoveredLogoId, setHoveredLogoId] = useState<string | null>(null);

  // Full Screen / Modal Video Preview state (Anti-download protected)
  const [modalVideoLogo, setModalVideoLogo] = useState<LogoItem | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const [modalCurrentTime, setModalCurrentTime] = useState(0);
  const [modalDuration, setModalDuration] = useState(0);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [isModalFullscreen, setIsModalFullscreen] = useState(false);

  // Custom Order Form state
  const [orderModalLogo, setOrderModalLogo] = useState<LogoItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [logoText, setLogoText] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const { pauseTrack } = useAudio();
  
  // Lock body scroll when modal is active to prevent scroll jumping
  useEffect(() => {
    if (modalVideoLogo || orderModalLogo) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [modalVideoLogo, orderModalLogo]);

  // Sync active video play/pause state
  useEffect(() => {
    if (activeVideoRef.current) {
      if (isActivePlaying) {
        activeVideoRef.current.play().catch(() => {});
      } else {
        activeVideoRef.current.pause();
      }
    }
  }, [isActivePlaying, activeLogo]);

  // Filtered logos based on search query and category
  const filteredLogos = useMemo(() => {
    const list = (Array.isArray(logos) && logos.length > 0) ? logos : LOGO_ITEMS_DATA;
    return list.filter((logo) => {
      if (!logo) return false;
      const q = (searchQuery || '').toLowerCase();
      const title = (logo.title || '').toLowerCase();
      const style = (logo.style || '').toLowerCase();
      const matchesSearch =
        q === '' ||
        title.includes(q) ||
        style.includes(q) ||
        (Array.isArray(logo.tags) && logo.tags.some((t) => t && typeof t === 'string' && t.toLowerCase().includes(q)));

      const matchesCat =
        selectedCategory === 'All' ||
        logo.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory, logos]);

  if (isLoading) {
    return <LogosRowSkeleton />;
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  // Select a 3D logo and play it directly in the middle cinema stage (zero scroll jump)
  const handleSelectAndPlayLogo = (logo: LogoItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    pauseTrack(); // Pause any mixtape playing
    setActiveLogo(logo);
    setIsActivePlaying(true);
    setShowCenterPlayer(true);

    if (activeVideoRef.current) {
      const dur = activeVideoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        // Start from the middle of the video as requested
        const midPoint = dur / 2;
        activeVideoRef.current.currentTime = midPoint;
        setActiveCurrentTime(midPoint);
      }
      activeVideoRef.current.play().catch(() => {});
    }

    // Keep smoothly in view right in the middle without taking user all the way up to page top
    if (centerPlayerRef.current) {
      centerPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleActiveLoadedMetadata = () => {
    if (activeVideoRef.current) {
      const dur = activeVideoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        setActiveDuration(dur);
        // Play from the middle as requested by the user
        const midPoint = dur / 2;
        activeVideoRef.current.currentTime = midPoint;
        setActiveCurrentTime(midPoint);
      }
    }
  };

  const toggleActivePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activeVideoRef.current) {
      if (activeVideoRef.current.paused) {
        activeVideoRef.current.play().catch(() => {});
        setIsActivePlaying(true);
      } else {
        activeVideoRef.current.pause();
        setIsActivePlaying(false);
      }
    }
  };

  const toggleActiveMute = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activeVideoRef.current) {
      activeVideoRef.current.muted = !isActiveMuted;
      setIsActiveMuted(!isActiveMuted);
    }
  };

  const handleActiveTimeUpdate = () => {
    if (activeVideoRef.current) {
      setActiveCurrentTime(activeVideoRef.current.currentTime);
      if (activeVideoRef.current.duration && !isNaN(activeVideoRef.current.duration)) {
        setActiveDuration(activeVideoRef.current.duration);
      }
    }
  };

  const handleActiveSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setActiveCurrentTime(time);
    if (activeVideoRef.current) {
      activeVideoRef.current.currentTime = time;
    }
  };

  // Direct 1-click WhatsApp order
  const handleDirectWhatsAppOrder = (logo: LogoItem) => {
    const text = encodeURIComponent(
      `Hello DJ Emma Pro FX,\n\nI want to order this 3D Animated DJ Logo from your Netflix Studio:\n\n*Animation Style:* ${logo.title}\n*FX Style:* ${logo.style}\n*Price:* ${logo.priceUgx} (${logo.priceUsd})\n*Resolution:* ${logo.resolution}\n*Video Reference:* ${logo.videoUrl}\n\nPlease let me know the requirements and payment details.`
    );
    window.open(`https://wa.me/256780527361?text=${text}`, '_blank');
  };

  // Custom Order Submit
  const handleCustomOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!orderModalLogo) return;

    const message = encodeURIComponent(
      `Hello DJ Emma Pro FX (3D Logo Order),\n\n*Selected Animation Style:* ${orderModalLogo.title}\n*Price:* ${orderModalLogo.priceUgx} (${orderModalLogo.priceUsd})\n*My Name / DJ Name:* ${clientName || 'DJ Name'}\n*Exact Text for 3D Logo:* ${logoText || clientName}\n*Custom Notes:* ${specialInstructions || 'Make it pop with high energy FX'}\n*Reference Video:* ${orderModalLogo.videoUrl}\n\nPlease render and send to this WhatsApp number.`
    );
    window.open(`https://wa.me/256780527361?text=${message}`, '_blank');
    setOrderModalLogo(null);
  };

  // Open Full Screen Theater Video Modal
  const handleOpenVideoModal = (logo: LogoItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    pauseTrack(); // Pause any mixtape playing
    setModalVideoLogo(logo);
    setIsModalPlaying(true);
    // User requested: do not restart video from 0:00, let it play from the middle
  };

  const handleModalLoadedMetadata = () => {
    if (modalVideoRef.current) {
      const dur = modalVideoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        setModalDuration(dur);
        // Start from the middle as requested by the user
        const midPoint = dur / 2;
        modalVideoRef.current.currentTime = midPoint;
        setModalCurrentTime(midPoint);
      }
    }
  };

  // Modal Custom Player Handlers (Prevents browser default menu and right-click downloading)
  const toggleModalPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play().catch(() => {});
        setIsModalPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsModalPlaying(false);
      }
    }
  };

  const handleModalTimeUpdate = () => {
    if (modalVideoRef.current) {
      setModalCurrentTime(modalVideoRef.current.currentTime);
      if (modalVideoRef.current.duration && !isNaN(modalVideoRef.current.duration)) {
        setModalDuration(modalVideoRef.current.duration);
      }
    }
  };

  const handleModalSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (modalVideoRef.current) {
      modalVideoRef.current.currentTime = time;
      setModalCurrentTime(time);
    }
  };

  const toggleModalMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isModalMuted;
      setIsModalMuted(!isModalMuted);
    }
  };

  const toggleModalFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen().catch(() => {});
      setIsModalFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsModalFullscreen(false);
    }
  };

  const formatVideoTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section id="logos" className="relative my-8 lg:my-14 px-4 sm:px-8 lg:px-12 select-none group">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <motion.span 
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px] shadow drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]"
            >
              N
            </motion.span>
            <span className="text-[#E50914] font-mono text-xs font-bold tracking-wider uppercase drop-shadow-[0_0_3px_rgba(229,9,20,0.5)]">
              STUDIO 3D MOTION GRAPHICS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide flex flex-wrap items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-100 via-red-500 to-[#E50914] animate-pulse drop-shadow-md">
              3D LOGOS • 4 Lines Down Video Showcase
            </span>
            <motion.span 
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(229,9,20,0)", "0px 0px 10px rgba(229,9,20,0.8)", "0px 0px 0px rgba(229,9,20,0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs bg-[#E50914] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase"
            >
              {filteredLogos.length} 3D Models • 480p Quality • All 18,000 UGX
            </motion.span>
            <span className="text-[11px] bg-zinc-900 border border-zinc-700/80 text-zinc-300 px-2 py-0.5 rounded flex items-center gap-1.5 font-mono">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded text-[10px] border border-emerald-500/30">480p</span>
              <Lock className="w-3 h-3 text-[#E50914]" />
              DOWNLOAD PROTECTED
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl opacity-80">
            Displayed in <strong className="text-white font-semibold">4 lines down per column</strong> in fast-loading <strong className="text-white">480p Quality</strong>. Watch & preview 3D animation styles. (Direct downloading disabled for copyright protection — order your custom unwatermarked 3D logo for <strong className="text-[#46d369] font-bold">18,000 UGX</strong> on WhatsApp).
          </p>
        </motion.div>

        {/* View Mode Switcher & Direct Studio WhatsApp */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch to Dedicated 3D LOGOS REVEAL Room */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('app:switch-view', { detail: 'logos-reveal' }))}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Open dedicated 3D LOGOS REVEAL chamber"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open 3D LOGOS REVEAL Room</span>
          </button>

          {/* View Mode Switcher */}
          <div className="bg-zinc-900 border border-zinc-700/80 rounded-lg p-1 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('four-rows')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'four-rows'
                  ? 'bg-[#E50914] text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="4 Lines Down Scroll"
            >
              <Columns4 className="w-3.5 h-3.5" />
              <span>4 Lines Down</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#E50914] text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Full Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('single-row')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'single-row'
                  ? 'bg-[#E50914] text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Single Row Carousel"
            >
              <GalleryHorizontal className="w-3.5 h-3.5" />
              <span>Single Row</span>
            </button>
          </div>

          <a
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20want%20to%20order%20a%203D%20Animated%20Logo%20for%2018,000%20UGX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded bg-zinc-800 hover:bg-[#E50914] text-white text-xs font-bold transition-all border border-zinc-700 hover:border-[#E50914] cursor-pointer shrink-0"
          >
            <Film className="w-3.5 h-3.5" />
            <span>All 3D Logos: 18,000 UGX</span>
          </a>
        </div>
      </div>

      {/* Filter and Quick Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          {['All', 'Gold & Metallic', 'Neon & Electric', 'Sparks & Pyro', '3D Extrusion', 'Cybernetic & Sci-Fi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-white text-black border-white font-bold shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search 3D video logos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-8 pr-8 py-1 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E50914]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* FEATURED CENTER STAGE 3D VIDEO PLAYER (PLAYS DIRECTLY IN THE MIDDLE - ZERO SCROLL JUMP) */}
      {showCenterPlayer && activeLogo && (
        <div
          ref={centerPlayerRef}
          className="mb-8 rounded-xl overflow-hidden border border-zinc-700 bg-gradient-to-b from-[#181818] via-[#141414] to-[#101010] shadow-[0_15px_45px_rgba(0,0,0,0.85)] relative"
        >
          {/* Top Bar for Center Player */}
          <div className="px-4 py-2.5 bg-black/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-4.5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[9px] shadow">
                N
              </span>
              <span className="text-[#E50914] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                PLAYING FROM THE MIDDLE • 3D LOGO CINEMA PREVIEW
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                480p Quality
              </span>
              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#E50914]" />
                Download Protected
              </span>
            </div>
          </div>

          {/* Main Video Cinema Screen */}
          <div
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="relative aspect-video max-h-[460px] w-full bg-black flex items-center justify-center select-none overflow-hidden group/centerplayer cursor-pointer"
            onClick={toggleActivePlay}
          >
            <video
              ref={activeVideoRef}
              src={getOptimizedMediaUrl(activeLogo?.videoUrl || LOGO_ITEMS_DATA[0]?.videoUrl, 'video')}
              poster={getCloudinaryPoster(activeLogo?.videoUrl || LOGO_ITEMS_DATA[0]?.videoUrl || '')}
              autoPlay={shouldAutoplay}
              preload={preloadStrategy}
              loop
              playsInline
              muted={isActiveMuted}
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload noplaybackrate nofullscreen"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onTimeUpdate={handleActiveTimeUpdate}
              onLoadedMetadata={handleActiveLoadedMetadata}
              onPlay={() => setIsActivePlaying(true)}
              onPause={() => setIsActivePlaying(false)}
              className="w-full h-full object-contain"
            />

            {/* Subtle Anti-Download Watermark Banner */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10 text-[10px] font-mono">
              <span className="text-emerald-400 font-bold">{isDataSaver ? 'Eco 360p Data Saver' : '480p 60FPS'}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 truncate max-w-[180px] sm:max-w-none">{activeLogo.title}</span>
            </div>

            {/* Diagonal Protection Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
              <span className="text-white text-sm sm:text-lg font-black tracking-widest uppercase rotate-[-10deg] select-none border border-white/20 px-4 py-1.5 rounded">
                DJ EMMA PRO • 480P PREVIEW • COPYRIGHT PROTECTED
              </span>
            </div>

            {/* Center Play Button Overlay when paused */}
            {!isActivePlaying && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] cursor-pointer z-20"
                onClick={toggleActivePlay}
              >
                <div 
                  className="w-16 h-16 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.8)] hover:scale-110 active:scale-95 transition-transform mb-2.5"
                  title="Play 3D Logo"
                >
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                {isDataSaver && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400 shadow-lg">
                    <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                    <span>Tap to Play 3D Logo (Data Saver Active)</span>
                  </div>
                )}
              </div>
            )}

            {/* Floating Quick Mute Button */}
            <button
              type="button"
              onClick={toggleActiveMute}
              className="absolute bottom-14 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm border border-white/10 cursor-pointer transition-all hover:scale-105"
              title={isActiveMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isActiveMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Bottom Scrubber & Controls Bar */}
            <div
              className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2.5 pt-6 flex flex-col gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={activeDuration || 100}
                step={0.1}
                value={activeCurrentTime}
                onChange={handleActiveSeek}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleActivePlay}
                    className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
                    title={isActivePlaying ? 'Pause' : 'Play'}
                  >
                    {isActivePlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleActiveMute}
                    className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
                    title={isActiveMuted ? 'Unmute' : 'Mute'}
                  >
                    {isActiveMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <span className="font-mono text-[10px] text-zinc-300">
                    {formatVideoTime(activeCurrentTime)} / {formatVideoTime(activeDuration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#46d369] font-bold">
                    {activeLogo.priceUgx}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleOpenVideoModal(activeLogo, e)}
                    className="p-1 rounded hover:bg-white/20 text-white cursor-pointer flex items-center gap-1 text-[10px]"
                    title="Expand to Fullscreen Theater Modal"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Theater</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Under-Video Details & Quick Order Row */}
          <div className="p-3 sm:p-4 bg-zinc-900/90 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  {activeLogo.category}
                </span>
                <span className="text-[10px] font-bold text-[#46d369] bg-green-500/10 px-2 py-0.2 rounded border border-green-500/20 font-mono">
                  {activeLogo.priceUgx} ({activeLogo.priceUsd})
                </span>
                <span className="text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.2 rounded">
                  {activeLogo.resolution}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {activeLogo.title}
              </h3>
              <p className="text-xs text-zinc-300 line-clamp-1">
                {activeLogo.style} • Transparent Alpha Channel (.MOV / .MP4)
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleDirectWhatsAppOrder(activeLogo)}
                className="py-2 px-3.5 sm:px-4 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#E50914]/30 cursor-pointer transition-all whitespace-nowrap"
                title="Order this 3D Logo on WhatsApp for 18,000 UGX"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>ORDER ON WHATSAPP ({activeLogo.priceUgx})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderModalLogo(activeLogo);
                  setLogoText('');
                  setSpecialInstructions('');
                }}
                className="py-2 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 cursor-pointer transition-colors whitespace-nowrap"
                title="Customize with your DJ name"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize DJ Name</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('app:open-google-search', {
                      detail: { query: `${activeLogo.title} 3D Logo Reveal DJ Emma` }
                    })
                  );
                }}
                className="py-2 px-2.5 rounded bg-[#1c1c24] hover:bg-[#252532] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer transition-colors whitespace-nowrap"
                title="Search this 3D logo reveal on Google"
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
          </div>
        </div>
      )}

      {/* RENDER VIEW 1: 4 LINES DOWN PER COLUMN (DEFAULT) */}
      {viewMode === 'four-rows' && (
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-r cursor-pointer backdrop-blur-xs shadow-lg"
              title="Scroll Left"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <div
            ref={rowRef}
            onScroll={checkScrollPosition}
            className="grid grid-rows-4 grid-flow-col auto-cols-[310px] sm:auto-cols-[380px] md:auto-cols-[430px] lg:auto-cols-[460px] gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2"
          >
            {filteredLogos.map((logo) => {
              const isHovered = hoveredLogoId === logo.id;
              const isCurrentActive = activeLogo?.id === logo.id;

              return (
                <div
                  key={logo.id}
                  onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                  onMouseEnter={() => setHoveredLogoId(logo.id)}
                  onMouseLeave={() => setHoveredLogoId(null)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`group/card relative flex items-center justify-between gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    isCurrentActive
                      ? 'bg-[#222222] border-2 border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.35)]'
                      : 'bg-[#181818] hover:bg-[#202020] border border-white/10 hover:border-[#E50914] hover:shadow-xl'
                  }`}
                >
                  {/* Left: Compact Video Preview Thumbnail */}
                  <div className="relative w-24 h-16 sm:w-28 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-black border border-white/10 select-none">
                    {isDataSaver && !isHovered && !isCurrentActive ? (
                      <img
                        src={getCloudinaryPoster(logo?.videoUrl || '')}
                        alt={logo?.title || '3D Logo'}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300 pointer-events-none select-none"
                      />
                    ) : (
                      <video
                        src={ensure480pUrl(logo?.videoUrl || '')}
                        muted
                        loop
                        playsInline
                        preload="none"
                        disablePictureInPicture
                        disableRemotePlayback
                        controlsList="nodownload noplaybackrate nofullscreen"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        ref={(el) => {
                          if (el) {
                            if (isHovered || isCurrentActive) {
                              el.play().catch(() => {});
                            } else {
                              el.pause();
                              el.currentTime = 0;
                            }
                          }
                        }}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300 pointer-events-none select-none"
                      />
                    )}

                    {/* Netflix Red N Badge */}
                    <span className="absolute top-1 left-1 w-3.5 h-4 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[8px] shadow z-10">
                      N
                    </span>

                    {/* Play/Watch Button Overlay (Plays in center stage) */}
                    <button
                      type="button"
                      onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                      title="Play 3D Logo from the Middle"
                      className="absolute inset-0 m-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110 z-10"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>

                    {/* Bottom Resolution Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/85 text-[8px] font-mono text-emerald-400 font-bold text-center py-0.5 border-t border-white/10">
                      480p • 60 FPS
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider truncate">
                        {logo.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#46d369] bg-green-500/10 px-1.5 py-0.2 rounded border border-green-500/20 whitespace-nowrap">
                        {logo.priceUgx}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-xs sm:text-sm truncate leading-tight mb-0.5" title={logo.title}>
                      {logo.title}
                    </h3>

                    <p className="text-[11px] text-zinc-300 line-clamp-1 mb-1" title={logo.style}>
                      {logo.style}
                    </p>

                    <div className="flex items-center gap-1">
                      {isCurrentActive ? (
                        <span className="text-[8px] bg-[#E50914] text-white font-bold px-1.5 py-0.2 rounded uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          PLAYING IN CENTER
                        </span>
                      ) : (
                        <span className="text-[9px] text-[#46d369] font-semibold">
                          {logo.matchScore}% Match
                        </span>
                      )}
                      <span className="text-[9px] text-zinc-400 bg-white/5 px-1 rounded truncate hidden sm:inline">
                        {Array.isArray(logo.tags) && logo.tags[0] ? logo.tags[0] : '3D Logo'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex-shrink-0 flex items-center gap-1 sm:gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* Direct WhatsApp Order Button */}
                    <button
                      type="button"
                      onClick={() => handleDirectWhatsAppOrder(logo)}
                      className="py-1.5 px-2.5 sm:px-3 rounded bg-[#E50914] hover:bg-[#b80710] active:scale-95 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-[#E50914]/25 transition-all cursor-pointer whitespace-nowrap"
                      title="Order this 3D Logo on WhatsApp for 18,000 UGX"
                    >
                      <MessageSquare className="w-3 h-3 fill-current" />
                      <span>ORDER</span>
                    </button>

                    {/* Play in Middle Stage */}
                    <button
                      type="button"
                      onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                      title="Play in Middle Player"
                      className="p-1.5 sm:p-2 rounded bg-white hover:bg-white/80 text-black transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </button>

                    {/* Fullscreen Theater Modal */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenVideoModal(logo, e)}
                      title="Expand to Fullscreen Theater"
                      className="p-1.5 sm:p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>

                    {/* Customize Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setOrderModalLogo(logo);
                        setLogoText('');
                        setSpecialInstructions('');
                      }}
                      title="Customize with your DJ name"
                      className="p-1.5 sm:p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-l cursor-pointer backdrop-blur-xs shadow-lg"
              title="Scroll Right"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}

      {/* RENDER VIEW 2: MULTI-COLUMN FULL GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-2">
          {filteredLogos.map((logo) => {
            const isHovered = hoveredLogoId === logo.id;
            const isCurrentActive = activeLogo?.id === logo.id;

            return (
              <div
                key={logo.id}
                onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                onMouseEnter={() => setHoveredLogoId(logo.id)}
                onMouseLeave={() => setHoveredLogoId(null)}
                onContextMenu={(e) => e.preventDefault()}
                className={`group/card relative flex items-center justify-between gap-3 p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  isCurrentActive
                    ? 'bg-[#222222] border-2 border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.35)]'
                    : 'bg-[#181818] hover:bg-[#202020] border border-white/10 hover:border-[#E50914] shadow-md'
                }`}
              >
                <div className="relative w-24 h-16 sm:w-28 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-black border border-white/10 select-none">
                  {isDataSaver && !isHovered && !isCurrentActive ? (
                    <img
                      src={getCloudinaryPoster(logo?.videoUrl || '')}
                      alt={logo?.title || '3D Logo'}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  ) : (
                    <video
                      src={ensure480pUrl(logo?.videoUrl || '')}
                      muted
                      loop
                      playsInline
                      preload="none"
                      disablePictureInPicture
                      disableRemotePlayback
                      controlsList="nodownload noplaybackrate nofullscreen"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      ref={(el) => {
                        if (el) {
                          if (isHovered || isCurrentActive) {
                            el.play().catch(() => {});
                          } else {
                            el.pause();
                            el.currentTime = 0;
                          }
                        }
                      }}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                    title="Play 3D Logo from the Middle"
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center cursor-pointer shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono text-[#46d369] font-bold block mb-0.5">
                    {logo.priceUgx}
                  </span>
                  <h3 className="font-bold text-white text-xs truncate mb-0.5" title={logo.title}>
                    {logo.title}
                  </h3>
                  <p className="text-[10px] text-zinc-300 line-clamp-1 mb-1">
                    {logo.style}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-zinc-400 bg-white/5 px-1.5 py-0.2 rounded font-mono">
                      {logo.resolution}
                    </span>
                    {isCurrentActive && (
                      <span className="text-[8px] bg-[#E50914] text-white font-bold px-1 rounded uppercase">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleDirectWhatsAppOrder(logo)}
                    className="py-1.5 px-2.5 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 fill-current" />
                    <span>ORDER</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                    className="py-1 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RENDER VIEW 3: CLASSIC SINGLE ROW CAROUSEL */}
      {viewMode === 'single-row' && (
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-r cursor-pointer backdrop-blur-xs shadow-lg"
              title="Scroll Left"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <div
            ref={rowRef}
            onScroll={checkScrollPosition}
            className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-4"
          >
            {filteredLogos.map((logo) => {
              const isHovered = hoveredLogoId === logo.id;
              const isCurrentActive = activeLogo?.id === logo.id;

              return (
                <div
                  key={logo.id}
                  onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                  onMouseEnter={() => setHoveredLogoId(logo.id)}
                  onMouseLeave={() => setHoveredLogoId(null)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`group/card relative flex-none w-[280px] sm:w-[340px] rounded-md overflow-hidden transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between shadow-xl cursor-pointer ${
                    isCurrentActive
                      ? 'bg-[#222222] border-2 border-[#E50914]'
                      : 'bg-[#181818] border border-white/10 hover:border-[#E50914]'
                  }`}
                >
                  {/* Top: Video Screen with Auto Play on Hover / Poster for Data Saver */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden select-none">
                    {isDataSaver && !isHovered && !isCurrentActive ? (
                      <img
                        src={getCloudinaryPoster(logo?.videoUrl || '')}
                        alt={logo?.title || '3D Logo'}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    ) : (
                      <video
                        src={ensure480pUrl(logo?.videoUrl || '')}
                        muted
                        loop
                        playsInline
                        preload="none"
                        disablePictureInPicture
                        disableRemotePlayback
                        controlsList="nodownload noplaybackrate nofullscreen"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        ref={(el) => {
                          if (el) {
                            if (isHovered || isCurrentActive) {
                              el.play().catch(() => {});
                            } else {
                              el.pause();
                              el.currentTime = 0;
                            }
                          }
                        }}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/60 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-2">
                      <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px] shadow">
                        N
                      </span>
                      <span className="bg-black/85 backdrop-blur-sm text-[#46d369] font-mono text-xs px-2 py-0.5 rounded font-bold border border-green-500/30 shadow">
                        {logo.priceUgx}
                      </span>
                    </div>

                    {/* Match Score Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="bg-black/85 backdrop-blur-sm text-[#46d369] font-bold text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">
                        {logo.matchScore}% Match
                      </span>
                    </div>

                    {/* Center Play Overlay for Playing from the Middle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                        title="Play in Middle Player"
                        className="w-14 h-14 rounded-full bg-white/90 hover:bg-white text-black hover:scale-110 flex items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-sm"
                      >
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </button>
                    </div>

                    {/* Bottom Resolution Bar */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-300 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                      <span className="text-zinc-200">{logo.resolution}</span>
                      <span className="text-[#E50914] font-bold">18,000 UGX</span>
                    </div>
                  </div>

                  {/* Card Information */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span className="uppercase tracking-wider">{logo.category}</span>
                        <span className="text-[#46d369] font-bold font-mono text-xs">{logo.priceUgx}</span>
                      </div>

                      <h3 className="font-bold text-white text-base truncate mb-1" title={logo.title}>
                        {logo.title}
                      </h3>

                      <p className="text-zinc-300 text-xs font-medium mb-3 line-clamp-1">
                        {logo.style}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {(Array.isArray(logo.tags) ? logo.tags : []).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Watch Video / Customize & Direct WhatsApp Order */}
                    <div className="space-y-2 pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleSelectAndPlayLogo(logo, e)}
                          className="flex-1 py-2 px-3 rounded bg-white hover:bg-white/80 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>PLAY IN CENTER</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOrderModalLogo(logo);
                            setLogoText('');
                            setSpecialInstructions('');
                          }}
                          title="Customize with your DJ name"
                          className="py-2 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDirectWhatsAppOrder(logo)}
                        className="w-full py-2.5 px-3 rounded bg-[#E50914] hover:bg-[#b80710] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E50914]/25 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>ORDER ON WHATSAPP ({logo.priceUgx})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-l cursor-pointer backdrop-blur-xs shadow-lg"
              title="Scroll Right"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}

      {/* Netflix Theater Video Modal for 3D Logo Inspection */}
      {modalVideoLogo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setModalVideoLogo(null)}
        >
          <div
            className="bg-[#181818] border border-zinc-700 rounded-xl max-w-3xl w-full overflow-hidden text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalVideoLogo(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-[#E50914] text-white flex items-center justify-center cursor-pointer transition-colors border border-white/20"
            >
              ✕
            </button>

            {/* Big Video Screen (Anti-Download Protected) */}
            <div
              ref={modalContainerRef}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="relative aspect-video w-full bg-black flex items-center justify-center select-none overflow-hidden group/player"
            >
              <video
                ref={modalVideoRef}
                src={ensure480pUrl(modalVideoLogo?.videoUrl || '')}
                poster={getCloudinaryPoster(modalVideoLogo?.videoUrl || '')}
                autoPlay
                preload={preloadStrategy}
                loop
                playsInline
                muted={isModalMuted}
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload noplaybackrate nofullscreen"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onTimeUpdate={handleModalTimeUpdate}
                onLoadedMetadata={handleModalLoadedMetadata}
                onPlay={() => setIsModalPlaying(true)}
                onPause={() => setIsModalPlaying(false)}
                onClick={toggleModalPlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Security Watermark Badge across the screen */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-white border border-white/10 text-[11px] font-mono shadow-lg">
                <span className="bg-[#E50914] text-white font-black px-1.5 py-0.2 rounded text-[10px]">480p</span>
                <span className="text-zinc-500">•</span>
                <Lock className="w-3.5 h-3.5 text-[#E50914]" />
                <span className="font-bold text-zinc-200">PREVIEW ONLY</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">NO DOWNLOAD</span>
              </div>

              {/* Diagonal Subtle Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <span className="text-white text-base sm:text-xl font-black tracking-widest uppercase rotate-[-12deg] select-none border border-white/30 px-5 py-2 rounded">
                  DJ EMMA PRO • 480P PREVIEW • NO DOWNLOAD
                </span>
              </div>

              {/* Big Center Play/Pause button on click or hover */}
              {!isModalPlaying && (
                <button
                  type="button"
                  onClick={toggleModalPlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/95 hover:bg-white text-black flex items-center justify-center cursor-pointer shadow-2xl z-20 hover:scale-110 transition-transform"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              )}

              {/* Custom Player Controls Bar (No Download Option) */}
              <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 pt-6 flex flex-col gap-2">
                {/* Progress Bar / Scrubber */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={modalDuration || 100}
                    step={0.1}
                    value={modalCurrentTime}
                    onChange={handleModalSeek}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      onClick={toggleModalPlay}
                      className="p-1.5 rounded hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title={isModalPlaying ? 'Pause' : 'Play'}
                    >
                      {isModalPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    {/* Mute/Volume Button */}
                    <button
                      type="button"
                      onClick={toggleModalMute}
                      className="p-1.5 rounded hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title={isModalMuted ? 'Unmute' : 'Mute'}
                    >
                      {isModalMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>

                    {/* Current Time / Duration */}
                    <span className="font-mono text-[11px] text-zinc-300">
                      {formatVideoTime(modalCurrentTime)} / {formatVideoTime(modalDuration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Explicit 480p Quality Badge */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
                      480p Quality
                    </span>

                    {/* Explicit No Download Indicator */}
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
                      <Lock className="w-3 h-3 text-[#E50914]" />
                      Download Disabled
                    </span>

                    {/* Fullscreen Button */}
                    <button
                      type="button"
                      onClick={toggleModalFullscreen}
                      className="p-1.5 rounded hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Details & Ordering Bar */}
            <div className="p-5 sm:p-6 bg-gradient-to-b from-[#181818] to-[#121212]">
              {/* Studio Protection Notice Banner */}
              <div className="mb-4 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#46d369] flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-zinc-300">
                  <strong className="text-white">Direct Download Disabled:</strong> To protect original 3D project assets, sample video files stream in 480p preview quality and cannot be downloaded directly. When you place an order for <strong className="text-[#46d369]">18,000 UGX</strong>, your customized master file with transparent alpha channel (.MOV ProRes & .MP4) will be rendered with your DJ name and sent directly to your WhatsApp.
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px]">
                      N
                    </span>
                    <span className="text-[#E50914] font-mono text-xs font-bold uppercase tracking-wider">
                      STUDIO 3D MOTION PREVIEW
                    </span>
                    <span className="text-[#46d369] font-bold text-xs font-mono ml-2">
                      {modalVideoLogo.matchScore}% Match
                    </span>
                  </div>
                  <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
                    {modalVideoLogo.title}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">{modalVideoLogo.style}</p>
                </div>

                {/* Price Display */}
                <div className="sm:text-right bg-zinc-900/90 border border-zinc-800 p-3 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block font-mono">OFFICIAL PRICE</span>
                  <span className="text-xl sm:text-2xl font-black text-[#46d369] font-mono block">
                    {modalVideoLogo.priceUgx}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">({modalVideoLogo.priceUsd})</span>
                </div>
              </div>

              {/* Tags & Delivery specs */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded">
                  {modalVideoLogo.resolution}
                </span>
                <span className="text-xs text-zinc-300 bg-white/5 px-2.5 py-1 rounded">
                  Transparent Alpha Channel (.MOV / .MP4)
                </span>
                <span className="text-xs text-zinc-300 bg-white/5 px-2.5 py-1 rounded">
                  Fast 24H WhatsApp Delivery
                </span>
              </div>

              {/* Order Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDirectWhatsAppOrder(modalVideoLogo);
                  }}
                  className="flex-1 py-3 px-5 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E50914]/30 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>ORDER THIS 3D ANIMATION ({modalVideoLogo.priceUgx})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = modalVideoLogo;
                    setModalVideoLogo(null);
                    setOrderModalLogo(target);
                  }}
                  className="py-3 px-5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  <span>CUSTOMIZE WITH MY DJ NAME</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('app:open-google-search', {
                        detail: { query: `${modalVideoLogo.title} 3D Logo Reveal DJ Emma` }
                      })
                    );
                  }}
                  className="py-3 px-4 rounded bg-[#1f1f28] hover:bg-[#282836] text-zinc-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/10 cursor-pointer transition-colors"
                  title="Search this 3D logo reveal on Google"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Check on Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Netflix Custom DJ Order Modal */}
      {orderModalLogo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setOrderModalLogo(null)}
        >
          <div
            className="bg-[#181818] border border-zinc-700 rounded-lg max-w-lg w-full p-6 text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOrderModalLogo(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px]">
                N
              </span>
              <span className="text-[#E50914] font-mono text-xs font-bold uppercase tracking-wider">
                CUSTOM 3D ANIMATION ORDER
              </span>
            </div>

            <h3 className="font-bebas text-3xl tracking-wide text-white">{orderModalLogo.title}</h3>
            <p className="text-xs text-zinc-400 mb-4">
              DJ Emma Pro FX will model, extrude, and animate your DJ or brand name in high definition 3D using this exact style. Delivered directly on WhatsApp within 24 hours.
            </p>

            <form onSubmit={handleCustomOrderSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Your DJ / Stage / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ BLAZE / MC SPARK / BOSS KAMPALA"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Exact Letters / Text to appear in 3D *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ BLAZE 256 (or send logo image on WhatsApp)"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Special FX / Color Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
                  placeholder="e.g. Gold & Fire theme, heavy sparks, or transparent background for LED walls"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Total Package:</span>
                  <span className="font-mono text-[#46d369] text-base font-bold">
                    {orderModalLogo.priceUgx} / {orderModalLogo.priceUsd}
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-[#E50914]/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ORDER ON WHATSAPP NOW</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
