/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { AudioProvider, useAudio, AudioTrack } from './context/AudioContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataSaverProvider } from './context/DataSaverContext';
import AdminAuthModal from './components/AdminAuthModal';
import NetflixNavbar, { MainNavView } from './components/NetflixNavbar';
import NetflixBillboard from './components/NetflixBillboard';
import NetflixRow from './components/NetflixRow';
import NetflixTop10Row from './components/NetflixTop10Row';
import NetflixDropsRow from './components/NetflixDropsRow';
import NetflixLogosRow from './components/NetflixLogosRow';
import FeedbackWidget from './components/FeedbackWidget';
import NetflixModal from './components/NetflixModal';
import NewsletterSignup from './components/NewsletterSignup';
import NetflixFooter from './components/NetflixFooter';
import StudioManagerPage from './components/StudioManagerPage';
import TrustProofModal from './components/TrustProofModal';
import TrustProofBanner from './components/TrustProofBanner';
import GlobalKeyboardController from './components/GlobalKeyboardController';
import SoftwareDownloadSection from './components/SoftwareDownloadSection';
import CommunityCommentsSection from './components/CommunityCommentsSection';
import AiStudioHubModal from './components/AiStudioHubModal';
import QuickAccessBar from './components/QuickAccessBar';
import MobileBottomNav, { NavSection } from './components/MobileBottomNav';
import VideoMixesSection from './components/VideoMixesSection';
import AboutMeSection from './components/AboutMeSection';
import BookMeSection from './components/BookMeSection';
import ThreeDLogosRevealPage from './components/ThreeDLogosRevealPage';
import ThreeDLogosWelcomeHero from './components/ThreeDLogosWelcomeHero';
import TopStreetAnthemBanner from './components/TopStreetAnthemBanner';
import ContinueListeningBanner from './components/ContinueListeningBanner';
import MyFavoritesSection from './components/MyFavoritesSection';
import { FavoritesProvider } from './context/FavoritesContext';
import { WatchHistoryProvider } from './context/WatchHistoryContext';
import FloatingBackToTop from './components/FloatingBackToTop';

// AdSense & Dedicated Pages
import { AdSlot } from './components/AdSlot';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AudiosPage } from './components/AudiosPage';
import { VideosPage } from './components/VideosPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
import { ContactPage } from './components/ContactPage';

export type AppView = 
  | 'home' 
  | 'audios' 
  | 'videos' 
  | 'about' 
  | 'book' 
  | 'privacy' 
  | 'terms' 
  | 'contact' 
  | 'manager' 
  | 'logos-reveal';

