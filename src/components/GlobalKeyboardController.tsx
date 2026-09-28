import { useState, useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import KeyboardHUD, { HudMessage } from './KeyboardHUD';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

interface GlobalKeyboardControllerProps {
  onCloseAllModals?: () => void;
  isAnyModalOpen?: boolean;
}

export default function GlobalKeyboardController({
  onCloseAllModals,
  isAnyModalOpen = false,
}: GlobalKeyboardControllerProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    seekRelative,
    adjustVolume,
    toggleMute,
    formatTime,
    downloadTrack,
    togglePiP,
  } = useAudio();

  const [hudMessage, setHudMessage] = useState<HudMessage | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const hudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showHud = (msg: Omit<HudMessage, 'id'>) => {
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    const newMsg = { ...msg, id: Date.now() };
    setHudMessage(newMsg);
    hudTimerRef.current = setTimeout(() => {
      setHudMessage(null);
    }, 1400);
  };

  useEffect(() => {
    const handleOpenShortcutsEvent = () => {
      setIsShortcutsOpen((prev) => !prev);
    };

    window.addEventListener('app:toggle-shortcuts', handleOpenShortcutsEvent);
    return () => {
      window.removeEventListener('app:toggle-shortcuts', handleOpenShortcutsEvent);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Handle Escape globally even when typing in input
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (isInputFocused) {
          target.blur();
        }
        if (isShortcutsOpen) {
          e.preventDefault();
          setIsShortcutsOpen(false);
          return;
        }
        if (onCloseAllModals) {
          onCloseAllModals();
        }
        window.dispatchEvent(new CustomEvent('app:escape'));
        return;
      }

      // If user is currently typing in an input field, do not trigger shortcuts
      if (isInputFocused) {
        return;
      }

      // Disable default browser action for keys that scroll the page (Space, ArrowUp, ArrowDown, PageUp, PageDown)
      // Play / Pause
      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
        showHud({
          type: !isPlaying ? 'play' : 'pause',
          title: !isPlaying ? 'Playing Mixtape' : 'Playback Paused',
          subtitle: currentTrack.title,
        });
        return;
      }

      // Next Track
      if ((e.shiftKey && (e.key === 'N' || e.key === 'n')) || (!e.shiftKey && (e.key === 'n' || e.key === 'N'))) {
        e.preventDefault();
        nextTrack();
        showHud({
          type: 'track',
          title: 'Next Mixtape',
          subtitle: currentTrack.title,
        });
        return;
      }

      // Previous Track
      if ((e.shiftKey && (e.key === 'P' || e.key === 'p')) || (!e.shiftKey && (e.key === 'p' || e.key === 'P'))) {
        e.preventDefault();
        prevTrack();
        showHud({
          type: 'track',
          title: 'Previous Mixtape',
          subtitle: currentTrack.title,
        });
        return;
      }

      // Seek -10s (J key)
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        seekRelative(-10);
        const newTime = Math.max(0, currentTime - 10);
        showHud({
          type: 'seek',
          title: '-10s Rewind',
          subtitle: formatTime(newTime),
        });
        return;
      }

      // Seek +10s (L key)
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        seekRelative(10);
        const newTime = Math.min(duration || currentTime + 10, currentTime + 10);
        showHud({
          type: 'seek',
          title: '+10s Fast-Forward',
          subtitle: formatTime(newTime),
        });
        return;
      }

      // Left Arrow (Seek -5s when modal is not handling it)
      if (e.key === 'ArrowLeft') {
        if (!isAnyModalOpen) {
          e.preventDefault();
          seekRelative(-5);
          const newTime = Math.max(0, currentTime - 5);
          showHud({
            type: 'seek',
            title: '-5s Rewind',
            subtitle: formatTime(newTime),
          });
        }
        return;
      }

      // Right Arrow (Seek +5s when modal is not handling it)
      if (e.key === 'ArrowRight') {
        if (!isAnyModalOpen) {
          e.preventDefault();
          seekRelative(5);
          const newTime = Math.min(duration || currentTime + 5, currentTime + 5);
          showHud({
            type: 'seek',
            title: '+5s Fast-Forward',
            subtitle: formatTime(newTime),
          });
        }
        return;
      }

      // Volume Up (ArrowUp)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newVol = adjustVolume(0.05);
        showHud({
          type: 'volume',
          title: 'Volume Up',
          value: newVol * 100,
        });
        return;
      }

      // Volume Down (ArrowDown)
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newVol = adjustVolume(-0.05);
        showHud({
          type: 'volume',
          title: 'Volume Down',
          value: newVol * 100,
        });
        return;
      }

      // Mute / Unmute (M key)
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const nowMuted = toggleMute();
        showHud({
          type: nowMuted ? 'mute' : 'unmute',
          title: nowMuted ? 'Muted' : 'Audio Restored',
          value: nowMuted ? 0 : volume * 100,
        });
        return;
      }

      // Number keys 0 - 9: Jump to 0%, 10%, ... 90%
      if (!e.ctrlKey && !e.metaKey && !e.altKey && /^[0-9]$/.test(e.key)) {
        e.preventDefault();
        const percent = parseInt(e.key, 10) / 10;
        if (duration > 0) {
          const targetTime = duration * percent;
          seek(targetTime);
          showHud({
            type: 'seek',
            title: `Jumped to ${percent * 100}%`,
            subtitle: formatTime(targetTime),
          });
        }
        return;
      }

      // Toggle Fullscreen (F key)
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          showHud({
            type: 'fullscreen',
            title: 'Fullscreen Mode',
            subtitle: 'Press F or Esc to exit',
          });
        } else {
          document.exitFullscreen().catch(() => {});
          showHud({
            type: 'fullscreen',
            title: 'Exited Fullscreen',
          });
        }
        return;
      }

      // Toggle Picture-in-Picture (I or P with shift)
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        togglePiP();
        showHud({
          type: 'pip',
          title: 'Picture-in-Picture',
          subtitle: 'Floating video toggled',
        });
        return;
      }

      // Toggle Studio Waveform Visualizer (W key)
      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('app:toggle-waveform'));
        showHud({
          type: 'waveform',
          title: 'Studio Waveform',
          subtitle: 'Toggled Audio Visualizer',
        });
        return;
      }

      // Download Active Track (D key)
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        downloadTrack(currentTrack);
        showHud({
          type: 'download',
          title: 'Downloading to Device',
          subtitle: currentTrack.title,
        });
        return;
      }

      // Focus Search Bar (/ key)
      if (e.key === '/') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('app:focus-search'));
        showHud({
          type: 'search',
          title: 'Search Library',
          subtitle: 'Type to find mixtapes, videos, or drops',
        });
        return;
      }

      // Help / Keyboard Shortcuts Guide (? key or H key)
      if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Scroll to Top (T key or Home)
      if (e.key === 't' || e.key === 'T' || e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isShortcutsOpen,
    isAnyModalOpen,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    currentTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    seekRelative,
    adjustVolume,
    toggleMute,
    formatTime,
    downloadTrack,
    togglePiP,
    onCloseAllModals,
  ]);

  return (
    <>
      <KeyboardHUD message={hudMessage} />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
}
