import { ShieldCheck, CheckCircle2, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TrustProofBannerProps {
  onOpenProofModal: () => void;
}

export default function TrustProofBanner({ onOpenProofModal }: TrustProofBannerProps) {
  const trustStats = [
    { value: '500+', label: 'Verified Studio Orders Delivered' },
    { value: '100%', label: 'WhatsApp Delivery Rate' },
    { value: '320 kbps', label: 'Studio-Grade Lossless Fidelity' },
    { value: '4.9 / 5', label: 'Client Satisfaction Rating' },
  ];

  return (
    <section className="relative my-8 sm:my-14 px-4 sm:px-8 lg:px-12 max-w-[1800px] mx-auto select-none">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-zinc-950 via-[#071610] to-zinc-950 p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column: Heading & Description */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Verified Studio Authenticity</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Trusted by Hundreds of DJs, Clubs & Radio Stations Across East Africa
            </h3>

            <p className="mt-2.5 text-zinc-300 text-sm sm:text-base leading-relaxed">
              Every voice drop, radio frequency jingle, and 3D animated station logo is custom-produced, 
              auditioned, and delivered directly to client WhatsApp numbers with full proof of receipt.
            </p>

            {/* Quick Proof Trigger Button */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenProofModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>View WhatsApp Delivery Receipts & Proof</span>
                <ArrowRight className="w-4 h-4 shrink-0 opacity-80" />
              </button>

              <a
                href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX%2C%20I%20want%20to%20verify%20and%20order%20studio%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs sm:text-sm border border-zinc-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>Talk to DJ Emma Directly</span>
              </a>
            </div>
          </div>

          {/* Right Column: Statistics Grid */}
          <div className="w-full lg:w-auto grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            {trustStats.map((stat, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-black/40 border border-emerald-500/20 backdrop-blur-sm flex flex-col justify-center min-w-[150px] sm:min-w-[170px]"
              >
                <div className="flex items-center gap-1 text-emerald-400 text-xl sm:text-2xl font-black font-mono">
                  {stat.value}
                  {Boolean(stat.value && typeof stat.value === 'string' && stat.value.includes('4.9')) && <Star className="w-4 h-4 fill-emerald-400 text-emerald-400 inline" />}
                </div>
                <div className="text-zinc-400 text-xs mt-1 leading-snug font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
