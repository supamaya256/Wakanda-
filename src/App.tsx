/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { AudioProvider, useAudio, AudioTrack } from './context/AudioContext';
import { ContentProvider } from './context/ContentContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useAdminAuth } from './context/AdminAuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataSaverProvider, useDataSaver } from './context/DataSaverContext';
import DataSaverQuickBar from './components/DataSaverQuickBar';
import AdminAuthModal from './components/AdminAuthModal';
import { AtesoMovie } from './data/atesoMoviesData';
import NetflixNavbar from './components/NetflixNavbar';
import NetflixBillboard from './components/NetflixBillboard';
import NetflixRow from './components/NetflixRow';
import NetflixTop10Row from './components/NetflixTop10Row';
import NetflixDropsRow from './components/NetflixDropsRow';
import NetflixLogosRow from './components/NetflixLogosRow';
import NetflixAtesoMoviesRow from './components/NetflixAtesoMoviesRow';
import TelegramAtesoBanner from './components/TelegramAtesoBanner';
import WatchAtesoMoviesPage from './components/WatchAtesoMoviesPage';
import NetflixClientPortal from './components/NetflixClientPortal';
import FeedbackWidget from './components/FeedbackWidget';
import NetflixModal from './components/NetflixModal';
import NewsletterSignup from './components/NewsletterSignup';
import NetflixFooter from './components/NetflixFooter';
import StudioManagerPage from './components/StudioManagerPage';
import LoginScreen from './components/LoginScreen';
import TrustProofModal from './components/TrustProofModal';
import TrustProofBanner from './components/TrustProofBanner';
import GlobalKeyboardController from './components/GlobalKeyboardController';
import SoftwareDownloadSection from './components/SoftwareDownloadSection';
import CommunityCommentsSection from './components/CommunityCommentsSection';
import AiStudioHubModal from './components/AiStudioHubModal';
import QuickAccessBar from './components/QuickAccessBar';
import MobileBottomNav from './components/MobileBottomNav';
import FeaturedVideoPremiere from './components/FeaturedVideoPremiere';
import ThreeDLogosRevealPage from './components/ThreeDLogosRevealPage';
import ThreeDLogosWelcomeHero from './components/ThreeDLogosWelcomeHero';
import TopStreetAnthemBanner from './components/TopStreetAnthemBanner';
import { WatchHistoryProvider } from './context/WatchHistoryContext';
import FloatingBackToTop from './components/FloatingBackToTop';
import ErrorBoundary from './components/ErrorBoundary';

