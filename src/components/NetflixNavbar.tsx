import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Search, Bell, ChevronDown, Check, Download, MessageSquare, Headphones, Sliders, ExternalLink, X, UploadCloud, Shield, Film, Lock, ShieldCheck, LogOut, Instagram, Twitter, Music, Facebook, Ghost, MessageCircle, Youtube, WifiOff, Phone, Keyboard, Sparkles, Globe, Cloud, LayoutDashboard, User, UserPlus, LogIn, History, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio } from '../context/AudioContext';
import { useAdminAuth, MASTER_ADMIN_EMAIL } from '../context/AdminAuthContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import GoogleSearchVisibilityModal from './GoogleSearchVisibilityModal';

interface NetflixNavbarProps {
  onSearch?: (query: string) => void;
  onOpenPortal?: () => void;
  onOpenStudioManager?: () => void;
  isStudioManager?: boolean;
  onOpenAtesoMovies?: () => void;
  isAtesoMovies?: boolean;
  onOpenLogosReveal?: () => void;
  isLogosReveal?: boolean;
  onOpenLogin?: (mode?: 'signin' | 'signup') => void;
  onOpenTrustModal?: () => void;
  onOpenAiHub?: () => void;
}

export default function NetflixNavbar({
  onSearch,
  onOpenPortal,
  onOpenStudioManager,
  isStudioManager,
  onOpenAtesoMovies,
  isAtesoMovies,
  onOpenLogosReveal,
  isLogosReveal,
  onOpenLogin,
  onOpenTrustModal,
  onOpenAiHub
}: NetflixNavbarProps) {
  const { isAdmin, adminEmail, openAuthModal, logout: adminLogout } = useAdminAuth();
  const { user, logout: clientLogout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleInitialQuery, setGoogleInitialQuery] = useState('DJ EMMA PRO FX');
  const { tracks, playTrack, downloadTrack } = useAudio();
  const { language, toggleLanguage, setLanguage, supportedLanguages, currentLanguageInfo, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setShowLanguageMenu(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleFocusSearch = () => {
      setShowSearch(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }, 50);
    };

    const handleEscape = () => {
      setShowSearch(false);
    };

    const handleOpenGoogleModal = (e: any) => {
      if (e?.detail?.query) {
        setGoogleInitialQuery(e.detail.query);
      }
      setShowGoogleModal(true);
    };

    window.addEventListener('app:focus-search', handleFocusSearch);
    window.addEventListener('app:escape', handleEscape);
    window.addEventListener('app:open-google-search', handleOpenGoogleModal);

    return () => {
      window.removeEventListener('app:focus-search', handleFocusSearch);
      window.removeEventListener('app:escape', handleEscape);
      window.removeEventListener('app:open-google-search', handleOpenGoogleModal);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <>
      {/* Top Studio Broadcast & Social Media Bar */}
      <div className="fixed top-0 left-0 right-0 h-[36px] bg-[#0c0c0c] border-b border-white/10 z-[60] flex items-center justify-between px-4 sm:px-8 overflow-x-auto hide-scrollbar shadow-lg shadow-black/60">
        <div className="flex items-center gap-2.5 text-[11px] text-zinc-300 font-medium shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50914]"></span>
          </span>
          <span className="text-white font-extrabold tracking-wider uppercase text-[10px]">DJ EMMA PRO FX</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-400 hidden sm:inline text-[11px]">Official Studio & Nonstop Broadcast</span>

          {/* Left-Side Top Bar Quick Auth Links */}
          {!user && (
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/15">
              <button
                type="button"
                onClick={() => onOpenLogin && onOpenLogin('signin')}
                className="text-[10px] text-zinc-300 hover:text-white font-bold cursor-pointer transition-colors"
                title="Sign in with your account"
              >
                Sign In
              </button>
              <span className="text-zinc-600">/</span>
              <button
                type="button"
                onClick={() => onOpenLogin && onOpenLogin('signup')}
                className="text-[10px] text-[#E50914] hover:text-red-400 font-bold cursor-pointer transition-colors"
                title="Create a free new account"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-xs">
          <a
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10"
            title="Direct WhatsApp Studio Hotline"
          >
            <Phone className="w-3.5 h-3.5 text-[#E50914]" />
            <span className="font-mono text-[11px] text-zinc-200">+256 780 527 361</span>
          </a>

          <div className="h-3 w-px bg-zinc-800" />

          <div className="flex items-center gap-2.5 sm:gap-4">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Follow:</span>
            <a 
              href="https://www.instagram.com/deejayemmap?stkn=MTl1dWdweTFyamQwdw==" target="_blank" rel="noopener noreferrer" title="Instagram"
              className="text-zinc-400 hover:text-[#E1306C] transition-all hover:scale-110"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com/djemmaproo" target="_blank" rel="noopener noreferrer" title="Twitter / X"
              className="text-zinc-400 hover:text-white transition-all hover:scale-110"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=100084323655178" target="_blank" rel="noopener noreferrer" title="Facebook"
              className="text-zinc-400 hover:text-[#1877F2] transition-all hover:scale-110"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://www.tiktok.com/@djdropsuganda?_r=1&_t=ZS-99oYUzQBmPU" target="_blank" rel="noopener noreferrer" title="TikTok"
              className="text-zinc-400 hover:text-[#00f2fe] transition-all hover:scale-110"
            >
              <Music className="w-4 h-4" />
            </a>
            <a 
              href="https://youtube.com/@djemmapro7231?si=iKgwrQvCurZhDQob" target="_blank" rel="noopener noreferrer" title="YouTube"
              className="text-zinc-400 hover:text-[#FF0000] transition-all hover:scale-110"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a 
              href="https://www.snapchat.com/add/emmapro257687?share_id=HskB4TeN5bg&locale=en-GB" target="_blank" rel="noopener noreferrer" title="Snapchat"
              className="text-zinc-400 hover:text-[#FFFC00] transition-all hover:scale-110"
            >
              <Ghost className="w-4 h-4" />
            </a>
            <a 
              href="https://profile.imo.im/profileshare/shr.AAAAAAAAAAAAAAAAAAAAAKgSW7_KbozgNaMYLq3fuOpQBrWahQ4HuAza-Rr7tBxY" target="_blank" rel="noopener noreferrer" title="IMO"
              className="text-zinc-400 hover:text-[#2196F3] transition-all hover:scale-110"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <header
        id="netflix-navbar"
        className={`fixed top-[36px] left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl border-b border-white/5 py-3'
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-4'
        }`}
      >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left Side: Brand, Sign In & Sign Up Options, and Desktop Navigation */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer shrink-0"
            title="DJ EMMA PRO FX - Netflix Dashboard"
          >
            {/* Netflix Stylized Red Brand */}
            <div className="flex items-baseline">
              <span className="font-bebas text-2xl sm:text-3xl lg:text-4xl text-[#E50914] tracking-wider font-black drop-shadow-[0_2px_12px_rgba(229,9,20,0.6)] group-hover:scale-105 transition-transform">
                DJ EMMA
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold font-mono tracking-widest bg-[#E50914] text-white">
                PRO FX
              </span>
            </div>
          </a>

          {/* LEFT-SIDE AUTHENTICATION OPTIONS: Sign In & Sign Up */}
          {!user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenLogin && onOpenLogin('signin')}
                className="flex items-center gap-1 sm:gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-1 sm:py-1.5 px-2.5 sm:px-3 rounded text-xs sm:text-sm transition-all shadow-sm cursor-pointer hover:border-white active:scale-95 whitespace-nowrap"
                title="Sign in with your account"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenLogin && onOpenLogin('signup')}
                className="flex items-center gap-1 sm:gap-1.5 bg-[#E50914] hover:bg-[#b80710] text-white font-bold py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
                title="Create a free new account"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-zinc-300 max-w-[100px] truncate">
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
              </span>
            </div>
          )}

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-5 text-xs lg:text-sm font-medium text-zinc-300">
            <a
              href="#"
              className="text-white font-bold hover:text-[#E50914] transition-colors whitespace-nowrap"
            >
              {t('nav.home', 'Home')}
            </a>
            <a
              href="#mixes"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              {t('nav.mixes', 'Mixes')}
            </a>
            <a
              href="#drops"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              {t('nav.drops', 'DJ Drops')}
            </a>
            <a
              href="#logos"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              {t('nav.logos', '3D Logos')}
            </a>
            {onOpenLogosReveal && (
              <button
                type="button"
                onClick={onOpenLogosReveal}
                className={`hover:text-white transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  isLogosReveal ? 'text-red-500 font-bold' : 'text-zinc-300'
                }`}
                title="Open 3D LOGOS REVEAL Room"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span className="font-bold">3D LOGOS REVEAL</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenAtesoMovies}
              className={`hover:text-white transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                isAtesoMovies ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('nav.movies', 'Ateso Movies')}</span>
            </button>

            <a
              href="#watch-history-row"
              className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5 text-[#E50914]" />
              <span>{t('nav.history', 'History')}</span>
            </a>
            <a
              href="#software-downloads"
              className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>{t('nav.softwares', 'Softwares')}</span>
            </a>

            {/* Clean 'More Services' Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setShowMoreMenu(prev => !prev)}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  showMoreMenu ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMoreMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-[#161616] border border-zinc-700/90 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                  {onOpenLogosReveal && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onOpenLogosReveal();
                      }}
                      className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-zinc-800/80 text-zinc-200 hover:text-white cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-white">3D LOGOS REVEAL Room</p>
                        <p className="text-[10px] text-zinc-400">Master Motion Video Reveals</p>
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      if (onOpenTrustModal) onOpenTrustModal();
                    }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-zinc-800/80 text-zinc-200 hover:text-white cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">Verified Proofs</p>
                      <p className="text-[10px] text-zinc-400">WhatsApp delivery receipts</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      if (onOpenAiHub) onOpenAiHub();
                    }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-zinc-800/80 text-zinc-200 hover:text-white cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">AI Studio Pro Hub</p>
                      <p className="text-[10px] text-zinc-400">Gemini AI drops & music</p>
                    </div>
                  </button>

                  <a
                    href="#portal"
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-zinc-800/80 text-zinc-200 hover:text-white cursor-pointer transition-colors"
                  >
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">My Orders Portal</p>
                      <p className="text-[10px] text-zinc-400">Track drop & logo progress</p>
                    </div>
                  </a>

                  <div className="my-1 border-t border-zinc-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      if (onOpenStudioManager) {
                        onOpenStudioManager();
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('studio:switch-tab', { detail: 'inquiries' }));
                        }, 60);
                      }
                    }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-zinc-800/80 text-zinc-200 hover:text-white cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">Contact DJ / Send Inquiry</p>
                      <p className="text-[10px] text-zinc-400">Direct booking & project requests</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      if (onOpenStudioManager) onOpenStudioManager();
                    }}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-zinc-800/80 text-zinc-200 hover:text-white cursor-pointer transition-colors"
                  >
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-400">Admin Dashboard</p>
                          <p className="text-[10px] text-zinc-400">Upload & delete items • Studio control</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <LayoutDashboard className="w-4 h-4 text-[#E50914] shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white">Visitor Dashboard</p>
                          <p className="text-[10px] text-zinc-400">Studio showcase & client order hub</p>
                        </div>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Side: Search, Bell, Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Network Indicator */}
          {!isOnline && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600/90 text-white rounded text-xs font-bold animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)] border border-red-400" title="You are offline. Playback may fail.">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">OFFLINE</span>
            </div>
          )}

          {/* Language Switcher & African Languages Selector */}
          <div className="relative" ref={languageMenuRef}>
            <div className="flex items-center bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-500 rounded-lg p-0.5 shadow-md">
              {/* Quick 1-Click Toggle English <-> Ateso */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                title="Quick switch between English and Ateso"
              >
                <span>{language === 'en' ? '🇬🇧 EN' : language === 'at' ? '🇺🇬 AT' : `${currentLanguageInfo.flag} ${language.toUpperCase()}`}</span>
                <span className="text-[10px] text-zinc-500">⇄</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {language === 'en' ? 'AT' : 'EN'}
                </span>
              </button>

              <div className="w-px h-3.5 bg-zinc-700 mx-0.5" />

              {/* Full African Languages Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setShowLanguageMenu(prev => !prev)}
                className={`flex items-center gap-1 px-1.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  showLanguageMenu ? 'bg-[#E50914] text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                title="Choose from All African Languages & Kiswahili"
              >
                <Globe className="w-3.5 h-3.5 text-[#E50914]" />
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${showLanguageMenu ? 'rotate-180 text-white' : ''}`} />
              </button>
            </div>

            {/* African Languages Popover Menu */}
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#161616] border border-zinc-700/90 rounded-xl shadow-2xl z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                {/* Header */}
                <div className="p-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#E50914]" />
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                      Select African Language
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 font-mono border border-red-500/30">
                    {supportedLanguages.length} Languages
                  </span>
                </div>

                {/* Primary Quick Pickers: English & Ateso */}
                <div className="p-2.5 bg-black/40 border-b border-zinc-800/80">
                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1.5 tracking-wider">
                    Primary App Languages:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        setShowLanguageMenu(false);
                      }}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                        language === 'en'
                          ? 'bg-[#E50914]/20 border-[#E50914] text-white font-bold shadow'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇬🇧</span>
                        <div>
                          <p className="text-xs font-bold leading-none">English</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">International</p>
                        </div>
                      </div>
                      {language === 'en' && <Check className="w-3.5 h-3.5 text-[#E50914]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('at');
                        setShowLanguageMenu(false);
                      }}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                        language === 'at'
                          ? 'bg-[#E50914]/20 border-[#E50914] text-white font-bold shadow'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇺🇬</span>
                        <div>
                          <p className="text-xs font-bold leading-none">Ateso</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Teso / Uganda</p>
                        </div>
                      </div>
                      {language === 'at' && <Check className="w-3.5 h-3.5 text-[#E50914]" />}
                    </button>
                  </div>
                </div>

                {/* All African Languages List */}
                <div className="max-h-64 overflow-y-auto divide-y divide-zinc-800/60 p-1">
                  <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    African Languages & Kiswahili:
                  </div>
                  {supportedLanguages
                    .filter(item => item.code !== 'en' && item.code !== 'at')
                    .map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setLanguage(item.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                          language === item.code
                            ? 'bg-[#E50914]/20 text-white font-bold border border-[#E50914]/50'
                            : 'hover:bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{item.flag}</span>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-white">{item.nativeName}</span>
                              <span className="text-[10px] text-zinc-400">({item.name})</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block truncate">{item.region}</span>
                          </div>
                        </div>
                        {language === item.code && (
                          <Check className="w-4 h-4 text-[#E50914] shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="p-2 bg-zinc-900/90 border-t border-zinc-800 text-[10px] text-zinc-400 text-center">
                  Selected: <span className="text-white font-bold">{currentLanguageInfo.nativeName} ({currentLanguageInfo.name})</span>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center bg-black/80 border border-white/40 rounded px-2.5 py-1 transition-all w-44 sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Titles, mixtapes, voice drops... (/)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                  className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-zinc-500 font-sans"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    if (onSearch) onSearch('');
                  }}
                  className="text-zinc-400 hover:text-white ml-1 cursor-pointer"
                  title="Close search (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                title="Search Library (Press /)"
                className="text-white hover:text-[#E50914] p-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Keyboard Shortcuts Trigger Button */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('app:toggle-shortcuts'))}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
            title="Keyboard Shortcuts Cheat Sheet (Press ? or H)"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#E50914]" />
            <span className="text-[11px] font-bold">?</span>
          </button>

          {/* Google Search & Visibility Checker */}
          <button
            type="button"
            onClick={() => {
              setGoogleInitialQuery('DJ EMMA PRO FX');
              setShowGoogleModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded bg-[#1c1c24] hover:bg-[#252532] border border-white/15 text-zinc-200 hover:text-white text-[11px] sm:text-xs font-bold tracking-wide transition-all shadow-sm shrink-0 cursor-pointer group"
            title="Search on Google & Check Live SEO Snippet"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="hidden lg:inline">Google Search</span>
          </button>

          {/* WhatsApp Direct VIP Pill */}
          <a
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20am%20browsing%20your%20Netflix%20Dashboard%20and%20want%20to%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded bg-[#E50914] hover:bg-[#b80710] text-white text-[11px] sm:text-xs font-bold tracking-wider transition-colors shadow-lg shadow-[#E50914]/20 shrink-0 cursor-pointer"
            title="Direct WhatsApp Studio Order"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span className="whitespace-nowrap">ORDER STUDIO</span>
          </a>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              title="Notifications"
              className="text-white hover:text-zinc-300 p-1.5 relative transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E50914] animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#181818] border border-zinc-800 rounded-md shadow-2xl overflow-hidden z-50 text-xs">
                <div className="px-4 py-3 border-b border-zinc-800 font-bold text-white flex items-center justify-between">
                  <span>NOTIFICATIONS</span>
                  <span className="text-[10px] text-[#E50914] font-mono">NEW DROPS</span>
                </div>
                <div className="divide-y divide-zinc-800/80 max-h-72 overflow-y-auto">
                  {tracks.map((track, i) => (
                    <div
                      key={track.id}
                      className="p-3 hover:bg-zinc-800/60 transition-colors flex items-start gap-3 cursor-pointer"
                      onClick={() => {
                        playTrack(i);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="w-12 h-8 rounded bg-zinc-900 overflow-hidden shrink-0 border border-zinc-700">
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{track.title}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Now Streaming in Lossless 320kbps</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTrack(track);
                        }}
                        title="Download to phone"
                        className="text-[#E50914] hover:text-white p-1"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu (visible on right side when user is logged in) */}
          {user && (
            <div className="relative">
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-1.5 group cursor-pointer"
                  title="Account Profiles"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Google User'} 
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-red-500/60 object-cover shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-[#E50914] to-red-900 border border-red-500/50 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      <span>{user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'DJ'}</span>
                    </div>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Direct Sign Out Button */}
                <button
                  type="button"
                  onClick={() => {
                    clientLogout();
                    if (isAdmin) adminLogout();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800/90 hover:bg-red-700 text-zinc-200 hover:text-white text-xs font-bold transition-all cursor-pointer border border-zinc-700 hover:border-red-600 shadow-sm"
                  title="Sign Out of Account"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-10 mt-2 w-60 bg-[#181818] border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                    {/* Profile switchers */}
                    <div className="px-3.5 py-2.5 border-b border-zinc-800 flex items-center gap-2.5">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-bold text-[12px] truncate text-white">
                          {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'FX'}
                        </div>
                      )}
                      <div className="overflow-hidden min-w-0">
                        <p className="text-white font-bold truncate">{user?.displayName || user?.email?.split('@')[0] || 'Member'}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                        <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                          Google Verified
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      <a
                        href="#mixes"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        Nonstop Mixtapes
                      </a>
                      <a
                        href="#drops"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        Custom Voice Drops
                      </a>
                      <a
                        href="#logos"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        3D Logo Studio
                      </a>
                      <a
                        href="#portal"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        Track Order Delivery
                      </a>

                      {/* Watch Ateso Movies in Profile Menu */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenAtesoMovies) onOpenAtesoMovies();
                        }}
                        className="w-full text-left px-4 py-2 text-amber-300 hover:text-white hover:bg-amber-500/20 font-bold flex items-center justify-between cursor-pointer border-t border-zinc-800/80"
                      >
                        <span className="flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t('nav.movies')}</span>
                        </span>
                        <span className="text-[9px] uppercase px-1 py-0.2 bg-[#E50914] text-white rounded font-mono">NEW</span>
                      </button>

                      {/* Studio Dashboard Link in Profile (Admin vs Visitor) */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenStudioManager) onOpenStudioManager();
                        }}
                        className={`w-full text-left px-4 py-2 transition-colors font-bold flex items-center justify-between cursor-pointer border-t border-zinc-800/80 mt-1 ${
                          isAdmin 
                            ? 'text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60' 
                            : 'text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isAdmin ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Admin Dashboard (Upload/Delete)</span>
                            </>
                          ) : (
                            <>
                              <LayoutDashboard className="w-3.5 h-3.5 text-[#E50914]" />
                              <span>Visitor Dashboard</span>
                            </>
                          )}
                        </span>
                        <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-mono ${
                          isAdmin ? 'bg-emerald-500 text-black font-black' : 'bg-[#E50914] text-white'
                        }`}>
                          {isAdmin ? 'ADMIN' : 'GUEST'}
                        </span>
                      </button>

                      {/* Admin Direct Toggle / Verification */}
                      {isAdmin && (
                        <div className="px-4 py-2 text-xs bg-emerald-950/40 text-emerald-300 border-t border-zinc-800/80 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[11px] font-mono truncate">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{adminEmail || MASTER_ADMIN_EMAIL}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Client Logout */}
                    <div className="pt-1 mt-1 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          clientLogout();
                          if (isAdmin) adminLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 font-semibold hover:bg-zinc-800 transition-colors"
                      >
                        <span>Sign Out of Netflix</span>
                        <LogOut className="w-3 h-3 text-zinc-400" />
                      </button>
                    </div>
                    
                    <div className="pt-1 mt-1 border-t border-zinc-800">
                      <a
                        href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-2 text-[#E50914] font-bold hover:bg-zinc-800 transition-colors"
                      >
                        <span>Contact WhatsApp VIP</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub Category Chips Bar (Mobile / Compact) - Shows ALL Navigation Buttons */}
      <div className="md:hidden px-4 pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold border-t border-white/5 mt-2 bg-black/40 backdrop-blur-md">
        {/* Watch Ateso Movies */}
        <button
          type="button"
          onClick={onOpenAtesoMovies}
          className={`px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 font-bold cursor-pointer shrink-0 shadow-sm ${
            isAtesoMovies
              ? 'bg-[#E50914] text-white shadow-[#E50914]/40'
              : 'bg-zinc-800 text-amber-300 border border-amber-400/50 hover:bg-[#E50914] hover:text-white'
          }`}
          title="Watch Ateso Movies"
        >
          <Film className="w-3 h-3 text-amber-400" />
          <span>{t('nav.movies', 'WATCH ATESO MOVIES')}</span>
        </button>

        {/* Verified Proof Button */}
        <button
          type="button"
          onClick={onOpenTrustModal}
          className="px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 font-bold cursor-pointer shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
          title="Verified Client Delivery Proofs"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>{t('nav.trust', 'VERIFIED PROOF')}</span>
        </button>

        {/* Sofwares Button */}
        <a
          href="#software-downloads"
          className="px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 font-bold cursor-pointer shrink-0 bg-red-600/20 text-red-300 border border-red-600/40 hover:bg-red-600 hover:text-white"
          title="Download DJ Software & Tools"
        >
          <Download className="w-3 h-3 text-red-400" />
          <span>{t('nav.softwares', 'SOFWARES')}</span>
        </a>

        {/* Dashboard Link - Differentiated for Admin vs Visitor */}
        <button
          type="button"
          onClick={onOpenStudioManager}
          className={`px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1.5 font-bold cursor-pointer shrink-0 transition-colors ${
            isStudioManager
              ? 'bg-[#E50914] text-white shadow-lg'
              : isAdmin
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700'
          }`}
          title={isAdmin ? "Admin Studio Dashboard (Upload & Delete Options)" : "Visitor Dashboard & Media Showcase"}
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

        <a href="#mixes" className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white whitespace-nowrap shrink-0 border border-zinc-700">
          {t('nav.mixes', 'Nonstops & Mixes')}
        </a>
        <a href="#top10" className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white whitespace-nowrap shrink-0 border border-zinc-700 flex items-center gap-1">
          <span className="text-[#E50914] font-black">TOP 10</span> {t('nav.top10', 'Shows')}
        </a>
        <a href="#drops" className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white whitespace-nowrap shrink-0 border border-zinc-700">
          {t('nav.drops', 'DJ Voice Drops')}
        </a>
        <a href="#logos" className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white whitespace-nowrap shrink-0 border border-zinc-700">
          {t('nav.logos', '3D Logos')}
        </a>
        <a href="#portal" className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white whitespace-nowrap shrink-0 border border-zinc-700">
          {t('nav.orders', 'My Orders')}
        </a>
      </div>
    </header>

    {/* Google Search & Visibility Modal */}
    <GoogleSearchVisibilityModal
      isOpen={showGoogleModal}
      onClose={() => setShowGoogleModal(false)}
      initialQuery={googleInitialQuery}
    />
    </>
  );
}
