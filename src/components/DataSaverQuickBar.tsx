/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Zap,
  DownloadCloud,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Wifi,
  Info,
  Check,
  X,
  Gauge,
  Film,
  Mic,
  Activity,
  MessageCircle,
  Headphones
} from 'lucide-react';
import { useDataSaver } from '../context/DataSaverContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DataSaverQuickBarProps {
  onOpenLogosReveal?: () => void;
  onOpenAtesoMovies?: () => void;
}

export default function DataSaverQuickBar({
  onOpenLogosReveal,
  onOpenAtesoMovies
}: DataSaverQuickBarProps) {
  const {
    isDataSaver,
    toggleDataSaver,
    estimatedDataSavedMB,
    connectionType,
    isOnline
  } = useDataSaver();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <div className="bg-[#121217] border-y border-red-500/20 px-3 sm:px-6 py-2">
        <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Data Saver Status & 1-Tap Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={toggleDataSaver}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-md select-none ${
                isDataSaver
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40 shadow-emerald-950/50'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
              }`}
              title="Click to toggle Data Saver mode"
            >
              <Zap className={`w-3.5 h-3.5 ${isDataSaver ? 'fill-current text-white animate-pulse' : 'text-zinc-400'}`} />
              <span>DATA SAVER: {isDataSaver ? 'ON (LOW MB)' : 'OFF (HD)'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isDataSaver ? 'bg-black/30 text-emerald-200' : 'bg-black/40 text-zinc-400'
              }`}>
                {isDataSaver ? '85% Less Data' : 'Full Bitrate'}
              </span>
            </button>

            {/* Live Data Saved Counter */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 font-mono bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
              <span className="text-emerald-400 font-bold">💾 Saved:</span>
              <span className="text-white font-bold">{estimatedDataSavedMB} MB</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">{connectionType}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              title="How Data Saver saves your mobile bundles"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Easy Access Home Screen App Install + Quick Jump Links */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Quick 1-Tap Category Jump */}
            <div className="hidden lg:flex items-center gap-1.5">
              {onOpenLogosReveal && (
                <button
                  type="button"
                  onClick={onOpenLogosReveal}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-red-400" />
                  <span>3D Logos</span>
                </button>
              )}
              {onOpenAtesoMovies && (
                <button
                  type="button"
                  onClick={onOpenAtesoMovies}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
                >
                  <Film className="w-3 h-3 text-amber-400" />
                  <span>Ateso Movies</span>
                </button>
              )}
              <a
                href="#drops"
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Mic className="w-3 h-3 text-zinc-400" />
                <span>Drops</span>
              </a>
              <a
                href="#mixes"
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Headphones className="w-3 h-3 text-zinc-400" />
                <span>Mixes</span>
              </a>
            </div>

            {/* 1-Tap WhatsApp Fast Access (Easy Access to Studio) */}
            <a
              href="https://wa.me/256701540681?text=Hello%20DJ%20Emma%20Pro%20FX%2C%20I%20am%20browsing%20your%20website%20and%20would%20like%20to%20order%20or%20make%20an%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border border-[#25D366]/40 transition-all cursor-pointer shadow-sm select-none"
              title="Easy Access: 1-Tap WhatsApp Chat & Order with DJ Emma"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">WhatsApp Fast Access</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            {/* PWA In-App Install Button for Instant Home Screen Access */}
            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={install}
                className="flex items-center gap-1.5 bg-[#E50914] hover:bg-[#b80710] text-white px-3 py-1.5 rounded-full text-xs font-black tracking-wide shadow-lg shadow-red-950/60 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Install DJ Emma Pro FX on your phone home screen for instant access"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>INSTALL APP (FAST ACCESS)</span>
              </button>
            )}

            {!isInstalled && isIOS && (
              <button
                type="button"
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-700 transition-all cursor-pointer"
                title="Install on iPhone / iPad"
              >
                <Smartphone className="w-3.5 h-3.5 text-zinc-300" />
                <span>Add to iPhone</span>
              </button>
            )}

            {isInstalled && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3" />
                <span>App Installed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Modal: How Data Saver Works */}
      {showInfoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowInfoModal(false)}
        >
          <div 
            className="bg-[#16161c] border border-white/10 rounded-2xl max-w-md w-full p-5 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Data Saver Technology</h3>
                  <p className="text-[11px] text-zinc-400">Optimized for fast loading & minimal cellular data</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>No Background Video Auto-play</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-5">
                  Videos and heavy 3D motion animations will only stream when you press Play, preventing unwanted background data consumption.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Eco Cloudinary Video Compression (360p / 270p)</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-5">
                  Motion clips are delivered via eco video streams reducing file sizes by up to 85% with zero buffering.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Ultra-Compressed WebP Graphics</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-5">
                  Wallpapers and cover graphics use modern AVIF/WebP formats instead of heavy multi-megabyte PNG files.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Instant Audio & Zero Waste Preload</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-5">
                  Audio tracks stream on-demand when clicked without downloading tracks you haven't played yet.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400">
                Current Mode: {isDataSaver ? 'Data Saver Active' : 'High Definition'}
              </span>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Home Screen Guide */}
      {showIOSModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="bg-[#16161c] border border-white/10 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Install on iPhone / iPad</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p>For 1-tap instant access without opening Safari:</p>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Tap the <strong>Share</strong> button at bottom of Safari</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Tap <strong>Add</strong> in the top-right corner</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