function NetflixDashboard({ onOpenLogin }: { onOpenLogin: (mode?: 'signin' | 'signup') => void }) {
  const { t } = useLanguage();
  const { tracks, recentTracks, favoriteTracks } = useAudio();
  const { isAdmin } = useAdminAuth();

  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<AtesoMovie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [currentView, setCurrentView] = useState<'store' | 'manager' | 'movies' | 'logos-reveal'>('store');
  const [studioInitialTab, setStudioInitialTab] = useState<'dashboard' | 'tracks' | 'drops' | 'custom-drops' | 'logos' | 'movies' | 'files'>('dashboard');
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [isAiHubOpen, setIsAiHubOpen] = useState(false);

  // Perceived performance: realistic smooth skeleton loading while initial feeds hydrate
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    const handleOpenCustomDrop = () => {
      setStudioInitialTab('custom-drops');
      setCurrentView('manager');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('app:open-custom-drop-form', handleOpenCustomDrop);
    return () => window.removeEventListener('app:open-custom-drop-form', handleOpenCustomDrop);
  }, []);

  useEffect(() => {
    const handleSwitchView = (e: any) => {
      if (e.detail) {
        setCurrentView(e.detail);
      }
    };
    window.addEventListener('app:switch-view', handleSwitchView);
    return () => window.removeEventListener('app:switch-view', handleSwitchView);
  }, []);

  useEffect(() => {
    const handleEscape = () => {
      setSelectedTrack(null);
      setSelectedMovie(null);
      setIsTrustModalOpen(false);
      setIsAiHubOpen(false);
    };
    window.addEventListener('app:escape', handleEscape);
    return () => window.removeEventListener('app:escape', handleEscape);
  }, []);

  useEffect(() => {
    // Initial feed fetch / cache hydration simulation
    const timer = setTimeout(() => {
      setIsFeedLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectGenre = (genre: string) => {
    if (genre === selectedGenre) return;
    setIsFilterLoading(true);
    setSelectedGenre(genre);
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 380);
  };

  const handleRefreshFeed = () => {
    setIsFeedLoading(true);
    setTimeout(() => {
      setIsFeedLoading(false);
    }, 800);
  };

  // Automatically open shared track if specified in URL query params (e.g., ?track=2)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const trackParam = searchParams.get('track');
      if (trackParam && tracks.length > 0) {
        const matched = tracks.find(t => String(t.id) === String(trackParam));
        if (matched) {
          setSelectedTrack(matched);
        }
      }
    } catch {
      // URLSearchParams not supported or invalid
    }
  }, [tracks]);

  // Keep URL query in sync when modal opens or closes
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedTrack) {
        if (url.searchParams.get('track') !== String(selectedTrack.id)) {
          url.searchParams.set('track', String(selectedTrack.id));
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        if (url.searchParams.has('track')) {
          url.searchParams.delete('track');
          window.history.replaceState({}, '', url.pathname + (url.search ? url.search : '') + url.hash);
        }
      }
    } catch {
      // history or URL unavailable
    }
  }, [selectedTrack]);

  // Derive available genres dynamically from tracks, prepended with 'All'
  const availableGenres = ['All', 'Reggae', 'Ateso', 'Dancehall', 'Afrobeats', 'Video Mix'];

  let filteredTracks = Array.isArray(tracks) ? tracks : [];
  
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredTracks = filteredTracks.filter(
      t =>
        (t?.title && t.title.toLowerCase().includes(q)) ||
        (t?.artist && t.artist.toLowerCase().includes(q)) ||
        (Array.isArray(t?.genres) && t.genres.some(g => g && typeof g === 'string' && g.toLowerCase().includes(q)))
    );
  } else if (selectedGenre !== 'All') {
    const gFilter = selectedGenre.toLowerCase();
    filteredTracks = filteredTracks.filter(t => 
      (Array.isArray(t?.genres) && t.genres.some(g => g && typeof g === 'string' && g.toLowerCase().includes(gFilter))) ||
      (t?.title && t.title.toLowerCase().includes(gFilter))
    );
  }

  if (currentView === 'manager') {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <StudioManagerPage 
          onBackToStore={() => setCurrentView('store')} 
          initialTab={studioInitialTab}
        />
      </div>
    );
  }

  if (currentView === 'movies') {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white pb-20 md:pb-8">
        <DataSaverQuickBar 
          onOpenLogosReveal={() => {
            setCurrentView('logos-reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAtesoMovies={() => {
            setSelectedMovie(null);
            setCurrentView('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <WatchAtesoMoviesPage
          onBackToStore={() => {
            setSelectedMovie(null);
            setCurrentView('store');
          }}
          onOpenStudioManager={() => {
            setStudioInitialTab('dashboard');
            setCurrentView('manager');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          initialSelectedMovie={selectedMovie}
        />
        <MobileBottomNav
          onOpenAtesoMovies={() => {}}
          onOpenStudioManager={() => {
            setStudioInitialTab('dashboard');
            setCurrentView('manager');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLogosReveal={() => {
            setCurrentView('logos-reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLogin={onOpenLogin}
          currentView={currentView}
        />
      </div>
    );
  }

  if (currentView === 'logos-reveal') {
    return (
      <div className="min-h-screen bg-[#07070a] text-white pb-20 md:pb-8">
        <DataSaverQuickBar 
          onOpenLogosReveal={() => {
            setCurrentView('logos-reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAtesoMovies={() => {
            setSelectedMovie(null);
            setCurrentView('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <ThreeDLogosRevealPage
          onBackToStore={() => {
            setCurrentView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenStudioManager={() => {
            setStudioInitialTab('dashboard');
            setCurrentView('manager');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAtesoMovies={() => {
            setSelectedMovie(null);
            setCurrentView('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <MobileBottomNav
          onOpenAtesoMovies={() => {
            setSelectedMovie(null);
            setCurrentView('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenStudioManager={() => {
            setStudioInitialTab('dashboard');
            setCurrentView('manager');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLogosReveal={() => {
            setCurrentView('logos-reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLogin={onOpenLogin}
          currentView={currentView}
        />
      </div>
    );
  }

  const { isDataSaver } = useDataSaver();
  const bgImageUrl = isDataSaver 
    ? 'https://res.cloudinary.com/hbyqk5y0/image/upload/f_auto,q_auto:low,w_640/v1790550689/file_00000000bda08211910e147fbb531635.png'
    : 'https://res.cloudinary.com/hbyqk5y0/image/upload/f_auto,q_auto:eco,w_1440/v1790550689/file_00000000bda08211910e147fbb531635.png';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#0a0a0f]/40 text-white selection:bg-[#E50914] selection:text-white font-sans overflow-x-hidden pt-[36px] pb-28 sm:pb-24 relative"
    >
      {/* Background Image Layer (Transparent Glass Theme - DJ Emma Background Picture Clearly Visible) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-80 filter brightness-95 contrast-110 transition-opacity duration-700"
        style={{ backgroundImage: `url('${bgImageUrl}')` }}
      />
      {/* Subtle Transparent Glass Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 backdrop-blur-[0.5px]" />

      <div className="relative z-10">
        {/* Netflix Top Navigation Bar */}
        <NetflixNavbar
        onSearch={(query) => setSearchQuery(query)}
        onOpenPortal={() => {
          const el = document.getElementById('portal');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenStudioManager={() => {
          setStudioInitialTab('dashboard');
          setCurrentView('manager');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isStudioManager={false}
        onOpenAtesoMovies={() => {
          setSelectedMovie(null);
          setCurrentView('movies');
        }}
        isAtesoMovies={false}
        onOpenLogosReveal={() => {
          setCurrentView('logos-reveal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isLogosReveal={false}
        onOpenLogin={onOpenLogin}
        onOpenTrustModal={() => setIsTrustModalOpen(true)}
        onOpenAiHub={() => setIsAiHubOpen(true)}
      />

      {/* Easy Access & Data Saver Quick Bar */}
      <DataSaverQuickBar 
        onOpenLogosReveal={() => {
          setCurrentView('logos-reveal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAtesoMovies={() => {
          setSelectedMovie(null);
          setCurrentView('movies');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main>
        {/* TOP NONSTOP DISPLAY: STREET ANTHEM 90 FEATURED AT THE TOP */}
        {!searchQuery.trim() && (
          <TopStreetAnthemBanner onOpenModal={(track) => setSelectedTrack(track)} />
        )}

        {/* FIRST TO WELCOME VISITORS: 3D LOGO REVEAL HERO ON TOP OF BILLBOARD */}
        {!searchQuery.trim() && (
          <ThreeDLogosWelcomeHero
            onOpenLogosReveal={() => {
              setCurrentView('logos-reveal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Netflix Billboard (Hero Feature Title) */}
        <div id="billboard-section">
          <NetflixBillboard 
            onOpenModal={(track) => setSelectedTrack(track)} 
            onOpenTrustModal={() => setIsTrustModalOpen(true)}
            isLoading={isFeedLoading}
          />
        </div>

        {/* First in Dashboard: Direct Video Premiere Playable from Website */}
        {!searchQuery.trim() && (
          <FeaturedVideoPremiere 
            onOpenTrustModal={() => setIsTrustModalOpen(true)}
            onOpenAiHub={() => setIsAiHubOpen(true)}
          />
        )}

        {/* Quick Access Hub (Instant 1-Click Navigation) */}
        {!searchQuery.trim() && (
          <QuickAccessBar
            onOpenAtesoMovies={() => {
              setSelectedMovie(null);
              setCurrentView('movies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCustomDrops={() => {
              setStudioInitialTab('custom-drops');
              setCurrentView('manager');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLogosReveal={() => {
              setCurrentView('logos-reveal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAiHub={() => setIsAiHubOpen(true)}
          />
        )}



        {/* Search Results Row (Visible only when searching) */}
        {searchQuery.trim() && (
          <div className="pt-4">
            <NetflixRow
              id="search-results"
              title={`Search Results for "${searchQuery}"`}
              subtitle={`${filteredTracks.length} matches found`}
              tracks={filteredTracks}
              onOpenModal={(track) => setSelectedTrack(track)}
              isLoading={isFilterLoading}
            />
          </div>
        )}

        {/* Negative-margin container pulls the first row up over the billboard gradient just like Netflix! */}
        <motion.div 
          className="relative z-20 space-y-2 sm:space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.3 }
            }
          }}
        >
          {/* Genre Filters & Quick Category Switcher */}
          {!searchQuery.trim() && (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
              className="px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {availableGenres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleSelectGenre(genre)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                      selectedGenre === genre 
                        ? 'bg-white text-black shadow-lg shadow-white/10 scale-105' 
                        : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={handleRefreshFeed}
                  disabled={isFeedLoading}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-800/70 hover:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-700/60 cursor-pointer disabled:opacity-50"
                  title="Reload feeds & preview skeleton loading"
                >
                  <RefreshCw className={`w-3 h-3 ${isFeedLoading ? 'animate-spin text-[#E50914]' : ''}`} />
                  <span>{isFeedLoading ? 'Loading...' : 'Refresh'}</span>
                </button>
                
                <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{filteredTracks.length} Mixtapes Available</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================
              ACT 1: STREAMING THEATRE (Nonstop DJ Mixtapes & Top Shows)
             =================================================================== */}
          {/* My Favorites Row */}
          {favoriteTracks && favoriteTracks.length > 0 && !searchQuery.trim() && selectedGenre === 'All' && (
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
              <NetflixRow
                id="my-favorites"
                title="My Favorites"
                subtitle="Your saved mixes and favorite tracks"
                tracks={favoriteTracks}
                onOpenModal={(track) => setSelectedTrack(track)}
                isLoading={isFeedLoading || isFilterLoading}
              />
            </motion.div>
          )}

          {/* Recently Played */}
          {recentTracks && recentTracks.length > 0 && !searchQuery.trim() && selectedGenre === 'All' && (
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
              <NetflixRow
                id="recently-played"
                title="Recently Played"
                subtitle="Jump back into your recent tracks and mixes"
                tracks={recentTracks}
                onOpenModal={(track) => setSelectedTrack(track)}
                isLoading={isFeedLoading || isFilterLoading}
              />
            </motion.div>
          )}

          {/* Row 1: Trending Now • Video Nonstops & DJ Mixtapes */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <NetflixRow
              id="mixes"
              title={selectedGenre === 'All' ? t('row.trending') : `${selectedGenre} Mixtapes`}
              subtitle={selectedGenre === 'All' ? t('row.trendingSub') : `Browse our best ${selectedGenre} mixes`}
              tracks={filteredTracks}
              onOpenModal={(track) => setSelectedTrack(track)}
              isLoading={isFeedLoading || isFilterLoading}
            />
          </motion.div>



          {/* Row 2: Wakanda DJs Live Mixtapes & Battle Scratch */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <NetflixRow
              id="wakanda-battles"
              title="Wakanda DJs • Live Mixtapes & Battle Scratch"
              subtitle="High-Energy Turntablism, Street Anthems & Live MC Ricky Sessions"
              tracks={tracks.filter(t => 
                t.title.includes('WAKANDA') || 
                t.title.includes('STREET ANTHEM') || 
                t.title.includes('CHALLENGE SCRATCH') || 
                t.title.includes('LIVE MIXTAPE') || 
                t.title.includes('ALIEN SKIN') || 
                t.title.includes('CLUB BANGERS') ||
                t.title.includes('EPISODE')
              )}
              onOpenModal={(track) => setSelectedTrack(track)}
              isLoading={isFeedLoading || isFilterLoading}
            />
          </motion.div>

          {/* Row 3: Ateso Cultural & Gospel Video Nonstops */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <NetflixRow
              id="ateso-gospel-cultural"
              title="Ateso Cultural & Gospel Video Nonstops"
              subtitle="Authentic Teso Rhythms & Uplifting Gospel Praises by DJ Emma Pro"
              tracks={tracks.filter(t => 
                t.title.includes('ATESO') || 
                t.title.includes('GOSPEL') || 
                t.title.includes('ACHOLI')
              )}
              onOpenModal={(track) => setSelectedTrack(track)}
              isLoading={isFeedLoading || isFilterLoading}
            />
          </motion.div>

          {/* Row 4: Ugandan Hits, Dancehall & Reggae Vibes */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <NetflixRow
              id="reggae-afro"
              title="Ugandan Hits, Dancehall & Reggae Vibes"
              subtitle="East African Chart-Toppers & Smooth Transitions by DJ Emma Pro"
              tracks={tracks.filter(t => 
                t.title.includes('UGANDAN MUSIC') || 
                t.title.includes('DANCEHALL') || 
                t.title.includes('REGGEA') || 
                t.title.includes('VYROOTA') || 
                t.title.includes('SURPRISE') || 
                t.title.includes('NEW HITS')
              )}
              onOpenModal={(track) => setSelectedTrack(track)}
              isLoading={isFeedLoading || isFilterLoading}
            />
          </motion.div>

          {/* ===================================================================
              ACT 2: ATESO CINEMA & TRANSLATED MOVIES
             =================================================================== */}
          {/* Section Divider & Header */}
          <div className="pt-8 sm:pt-12 px-4 sm:px-8 lg:px-12">
            <div className="border-t border-zinc-800/80 pt-6 flex items-center justify-between">
              <div>
                <span className="bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded mr-2">
                  CINEMA
                </span>
                <span className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  Ateso Translated Series & Feature Films
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Poison Break Ateso Movies Row */}
          <motion.div id="ateso-movies-section" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <NetflixAtesoMoviesRow
              isLoading={isFeedLoading}
              onWatchMovie={(movie) => {
                setSelectedMovie(movie);
                setCurrentView('movies');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewAllMovies={() => {
                setSelectedMovie(null);
                setCurrentView('movies');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>

          {/* Telegram Channel VIP Ad Banner */}
          <motion.div className="px-4 sm:px-8 lg:px-12 my-4" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <TelegramAtesoBanner />
          </motion.div>

          {/* ===================================================================
              ACT 3: DJ EMMA PRO PRODUCTION SUITE (Voice Drops, 3D Logos, Orders)
             =================================================================== */}
          <div className="pt-10 sm:pt-14 px-4 sm:px-8 lg:px-12">
            <div className="border-t border-zinc-800/80 pt-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded">
                  STUDIO SUITE
                </span>
                <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  Commercial & DJ Audio Branding
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                DJ Emma Pro Production Studio
              </h2>
              <p className="text-zinc-400 text-xs sm:text-base max-w-2xl mt-1">
                Custom studio voice drops, club sound FX, and 3D animated station logos produced with studio-grade fidelity and direct WhatsApp delivery.
              </p>
            </div>
          </div>

          {/* Row 5: DJ Emma Originals • Voice Drops & FX Packs */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <NetflixDropsRow isLoading={isFeedLoading} />
          </motion.div>

          {/* Dedicated Gateway to 3D LOGOS REVEAL Room */}
          {!searchQuery.trim() && (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
              className="px-4 sm:px-8 lg:px-12 my-6"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-950/60 via-[#13111c] to-[#0c0c14] border border-red-500/40 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>New Dedicated Room Available</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    3D LOGOS REVEAL Room
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Step inside the exclusive 3D Logo Reveal Chamber featuring master motion editions, interactive 3D spatial tilts, real-time stage audio playback, and protected client preview mode.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="text-amber-400 font-semibold">Master Editions</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">60 FPS Video Streams</span>
                    <span>·</span>
                    <span className="text-zinc-400">Direct Download Restricted</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('logos-reveal');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-black rounded-xl shadow-xl shadow-red-950/60 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Enter 3D Logos Reveal Room</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Row 6: 3D Animated Logo Design Studio */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <ErrorBoundary fallbackTitle="3D Motion Logos Showcase">
              <NetflixLogosRow isLoading={isFeedLoading} />
            </ErrorBoundary>
          </motion.div>

          {/* Row 7: Continue Watching / Client Portal Order Tracking */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <NetflixClientPortal />
          </motion.div>

          {/* ===================================================================
              ACT 4: VERIFIED CLIENT DELIVERIES & TRUST SHOWCASE
             =================================================================== */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <TrustProofBanner onOpenProofModal={() => setIsTrustModalOpen(true)} />
          </motion.div>

          {/* Software Downloads Section */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
            <SoftwareDownloadSection />
          </motion.div>
        </motion.div>
      </main>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Community Comments & Discussion Wall */}
      <CommunityCommentsSection />

      {/* Netflix Footer */}
      <NetflixFooter
        onOpenAtesoMovies={() => {
          setSelectedMovie(null);
          setCurrentView('movies');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenStudioManager={() => {
          if (isAdmin) {
            setCurrentView('manager');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Netflix Interactive Modal ("More Info") */}
      <AnimatePresence>
        {selectedTrack && (
          <NetflixModal
            track={selectedTrack}
            onClose={() => setSelectedTrack(null)}
            onSelectTrack={(t) => setSelectedTrack(t)}
          />
        )}
      </AnimatePresence>

      {/* Trust & Proof Modal */}
      {isTrustModalOpen && (
        <TrustProofModal onClose={() => setIsTrustModalOpen(false)} />
      )}

      {/* AI Studio Pro Hub Modal */}
      {isAiHubOpen && (
        <AiStudioHubModal onClose={() => setIsAiHubOpen(false)} />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenAtesoMovies={() => {
          setSelectedMovie(null);
          setCurrentView('movies');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogosReveal={() => {
          setCurrentView('logos-reveal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogin={onOpenLogin}
        currentView={currentView}
      />
      </div>
    </motion.div>
  );
}

function RootApp() {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'signin' | 'signup'>('signin');

  const handleOpenLogin = (mode: 'signin' | 'signup' = 'signin') => {
    setLoginModalMode(mode);
    setShowLoginModal(true);
  };

  return (
    <>
      <GlobalKeyboardController
        isAnyModalOpen={showLoginModal}
        onCloseAllModals={() => setShowLoginModal(false)}
      />
      <NetflixDashboard onOpenLogin={handleOpenLogin} />
      <AdminAuthModal />
      {showLoginModal && (
        <LoginScreen 
          onClose={() => setShowLoginModal(false)}
          isFirstVisit={false}
          initialMode={loginModalMode}
        />
      )}
      <FloatingBackToTop />
      <FeedbackWidget />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DataSaverProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <ContentProvider>
              <AudioProvider>
                <WatchHistoryProvider>
                  <RootApp />
                </WatchHistoryProvider>
              </AudioProvider>
            </ContentProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </DataSaverProvider>
    </LanguageProvider>
  );
}

