import React from 'react';
import { Award, Music, Radio, Disc, Sparkles, MapPin, CheckCircle, ShieldCheck, Youtube, Instagram, Twitter, Phone, MessageSquare, Headphones, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutMeSectionProps {
  onBookMeClick?: () => void;
}

export default function AboutMeSection({ onBookMeClick }: AboutMeSectionProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { label: 'Master Nonstops', value: '90+', icon: Disc },
    { label: 'Years On Decks', value: '8+', icon: Headphones },
    { label: 'Monthly Streams', value: '100K+', icon: Zap },
    { label: 'Voice Drops Made', value: '500+', icon: Award }
  ];

  const skills = [
    'Live Club & Festival DJing',
    'Street Anthem Scratch Battles',
    'Multi-Genre Nonstop Mixtapes',
    '320kbps Studio Mastering',
    'Custom Hypeman Voice Drops',
    '3D Animated Video Logos',
    'Ateso Cinema VJ Translation',
    'Radio & Club Audio Jingles'
  ];

  return (
    <section id="about-me" className="relative my-14 sm:my-20 px-4 sm:px-8 lg:px-12 select-none scroll-mt-20">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow">
          ABOUT ME
        </span>
        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          Official DJ Biography & Profile
        </span>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-[#111115] to-black border border-zinc-800 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        {/* Watermark Logo / Text */}
        <div className="absolute -right-12 -bottom-10 text-[140px] font-black text-white/[0.02] select-none pointer-events-none font-mono">
          EMMA
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Portrait & Highlights */}
          <div className="lg:col-span-5 flex flex-col items-center text-center lg:text-left">
            <div className="relative group w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-2xl shadow-red-950/40">
              <img
                src="https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/WhatsApp%20Image%202026-06-17%20at%2012.23.24%20PM.jpeg"
                alt="DJ Emma Pro FX"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              {/* Floating Verified Badge */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold text-white tracking-wide">VERIFIED CREATOR</span>
              </div>

              {/* Bottom Stage Tag */}
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                  KING OF SCRATCH • WAKANDA DJs
                </span>
                <h4 className="text-lg font-black text-white tracking-tight">
                  DJ EMMA PRO FX
                </h4>
              </div>
            </div>

            {/* Location & Affiliation Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/80 px-3 py-1 rounded-full text-xs text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Soroti City & Kampala, Uganda</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-red-950/60 border border-red-500/40 px-3 py-1 rounded-full text-xs text-red-300 font-bold">
                <Award className="w-3.5 h-3.5 text-red-400" />
                <span>Wakanda Deejays Academy</span>
              </span>
            </div>
          </div>

          {/* Right Column: Biography & Career Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Uganda’s Premier Audio-Visual DJ Brand</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                DJ EMMA PRO FX
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                Turntablist • Nonstop Mixtape Producer • Radio Presenter & Club DJ
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              DJ Emma Pro FX is one of Eastern Uganda's most celebrated and technically gifted deejays, radio presenters, producers, and audio engineers. Rooted in <strong className="text-white">Soroti City</strong> and performing across <strong className="text-white">Kampala and all of East Africa</strong>, DJ Emma Pro has transformed mixtape culture with his viral <strong className="text-red-400">STREET ANTHEM</strong> nonstops, high-octane club routines, and signature Wakanda Deejay mixes.
            </p>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              As the creative architect of <strong className="text-white">Wakanda Deejays Academy</strong> and <strong className="text-white">DJ Emma Pro FX Studio Suite</strong>, he delivers industry-grade 320kbps master sound, custom hypeman vocal drops, live video mixes, and electrifying festival performances.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-center">
                    <Icon className="w-5 h-5 text-[#E50914] mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black text-white">{s.value}</div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Core Skills Chips */}
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-2.5">
                Mastery & Studio Services
              </span>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium hover:border-[#E50914] transition-colors"
                  >
                    <CheckCircle className="w-3 h-3 text-red-500" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onBookMeClick) onBookMeClick();
                  else scrollTo('book-me');
                }}
                className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>BOOK DJ EMMA PRO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20connect%20and%20chat%20about%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-bold flex items-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+256 780 527 361</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
