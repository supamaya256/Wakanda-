import { X, Keyboard, Play, Volume2, Maximize, Search, ArrowRight, CornerDownLeft, Sliders, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  title: string;
  icon: any;
  shortcuts: ShortcutItem[];
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    title: 'Playback & Scrubbing',
    icon: Play,
    shortcuts: [
      { keys: ['Space'], description: 'Play / Pause mixtape or video' },
      { keys: ['K'], description: 'Alternative Play / Pause' },
      { keys: ['Shift', 'N'], description: 'Next track in playlist (or press N)' },
      { keys: ['Shift', 'P'], description: 'Previous track in playlist (or press P)' },
      { keys: ['J'], description: 'Rewind 10 seconds' },
      { keys: ['L'], description: 'Fast-forward 10 seconds' },
      { keys: ['←'], description: 'Rewind 5 seconds (or previous mix in details modal)' },
      { keys: ['→'], description: 'Fast-forward 5 seconds (or next mix in details modal)' },
      { keys: ['0', '–', '9'], description: 'Jump to 0% – 90% of current mixtape' },
    ],
  },
  {
    title: 'Audio & Volume',
    icon: Volume2,
    shortcuts: [
      { keys: ['M'], description: 'Mute / Unmute audio' },
      { keys: ['↑'], description: 'Increase volume by 5%' },
      { keys: ['↓'], description: 'Decrease volume by 5%' },
    ],
  },
  {
    title: 'Display & Screen',
    icon: Maximize,
    shortcuts: [
      { keys: ['F'], description: 'Toggle Fullscreen view' },
      { keys: ['I'], description: 'Toggle Picture-in-Picture (PiP) mini-player' },
      { keys: ['W'], description: 'Toggle Studio Audio Waveform Visualizer' },
    ],
  },
  {
    title: 'Navigation & Windows',
    icon: Search,
    shortcuts: [
      { keys: ['/'], description: 'Quick focus search bar to find mixtapes & drops' },
      { keys: ['Esc'], description: 'Close any active modal, search, or overlay' },
      { keys: ['T'], description: 'Scroll to top of the page (or press Home)' },
      { keys: ['D'], description: 'Instant download active mix to your phone/PC' },
      { keys: ['?'], description: 'Open / close this keyboard shortcuts guide' },
    ],
  },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="keyboard-shortcuts-modal"
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#161616] rounded-2xl border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-white flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-zinc-800 bg-[#1c1c1c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E50914]/20 border border-[#E50914]/50 flex items-center justify-center text-[#E50914]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Keyboard Shortcuts
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Active Everywhere
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full media playback, scrubbing, and screen hotkeys for DJ Emma Pro FX
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 divide-y divide-zinc-800/80">
          {SHORTCUT_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="pt-5 first:pt-0">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-zinc-300">
                  <Icon className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>{category.title}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {category.shortcuts.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800/70 hover:border-zinc-700 transition-colors"
                    >
                      <span className="text-xs text-zinc-300 mr-3 leading-snug">
                        {item.description}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="min-w-[24px] px-1.5 py-0.5 text-center text-[11px] font-mono font-bold bg-[#222] text-zinc-100 border border-zinc-700 rounded shadow-sm"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info pill */}
        <div className="px-5 sm:px-7 py-3 border-t border-zinc-800 bg-[#121212] flex items-center justify-between text-[11px] text-zinc-400">
          <span>Shortcuts are disabled while typing inside search or input fields.</span>
          <div className="flex items-center gap-1 font-mono">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px]">Esc</kbd>
            <span>to dismiss</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
