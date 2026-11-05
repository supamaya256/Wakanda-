import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Search, Headphones, Film, User, Calendar, ShieldCheck, Shield, Lock, X, Globe, ChevronDown, Check, MessageSquare, Zap } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useDataSaver } from '../context/DataSaverContext';

export type MainNavView = 'home' | 'audios' | 'videos' | 'about' | 'book';

interface NetflixNavbarProps {
  currentView?: string;
  onNavigate?: (view: MainNavView) => void;
  onSearch?: (query: string) => void;
  onOpenStudioManager?: () => void;
  isStudioManager?: boolean;
}

export default function NetflixNavbar({
  currentView = 'home',
  onNavigate,
  onSearch,
  onOpenStudioManager,
  isStudioManager = false,
}: NetflixNavbarProps) {
  const { isAdmin, adminEmail, openAuthModal, logout: adminLogout } = useAdminAuth();
  const { isDataSaver, toggleDataSaver } = useDataSaver();
  const { language, toggleLanguage, supportedLanguages, setLanguage, currentLanguageInfo } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const navLinks: { id: MainNavView; label: string; icon: typeof Headphones }[] = [
    { id: 'home', label: 'HOME', icon: Headphones },
    { id: 'audios', label: 'AUDIOS', icon: Headphones },
    { id: 'videos', label: 'VIDEOS', icon: Film },
    { id: 'about', label: 'ABOUT ME', icon: User },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 select-none ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-10">
          {/* DJ EMMA PRO Brand Logo */}
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="DJ Emma Pro FX Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-black p-0.5 shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center border border-red-500/30">
                <span className="text-white font-black text-sm sm:text-base tracking-tighter">FX</span>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-black text-base sm:text-lg tracking-wider leading-none group-hover:text-red-500 transition-colors uppercase">
                DJ EMMA <span className="text-red-600">PRO</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                Official Music Platform
              </span>
            </div>
          </button>

          {/* Desktop Navigation - Strictly ONLY: HOME | AUDIOS | VIDEOS | ABOUT ME */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentView === link.id && !isStudioManager;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate?.(link.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-950/50 scale-105'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons: Search, Data Saver, Language, WhatsApp, and Admin Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center bg-zinc-900/95 border border-zinc-700 rounded-xl px-3 py-1.5 w-44 sm:w-64 shadow-xl">
                <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search audio or video mixes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                  className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    if (onSearch) onSearch('');
                  }}
                  className="text-zinc-400 hover:text-white ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                title="Search mixes"
                className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800 transition cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            )}
          </div>

          {/* Data Saver Mode */}
          <button
            type="button"
            onClick={toggleDataSaver}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isDataSaver
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50'
                : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            title="Toggle Data Saver"
          >
            <Zap className={`w-3.5 h-3.5 ${isDataSaver ? 'fill-emerald-400 animate-pulse' : ''}`} />
            <span className="text-[11px] font-mono">{isDataSaver ? 'Saver ON' : 'Saver OFF'}</span>
          </button>

          {/* Direct WhatsApp Booking Button */}
          <a
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%2C%20I%20am%20interested%20in%20booking%20you%20for%20an%20event."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold border border-emerald-600/40 transition shadow-md cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp DJ</span>
          </a>

          {/* Language Selector */}
          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              onClick={() => setShowLanguageMenu((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition cursor-pointer"
              title="Select Language"
            >
              <span>{currentLanguageInfo.flag}</span>
              <span className="hidden sm:inline uppercase text-[10px] font-bold">{language}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in">
                {supportedLanguages.slice(0, 5).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-zinc-900 transition cursor-pointer ${
                      language === l.code ? 'text-red-500 font-bold bg-zinc-900/50' : 'text-zinc-300'
                    }`}
                  >
                    <span>
                      {l.flag} {l.name}
                    </span>
                    {language === l.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Management Lock/Shield Trigger */}
          {isAdmin ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenStudioManager}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/40 text-xs font-bold transition cursor-pointer"
                title="Open Studio Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin</span>
              </button>
              <button
                type="button"
                onClick={adminLogout}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs"
                title="Log out of Admin"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/60 transition cursor-pointer"
              title="Admin Access"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
