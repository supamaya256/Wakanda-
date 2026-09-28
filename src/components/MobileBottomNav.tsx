import React from 'react';
import { Home, Headphones, Mic2, Film, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';

interface MobileBottomNavProps {
  onOpenAtesoMovies: () => void;
  onOpenLogin: (mode?: 'signin' | 'signup') => void;
  onOpenStudioManager?: () => void;
  onOpenLogosReveal?: () => void;
  currentView?: 'store' | 'manager' | 'movies' | 'logos-reveal';
}

export default function MobileBottomNav({
  onOpenAtesoMovies,
  onOpenLogin,
  onOpenStudioManager,
  onOpenLogosReveal,
  currentView = 'store',
}: MobileBottomNavProps) {
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();

  const scrollTo = (id: string) => {
    if (currentView !== 'store') {
      window.dispatchEvent(new CustomEvent('app:switch-view', { detail: 'store' }));
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-lg border-t border-zinc-800/90 px-3 py-1.5 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.6)]"
      aria-label="Mobile Navigation"
    >
      <button
        type="button"
        onClick={() => {
          if (currentView !== 'store') {
            window.dispatchEvent(new CustomEvent('app:switch-view', { detail: 'store' }));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center justify-center py-1 px-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
      >
        <Home className={`w-5 h-5 ${currentView === 'store' ? 'text-[#E50914]' : 'text-zinc-400 group-hover:text-white'}`} />
        <span className={`text-[10px] mt-0.5 font-medium ${currentView === 'store' ? 'text-white font-bold' : 'text-zinc-400'}`}>
          Home
        </span>
      </button>

      <button
        type="button"
        onClick={() => scrollTo('mixes')}
        className="flex flex-col items-center justify-center py-1 px-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
      >
        <Headphones className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        <span className="text-[10px] mt-0.5 font-medium text-zinc-400 group-hover:text-white">
          Mixes
        </span>
      </button>

      <button
        type="button"
        onClick={() => scrollTo('drops')}
        className="flex flex-col items-center justify-center py-1 px-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
      >
        <Mic2 className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        <span className="text-[10px] mt-0.5 font-medium text-zinc-400 group-hover:text-white">
          DJ Drops
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (onOpenLogosReveal) {
            onOpenLogosReveal();
          } else {
            scrollTo('logos');
          }
        }}
        className="flex flex-col items-center justify-center py-1 px-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
      >
        <Sparkles className={`w-5 h-5 ${currentView === 'logos-reveal' ? 'text-red-500' : 'text-zinc-400 group-hover:text-red-400'}`} />
        <span className={`text-[10px] mt-0.5 font-medium ${currentView === 'logos-reveal' ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
          3D Logos
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenAtesoMovies}
        className="flex flex-col items-center justify-center py-1 px-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
      >
        <Film className={`w-5 h-5 ${currentView === 'movies' ? 'text-amber-400' : 'text-zinc-400 group-hover:text-amber-400'}`} />
        <span className={`text-[10px] mt-0.5 font-medium ${currentView === 'movies' ? 'text-amber-300 font-bold' : 'text-zinc-400'}`}>
          Movies
        </span>
      </button>

      <button
        type="button"
        onClick={() => onOpenLogin('signin')}
        className="flex flex-col items-center justify-center py-1 px-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="User profile"
            className="w-5 h-5 rounded-full object-cover border border-red-500/60"
            referrerPolicy="no-referrer"
          />
        ) : (
          <User className="w-5 h-5 text-zinc-400 group-hover:text-white" />
        )}
        <span className="text-[10px] mt-0.5 font-medium text-zinc-400 group-hover:text-white">
          {user ? (isAdmin ? 'Admin' : 'Profile') : 'Sign In'}
        </span>
      </button>
    </nav>
  );
}
