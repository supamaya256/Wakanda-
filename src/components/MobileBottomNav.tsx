import React, { useState, useEffect } from 'react';
import { Headphones, Film, User, Calendar, Music } from 'lucide-react';

export type NavSection = 'audio' | 'videos' | 'about' | 'book';

interface MobileBottomNavProps {
  currentView?: 'store' | 'manager' | 'movies' | 'logos-reveal';
  activeSection?: NavSection;
  onNavigateSection?: (section: NavSection) => void;
  // Kept for backward compatibility if called elsewhere
  onOpenAtesoMovies?: () => void;
  onOpenLogin?: (mode?: 'signin' | 'signup') => void;
  onOpenStudioManager?: () => void;
  onOpenLogosReveal?: () => void;
}

export default function MobileBottomNav({
  currentView = 'store',
  activeSection: controlledActiveSection,
  onNavigateSection
}: MobileBottomNavProps) {
  const [internalActive, setInternalActive] = useState<NavSection>('audio');
  const currentActive = controlledActiveSection || internalActive;

  // Scroll spy to automatically highlight currently visible section in red while scrolling
  useEffect(() => {
    if (currentView !== 'store') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;

      const bookEl = document.getElementById('book-me');
      const aboutEl = document.getElementById('about-me');
      const videosEl = document.getElementById('videos');
      const audioEl = document.getElementById('mixes');

      if (bookEl && scrollPos >= bookEl.offsetTop) {
        setInternalActive('book');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setInternalActive('about');
      } else if (videosEl && scrollPos >= videosEl.offsetTop) {
        setInternalActive('videos');
      } else if (audioEl && scrollPos >= audioEl.offsetTop) {
        setInternalActive('audio');
      } else {
        setInternalActive('audio');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavClick = (section: NavSection) => {
    setInternalActive(section);
    if (onNavigateSection) {
      onNavigateSection(section);
    }

    // Target element IDs for each of the 4 items
    const targetMap: Record<NavSection, string> = {
      audio: 'mixes',
      videos: 'videos',
      about: 'about-me',
      book: 'book-me'
    };

    const targetId = targetMap[section];

    if (currentView !== 'store') {
      window.dispatchEvent(new CustomEvent('app:switch-view', { detail: 'store' }));
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems: { id: NavSection; label: string; icon: typeof Headphones }[] = [
    {
      id: 'audio',
      label: 'AUDIO',
      icon: Headphones
    },
    {
      id: 'videos',
      label: 'VIDEOS',
      icon: Film
    },
    {
      id: 'about',
      label: 'ABOUT ME',
      icon: User
    },
    {
      id: 'book',
      label: 'BOOK ME',
      icon: Calendar
    }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-zinc-800/90 shadow-[0_-4px_25px_rgba(0,0,0,0.85)] select-none"
      aria-label="Main Navigation"
    >
      <div className="max-w-xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = currentActive === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 sm:px-3 rounded-xl transition-all duration-200 cursor-pointer group active:scale-95 ${
                isSelected
                  ? 'bg-red-600/15 border border-red-500/30 shadow-md shadow-red-950/40'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              {/* Modern Icon */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 group-hover:scale-110 ${
                    isSelected
                      ? 'text-[#E50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.7)]'
                      : 'text-zinc-400 group-hover:text-white'
                  }`}
                />
                {/* Active Glow Dot */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] mt-1 tracking-wider uppercase transition-colors duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'text-white font-black drop-shadow-[0_0_6px_rgba(229,9,20,0.5)]'
                    : 'text-zinc-400 font-semibold group-hover:text-zinc-200'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
