import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingBackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col items-center gap-2 select-none animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* WhatsApp Quick Chat Floating Button */}
      <a
        href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX%20I%20am%20on%20your%20website"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-900/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
        title="Chat on WhatsApp (+256 780 527 361)"
        aria-label="Direct WhatsApp Chat"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
      </a>

      {/* Back to Top */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center shadow-lg border border-zinc-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
