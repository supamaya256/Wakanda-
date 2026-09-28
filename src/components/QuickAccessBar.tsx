import React from 'react';
import { Headphones, Mic2, Film, Box, Download, MessageCircle, Sparkles, ArrowRight, Cloud } from 'lucide-react';

interface QuickAccessBarProps {
  onOpenAtesoMovies: () => void;
  onOpenCustomDrops?: () => void;
  onOpenLogosReveal?: () => void;
  onOpenAiHub?: () => void;
}

export default function QuickAccessBar({ onOpenAtesoMovies, onOpenCustomDrops, onOpenLogosReveal, onOpenAiHub }: QuickAccessBarProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const items = [
    {
      id: 'logos-reveal-room',
      title: '3D LOGOS REVEAL',
      subtitle: 'Master Motion Visuals',
      icon: Sparkles,
      color: 'from-rose-600/30 to-red-950/50 border-red-500/50 hover:border-red-400',
      iconColor: 'text-red-400',
      badge: 'New Room',
      onClick: onOpenLogosReveal || (() => scrollTo('logos')),
    },
    {
      id: 'mixes',
      title: 'Nonstop Mixes',
      subtitle: 'Stream & Download',
      icon: Headphones,
      color: 'from-red-600/20 to-red-950/40 border-red-500/30 hover:border-red-500',
      iconColor: 'text-[#E50914]',
      badge: 'Popular',
      onClick: () => scrollTo('mixes'),
    },
    {
      id: 'drops',
      title: 'DJ Voice Drops',
      subtitle: 'Custom Audio Tags',
      icon: Mic2,
      color: 'from-amber-600/20 to-amber-950/40 border-amber-500/30 hover:border-amber-400',
      iconColor: 'text-amber-400',
      badge: 'Order',
      onClick: () => {
        if (onOpenCustomDrops) {
          onOpenCustomDrops();
        } else {
          scrollTo('drops');
        }
      },
    },

    {
      id: 'movies',
      title: 'Ateso Movies',
      subtitle: 'Translated Cinema',
      icon: Film,
      color: 'from-purple-600/20 to-purple-950/40 border-purple-500/30 hover:border-purple-400',
      iconColor: 'text-purple-400',
      badge: 'Poison Break',
      onClick: onOpenAtesoMovies,
    },
    {
      id: 'logos',
      title: '3D Logo Animation',
      subtitle: 'Visual Brand Intros',
      icon: Box,
      color: 'from-blue-600/20 to-blue-950/40 border-blue-500/30 hover:border-blue-400',
      iconColor: 'text-blue-400',
      badge: 'Studio HD',
      onClick: () => scrollTo('logos'),
    },
    {
      id: 'software',
      title: 'DJ Softwares',
      subtitle: 'Free Tools & Setups',
      icon: Download,
      color: 'from-emerald-600/20 to-emerald-950/40 border-emerald-500/30 hover:border-emerald-400',
      iconColor: 'text-emerald-400',
      badge: 'Free',
      onClick: () => scrollTo('software-downloads'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Studio',
      subtitle: '+256 780 527 361',
      icon: MessageCircle,
      color: 'from-green-600/20 to-green-950/40 border-green-500/30 hover:border-green-400',
      iconColor: 'text-green-400',
      badge: '24/7 Live',
      onClick: () => {
        window.open('https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX%20I%20want%20to%20order', '_blank');
      },
    },
  ];

  return (
    <section className="relative z-30 px-4 sm:px-8 lg:px-12 py-6 max-w-[1800px] mx-auto" aria-label="Quick Access Navigation">
      <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300">
              Quick Access Hub
            </h2>
            <span className="text-zinc-600 text-xs hidden sm:inline">·</span>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Jump directly to any section or studio service
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
            Fast 1-Click Navigation
          </span>
        </div>

        {/* Responsive Grid for Desktop & Smooth Horizontal Scroll on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`group text-left p-3.5 rounded-xl bg-gradient-to-b ${item.color} border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer flex flex-col justify-between min-h-[92px]`}
              >
                <div className="flex items-start justify-between w-full mb-2">
                  <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${item.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/50 text-zinc-300 border border-white/10">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
