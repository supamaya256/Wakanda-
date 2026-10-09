import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, 
  Send, Youtube, Sparkles, Film, ArrowLeft,
  Search, ShieldCheck, Star, Clock, Info, CheckCircle2,
  SkipForward, SkipBack, ListMusic, Tv, Lock, Unlock, ExternalLink,
  PictureInPicture2, LayoutDashboard, Columns, Split
} from 'lucide-react';
import { useContent, OFFICIAL_YOUTUBE_CHANNEL_URL } from '../context/ContentContext';
import { AtesoMovie, get320pVideoUrl, getMovieStreamUrl } from '../data/atesoMoviesData';
import TelegramAtesoBanner from './TelegramAtesoBanner';
import SoftwareDownloadSection from './SoftwareDownloadSection';
import YoutubeSubscribeUnlockModal from './YoutubeSubscribeUnlockModal';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { useDataSaver } from '../context/DataSaverContext';
import HdMediaSlideshow from './HdMediaSlideshow';
import { Zap } from 'lucide-react';

interface WatchAtesoMoviesPageProps {
  onBackToStore: () => void;
  onOpenStudioManager?: () => void;
  initialSelectedMovie?: AtesoMovie | null;
}

export default function WatchAtesoMoviesPage({ onBackToStore, onOpenStudioManager, initialSelectedMovie }: WatchAtesoMoviesPageProps) {
  const { atesoMovies, isYoutubeSubscribed, setYoutubeSubscribed } = useContent();
  const { isAdmin } = useAdminAuth();
  const { recordMoviePlayed } = useWatchHistory();
  const { isDataSaver, toggleDataSaver } = useDataSaver();
  const [selectedMovie, setSelectedMovie] = useState<AtesoMovie | null>(
    initialSelectedMovie || atesoMovies[0] || null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(!isDataSaver && isYoutubeSubscribed);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [screenMode, setScreenMode] = useState<'standard' | 'half'>('standard');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('all');
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);
  const [modalMovie, setModalMovie] = useState<AtesoMovie | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const telegramUrl = 'https://t.me/atesomoviesbox';

  // Ensure current selected movie is in sync if initialSelectedMovie changes
  useEffect(() => {
    if (initialSelectedMovie) {
      setSelectedMovie(initialSelectedMovie);
      if (isYoutubeSubscribed) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  }, [initialSelectedMovie, isYoutubeSubscribed]);

  // If selectedMovie changes, reload and handle autoplay if unlocked
  useEffect(() => {
    if (selectedMovie) {
      recordMoviePlayed(selectedMovie);
    }
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying && isYoutubeSubscribed) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Browser autoplay prevented, waiting for user interaction:', err);
            setIsPlaying(false);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [selectedMovie, isYoutubeSubscribed, recordMoviePlayed]);

  // Sync play/pause state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && isYoutubeSubscribed) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isYoutubeSubscribed]);

  // Time update handler
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Seek bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Next / Previous episode navigation
  const currentIndex = atesoMovies.findIndex(m => m.id === selectedMovie?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < atesoMovies.length - 1;

  const handleNextEpisode = () => {
    if (hasNext) {
      const nextMovie = atesoMovies[currentIndex + 1];
      setSelectedMovie(nextMovie);
      if (!isYoutubeSubscribed) {
        setIsPlaying(false);
        setModalMovie(nextMovie);
        setIsUnlockModalOpen(true);
      } else {
        setIsPlaying(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevEpisode = () => {
    if (hasPrev) {
      const prevMovie = atesoMovies[currentIndex - 1];
      setSelectedMovie(prevMovie);
      if (!isYoutubeSubscribed) {
        setIsPlaying(false);
        setModalMovie(prevMovie);
        setIsUnlockModalOpen(true);
      } else {
        setIsPlaying(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectMovie = (movie: AtesoMovie) => {
    setSelectedMovie(movie);
    if (!isYoutubeSubscribed) {
      setIsPlaying(false);
      setModalMovie(movie);
      setIsUnlockModalOpen(true);
    } else {
      setIsPlaying(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePlay = () => {
    if (!isYoutubeSubscribed) {
      setModalMovie(selectedMovie);
      setIsUnlockModalOpen(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      } else {
        playerContainerRef.current.requestFullscreen().catch(console.error);
      }
    }
  };

  const handlePiP = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error('Failed to enter/exit PIP:', error);
      }
    }
  };

  // Helper to categorize movies by their series
  const getMovieSeriesKey = (movie: AtesoMovie | null): string => {
    if (!movie) return 'other';
    const title = (movie.title || '').toLowerCase();
    const series = (movie.seriesTitle || '').toLowerCase();
    const id = (movie.id || '').toLowerCase();
    if (series.includes('ismart') || title.includes('ismart') || id.includes('ismart')) return 'ismart-shankar';
    if (series.includes('tiger') || title.includes('tiger and crane') || id.includes('tiger-and-crane')) return 'tiger-and-crane';
    if (id.startsWith('poison-break') || title.includes('poison break')) return 'poison-break';
    if (id.startsWith('movie-')) return 'classics';
    return 'other';
  };

  const currentSeriesKey = selectedMovie ? getMovieSeriesKey(selectedMovie) : 'poison-break';
  const currentSeriesMovies = (Array.isArray(atesoMovies) ? atesoMovies : []).filter(
    (m) => getMovieSeriesKey(m) === currentSeriesKey
  );

  const filteredMovies = (Array.isArray(atesoMovies) ? atesoMovies : []).filter((movie) => {
    if (!movie) return false;
    const seriesKey = getMovieSeriesKey(movie);
    if (selectedSeriesFilter !== 'all' && seriesKey !== selectedSeriesFilter) {
      return false;
    }
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      !q ||
      Boolean(movie.title && typeof movie.title === 'string' && movie.title.toLowerCase().includes(q)) ||
      Boolean(movie.vj && typeof movie.vj === 'string' && movie.vj.toLowerCase().includes(q)) ||
      Boolean(movie.description && typeof movie.description === 'string' && movie.description.toLowerCase().includes(q)) ||
      Boolean(movie.episodeNumber && `episode ${movie.episodeNumber}`.toLowerCase().includes(q)) ||
      Boolean(movie.partNumber && `part ${movie.partNumber}`.toLowerCase().includes(q));

    return matchesSearch;
  });

  const bgImageUrl = isDataSaver 
    ? 'https://res.cloudinary.com/hbyqk5y0/image/upload/f_auto,q_auto:low,w_640/v1790550689/file_00000000bda08211910e147fbb531635.png'
    : 'https://res.cloudinary.com/hbyqk5y0/image/upload/f_auto,q_auto:eco,w_1440/v1790550689/file_00000000bda08211910e147fbb531635.png';

  return (
    <div className="min-h-screen bg-[#0a0a0f]/40 text-white selection:bg-[#E50914] selection:text-white font-sans pb-20 select-none relative">
      {/* Background Image Layer (Transparent Glass Theme) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-80 filter brightness-95 contrast-110"
        style={{ backgroundImage: `url('${bgImageUrl}')` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 backdrop-blur-[0.5px]" />

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#E50914]" />
            <span>Back to Mixtapes</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-[#E50914] text-white font-black text-xs px-2 py-0.5 rounded tracking-wider">
              CINEMA
            </span>
            <h1 className="text-base sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>POISON BREAK</span>
              <span className="text-xs text-red-500 font-semibold uppercase tracking-wider hidden sm:inline">
                • All 9 Parts In-Site Player
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Data Saver Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleDataSaver}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border select-none ${
              isDataSaver
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 shadow-md'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
            }`}
            title="Toggle Data Saver (Saves ~85% mobile data)"
          >
            <Zap className={`w-3.5 h-3.5 ${isDataSaver ? 'text-emerald-400 fill-current animate-pulse' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline">DATA SAVER:</span>
            <span>{isDataSaver ? 'ON (LOW MB)' : 'OFF (HD)'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('app:switch-view', { detail: 'logos-reveal' }))}
            className="inline-flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded border border-red-500/30 transition-all cursor-pointer"
            title="Open 3D LOGOS REVEAL Room"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">3D Logos Reveal</span>
          </button>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0088cc] hover:bg-[#009bf0] text-white text-xs font-bold px-3 py-1.5 rounded transition-all"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
            <span>Telegram Channel</span>
          </a>

          <a
            href="#hd-slides-showcase"
            onClick={(e) => {
              const el = document.getElementById('hd-slides-showcase');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded border border-amber-500/30 transition-all cursor-pointer"
            title="View Official Full HD Slides"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>HD Slides</span>
          </a>

          <a
            href={OFFICIAL_YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-all"
          >
            <Youtube className="w-3.5 h-3.5 fill-white" />
            <span>YouTube</span>
          </a>

          {onOpenStudioManager && (
            <button
              type="button"
              onClick={onOpenStudioManager}
              className={`text-xs px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/50'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700'
              }`}
              title={isAdmin ? "Studio Admin Dashboard (Upload & Delete Mode)" : "Visitor Dashboard & Media Showcase"}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Dashboard</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Visitor Dashboard</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6">
        {/* Active Cinema Video Player Section */}
        {selectedMovie && (
          <section className="mb-8">
            {/* Playback Mode Control Bar (Half Screen & Full Screen) */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 bg-zinc-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-800 shadow-md">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#E50914]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">Screen Mode:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  screenMode === 'half' 
                    ? 'bg-[#E50914]/20 text-red-400 border border-red-500/30' 
                    : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {screenMode === 'half' ? '◨ Half Screen (50% Split View)' : '▭ Standard Widescreen'}
                </span>
                <span className="hidden md:inline text-zinc-500 text-xs">• Direct Stream (No Downloads)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScreenMode('standard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    screenMode === 'standard'
                      ? 'bg-[#E50914] text-white shadow-md shadow-red-900/40'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  title="Widescreen Cinema View"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Standard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScreenMode(prev => prev === 'half' ? 'standard' : 'half')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    screenMode === 'half'
                      ? 'bg-[#E50914] text-white shadow-md shadow-red-900/40 ring-1 ring-white/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  title="Play in Half Screen (50% width side-by-side with episodes)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>{screenMode === 'half' ? 'Exit Half Screen' : 'Half Screen (50%)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow"
                  title="Enter Full Screen View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </button>
              </div>
            </div>

            <div className={`transition-all duration-300 ${screenMode === 'half' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-start' : 'w-full'}`}>
              <div
                ref={playerContainerRef}
                className="relative w-full rounded-2xl overflow-hidden bg-black border-2 border-zinc-800 shadow-2xl group flex flex-col justify-between"
              >
                {/* HTML5 Video element - Plays directly on site without leaving in 320p quality */}
                <div className={`relative w-full flex items-center justify-center bg-black ${screenMode === 'half' ? 'aspect-video max-h-[55vh]' : 'aspect-video max-h-[72vh]'}`}>
                  {selectedMovie.youtubeId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedMovie.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                      title={selectedMovie.title}
                      className="w-full h-full border-0 aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={getMovieStreamUrl(selectedMovie)}
                      poster={selectedMovie.thumbnail}
                      preload={isDataSaver ? 'none' : 'metadata'}
                      className="w-full h-full object-contain"
                      playsInline
                      controls={false}
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        e.stopPropagation();
                        console.warn('Movie video playback handled:', e);
                      }}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => {
                        if (hasNext) {
                          handleNextEpisode();
                        } else {
                          setIsPlaying(false);
                        }
                      }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  )}

                  {/* Big Center Play Overlay when paused or Locked Screen if not subscribed */}
                  {!isYoutubeSubscribed ? (
                    <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-950/80 border-2 border-red-500/60 flex items-center justify-center mb-4 shadow-xl shadow-red-950/50">
                        <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-pulse" />
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-2">
                        <span>🔒 MOVIE LOCKED</span>
                        <span>•</span>
                        <span>PART {selectedMovie.partNumber || selectedMovie.episodeNumber || (currentIndex + 1)}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white max-w-lg mb-2">
                        Subscribe on YouTube to Unlock
                      </h2>

                      <p className="text-xs sm:text-sm text-zinc-300 max-w-md mb-6 leading-relaxed">
                        To watch this movie from Telegram and play on site, please subscribe to <strong className="text-white">DJ Emma Pro (@djemmapro7231)</strong> on YouTube first.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                        <button
                          onClick={() => {
                            setModalMovie(selectedMovie);
                            setIsUnlockModalOpen(true);
                          }}
                          className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-[#FF0000] hover:bg-red-600 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-red-900/40 transition-transform active:scale-95 cursor-pointer"
                        >
                          <Youtube className="w-5 h-5 fill-white" />
                          <span>SUBSCRIBE ON YOUTUBE</span>
                        </button>

                        <button
                          onClick={() => {
                            setModalMovie(selectedMovie);
                            setIsUnlockModalOpen(true);
                          }}
                          className="w-full sm:w-auto py-3 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>I Have Subscribed</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!selectedMovie.youtubeId && !isPlaying && (
                        <button
                          onClick={handleTogglePlay}
                          className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E50914]/90 hover:bg-[#E50914] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 z-20 cursor-pointer"
                          aria-label="Play Episode On Site"
                        >
                          <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-white translate-x-1" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Top Overlay Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      <span className={`w-2.5 h-2.5 rounded-full ${isYoutubeSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        {selectedMovie.youtubeId ? 'YOUTUBE STREAM' : isYoutubeSubscribed ? `PLAYING (${screenMode === 'half' ? 'HALF SCREEN' : '320p'})` : 'LOCKED'}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-xs font-bold text-zinc-200">
                        {selectedMovie.seriesTitle ? `${selectedMovie.seriesTitle.toUpperCase()} • PART ${selectedMovie.partNumber || selectedMovie.episodeNumber}` : `PART ${selectedMovie.partNumber || (currentIndex + 1)}`}
                      </span>
                    </div>

                    <span className="bg-[#E50914] text-white text-[11px] font-black uppercase px-2.5 py-1 rounded shadow">
                      {selectedMovie.vj}
                    </span>
                  </div>

                  {/* Bottom Custom Video Controls (for HTML5 video) */}
                  {!selectedMovie.youtubeId && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col gap-2 z-20">
                      {/* Progress scrubber bar */}
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-[11px] font-mono text-zinc-300 w-10 text-right">
                          {formatTime(currentTime)}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          step={0.1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="flex-1 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
                        />
                        <span className="text-[11px] font-mono text-zinc-400 w-12">
                          {selectedMovie.duration || formatTime(duration)}
                        </span>
                      </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Prev Episode */}
                        <button
                          onClick={handlePrevEpisode}
                          disabled={!hasPrev}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            hasPrev ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                          }`}
                          title="Previous Episode"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>

                        {/* Play / Pause */}
                        <button
                          onClick={handleTogglePlay}
                          className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow transition-transform active:scale-95 cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 fill-black" />
                          ) : (
                            <Play className="w-5 h-5 fill-black translate-x-0.5" />
                          )}
                        </button>

                        {/* Next Episode */}
                        <button
                          onClick={handleNextEpisode}
                          disabled={!hasNext}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            hasNext ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                          }`}
                          title="Next Episode"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>

                        <button
                          onClick={handleToggleMute}
                          className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <div className="hidden sm:block ml-2">
                          <h3 className="text-white font-black text-sm line-clamp-1">
                            {selectedMovie.title}
                          </h3>
                          <p className="text-zinc-400 text-xs">
                            {selectedMovie.vj} • {selectedMovie.duration} • {selectedMovie.quality}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Half Screen Button inside player controls */}
                        <button
                          type="button"
                          onClick={() => setScreenMode(prev => prev === 'half' ? 'standard' : 'half')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            screenMode === 'half'
                              ? 'bg-[#E50914] text-white shadow-md shadow-red-900/40 ring-1 ring-white/20'
                              : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                          }`}
                          title={screenMode === 'half' ? 'Switch to Full Cinema View' : 'Play Half Screen'}
                        >
                          <Columns className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{screenMode === 'half' ? 'Full Width' : 'Half Screen'}</span>
                        </button>

                        {/* Picture in Picture */}
                        <button
                          type="button"
                          onClick={handlePiP}
                          className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Picture in Picture"
                        >
                          <PictureInPicture2 className="w-4 h-4" />
                        </button>

                        {/* Full Screen */}
                        <button
                          type="button"
                          onClick={handleFullscreen}
                          className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>

                {/* Movie Synopsis Details Bar */}
                <div className="p-5 sm:p-7 bg-zinc-950 border-t border-zinc-800 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 text-xs">
                      <span className="bg-[#E50914] text-white font-black px-2 py-0.5 rounded text-[11px]">
                        {selectedMovie.seriesTitle ? `${selectedMovie.seriesTitle.toUpperCase()} • PART ${selectedMovie.partNumber || (currentIndex + 1)}` : `PART ${selectedMovie.partNumber || (currentIndex + 1)}`}
                      </span>
                      <span className="text-emerald-400 font-bold">{selectedMovie.matchScore}% Match</span>
                      <span className="text-zinc-400 font-mono">{selectedMovie.year}</span>
                      <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-[11px] text-zinc-300">
                        {selectedMovie.duration}
                      </span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 text-[11px]">
                        {selectedMovie.quality}
                      </span>
                      <span className="text-zinc-400">{selectedMovie.viewsCount}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                      {selectedMovie.title}
                    </h2>

                    <p className="mt-2 text-zinc-300 text-sm sm:text-base leading-relaxed">
                      {selectedMovie.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2.5 min-w-[220px]">
                    <p className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                      Telegram & YouTube Access
                    </p>
                    {isYoutubeSubscribed ? (
                      <a
                        href={selectedMovie.telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0099e6] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-98"
                      >
                        <Send className="w-4 h-4 fill-white" />
                        <span>Watch on Telegram</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setModalMovie(selectedMovie);
                          setIsUnlockModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-red-400" />
                        <span>Subscribe to Watch on Telegram</span>
                      </button>
                    )}

                    <a
                      href={OFFICIAL_YOUTUBE_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all"
                    >
                      <Youtube className="w-4 h-4 fill-white" />
                      <span>{isYoutubeSubscribed ? 'Subscribed @djemmapro7231 ✓' : 'Subscribe @djemmapro7231'}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Half Screen Companion Episode Selector & Details Panel */}
              {screenMode === 'half' && (
                <div className="bg-zinc-950/95 backdrop-blur-md rounded-2xl border-2 border-zinc-800 p-5 sm:p-6 flex flex-col justify-between shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Half Screen Mode Active
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleFullscreen}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Go Fullscreen</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setScreenMode('standard')}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Standard View
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        {selectedMovie.seriesTitle || selectedMovie.vj}
                      </span>
                      <span className="text-emerald-400 text-xs font-bold">{selectedMovie.quality}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {selectedMovie.title}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-2 line-clamp-3 leading-relaxed">
                      {selectedMovie.description}
                    </p>
                  </div>

                  {/* Half-Screen Quick Episode Selector */}
                  <div className="pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Quick Switch Episode:</span>
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {currentSeriesMovies.length} Episodes
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
                      {currentSeriesMovies.map((m, idx) => {
                        const isCur = m.id === selectedMovie.id;
                        const ep = m.partNumber || m.episodeNumber || (idx + 1);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectMovie(m)}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center border text-center transition-all cursor-pointer ${
                              isCur
                                ? 'bg-[#E50914] text-white border-red-500 shadow-lg scale-105'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                            }`}
                          >
                            <span className="text-[8px] uppercase font-bold opacity-75">PART</span>
                            <span className="text-base font-black">{ep < 10 ? `0${ep}` : ep}</span>
                            <span className="text-[9px] font-mono opacity-60 mt-0.5">{m.duration}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Quick Episode Selection Strip with Series Navigation */}
        <section className="mb-10 bg-zinc-900/80 p-4 sm:p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#E50914]" />
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                {currentSeriesKey === 'ismart-shankar'
                  ? '⚡ iSMART SHANKAR SERIES • Episodes 1 to 4 (VJ Opolot)'
                  : currentSeriesKey === 'tiger-and-crane'
                  ? '🐉 TIGER & CRANE SERIES • Episodes 5 to 12 (VJ Opolot)'
                  : currentSeriesKey === 'poison-break'
                  ? '⛓️ POISON BREAK SERIES • Episodes 1 to 9 (VJ Emma Pro FX)'
                  : '🎬 FEATURED ATESO TRANSLATED CINEMA'}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Switch quick series filter */}
              {[
                { id: 'ismart-shankar', label: 'iSmart Shankar (4)' },
                { id: 'tiger-and-crane', label: 'Tiger & Crane (8)' },
                { id: 'poison-break', label: 'Poison Break (9)' },
                { id: 'all', label: 'All Catalog' }
              ].map((tab) => {
                const isActive = (selectedSeriesFilter === tab.id) || (selectedSeriesFilter === 'all' && currentSeriesKey === tab.id);
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedSeriesFilter(tab.id);
                      if (tab.id !== 'all') {
                        const first = atesoMovies.find(m => getMovieSeriesKey(m) === tab.id);
                        if (first) setSelectedMovie(first);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E50914] text-white shadow-md'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
            {currentSeriesMovies.map((movie, idx) => {
              const epNum = movie.partNumber || movie.episodeNumber || (idx + 1);
              const isSelected = selectedMovie?.id === movie.id;

              return (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => handleSelectMovie(movie)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E50914] text-white border-red-500 shadow-xl shadow-red-900/50 scale-105 z-10'
                      : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {!isYoutubeSubscribed && (
                    <span className="absolute top-1.5 right-1.5">
                      <Lock className="w-2.5 h-2.5 text-red-400" />
                    </span>
                  )}
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-80">
                    PART
                  </span>
                  <span className="text-lg sm:text-xl font-black">
                    {epNum < 10 ? `0${epNum}` : epNum}
                  </span>
                  <span className="text-[9px] font-mono mt-0.5 opacity-75">
                    {movie.duration}
                  </span>
                  {isSelected && isPlaying && (
                    <span className="mt-1 flex items-center gap-1 text-[8px] font-black uppercase bg-black/40 px-1.5 py-0.5 rounded">
                      <Play className="w-2 h-2 fill-current" />
                      PLAYING
                    </span>
                  )}
                  {!isYoutubeSubscribed && (
                    <span className="mt-1 text-[8px] font-black uppercase text-red-400 flex items-center gap-0.5">
                      LOCKED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Telegram Promo Banner Component */}
        <TelegramAtesoBanner />

        {/* Section Header & Search Controls */}
        <div className="mt-10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E50914] font-bold">
              <Film className="w-4 h-4" />
              <span>Full Video Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ateso Translated Movies ({filteredMovies.length} Available)
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
              Select any poster below to start instant streaming on site in Half Screen or Full Screen!
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {[
                { id: 'all', label: `All Movies (${atesoMovies.length})` },
                { id: 'ismart-shankar', label: '⚡ iSmart Shankar (4)' },
                { id: 'tiger-and-crane', label: '🐉 Tiger & Crane (8)' },
                { id: 'poison-break', label: '⛓️ Poison Break (9)' },
                { id: 'classics', label: '🥋 Classic Cinema' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedSeriesFilter(chip.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedSeriesFilter === chip.id
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search movies, episodes, VJ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredMovies.map((movie, idx) => {
            const isCurrentlySelected = selectedMovie?.id === movie.id;
            const epNum = movie.partNumber || movie.episodeNumber || (idx + 1);

            return (
              <div
                key={movie.id}
                className={`group relative flex flex-col justify-between bg-zinc-900/90 hover:bg-zinc-900 rounded-xl overflow-hidden border transition-all duration-300 shadow-xl ${
                  isCurrentlySelected
                    ? 'border-[#E50914] ring-2 ring-[#E50914]/40'
                    : 'border-zinc-800 hover:border-zinc-700 hover:-translate-y-1'
                }`}
              >
                {/* Poster Image with Play Hover Overlay */}
                <div
                  className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
                  onClick={() => handleSelectMovie(movie)}
                >
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top Tags */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                      {movie.seriesTitle ? `${movie.seriesTitle.toUpperCase()} • PART ${epNum}` : `PART ${epNum}`}
                    </span>
                    <span className="bg-black/80 backdrop-blur-sm text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                      {movie.duration}
                    </span>
                  </div>

                  {/* Center Play Button Icon */}
                  <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#E50914]/90 group-hover:bg-[#E50914] text-white flex items-center justify-center shadow-xl opacity-90 group-hover:scale-110 transition-all">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>

                  {/* Bottom Overlay Title & Quality */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {movie.quality}
                      </span>
                      <span className="text-zinc-500 text-[10px]">•</span>
                      <span className="text-[10px] font-bold text-red-300 uppercase">
                        {movie.vj}
                      </span>
                    </div>
                    <h3 className="text-white font-extrabold text-sm sm:text-base line-clamp-1 drop-shadow">
                      {movie.title}
                    </h3>
                  </div>
                </div>

                {/* Movie Details Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-2">
                      <span className="font-mono text-zinc-300 font-bold">{movie.vj}</span>
                      <span className="text-zinc-400 truncate max-w-[140px]">{movie.genre}</span>
                      <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
                    </div>

                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
                      {movie.description}
                    </p>
                  </div>

                  {/* Actions Buttons (No download button, clean direct playback) */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectMovie(movie)}
                      className={`flex-1 flex items-center justify-center gap-1.5 font-extrabold text-xs py-2.5 px-3 rounded-lg shadow transition-all active:scale-95 cursor-pointer ${
                        !isYoutubeSubscribed
                          ? 'bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300'
                          : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      {!isYoutubeSubscribed ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-red-400" />
                          <span>Subscribe to Watch</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>{isCurrentlySelected && isPlaying ? 'Now Playing' : 'Play on Site'}</span>
                        </>
                      )}
                    </button>

                    {/* Half Screen Launch Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectMovie(movie);
                        setScreenMode('half');
                      }}
                      className="px-3 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      title="Play in Half Screen mode"
                    >
                      <Columns className="w-3.5 h-3.5 text-red-400" />
                      <span className="hidden sm:inline">Half Screen</span>
                    </button>

                    {isYoutubeSubscribed ? (
                      <a
                        href={movie.telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-[#0088cc] hover:bg-[#0099e6] text-white font-bold text-xs py-2.5 px-3 rounded-lg transition-all"
                        title="Telegram Discussion & Updates"
                      >
                        <Send className="w-3.5 h-3.5 fill-white" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setModalMovie(movie);
                          setIsUnlockModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs py-2.5 px-3 rounded-lg transition-all cursor-pointer"
                        title="Subscribe to unlock"
                      >
                        <Lock className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DJ Emma Official Full HD Cinema & Production Slideshow */}
        <div className="mt-12 mb-8">
          <HdMediaSlideshow 
            id="hd-slides-showcase"
            variant="cinema"
            title="DJ Emma Pro FX Cinema & Production Gallery"
            subtitle="Explore official full HD promotional photos, studio visuals, and motion teaser slides from the producer of Poison Break"
          />
        </div>

        {/* Software Download Section */}
        <div className="mt-16">
          <SoftwareDownloadSection />
        </div>

        {/* YouTube Subscribe Gate & Telegram Unlock Modal */}
        <YoutubeSubscribeUnlockModal
          isOpen={isUnlockModalOpen}
          onClose={() => setIsUnlockModalOpen(false)}
          movie={modalMovie || selectedMovie}
          onWatchOnSite={(movie) => {
            setIsUnlockModalOpen(false);
            setSelectedMovie(movie);
            setIsPlaying(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>
      </div>
    </div>
  );
}
