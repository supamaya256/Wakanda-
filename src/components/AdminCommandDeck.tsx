import React from 'react';
import { 
  ShieldCheck, 
  Upload, 
  Trash2, 
  Music, 
  Mic, 
  Film, 
  Box, 
  FolderOpen, 
  Eye, 
  EyeOff, 
  Sliders, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useContent } from '../context/ContentContext';
import { MASTER_ADMIN_EMAIL } from '../context/AdminAuthContext';

interface AdminCommandDeckProps {
  onOpenUploadTab: (tab: 'tracks' | 'drops' | 'logos' | 'movies' | 'files') => void;
  onOpenStudioManager: () => void;
  previewAsVisitor: boolean;
  onToggleVisitorPreview: () => void;
}

export default function AdminCommandDeck({
  onOpenUploadTab,
  onOpenStudioManager,
  previewAsVisitor,
  onToggleVisitorPreview,
}: AdminCommandDeckProps) {
  const { tracks } = useAudio();
  const { voiceDrops, logos, atesoMovies, customFiles } = useContent();

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-4">
      <div className="bg-gradient-to-r from-zinc-950 via-[#161214] to-zinc-950 rounded-2xl border border-red-500/40 p-4 sm:p-5 shadow-2xl shadow-red-950/30 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Super Admin Title & Identity */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-black tracking-widest uppercase shadow-md shadow-red-600/30">
                <ShieldCheck className="w-3 h-3 text-white" />
                ADMINISTRATOR DASHBOARD
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SUPER ADMIN ACTIVE
              </span>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                {MASTER_ADMIN_EMAIL}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>DJ EMMA PRO</span>
              <span className="text-zinc-500 font-normal text-sm sm:text-base">• Content Management Console</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
              Only you can see upload and delete options. Visitors see a clean, public streaming experience without any upload or delete controls.
            </p>
          </div>

          {/* Right: Quick Switcher to Preview as Visitor */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              type="button"
              onClick={onToggleVisitorPreview}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                previewAsVisitor
                  ? 'bg-amber-500 text-black shadow-amber-500/30 hover:bg-amber-400'
                  : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700'
              }`}
              title={previewAsVisitor ? "Switch back to Admin Mode" : "Preview what normal visitors see"}
            >
              {previewAsVisitor ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-black" />
                  <span>Previewing as Visitor (Upload/Delete Hidden)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview Visitor View</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenStudioManager}
              className="px-4 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#E50914]/30 cursor-pointer transition-all active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Open Full Studio Console</span>
            </button>
          </div>
        </div>

        {/* Catalog Statistics & Quick Upload Buttons (Visible ONLY when not previewing as visitor) */}
        {!previewAsVisitor && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-3">
              {/* Stat 1: Tracks */}
              <div 
                onClick={() => onOpenUploadTab('tracks')}
                className="bg-zinc-900/80 hover:bg-zinc-850 p-2.5 rounded-xl border border-zinc-800 hover:border-red-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <Music className="w-3 h-3 text-[#E50914]" />
                    Mixtapes
                  </span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-red-400 font-bold">+ Upload</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{tracks.length}</div>
              </div>

              {/* Stat 2: Drops */}
              <div 
                onClick={() => onOpenUploadTab('drops')}
                className="bg-zinc-900/80 hover:bg-zinc-850 p-2.5 rounded-xl border border-zinc-800 hover:border-amber-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-amber-400" />
                    DJ Drops
                  </span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-amber-400 font-bold">+ Upload</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{voiceDrops.length}</div>
              </div>

              {/* Stat 3: Movies */}
              <div 
                onClick={() => onOpenUploadTab('movies')}
                className="bg-zinc-900/80 hover:bg-zinc-850 p-2.5 rounded-xl border border-zinc-800 hover:border-purple-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <Film className="w-3 h-3 text-purple-400" />
                    Ateso Movies
                  </span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-purple-400 font-bold">+ Upload</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{atesoMovies.length}</div>
              </div>

              {/* Stat 4: Logos */}
              <div 
                onClick={() => onOpenUploadTab('logos')}
                className="bg-zinc-900/80 hover:bg-zinc-850 p-2.5 rounded-xl border border-zinc-800 hover:border-blue-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <Box className="w-3 h-3 text-blue-400" />
                    3D Logos
                  </span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-blue-400 font-bold">+ Upload</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{logos.length}</div>
              </div>

              {/* Stat 5: Files */}
              <div 
                onClick={() => onOpenUploadTab('files')}
                className="col-span-2 sm:col-span-1 bg-zinc-900/80 hover:bg-zinc-850 p-2.5 rounded-xl border border-zinc-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-3 h-3 text-emerald-400" />
                    Media Storage
                  </span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-emerald-400 font-bold">+ Upload</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{customFiles.length}</div>
              </div>
            </div>

            {/* Quick Upload Action Buttons Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mr-1">
                <Upload className="w-3 h-3 text-[#E50914]" />
                <span>Admin Upload Tools:</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenUploadTab('tracks')}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Music className="w-3 h-3 text-red-400" />
                <span>+ Upload Mixtape</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenUploadTab('drops')}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Mic className="w-3 h-3 text-amber-400" />
                <span>+ Upload DJ Drop</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenUploadTab('logos')}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Box className="w-3 h-3 text-blue-400" />
                <span>+ Upload 3D Logo</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenUploadTab('movies')}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Film className="w-3 h-3 text-purple-400" />
                <span>+ Upload Movie</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenUploadTab('files')}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3 h-3 text-emerald-400" />
                <span>+ Upload File</span>
              </button>
              <button
                type="button"
                onClick={onOpenStudioManager}
                className="ml-auto px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-200 hover:text-white text-[11px] font-bold flex items-center gap-1 border border-red-500/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                <span>Delete &amp; Manage Catalog</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
