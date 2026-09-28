import { Send, Film, Sparkles, ExternalLink, ShieldCheck, Youtube } from 'lucide-react';

interface TelegramAtesoBannerProps {
  onGoToMovies?: () => void;
  variant?: 'billboard' | 'compact';
}

export default function TelegramAtesoBanner({ onGoToMovies, variant = 'billboard' }: TelegramAtesoBannerProps) {
  const telegramUrl = 'https://t.me/atesomoviesbox';
  const promoImage = 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789608314/1000862657.png';

  if (variant === 'compact') {
    return (
      <div className="relative overflow-hidden rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-zinc-900 to-zinc-950 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <img
            src={promoImage}
            alt="Ateso Movies Box Telegram Channel"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-sky-400/40 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0088cc] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <Send className="w-2.5 h-2.5" /> Telegram Official
              </span>
              <span className="text-zinc-400 text-xs hidden sm:inline">• Free Movie Downloads</span>
            </div>
            <h4 className="text-white font-bold text-base sm:text-lg mt-0.5">
              ATESO MOVIES BOX
            </h4>
            <p className="text-zinc-300 text-xs line-clamp-1">
              Join our Telegram channel for instant video downloads & daily translated releases.
            </p>
          </div>
        </div>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0099e6] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-md transition-all shadow-lg shadow-sky-900/30 hover:scale-[1.02] active:scale-95"
        >
          <Send className="w-4 h-4 fill-white" />
          <span>Open Telegram Channel</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    );
  }

  return (
    <section className="relative my-8 sm:my-12 px-4 sm:px-8 lg:px-12 max-w-[1800px] mx-auto select-none">
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-zinc-950 via-[#0a1420] to-[#120a15] shadow-2xl">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8 lg:p-10 relative z-10">
          {/* Visual Poster Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm sm:max-w-md rounded-xl overflow-hidden shadow-2xl border-2 border-sky-400/40 bg-black">
              <img
                src={promoImage}
                alt="Ateso Movies Box Advertisement"
                className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#0088cc] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                    <Send className="w-2.5 h-2.5" /> Telegram Channel
                  </span>
                  <span className="bg-emerald-500/90 text-black text-[10px] font-black px-2 py-0.5 rounded">
                    DIRECT DOWNLOADS
                  </span>
                </div>
                <h3 className="text-white font-extrabold text-lg sm:text-xl drop-shadow">
                  @atesomoviesbox
                </h3>
                <p className="text-zinc-300 text-xs mt-0.5">
                  The #1 Home for Ateso Translated Action & Continuous Videos
                </p>
              </div>
            </div>
          </div>

          {/* Ad Description & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-3 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Telegram Stream & Download Hub</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Get All Ateso Translated Movies on <span className="text-[#0088cc]">Telegram</span>
            </h2>

            <p className="mt-3 text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Never miss a premiere! Join the <strong className="text-white">Ateso Movies Box</strong> Telegram channel to stream and download the latest action movies, martial arts blockbusters, Soroti comedy translations, and exclusive DJ Emma Pro nonstop video mixes straight to your device.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs text-zinc-300">
              <div className="flex items-center gap-2 bg-zinc-900/70 border border-zinc-800 rounded-lg p-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Fast Files</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/70 border border-zinc-800 rounded-lg p-2.5">
                <Film className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Ateso Translations</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/70 border border-zinc-800 rounded-lg p-2.5 col-span-2 sm:col-span-1">
                <Send className="w-4 h-4 text-[#0088cc] shrink-0" />
                <span>Free Instant Access</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#0088cc] hover:bg-[#009bf0] text-white font-bold text-sm sm:text-base px-6 py-3 rounded-lg shadow-xl shadow-sky-900/40 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Send className="w-5 h-5 fill-white" />
                <span>Join @atesomoviesbox</span>
                <ExternalLink className="w-4 h-4 opacity-75" />
              </a>

              <a
                href="https://youtube.com/@djemmapro7231?si=ckcc0gJQHAjdv7CD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-red-600 text-white font-bold text-sm sm:text-base px-5 py-3 rounded-lg shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Youtube className="w-5 h-5 fill-white" />
                <span>Subscribe on YouTube</span>
              </a>

              {onGoToMovies && (
                <button
                  onClick={onGoToMovies}
                  className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
                >
                  <Film className="w-4 h-4 text-[#E50914]" />
                  <span>Watch Movies Here</span>
                </button>
              )}
            </div>

            <p className="mt-3 text-[11px] text-zinc-500">
              Direct Telegram link: <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">{telegramUrl}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
