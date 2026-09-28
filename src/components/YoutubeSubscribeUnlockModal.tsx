import React, { useState } from 'react';
import { 
  X, Lock, Unlock, Youtube, Send, CheckCircle2, 
  ExternalLink, Sparkles, Film, Play, ShieldAlert, ArrowRight
} from 'lucide-react';
import { AtesoMovie } from '../data/atesoMoviesData';
import { useContent, OFFICIAL_YOUTUBE_CHANNEL_URL } from '../context/ContentContext';

interface YoutubeSubscribeUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: AtesoMovie | null;
  onWatchOnSite?: (movie: AtesoMovie) => void;
}

export default function YoutubeSubscribeUnlockModal({
  isOpen,
  onClose,
  movie,
  onWatchOnSite
}: YoutubeSubscribeUnlockModalProps) {
  const { isYoutubeSubscribed, setYoutubeSubscribed } = useContent();
  const [clickedSubscribe, setClickedSubscribe] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  if (!isOpen || !movie) return null;

  const isUnlocked = isYoutubeSubscribed || justUnlocked;
  const epNum = movie.episodeNumber || movie.partNumber || 1;
  const telegramWatchUrl = movie.telegramUrl || 'https://t.me/atesomoviesbox';

  const handleSubscribeClick = () => {
    setClickedSubscribe(true);
    // Mark as unlocked upon engaging with the official YouTube channel
    setYoutubeSubscribed(true);
    setJustUnlocked(true);
  };

  const handleConfirmSubscribed = () => {
    setYoutubeSubscribed(true);
    setJustUnlocked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className={`h-1.5 w-full transition-colors duration-300 ${
          isUnlocked 
            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-[#0088cc]' 
            : 'bg-gradient-to-r from-[#E50914] via-red-600 to-[#FF0000]'
        }`} />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <span className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase px-2.5 py-1 rounded-full">
                <Unlock className="w-3.5 h-3.5" />
                <span>Movie Unlocked</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-black uppercase px-2.5 py-1 rounded-full animate-pulse">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked Movie</span>
              </span>
            )}
            <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
              PART {epNum < 10 ? `0${epNum}` : epNum}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Movie Preview Card */}
          <div className="flex gap-3 sm:gap-4 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <div className="relative w-28 sm:w-32 aspect-video flex-none rounded-lg overflow-hidden bg-black border border-zinc-800">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                {isUnlocked ? (
                  <Unlock className="w-6 h-6 text-emerald-400 drop-shadow-md" />
                ) : (
                  <Lock className="w-6 h-6 text-red-500 drop-shadow-md" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-0.5">
                <span className="bg-[#E50914] text-white font-bold text-[9px] px-1.5 py-0.2 rounded">
                  PART {epNum}
                </span>
                <span>• {movie.vj}</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white truncate">
                {movie.title}
              </h3>
              <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                {movie.duration} • 320p Fast Stream • Ateso Translation
              </p>
            </div>
          </div>

          {!isUnlocked ? (
            /* LOCKED STATE: Subscribe prompt */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-center">
                <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto mb-2.5">
                  <Youtube className="w-6 h-6 text-red-500" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Subscribe to Watch on Telegram
                </h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  This movie is locked! Subscribe to <strong className="text-white">DJ Emma Pro (@djemmapro7231)</strong> on YouTube to unlock and view the full movie on Telegram.
                </p>
              </div>

              {/* Step 1: Subscribe Button */}
              <div className="space-y-2">
                <a
                  href={OFFICIAL_YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSubscribeClick}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FF0000] hover:bg-red-600 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] active:scale-98"
                >
                  <Youtube className="w-5 h-5 fill-white" />
                  <span>STEP 1: SUBSCRIBE ON YOUTUBE (@djemmapro7231)</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <p className="text-[11px] text-zinc-400 text-center">
                  Opens YouTube in a new tab. Tap the <strong>Subscribe</strong> button, then come back here!
                </p>
              </div>

              {/* Step 2: Confirmation / Unlock Button */}
              <div className="pt-2 border-t border-zinc-900">
                <button
                  onClick={handleConfirmSubscribed}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-zinc-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>I Have Subscribed — Unlock Telegram Access</span>
                </button>
              </div>
            </div>
          ) : (
            /* UNLOCKED STATE: Direct Telegram Access */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                  🎉 Unlocked! Ready to Watch on Telegram
                </h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  Thank you for subscribing to DJ Emma Pro! You can now view and download <strong className="text-emerald-400">POISON BREAK Part {epNum}</strong> directly from our Telegram channel.
                </p>
              </div>

              {/* Step 2 Primary Action: View on Telegram */}
              <a
                href={telegramWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0088cc] hover:bg-[#0099e6] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-sky-900/40 transition-all hover:scale-[1.02] active:scale-98"
              >
                <Send className="w-5 h-5 fill-white" />
                <span>STEP 2: WATCH PART {epNum} ON TELEGRAM</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Secondary Option: Watch on Site in 320p */}
              {onWatchOnSite && (
                <button
                  onClick={() => {
                    onClose();
                    onWatchOnSite(movie);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Or Watch Here on Site (320p Fast Stream)</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-zinc-900/50 border-t border-zinc-900 text-center">
          <p className="text-[10px] text-zinc-500">
            Powered by VJ Emma Pro FX • Official Channel: @djemmapro7231 • Telegram: @atesomoviesbox
          </p>
        </div>
      </div>
    </div>
  );
}