function NetflixDashboard() {
  const { t } = useLanguage();
  const { tracks, recentTracks, favoriteTracks } = useAudio();
  const { voiceDrops } = useContent();
  const { isAdmin } = useAdminAuth();

  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [isAiHubOpen, setIsAiHubOpen] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState<NavSection>('audio');

  const [isFeedLoading, setIsFeedLoading] = useState(true);

  // Sync hash routing if user opens with hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#audios') setCurrentView('audios');
      else if (hash === '#videos') setCurrentView('videos');
      else if (hash === '#about') setCurrentView('about');
      else if (hash === '#book') setCurrentView('book');
      else if (hash === '#privacy') setCurrentView('privacy');
      else if (hash === '#terms') setCurrentView('terms');
      else if (hash === '#contact') setCurrentView('contact');
      else if (hash === '#logos-reveal') setCurrentView('logos-reveal');
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const handleSwitchView = (e: any) => {
      if (e.detail) {
        setCurrentView(e.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('app:switch-view', handleSwitchView);
    return () => window.removeEventListener('app:switch-view', handleSwitchView);
  }, []);

  useEffect(() => {
    const handleEscape = () => {
      setSelectedTrack(null);
      setIsTrustModalOpen(false);
      setIsAiHubOpen(false);
    };
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleEscape();
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFeedLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Filtered tracks for search
  let filteredTracks = Array.isArray(tracks) ? tracks : [];
  let filteredDrops: any[] = [];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredTracks = filteredTracks.filter((t) => {
      if (!t) return false;
      const titleMatch = t.title && t.title.toLowerCase().includes(q);
      const artistMatch = t.artist && t.artist.toLowerCase().includes(q);
      const djMatch =
        t.artist &&
        (t.artist.toLowerCase().includes('dj') || t.title.toLowerCase().includes('dj')) &&
        (q.includes('dj') || q.includes('emma') || q.includes('wakanda'));
      const genreMatch = Array.isArray(t.genres) && t.genres.some((g) => g && g.toLowerCase().includes(q));
      const yearMatch = t.year && String(t.year).includes(q);
      const descMatch = t.description && t.description.toLowerCase().includes(q);
      const qualityMatch = t.quality && t.quality.toLowerCase().includes(q);
      return Boolean(titleMatch || artistMatch || djMatch || genreMatch || yearMatch || descMatch || qualityMatch);
    });

    if (Array.isArray(voiceDrops)) {
      filteredDrops = voiceDrops.filter((d) => {
        if (!d) return false;
        const titleMatch = d.title && d.title.toLowerCase().includes(q);
        const styleMatch = d.style && d.style.toLowerCase().includes(q);
        const catMatch = d.category && d.category.toLowerCase().includes(q);
        const scriptMatch = d.sampleScript && d.sampleScript.toLowerCase().includes(q);
        const tagMatch = Array.isArray(d.tags) && d.tags.some((t: string) => t && t.toLowerCase().includes(q));
        return Boolean(titleMatch || styleMatch || catMatch || scriptMatch || tagMatch);
      });
    }
  }

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `#${view}`);
    }
  };

  // Render Sub-Views
  if (currentView === 'audios') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-8">
        <NetflixNavbar
          currentView="audios"
          onNavigate={(v) => navigateTo(v as AppView)}
          onSearch={(q) => setSearchQuery(q)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />
        <AudiosPage onOpenTrackDetails={(track) => setSelectedTrack(track)} />
        <NetflixFooter onNavigate={(v) => navigateTo(v as AppView)} onOpenStudioManager={() => setCurrentView('manager')} />
        <MobileBottomNav
          currentView="store"
          activeSection="audio"
          onNavigateSection={(sec) => {
            setActiveNavSection(sec);
            if (sec === 'audio') navigateTo('audios');
            else if (sec === 'videos') navigateTo('videos');
            else if (sec === 'about') navigateTo('about');
            else if (sec === 'book') navigateTo('book');
          }}
        />
      </div>
    );
  }

  if (currentView === 'videos') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-8">
        <NetflixNavbar
          currentView="videos"
          onNavigate={(v) => navigateTo(v as AppView)}
          onSearch={(q) => setSearchQuery(q)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />
        <VideosPage />
        <NetflixFooter onNavigate={(v) => navigateTo(v as AppView)} onOpenStudioManager={() => setCurrentView('manager')} />
        <MobileBottomNav
          currentView="store"
          activeSection="videos"
          onNavigateSection={(sec) => {
            setActiveNavSection(sec);
            if (sec === 'audio') navigateTo('audios');
            else if (sec === 'videos') navigateTo('videos');
            else if (sec === 'about') navigateTo('about');
            else if (sec === 'book') navigateTo('book');
          }}
        />
      </div>
    );
  }

  if (currentView === 'privacy') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-8">
        <NetflixNavbar
          currentView="home"
          onNavigate={(v) => navigateTo(v as AppView)}
          onSearch={(q) => setSearchQuery(q)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />
        <PrivacyPolicyPage onBackToHome={() => navigateTo('home')} />
        <NetflixFooter onNavigate={(v) => navigateTo(v as AppView)} onOpenStudioManager={() => setCurrentView('manager')} />
      </div>
    );
  }

  if (currentView === 'terms') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-8">
        <NetflixNavbar
          currentView="home"
          onNavigate={(v) => navigateTo(v as AppView)}
          onSearch={(q) => setSearchQuery(q)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />
        <TermsPage onBackToHome={() => navigateTo('home')} />
        <NetflixFooter onNavigate={(v) => navigateTo(v as AppView)} onOpenStudioManager={() => setCurrentView('manager')} />
      </div>
    );
  }

  if (currentView === 'contact') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-8">
        <NetflixNavbar
          currentView="home"
          onNavigate={(v) => navigateTo(v as AppView)}
          onSearch={(q) => setSearchQuery(q)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />
        <ContactPage onBackToHome={() => navigateTo('home')} />
        <NetflixFooter onNavigate={(v) => navigateTo(v as AppView)} onOpenStudioManager={() => setCurrentView('manager')} />
      </div>
    );
  }

  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-8">
        <NetflixNavbar
          currentView="about"
          onNavigate={(v) => navigateTo(v as AppView)}
          onSearch={(q) => setSearchQuery(q)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />
        <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-8">
          <AboutMeSection />
          <AdSlot slotId="about-mid" format="horizontal" className="my-10" />
          <BookMeSection />
        </div>
        <NetflixFooter onNavigate={(v) => navigateTo(v as AppView)} onOpenStudioManager={() => setCurrentView('manager')} />
        <MobileBottomNav
          currentView="store"
          activeSection="about"
          onNavigateSection={(sec) => {
            setActiveNavSection(sec);
            if (sec === 'audio') navigateTo('audios');
            else if (sec === 'videos') navigateTo('videos');
            else if (sec === 'about') navigateTo('about');
            else if (sec === 'book') navigateTo('book');
          }}
        />
      </div>
    );
  }

  if (currentView === 'book') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-8">
        <NetflixNavbar
          currentView="home"
          onNavigate={(v) => navigateTo(v as AppView)}
          onSearch={(q) => setSearchQuery(q)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />
        <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-8">
          <BookMeSection />
          <AdSlot slotId="book-mid" format="horizontal" className="my-10" />
        </div>
        <NetflixFooter onNavigate={(v) => navigateTo(v as AppView)} onOpenStudioManager={() => setCurrentView('manager')} />
        <MobileBottomNav
          currentView="store"
          activeSection="book"
          onNavigateSection={(sec) => {
            setActiveNavSection(sec);
            if (sec === 'audio') navigateTo('audios');
            else if (sec === 'videos') navigateTo('videos');
            else if (sec === 'about') navigateTo('about');
            else if (sec === 'book') navigateTo('book');
          }}
        />
      </div>
    );
  }

  if (currentView === 'manager') {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <StudioManagerPage onBackToStore={() => setCurrentView('home')} />
      </div>
    );
  }

  if (currentView === 'logos-reveal') {
    return (
      <div className="min-h-screen bg-[#07070a] text-white pb-20 md:pb-8">
        <ThreeDLogosRevealPage
          onBackToStore={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenStudioManager={() => {
            setCurrentView('manager');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <MobileBottomNav
          currentView="logos-reveal"
          activeSection="audio"
          onNavigateSection={(sec) => {
            setCurrentView('home');
            setActiveNavSection(sec);
          }}
        />
      </div>
    );
  }

  // DEFAULT HOMEPAGE VIEW ('home')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#141414] text-white selection:bg-[#E50914] selection:text-white"
    >
      <NetflixNavbar
        currentView="home"
        onNavigate={(v) => navigateTo(v as AppView)}
        onSearch={(query) => setSearchQuery(query)}
        onOpenStudioManager={() => setCurrentView('manager')}
      />

      <div className="pb-24 pt-16">
        {/* Hero Section */}
        <div id="home">
          <NetflixBillboard onOpenModal={(track) => setSelectedTrack(track)} />
        </div>

        {/* 3D LOGOS REVEAL Spotlight Banner (Edition #08 Default) */}
        <ThreeDLogosWelcomeHero
          onOpenLogosReveal={() => {
            setCurrentView('logos-reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Quick Access Bar */}
        <QuickAccessBar
          onOpenLogosReveal={() => {
            setCurrentView('logos-reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCustomDrops={() => {
            setCurrentView('manager');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAiHub={() => setIsAiHubOpen(true)}
        />

        {/* TOP Trending Billboard: STREET ANTHEM 90 */}
        <TopStreetAnthemBanner onOpenModal={(track) => setSelectedTrack(track)} />

        {/* Continue Listening / Resume Bar */}
        <ContinueListeningBanner />

        {/* SEARCH RESULTS (When user types in Search bar) */}
        {searchQuery.trim() && (
          <div className="px-4 sm:px-8 lg:px-12 py-8 bg-zinc-950/80 border-y border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-red-500" />
                <span>Search Results for "{searchQuery}"</span>
              </h2>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {filteredTracks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Matching Audio & Video Mixes ({filteredTracks.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {filteredTracks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrack(t)}
                      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 cursor-pointer transition group"
                    >
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-2">
                        <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400">{t.title}</h4>
                      <p className="text-[10px] text-zinc-400 truncate">{t.artist}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredTracks.length === 0 && (
              <div className="text-center py-12 text-zinc-500 text-xs">
                No mixes found matching "{searchQuery}". Try searching "Street Anthem" or "Wakanda".
              </div>
            )}
          </div>
        )}

        {/* Favorite mixes quick row */}
        {!searchQuery.trim() && <MyFavoritesSection onOpenModal={(track) => setSelectedTrack(track)} />}

        {/* Main Audio Mixes Row */}
        <div id="mixes">
          <NetflixRow
            title="Nonstop Mixtapes & Master Audio"
            subtitle="Lossless 320kbps Studio Releases"
            tracks={tracks}
            isLoading={isFeedLoading}
            onOpenModal={(track) => setSelectedTrack(track)}
          />
        </div>

        {/* Responsive Google AdSense Banner 1 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <AdSlot slotId="home-feed-banner-1" format="horizontal" />
        </div>

        {/* Official Video Mixes Section (#videos) */}
        <div id="videos">
          <VideoMixesSection onOpenTrackModal={(track) => setSelectedTrack(track)} />
        </div>

        {/* Top 10 Video Shows Row */}
        <div id="top10">
          <NetflixTop10Row
            onOpenModal={(track) => setSelectedTrack(track)}
          />
        </div>

        {/* Responsive Google AdSense Banner 2 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <AdSlot slotId="home-feed-banner-2" format="rectangle" />
        </div>

        {/* Custom Voice Drops Row */}
        <div id="drops">
          <NetflixDropsRow />
        </div>

        {/* 3D Metallic Logos Row */}
        <div id="logos">
          <NetflixLogosRow />
        </div>

        {/* Verified Delivery Proofs */}
        <TrustProofBanner onOpenProofModal={() => setIsTrustModalOpen(true)} />

        {/* About Me Section (#about-me) */}
        <div id="about-me">
          <AboutMeSection />
        </div>

        {/* Book Me Section (#book-me) */}
        <div id="book-me">
          <BookMeSection />
        </div>

        {/* Software Downloads */}
        <SoftwareDownloadSection />

        {/* Community Comments */}
        <CommunityCommentsSection />

        {/* Newsletter */}
        <NewsletterSignup />

        {/* Footer with Compliance & Navigation Links */}
        <NetflixFooter
          onNavigate={(v) => navigateTo(v as AppView)}
          onOpenStudioManager={() => setCurrentView('manager')}
        />

        {/* Track Modal */}
        <AnimatePresence>
          {selectedTrack && (
            <NetflixModal
              track={selectedTrack}
              onClose={() => setSelectedTrack(null)}
              onSelectTrack={(t) => setSelectedTrack(t)}
            />
          )}
        </AnimatePresence>

        {/* Proof Modal */}
        {isTrustModalOpen && <TrustProofModal onClose={() => setIsTrustModalOpen(false)} />}

        {/* AI Studio Hub Modal */}
        {isAiHubOpen && <AiStudioHubModal onClose={() => setIsAiHubOpen(false)} />}

        {/* Fixed Mobile Bottom Navigation (Strictly 4 Items: AUDIO, VIDEOS, ABOUT ME, BOOK ME) */}
        <MobileBottomNav
          currentView="store"
          activeSection={activeNavSection}
          onNavigateSection={(sec) => {
            setActiveNavSection(sec);
            if (sec === 'audio') {
              const el = document.getElementById('mixes');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (sec === 'videos') {
              const el = document.getElementById('videos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (sec === 'about') {
              const el = document.getElementById('about-me');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (sec === 'book') {
              const el = document.getElementById('book-me');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>
    </motion.div>
  );
}

function RootApp() {
  return (
    <>
      <GlobalKeyboardController
        isAnyModalOpen={false}
        onCloseAllModals={() => {}}
      />
      <NetflixDashboard />
      <AdminAuthModal />
      <CookieConsentBanner />
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
                <FavoritesProvider>
                  <WatchHistoryProvider>
                    <RootApp />
                  </WatchHistoryProvider>
                </FavoritesProvider>
              </AudioProvider>
            </ContentProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </DataSaverProvider>
    </LanguageProvider>
  );
}
