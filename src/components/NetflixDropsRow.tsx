import { useState, useRef, useEffect, FormEvent, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MessageSquare,
  Sliders,
  Send,
  Search,
  LayoutGrid,
  Columns4,
  GalleryHorizontal,
  X,
  Volume2,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio } from '../context/AudioContext';
import { useContent } from '../context/ContentContext';
import { VoiceDropItem, VOICE_DROPS_DATA } from '../data/voiceDropsData';
import { VoiceDropsRowSkeleton } from './NetflixSkeleton';
import AutoScrollCarousel from './AutoScrollCarousel';
import HeartLikeButton from './HeartLikeButton';

export type { VoiceDropItem };
export { VOICE_DROPS_DATA };

type ViewMode = 'four-rows' | 'grid' | 'single-row';

interface NetflixDropsRowProps {
  isLoading?: boolean;
}

export default function NetflixDropsRow({ isLoading = false }: NetflixDropsRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Layout view mode: defaults to 'single-row' (Smooth Auto-Scrolling Horizontal Content Carousel)
  const [viewMode, setViewMode] = useState<ViewMode>('single-row');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Playback state for voice drop samples
  const [activeDropId, setActiveDropId] = useState<string | null>(null);
  const [isPlayingDrop, setIsPlayingDrop] = useState(false);
  const [dropProgress, setDropProgress] = useState(0);
  const [dropDuration, setDropDuration] = useState(0);
  const [dropCurrentTime, setDropCurrentTime] = useState(0);

  // Audio element reference for voice drop previews
  const dropAudioRef = useRef<HTMLAudioElement | null>(null);

  // Modal ordering state
  const [activeOrderDrop, setActiveOrderDrop] = useState<VoiceDropItem | null>(null);
  const [djName, setDjName] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('Hype Club Vocalist (Heavy Stutters & Laser FX)');
  const [customScript, setCustomScript] = useState('');

  const { pauseTrack } = useAudio();
  const { voiceDrops } = useContent();

  // Initialize audio player
  useEffect(() => {
    const audio = new Audio();
    dropAudioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDropCurrentTime(audio.currentTime);
        setDropDuration(audio.duration);
        setDropProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlayingDrop(false);
      setDropProgress(0);
      setDropCurrentTime(0);
      setActiveDropId(null);
    };

    const handleError = () => {
      setIsPlayingDrop(false);
      setActiveDropId(null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Filtered voice drops based on search query and category
  const filteredDrops = useMemo(() => {
    if (!Array.isArray(voiceDrops)) return [];
    return voiceDrops.filter((drop) => {
      if (!drop) return false;
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch =
        q === '' ||
        Boolean(drop.title && typeof drop.title === 'string' && drop.title.toLowerCase().includes(q)) ||
        Boolean(drop.style && typeof drop.style === 'string' && drop.style.toLowerCase().includes(q)) ||
        Boolean(drop.category && typeof drop.category === 'string' && drop.category.toLowerCase().includes(q)) ||
        (Array.isArray(drop.tags) && drop.tags.some((t) => t && typeof t === 'string' && t.toLowerCase().includes(q)));

      const matchesCat =
        selectedCategory === 'All' ||
        (selectedCategory === 'Boss Edition' && Boolean(drop.title && typeof drop.title === 'string' && drop.title.includes('BOSS'))) ||
        (selectedCategory === 'Club Hype' && Boolean((drop.category && typeof drop.category === 'string' && (drop.category.includes('Hype') || drop.category.includes('Club'))))) ||
        (selectedCategory === 'Soundclash' && Boolean((drop.category && typeof drop.category === 'string' && drop.category.includes('Soundclash')) || (drop.title && typeof drop.title === 'string' && (drop.title.includes('RIFLE') || drop.title.includes('HORN') || drop.title.includes('BULL'))))) ||
        (selectedCategory === 'Dancehall' && Boolean((drop.category && typeof drop.category === 'string' && (drop.category.includes('Dancehall') || drop.category.includes('Dubplate'))) || (drop.style && typeof drop.style === 'string' && drop.style.includes('Jamaican'))));

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory, voiceDrops]);

  if (isLoading) {
    return <VoiceDropsRowSkeleton />;
  }

  // Synthetic DJ drop preview generator (fallback if remote MP3 is blocked or unavailable)
  const playSynthesizedVoiceDrop = (drop: VoiceDropItem) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        setActiveDropId(null);
        setIsPlayingDrop(false);
        return;
      }
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setActiveDropId(drop.id);
      setIsPlayingDrop(true);
      setDropProgress(10);
      setDropCurrentTime(0);
      setDropDuration(2.0);

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Energetic DJ sound FX sweep
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.7);
      osc.frequency.exponentialRampToValueAtTime(95, now + 1.5);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);

      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        setDropProgress(Math.min(100, (step / 18) * 100));
        setDropCurrentTime(step * 0.1);
        if (step >= 18) {
          clearInterval(interval);
          setIsPlayingDrop(false);
          setActiveDropId(null);
          setDropProgress(0);
          setDropCurrentTime(0);
          ctx.close().catch(() => {});
        }
      }, 100);
    } catch {
      setIsPlayingDrop(false);
      setActiveDropId(null);
    }
  };

  // Handle Play/Pause toggle on a drop
  const handleTogglePlay = (drop: VoiceDropItem) => {
    const audio = dropAudioRef.current;

    if (activeDropId === drop.id && isPlayingDrop) {
      if (audio) audio.pause();
      setIsPlayingDrop(false);
      setActiveDropId(null);
      return;
    }

    pauseTrack(); // Stop background mixtape

    const targetUrl = drop.audioUrl ? drop.audioUrl.trim() : '';

    if (!targetUrl || !audio) {
      playSynthesizedVoiceDrop(drop);
      return;
    }

    try {
      audio.pause();
      audio.src = targetUrl;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setActiveDropId(drop.id);
            setIsPlayingDrop(true);
          })
          .catch((err) => {
            console.warn('Remote drop audio preview blocked or unsupported, activating FX preview:', err);
            playSynthesizedVoiceDrop(drop);
          });
      }
    } catch (err) {
      console.warn('Audio player initialization fallback:', err);
      playSynthesizedVoiceDrop(drop);
    }
  };

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

  // Immediate WhatsApp Order for the specific drop
  const handleDirectWhatsAppOrder = (drop: VoiceDropItem) => {
    const priceFormatted = drop.priceUgx || ((drop as any).price ? `${(drop as any).price.toLocaleString()} UGX` : '10,000 UGX');
    const usdFormatted = drop.priceUsd || '$5 USD';
    const message = encodeURIComponent(
      `Hello DJ Emma Pro FX,\n\nI want to order a custom version of this voice drop from your Netflix Studio:\n\n*Drop Name:* ${drop.title}\n*Style:* ${drop.style || drop.category || 'Studio FX'}\n*Price:* ${priceFormatted} / ${usdFormatted}\n*Sample Audio URL:* ${drop.audioUrl}\n\nPlease let me know your turnaround time and payment info.`
    );
    window.open(`https://wa.me/256780527361?text=${message}`, '_blank');
  };

  // Custom modal form submit
  const handleCustomOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeOrderDrop) return;

    const priceFormatted = activeOrderDrop.priceUgx || ((activeOrderDrop as any).price ? `${(activeOrderDrop as any).price.toLocaleString()} UGX` : '10,000 UGX');
    const usdFormatted = activeOrderDrop.priceUsd || '$5 USD';
    const message = encodeURIComponent(
      `Hello DJ Emma Pro FX (Studio Voice Drop Order),\n\n*Sample Model:* ${activeOrderDrop.title}\n*My DJ / Stage Name:* ${djName || 'My DJ Name'}\n*Preferred Voice Style:* ${voiceStyle}\n*Custom Script / Words:* ${customScript || activeOrderDrop.sampleScript || activeOrderDrop.title}\n*Price:* ${priceFormatted} / ${usdFormatted}\n\nPlease master and send to this WhatsApp number.`
    );
    window.open(`https://wa.me/256780527361?text=${message}`, '_blank');
    setActiveOrderDrop(null);
  };

  return (
    <section id="drops" className="relative my-8 lg:my-14 px-4 sm:px-8 lg:px-12 select-none group">
      {/* Header */}
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
              STUDIO FX MASTER PACKS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide flex flex-wrap items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-100 via-red-500 to-[#E50914] animate-pulse drop-shadow-md">
              VOICE DROPS • Listen & Order on WhatsApp
            </span>
            <motion.span 
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(229,9,20,0)", "0px 0px 10px rgba(229,9,20,0.8)", "0px 0px 0px rgba(229,9,20,0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs bg-[#E50914] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase"
            >
              {filteredDrops.length} Real Samples
            </motion.span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl opacity-80">
            Displayed in <strong className="text-white font-semibold">4 lines down per column</strong>. Click <strong className="text-white">Play</strong> to preview any drop with FX stutters, then click <strong className="text-[#46d369]">Order</strong> to customize with your own DJ name on WhatsApp!
          </p>
        </motion.div>

        {/* View Layout Controls & WhatsApp Studio */}
        <div className="flex flex-wrap items-center gap-2">
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

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('app:open-custom-drop-form'))}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded bg-gradient-to-r from-[#E50914] to-purple-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
            title="Open Interactive Custom Voice Drop Request Form"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Request Custom Drop</span>
          </button>

          <a
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20want%20to%20order%20custom%20voice%20drops"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded bg-zinc-800 hover:bg-[#E50914] text-white text-xs font-bold transition-all border border-zinc-700 hover:border-[#E50914] cursor-pointer shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>Studio: +256 780 527 361</span>
          </a>
        </div>
      </div>

      {/* Filter and Quick Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          {['All', 'Boss Edition', 'Club Hype', 'Soundclash', 'Dancehall'].map((cat) => (
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
            placeholder="Search voice drops..."
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

      {/* RENDER VIEW: 4 LINES DOWN PER COLUMN (DEFAULT) */}
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
            className="grid grid-rows-4 grid-flow-col auto-cols-[300px] sm:auto-cols-[380px] md:auto-cols-[420px] lg:auto-cols-[450px] gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2"
          >
            {filteredDrops.map((drop) => {
              const isThisDropActive = activeDropId === drop.id && isPlayingDrop;

              return (
                <div
                  key={drop.id}
                  className={`group/card relative flex items-center justify-between gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-[#181818] hover:bg-[#202020] border transition-all duration-200 hover:shadow-xl ${
                    isThisDropActive
                      ? 'border-[#E50914] shadow-[0_0_16px_rgba(229,9,20,0.35)] bg-[#1e1314]'
                      : 'border-white/10 hover:border-zinc-600'
                  }`}
                >
                  {/* Left: Compact Square Thumbnail with Play Button */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-zinc-900">
                    <img
                      src={drop.thumbnail}
                      alt={drop.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/20 transition-colors" />

                    {/* Netflix Badge */}
                    <span className="absolute top-1 left-1 w-3.5 h-4 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[8px] shadow">
                      N
                    </span>

                    {/* Central Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePlay(drop)}
                      title={isThisDropActive ? 'Pause Drop Preview' : 'Play Drop Preview'}
                      className={`absolute inset-0 m-auto w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                        isThisDropActive
                          ? 'bg-[#E50914] text-white scale-105 shadow-[#E50914]/50'
                          : 'bg-white/95 hover:bg-white text-black hover:scale-110'
                      }`}
                    >
                      {isThisDropActive ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Live Equalizer Bounce when Playing */}
                    {isThisDropActive && (
                      <div className="absolute bottom-1 left-1 right-1 flex items-end justify-center gap-0.5 h-2 bg-black/60 rounded px-1">
                        <span className="w-0.5 bg-[#E50914] h-1.5 animate-bounce" />
                        <span className="w-0.5 bg-[#E50914] h-2 animate-pulse" />
                        <span className="w-0.5 bg-[#E50914] h-1 animate-bounce" />
                      </div>
                    )}

                    {/* Red Scrubber Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800">
                      <div
                        className="h-full bg-[#E50914] transition-all"
                        style={{
                          width: isThisDropActive ? `${dropProgress}%` : '0%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider truncate">
                        {drop.category || 'Voice Drop'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#46d369] bg-green-500/10 px-1.5 py-0.2 rounded border border-green-500/20 whitespace-nowrap">
                        {drop.priceUgx || ((drop as any).price ? `${(drop as any).price.toLocaleString()} UGX` : '10,000 UGX')}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-xs sm:text-sm truncate leading-tight mb-0.5" title={drop.title}>
                      {drop.title}
                    </h3>

                    <p className="text-[11px] text-zinc-400 italic line-clamp-1 mb-1">
                      {drop.sampleScript || `"${drop.title}" produced by DJ Emma Pro FX.`}
                    </p>

                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-zinc-400 bg-white/5 px-1.5 py-0.2 rounded">
                        {(drop.style || drop.category || 'Studio FX').split('&')[0].trim()}
                      </span>
                      <span className="text-[9px] text-[#46d369] font-semibold hidden sm:inline">
                        {drop.matchScore || 99}% Match
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex-shrink-0 flex items-center gap-1 sm:gap-1.5">
                    {/* Quick WhatsApp Order Button */}
                    <button
                      type="button"
                      onClick={() => handleDirectWhatsAppOrder(drop)}
                      className="py-1.5 px-2.5 sm:px-3 rounded bg-[#E50914] hover:bg-[#b80710] active:scale-95 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-[#E50914]/25 transition-all cursor-pointer whitespace-nowrap"
                      title="Order this voice drop on WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3 fill-current" />
                      <span>ORDER</span>
                    </button>

                    {/* Customize Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveOrderDrop(drop);
                        setCustomScript((drop.sampleScript || drop.title || '').replace(/^"|"$/g, ''));
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

      {/* RENDER VIEW: MULTI-COLUMN FULL GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-2">
          {filteredDrops.map((drop) => {
            const isThisDropActive = activeDropId === drop.id && isPlayingDrop;

            return (
              <div
                key={drop.id}
                className={`group/card relative flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#181818] hover:bg-[#202020] border transition-all duration-200 ${
                  isThisDropActive
                    ? 'border-[#E50914] shadow-[0_0_16px_rgba(229,9,20,0.35)] bg-[#1e1314]'
                    : 'border-white/10 hover:border-zinc-600'
                }`}
              >
                <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-zinc-900">
                  <img
                    src={drop.thumbnail}
                    alt={drop.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40" />

                  <button
                    type="button"
                    onClick={() => handleTogglePlay(drop)}
                    className={`absolute inset-0 m-auto w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isThisDropActive ? 'bg-[#E50914] text-white' : 'bg-white text-black'
                    }`}
                  >
                    {isThisDropActive ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono text-[#46d369] font-bold block mb-0.5">
                    {drop.priceUgx || ((drop as any).price ? `${(drop as any).price.toLocaleString()} UGX` : '10,000 UGX')}
                  </span>
                  <h3 className="font-bold text-white text-xs truncate mb-0.5" title={drop.title}>
                    {drop.title}
                  </h3>
                  <p className="text-[10px] text-zinc-400 italic line-clamp-1">
                    {drop.sampleScript || `"${drop.title}" produced by DJ Emma Pro FX.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDirectWhatsAppOrder(drop)}
                  className="py-1.5 px-2.5 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  <MessageSquare className="w-3 h-3 fill-current" />
                  <span>ORDER</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* RENDER VIEW: CLASSIC SINGLE ROW AUTO-SCROLL CAROUSEL */}
      {viewMode === 'single-row' && (
        <AutoScrollCarousel<VoiceDropItem>
          id="drops-auto-carousel"
          items={filteredDrops}
          getItemKey={(d) => d.id}
          speed={0.65}
          resumeDelay={2500}
          ariaLabel="DJ Voice Drops carousel"
          renderItem={(drop) => {
            const isThisDropActive = activeDropId === drop.id && isPlayingDrop;

            return (
              <div
                className={`group/card relative flex-none w-[270px] sm:w-[320px] bg-[#181818] rounded-md overflow-hidden border transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] touch-manipulation flex flex-col justify-between min-h-[320px] ${
                  isThisDropActive
                    ? 'border-[#E50914] shadow-[0_0_24px_rgba(229,9,20,0.5)] ring-1 ring-[#E50914] z-10'
                    : 'border-white/10 hover:border-zinc-500 hover:shadow-xl hover:z-20'
                }`}
              >
                <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={drop.thumbnail}
                    alt={drop.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/40 to-transparent" />

                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                    <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px]">
                      N
                    </span>
                    <span className="bg-black/80 backdrop-blur-sm text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-white/10">
                      {drop.priceUgx || ((drop as any).price ? `${(drop as any).price.toLocaleString()} UGX` : '10,000 UGX')}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
                    <HeartLikeButton trackId={drop.id} item={drop} type="drop" size="sm" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button
                      type="button"
                      onClick={() => handleTogglePlay(drop)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                        isThisDropActive
                          ? 'bg-[#E50914] text-white scale-110 shadow-[0_0_20px_rgba(229,9,20,0.8)]'
                          : 'bg-white/95 hover:bg-white text-black hover:scale-110'
                      }`}
                    >
                      {isThisDropActive ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-20">
                    <div
                      className="h-full bg-[#E50914] transition-all"
                      style={{
                        width: isThisDropActive ? `${dropProgress}%` : '0%'
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                      {drop.category || 'Voice Drop'}
                    </div>
                    <h3 className="font-bold text-white text-sm truncate mb-1" title={drop.title}>
                      {drop.title}
                    </h3>
                    <p className="text-zinc-400 text-xs italic line-clamp-2 mb-3">
                      {drop.sampleScript || `"${drop.title}" produced by DJ Emma Pro.`}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleDirectWhatsAppOrder(drop)}
                      className="w-full py-2 px-3 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>ORDER ON WHATSAPP ({drop.priceUgx || ((drop as any).price ? `${(drop as any).price.toLocaleString()} UGX` : '10,000 UGX')})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}

      {/* Netflix Order Modal for Custom DJ Drops */}
      {activeOrderDrop && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveOrderDrop(null)}
        >
          <div
            className="bg-[#181818] border border-zinc-700 rounded-lg max-w-lg w-full p-6 text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveOrderDrop(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px]">
                N
              </span>
              <span className="text-[#E50914] font-mono text-xs font-bold uppercase tracking-wider">
                STUDIO PRODUCTION STUDIO
              </span>
            </div>

            <h3 className="font-bebas text-3xl tracking-wide text-white">{activeOrderDrop.title}</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Order this drop customized with your exact DJ or stage name. DJ Emma Pro FX will master and deliver your drop directly via WhatsApp within 24 hours.
            </p>

            {/* Quick Play Sample inside modal */}
            <div className="mb-4 p-3 rounded bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleTogglePlay(activeOrderDrop)}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center cursor-pointer"
                >
                  {activeDropId === activeOrderDrop.id && isPlayingDrop ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <span className="text-xs font-bold text-white block">Preview Audio Sample</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{activeOrderDrop.style}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#46d369]">
                {activeOrderDrop.priceUgx}
              </span>
            </div>

            <form onSubmit={handleCustomOrderSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Your DJ / Stage Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ NOVA / MC BLAZE / BOSS KAMPALA"
                  value={djName}
                  onChange={(e) => setDjName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Voice Style & FX Energy
                </label>
                <select
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option>Hype Club Vocalist (Heavy Stutters & Laser FX)</option>
                  <option>Deep Cinematic Movie Trailer Voice</option>
                  <option>Sexy Female Vocalist (Smooth Echo Reverb)</option>
                  <option>Jamaican Dancehall Selector Style</option>
                  <option>Ateso / Eastern Uganda Cultural Hype</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Custom Script / Exact Words to Say
                </label>
                <textarea
                  rows={3}
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
                  placeholder="e.g. DJ [Your Name] on the mix! Straight fire for the party people!"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Total Package:</span>
                  <span className="font-mono text-white text-sm font-bold">
                    {activeOrderDrop.priceUgx} / {activeOrderDrop.priceUsd}
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
