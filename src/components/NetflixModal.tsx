import { 
  X, 
  Play, 
  Pause, 
  Download, 
  Plus, 
  Check, 
  Volume2, 
  MessageSquare, 
  ExternalLink, 
  Sparkles, 
  MessageCircle, 
  Send, 
  Link, 
  Loader2, 
  QrCode, 
  Mail,
  Share2,
  Copy,
  Twitter,
  Facebook,
  Smartphone,
  CheckCircle2,
  FileAudio,
  HardDrive,
  Laptop,
  HelpCircle,
  Headphones,
  ShieldCheck,
  Disc,
  ArrowDownToLine,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MonitorPlay
} from 'lucide-react';
import { useAudio, AudioTrack } from '../context/AudioContext';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import EmojiReactionPicker from './EmojiReactionPicker';
import StarRating from './StarRating';
import VideoPlayerModal from './VideoPlayerModal';

interface NetflixModalProps {
  track: AudioTrack | null;
  onClose: () => void;
  onSelectTrack?: (track: AudioTrack) => void;
}

export default function NetflixModal({ track: propTrack, onClose, onSelectTrack }: NetflixModalProps) {
  const { isPlaying, currentTrack, currentTrackIndex, playTrack, togglePlay, downloadTrack, tracks, playbackRate, setPlaybackRate, currentTime, duration, seek, formatTime } = useAudio();
  const [track, setTrack] = useState<AudioTrack | null>(propTrack);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTrack(propTrack);
  }, [propTrack]);

  const [inList, setInList] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [showDownloadGuide, setShowDownloadGuide] = useState(false);
  const [downloadGuideTab, setDownloadGuideTab] = useState<'save-guide' | 'master-wav' | 'flash-drive'>('save-guide');
  const [copiedDownloadLink, setCopiedDownloadLink] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  // Compute related tracks for the currently displayed track
  const relatedTracks = useMemo(() => {
    if (!track || !tracks || tracks.length === 0) return [];
    const currentGenres = new Set(track.genres || []);
    const others = tracks.filter(t => t.id !== track.id);
    
    return [...others].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.artist === track.artist) scoreA += 4;
      if (b.artist === track.artist) scoreB += 4;
      a.genres?.forEach(g => { if (currentGenres.has(g)) scoreA += 3; });
      b.genres?.forEach(g => { if (currentGenres.has(g)) scoreB += 3; });
      if (a.isTrending) scoreA += 1;
      if (b.isTrending) scoreB += 1;
      return scoreB - scoreA;
    });
  }, [track, tracks]);

  // Navigate to a specific track and scroll modal to top
  const handleSelectTrack = (nextTrack: AudioTrack) => {
    setTrack(nextTrack);
    onSelectTrack?.(nextTrack);
    setShowSharePanel(false);
    setShowDownloadGuide(false);
    setDownloadState('idle');
    modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to previous track in catalog
  const handlePrevTrack = () => {
    if (!tracks || tracks.length <= 1 || !track) return;
    const currentIndex = tracks.findIndex(t => t.id === track.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    const prev = tracks[prevIndex];
    if (prev) {
      handleSelectTrack(prev);
    }
  };

  // Navigate to next track in catalog
  const handleNextTrack = () => {
    if (!tracks || tracks.length <= 1 || !track) return;
    const currentIndex = tracks.findIndex(t => t.id === track.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    const next = tracks[nextIndex];
    if (next) {
      handleSelectTrack(next);
    }
  };

  // Keyboard navigation support: 'Esc' to close, Left and Right arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hijacking arrow keys when typing in input/textarea/contentEditable
      const target = e.target as HTMLElement | null;
      const isInputFocused = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        // If an inner panel (download guide or share panel) is open, close that first; otherwise close modal
        if (showDownloadGuide || showSharePanel) {
          setShowDownloadGuide(false);
          setShowSharePanel(false);
        } else {
          onClose();
        }
        return;
      }

      if (isInputFocused) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTrack();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, track, tracks, showDownloadGuide, showSharePanel]);

  if (!track) return null;

  const trackIndex = tracks.findIndex(t => t.id === track.id);
  const isThisPlaying = isPlaying && currentTrackIndex === (trackIndex >= 0 ? trackIndex : 0);

  // Generate canonical track-specific shareable URL
  const getTrackShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('track', String(track.id));
    return url.toString();
  };

  const shareUrl = getTrackShareUrl();
  const promoTitle = `${track.title} • DJ Emma Pro FX`;
  const promoMessage = `🔥 Stream "${track.title}" by ${track.artist} on DJ Emma Pro FX! Continuous Ateso club mixes and studio drops in HD:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShareFeedback('Share link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setShareFeedback(null);
      }, 3000);
    } catch {
      setShareFeedback('Please copy the link from the text box below.');
      setTimeout(() => setShareFeedback(null), 3500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: promoTitle,
          text: promoMessage,
          url: shareUrl,
        });
        setShareFeedback('Shared successfully!');
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // If native share fails or was dismissed with error, toggle the share panel fallback
          setShowSharePanel(true);
        }
      }
    } else {
      setShowSharePanel(true);
    }
  };

  const episodes = [
    {
      number: 1,
      title: 'Intro & Signature Voice Drop Blast',
      duration: '04:15',
      desc: 'Exclusive vocal tag opening, build-up rhythm, and Soroti City high-octane club intro.'
    },
    {
      number: 2,
      title: 'Hype Peak Dancehall Transitions',
      duration: '18:40',
      desc: 'Rapid seamless mixing through top East African party anthems with MC Ricky live vocals.'
    },
    {
      number: 3,
      title: 'Afro-Fusion & Cultural Grooves',
      duration: '14:20',
      desc: 'Heavy percussions, synchronized filter sweeps, and resonant basslines calibrated for concert speakers.'
    },
    {
      number: 4,
      title: 'Grand Finale & Studio Outro FX',
      duration: '08:50',
      desc: 'Explosive laser drops, vinyl scratch patterns, and closing contact booking information.'
    }
  ];

  const handleCopyDownloadLink = async () => {
    try {
      const link = track.downloadUrl || track.url;
      await navigator.clipboard.writeText(link);
      setCopiedDownloadLink(true);
      setShareFeedback('Direct download link copied to clipboard!');
      setTimeout(() => {
        setCopiedDownloadLink(false);
        setShareFeedback(null);
      }, 3000);
    } catch {
      setShareFeedback('Unable to copy link to clipboard.');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  const handleDownloadClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (downloadState === 'downloading') return;

    setDownloadState('downloading');
    setDownloadProgress(0);
    setShareFeedback(`Preparing download for "${track.title}"...`);

    const targetUrl = track.downloadUrl || track.url;
    const targetFilename = track.filename || `${track.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const contentLength = response.headers.get('content-length');
      if (!contentLength) {
        // Direct anchor download
        const a = document.createElement('a');
        a.href = targetUrl;
        a.download = targetFilename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setDownloadState('done');
        setShareFeedback('Download started! Check your browser downloads.');
        setTimeout(() => {
          setDownloadState('idle');
          setShareFeedback(null);
        }, 3500);
        return;
      }

      const total = parseInt(contentLength, 10);
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        setDownloadProgress(Math.min(100, Math.round((loaded / total) * 100)));
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = targetFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setDownloadState('done');
      setShareFeedback(`Successfully saved "${targetFilename}"!`);
      setTimeout(() => {
        setDownloadState('idle');
        setShareFeedback(null);
      }, 4000);

    } catch (err) {
      console.warn("Direct stream download progress failed, triggering native fallback", err);
      downloadTrack(track); // Fallback to context default
      
      // Native anchor trigger
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = targetFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadProgress(100);
      setDownloadState('done');
      setShareFeedback('Download triggered via direct link! Check notifications.');
      setTimeout(() => {
        setDownloadState('idle');
        setShareFeedback(null);
      }, 4000);
    }
  };

  return (
    <motion.div 
      ref={modalScrollRef}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-center p-0 sm:p-4 md:p-6"
    >
      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-[#181818] rounded-none sm:rounded-lg overflow-hidden shadow-2xl border border-zinc-800 my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls: Keyboard Hints, Prev/Next & Close */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {/* Keyboard shortcut hint pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono text-zinc-300 shadow-md">
            <span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">Esc</span>
            <span className="text-zinc-400">Close</span>
            <span className="text-zinc-600 mx-0.5">•</span>
            <span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">←</span>
            <span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">→</span>
            <span className="text-zinc-400">Navigate Mixes</span>
          </div>

          {/* Previous Track Arrow Button */}
          <button
            type="button"
            onClick={handlePrevTrack}
            className="w-9 h-9 rounded-full bg-[#181818]/90 hover:bg-[#282828] text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow hover:scale-105 active:scale-95"
            title="Previous Mix (Left Arrow key)"
            aria-label="Previous track"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Track Arrow Button */}
          <button
            type="button"
            onClick={handleNextTrack}
            className="w-9 h-9 rounded-full bg-[#181818]/90 hover:bg-[#282828] text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow hover:scale-105 active:scale-95"
            title="Next Mix (Right Arrow key)"
            aria-label="Next track"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#181818]/90 hover:bg-[#222] text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow hover:scale-105 active:scale-95"
            title="Close Modal (Esc key)"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Banner Header */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-zinc-900 overflow-hidden">
          {/* Floating Left/Right Chevrons on Hero */}
          <button
            type="button"
            onClick={handlePrevTrack}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#E50914] text-white flex items-center justify-center border border-white/20 hover:border-[#E50914] transition-all cursor-pointer backdrop-blur-sm group shadow-lg"
            title="Previous Mix (Left Arrow key)"
            aria-label="Previous mix"
          >
            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={handleNextTrack}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#E50914] text-white flex items-center justify-center border border-white/20 hover:border-[#E50914] transition-all cursor-pointer backdrop-blur-sm group shadow-lg"
            title="Next Mix (Right Arrow key)"
            aria-label="Next mix"
          >
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
          </button>

          <img
            src={track.backdrop || track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/80 via-transparent to-transparent w-2/3" />

          {/* Banner Overlay Details */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-5 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-[10px]">
                N
              </span>
              <span className="text-zinc-300 font-mono text-[11px] tracking-widest font-bold">
                SERIES • EPISODE COLLECTION
              </span>
            </div>

            <h2 className="font-bebas text-3xl sm:text-5xl text-white tracking-wide leading-tight drop-shadow-md">
              {track.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {/* Play Button */}
              <button
                type="button"
                onClick={() => {
                  if (trackIndex >= 0) {
                    if (isThisPlaying) togglePlay();
                    else playTrack(trackIndex);
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded bg-white hover:bg-white/80 text-black font-bold text-sm transition-all cursor-pointer shadow"
              >
                {isThisPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isThisPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMovieModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm border border-zinc-600 transition-all cursor-pointer shadow"
                title="Watch Full HD Video"
              >
                <MonitorPlay className="w-4 h-4 text-[#E50914]" />
                <span>Watch Video</span>
              </button>

              {/* Primary Download Button */}
              <button
                type="button"
                onClick={handleDownloadClick}
                className="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-sm transition-all shadow-md shadow-[#E50914]/30 cursor-pointer group active:scale-95"
                title={`Download ${track.title} directly to your device`}
              >
                {/* Progress bar background */}
                {downloadState === 'downloading' && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-white/25 transition-all duration-150 ease-out" 
                    style={{ width: `${downloadProgress}%` }} 
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-2">
                  {downloadState === 'downloading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : downloadState === 'done' ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Download className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>
                    {downloadState === 'downloading'
                      ? `Downloading ${downloadProgress}%`
                      : downloadState === 'done'
                      ? 'Downloaded'
                      : 'Download'}
                  </span>
                </span>
              </button>

              {/* High-Quality Guide & Acquisition Instructions Toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowDownloadGuide(!showDownloadGuide);
                  if (!showDownloadGuide) setShowSharePanel(false);
                }}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
                  showDownloadGuide
                    ? 'bg-white text-black ring-2 ring-white/60'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-600 hover:border-zinc-300'
                }`}
                title="View High-Quality audio download options & device instructions"
              >
                <FileAudio className={`w-4 h-4 ${showDownloadGuide ? 'text-[#E50914]' : 'text-zinc-400'}`} />
                <span>HQ Guide</span>
              </button>

              {/* Add to List */}
              <button
                type="button"
                onClick={() => setInList(!inList)}
                className="w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-white flex items-center justify-center text-white cursor-pointer shrink-0"
                title={inList ? 'Remove from List' : 'Add to My List'}
              >
                {inList ? <Check className="w-4 h-4 text-[#46d369]" /> : <Plus className="w-4 h-4" />}
              </button>

              <div className="w-px h-6 bg-zinc-700 mx-1"></div>

              {/* Share Feature Main Trigger */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setShareFeedback(`Direct link for "${track.title}" copied to clipboard!`);
                    setTimeout(() => {
                      setCopied(false);
                      setShareFeedback(null);
                    }, 3500);
                  } catch {
                    setShareFeedback('Please copy the link from the share menu below.');
                    setTimeout(() => setShareFeedback(null), 3000);
                  }
                  setShowSharePanel(!showSharePanel);
                  if (!showSharePanel) setShowDownloadGuide(false);
                }}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
                  showSharePanel
                    ? 'bg-[#E50914] text-white shadow-red-900/40 ring-2 ring-red-500/50'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-600 hover:border-zinc-300'
                }`}
                title="Copy direct share URL with track ID to clipboard"
              >
                <Share2 className="w-4 h-4 text-white" />
                <span>{copied ? 'Copied Link!' : 'Share'}</span>
              </button>

              {/* Quick Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className={`w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-white flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors ${copied ? 'border-[#46d369] text-[#46d369] bg-[#46d369]/10' : ''}`}
                title={copied ? "Link Copied!" : "Copy Track Link"}
              >
                {copied ? <Check className="w-4 h-4 text-[#46d369]" /> : <Link className="w-4 h-4" />}
              </button>

              {/* Quick WhatsApp Share */}
              <button
                onClick={() => {
                  const url = encodeURIComponent(shareUrl);
                  const text = encodeURIComponent(`${promoMessage}\n\n`);
                  window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
                }}
                className="w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-[#25D366] hover:bg-[#25D366]/15 hover:text-[#25D366] flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Share to WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </button>

              {/* Quick Telegram Share */}
              <button
                onClick={() => {
                  const url = encodeURIComponent(shareUrl);
                  const text = encodeURIComponent(promoMessage);
                  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
                }}
                className="w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-[#229ED9] hover:bg-[#229ED9]/15 hover:text-[#229ED9] flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Share to Telegram"
              >
                <Send className="w-4 h-4 text-[#229ED9]" />
              </button>

              {/* Quick X / Twitter Share */}
              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(promoMessage)}&url=${encodeURIComponent(shareUrl)}&hashtags=DJEmmaPro,AtesoMusic`, '_blank');
                }}
                className="w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-sky-400 hover:bg-sky-500/15 hover:text-sky-400 flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Post on X (Twitter)"
              >
                <Twitter className="w-4 h-4 text-sky-400" />
              </button>

              {/* Quick Facebook Share */}
              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                }}
                className="w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-[#1877F2] hover:bg-[#1877F2]/15 hover:text-[#1877F2] flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4 text-[#1877F2]" />
              </button>

              {/* Quick Native Device Share */}
              <button
                onClick={handleNativeShare}
                className="w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-red-400 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Share via Device Apps (Instagram, Bluetooth, Messages)"
              >
                <Smartphone className="w-4 h-4" />
              </button>

              {/* Quick QR Code Toggle */}
              <button
                onClick={() => {
                  setShowSharePanel(true);
                  setShowQR(!showQR);
                }}
                className={`w-9 h-9 rounded-full border border-zinc-500 bg-zinc-900/80 hover:border-white flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors ${showQR && showSharePanel ? 'border-white bg-white/20' : ''}`}
                title="Generate Track QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>

            {/* Seekable Progress Bar */}
            <div className="mt-4 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="font-bold text-white">{currentTrack?.id === track.id ? formatTime(currentTime) : '0:00'}</span>
                <span className="text-zinc-500">{currentTrack?.id === track.id ? formatTime(duration || 0) : (track.durationLabel || 'Nonstop')}</span>
              </div>
              <div className="relative group flex items-center">
                <input
                  type="range"
                  min={0}
                  max={currentTrack?.id === track.id && duration > 0 ? duration : 100}
                  step={0.1}
                  value={currentTrack?.id === track.id ? currentTime : 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    seek(val);
                  }}
                  className="w-full accent-[#E50914] cursor-pointer h-2 bg-zinc-800 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Playback Speed Control Slider & Quick Buttons */}
            <div className="mt-4 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Playback Speed:</span>
                <span className="text-xs font-mono font-bold text-[#E50914] bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800/40">{playbackRate.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                      playbackRate === rate
                        ? 'bg-[#E50914] text-white shadow-md'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
              <div className="w-full sm:w-auto flex items-center gap-2 mt-1 sm:mt-0">
                <span className="text-[10px] text-zinc-500 font-mono">0.5x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="w-32 sm:w-40 accent-[#E50914] cursor-pointer h-1.5 bg-zinc-700 rounded-lg"
                />
                <span className="text-[10px] text-zinc-500 font-mono">2.0x</span>
              </div>
            </div>

            {/* Quick Feedback Toast */}
            {shareFeedback && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{shareFeedback}</span>
              </div>
            )}

            {/* Emoji Reactions System */}
            <EmojiReactionPicker trackId={track.id} />
          </div>
        </div>

        {/* Dedicated High-Quality Audio & Download Guide Station */}
        <AnimatePresence>
          {showDownloadGuide && (
            <motion.div
              key="download-guide-station"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden bg-[#151515] border-b border-zinc-800"
            >
              <div className="p-4 sm:p-6 space-y-5 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#E50914] flex items-center justify-center text-white shadow-lg shadow-red-900/30 shrink-0">
                      <FileAudio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          Download & High-Quality Audio Studio
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-semibold">
                          320 KBPS MASTER
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Acquire <span className="text-white font-medium">{track.title}</span> for offline listening or request uncompressed Studio Master files.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDownloadGuide(false)}
                    className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Close Download Guide"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Quick Download Bar */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/90 border border-zinc-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Disc className="w-4 h-4 text-[#E50914] animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[280px] sm:max-w-md">
                        {track.filename || `${track.title}.mp4`}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Format: MP4/MP3 Audio Stream • 320kbps High Definition • Soroti Studio Master
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadClick}
                      className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-red-900/40 cursor-pointer active:scale-95"
                    >
                      {downloadState === 'downloading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : downloadState === 'done' ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <ArrowDownToLine className="w-4 h-4" />
                      )}
                      <span>
                        {downloadState === 'downloading'
                          ? `Downloading ${downloadProgress}%`
                          : downloadState === 'done'
                          ? 'Saved to Device'
                          : 'Download Mix Now'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyDownloadLink}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-600 font-semibold text-xs transition-colors cursor-pointer"
                      title="Copy direct file link"
                    >
                      {copiedDownloadLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copiedDownloadLink ? 'Copied' : 'Copy Link'}</span>
                    </button>

                    <a
                      href={track.downloadUrl || track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-600 font-semibold text-xs transition-colors"
                      title="Open direct file in new browser window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Direct Link</span>
                    </a>
                  </div>
                </div>

                {/* Guide Navigation Tabs */}
                <div className="flex border-b border-zinc-800 gap-2">
                  <button
                    type="button"
                    onClick={() => setDownloadGuideTab('save-guide')}
                    className={`pb-2 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                      downloadGuideTab === 'save-guide'
                        ? 'border-[#E50914] text-white'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>How to Save on Devices</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDownloadGuideTab('master-wav')}
                    className={`pb-2 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                      downloadGuideTab === 'master-wav'
                        ? 'border-[#E50914] text-white'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Lossless Studio Master (WAV)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDownloadGuideTab('flash-drive')}
                    className={`pb-2 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                      downloadGuideTab === 'flash-drive'
                        ? 'border-[#E50914] text-white'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>DJ Flash Drive Delivery</span>
                  </button>
                </div>

                {/* Tab 1: How to Save on Mobile & PC */}
                {downloadGuideTab === 'save-guide' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    {/* iOS */}
                    <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold text-xs">
                        <Smartphone className="w-4 h-4 text-sky-400" />
                        <span>iPhone & iPad (iOS Safari)</span>
                      </div>
                      <ol className="text-[11px] text-zinc-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                        <li>Tap the red <strong>Download Mix Now</strong> button above.</li>
                        <li>When Safari prompts, tap <strong>Download</strong>.</li>
                        <li>Tap the blue download icon (circle with down arrow) in Safari's address bar.</li>
                        <li>Tap the file, press the <strong>Share</strong> button, and tap <strong>"Save to Files"</strong>.</li>
                        <li>Plays offline in the Files app, Apple Music, or VLC!</li>
                      </ol>
                    </div>

                    {/* Android */}
                    <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold text-xs">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>Android (Chrome / Samsung)</span>
                      </div>
                      <ol className="text-[11px] text-zinc-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                        <li>Tap <strong>Download Mix Now</strong>.</li>
                        <li>Download begins automatically in your top notification drawer.</li>
                        <li>Once complete, tap the notification to open.</li>
                        <li>The file is permanently in your <strong>"Downloads"</strong> or <strong>"My Files"</strong> folder.</li>
                        <li>Plays in any player: Samsung Music, Boomplay, Poweramp, VLC.</li>
                      </ol>
                    </div>

                    {/* PC & DJs */}
                    <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold text-xs">
                        <Laptop className="w-4 h-4 text-amber-400" />
                        <span>PC / Mac & DJ Software</span>
                      </div>
                      <ol className="text-[11px] text-zinc-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                        <li>Click <strong>Download Mix Now</strong> to save directly into your `Downloads` folder.</li>
                        <li>File includes clean audio tag headers for Serato DJ, Rekordbox, VirtualDJ, and Traktor.</li>
                        <li>Consistent tempo and high dynamic output calibrated for club mixers.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Tab 2: Lossless Studio Master (WAV / 24-bit) */}
                {downloadGuideTab === 'master-wav' && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/30 to-zinc-900 border border-red-900/40 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#E50914]" />
                        <h4 className="text-sm font-bold text-white">How to Acquire the Uncompressed Studio Master (24-bit WAV)</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        AUDIOPHILE RIGS
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      While our direct web downloads are high-fidelity 320kbps MP3 streams, professional concert sound operators, radio broadcast stations, and club sound systems often require the raw <strong>24-bit / 48kHz uncompressed WAV / AIFF studio master</strong> with full acoustic headroom and zero lossy frequency cutting.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                        <span className="font-bold text-white block">1. Instant WhatsApp Dispatch</span>
                        <p className="text-[11px] text-zinc-400">
                          DJ Emma Pro FX sends the uncompressed master file directly to your WhatsApp or via Google Drive link within minutes.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                        <span className="font-bold text-white block">2. Custom Voice Tags & Dedications</span>
                        <p className="text-[11px] text-zinc-400">
                          You can also request a customized edition with your name, club shoutout, or corporate brand voiced into the master.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <a
                        href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20want%20to%20acquire%20the%20uncompressed%20Studio%20Master%20(24-bit%20WAV)%20for:%20${encodeURIComponent(track.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1ebd5a] text-black font-bold text-xs rounded-lg transition-colors shadow"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Request Studio Master on WhatsApp (+256 780 527 361)</span>
                      </a>

                      <a
                        href="https://t.me/djemmaprofx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-semibold text-xs rounded-lg transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Telegram Studio Channel</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Tab 3: DJ Flash Drive Delivery */}
                {downloadGuideTab === 'flash-drive' && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-[#E50914]" />
                      <h4 className="text-sm font-bold text-white">Full DJ Collection on USB Flash Drive or SD Card</h4>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Save mobile data and keep your sound system loaded for all weekend events! Order a dedicated 32GB or 64GB high-speed SanDisk USB 3.0 Flash Drive pre-loaded with:
                    </p>

                    <ul className="text-xs text-zinc-300 space-y-1.5 list-disc pl-5">
                      <li>Complete seasons of DJ Emma Pro FX nonstop party, reggae, and cultural club mixes.</li>
                      <li>Over 100+ high-definition DJ voice drops, laser sound effects, and party intros.</li>
                      <li>3D animated logo video files (1080p / 4K) for screen projection and club TVs.</li>
                      <li>Hand delivery in <strong>Soroti City</strong>, Kumi, Mbale, and express door-to-door / bus parcel shipping across Uganda (Kampala, Jinja, Gulu, etc.).</li>
                    </ul>

                    <div className="pt-1">
                      <a
                        href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20want%20to%20order%20a%20loaded%20DJ%20USB%20Flash%20Drive%20with%20all%20mixtapes%20including%20${encodeURIComponent(track.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs rounded-lg transition-colors shadow"
                      >
                        <HardDrive className="w-4 h-4" />
                        <span>Order Loaded DJ Flash Drive via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dedicated Interactive Share & Promotion Station */}
        <AnimatePresence>
          {showSharePanel && (
            <motion.div
              key="share-panel-station"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden bg-[#1f1f1f] border-b border-zinc-800"
            >
              <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center text-white shadow-md">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        Share & Promote Track
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-mono">
                          Track #{track.id}
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Share <span className="text-white font-medium">{track.title}</span> with a direct playable link or promote on social channels.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSharePanel(false)}
                    className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Close Share Panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Direct Shareable Link Box */}
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Direct Shareable Link</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-9 pr-3 text-xs sm:text-sm text-zinc-200 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none font-mono selection:bg-[#E50914]"
                      />
                      <Link className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 shadow active:scale-95"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Social Media 1-Click Promotion Buttons */}
                <div>
                  <p className="text-zinc-400 text-xs font-semibold mb-2">Promote on Social Media</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${promoMessage}\n\n${shareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>WhatsApp</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(promoMessage)}&url=${encodeURIComponent(shareUrl)}&hashtags=DJEmmaPro,AtesoMusic,NonstopMix`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Post to X</span>
                    </a>

                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(promoMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-[#229ED9] font-semibold text-xs transition-colors"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span>Telegram</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#1877F2] font-semibold text-xs transition-colors"
                    >
                      <Facebook className="w-4 h-4 shrink-0" />
                      <span>Facebook</span>
                    </a>
                  </div>
                </div>

                {/* Secondary Actions: Native Web Share, Email & QR Code */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-zinc-800/80 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleNativeShare}
                      className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg bg-gradient-to-r from-red-600/20 to-red-900/20 hover:from-red-600/30 hover:to-red-900/30 border border-red-500/40 text-red-300 font-semibold cursor-pointer transition-colors"
                      title="Share to installed phone apps"
                    >
                      <Smartphone className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Share via Device Apps</span>
                    </button>

                    <a
                      href={`mailto:?subject=${encodeURIComponent(promoTitle)}&body=${encodeURIComponent(`${promoMessage}\n\nListen here:\n${shareUrl}`)}`}
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold cursor-pointer transition-colors border border-zinc-700"
                      title="Share via Email"
                    >
                      <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>Share via Email</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold cursor-pointer transition-colors ml-auto border border-zinc-700"
                  >
                    <QrCode className="w-4 h-4 text-zinc-400" />
                    <span>{showQR ? 'Hide QR Code' : 'Show Mobile QR Code'}</span>
                  </button>
                </div>

                {/* Expandable QR Code Card */}
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-white rounded-xl shadow-xl flex flex-col sm:flex-row items-center justify-center gap-4 text-black border border-zinc-200"
                  >
                    <div className="p-2 bg-white rounded-lg border border-zinc-200 shadow-inner shrink-0">
                      <QRCodeSVG
                        value={shareUrl}
                        size={130}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="Q"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <h4 className="font-bold text-sm text-zinc-900">Scan to Open Mix on Phone</h4>
                      <p className="text-xs text-zinc-600 max-w-xs">
                        Scan with any mobile camera to immediately stream <span className="font-semibold text-black">{track.title}</span>.
                      </p>
                      <p className="text-[11px] font-mono text-zinc-500 pt-1 truncate max-w-xs">
                        {shareUrl}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6">
          {/* Metadata & Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                <span className="text-[#46d369] font-bold text-sm">{track.matchScore}% Match</span>
                <span className="text-zinc-400">{track.year}</span>
                <span className="border border-zinc-600 px-1 py-0.5 rounded text-[10px] text-zinc-300 font-mono">
                  {track.ageRating}
                </span>
                <span className="border border-zinc-600 px-1 py-0.5 rounded text-[10px] text-zinc-300 font-mono">
                  {track.quality}
                </span>
              </div>

              <div className="pt-1 pb-2">
                <StarRating trackId={track.id} size="lg" />
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {track.description}
              </p>

              {/* High-Quality Download & Audio Master Callout Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#E50914] shrink-0">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      High-Quality Audio & Downloads
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        320kbps MP3 / WAV
                      </span>
                    </h4>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      Download this mix to your device or learn how to acquire the 24-bit uncompressed studio master.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadClick}
                    className="px-3.5 py-2 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Mix</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDownloadGuide(true);
                      setShowSharePanel(false);
                    }}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs rounded-lg transition-colors border border-zinc-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                    <span>HQ Guide</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp Quick Order Callout */}
              <div className="p-4 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">Want this custom branded for your event?</h4>
                  <p className="text-zinc-400 text-xs mt-0.5">Order custom voice drops, intros, or full personalized mixtapes.</p>
                </div>
                <a
                  href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20want%20to%20order%20a%20custom%20version%20of%20${encodeURIComponent(track.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs rounded transition-colors whitespace-nowrap"
                >
                  ORDER ON WHATSAPP
                </a>
              </div>
            </div>

            {/* Sidebar Specifications */}
            <div className="space-y-3 text-xs text-zinc-400 border-l border-zinc-800 pl-4 hidden md:block">
              <div>
                <span className="text-zinc-500">Artist / DJ:</span>{' '}
                <span className="text-zinc-200">{track.artist}</span>
              </div>
              <div>
                <span className="text-zinc-500">Genres:</span>{' '}
                <span className="text-zinc-200">{track.genres.join(', ')}</span>
              </div>
              <div>
                <span className="text-zinc-500">Audio Bitrate:</span>{' '}
                <span className="text-zinc-200">320kbps MP3 / WAV Master</span>
              </div>
              <div>
                <span className="text-zinc-500">Origin:</span>{' '}
                <span className="text-zinc-200">Soroti City & Kampala, Uganda</span>
              </div>
              <div>
                <span className="text-zinc-500">Production Studio:</span>{' '}
                <span className="text-[#E50914] font-bold">DJ EMMA PRO STUDIOS</span>
              </div>
            </div>
          </div>

          {/* Episodes Breakdown */}
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Episodes & Segments</h3>
              <span className="text-xs text-zinc-400 font-mono">SEASON 2026</span>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {episodes.map((ep) => (
                <div
                  key={ep.number}
                  className="py-3 flex items-start gap-4 hover:bg-zinc-800/40 p-2 rounded transition-colors group"
                >
                  <span className="text-lg font-mono text-zinc-500 font-bold w-6">{ep.number}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                        {ep.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-zinc-400">{ep.duration}</span>
                        <button
                          type="button"
                          onClick={handleDownloadClick}
                          className="p-1 rounded bg-zinc-800/80 hover:bg-[#E50914] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title={`Download ${ep.title} (${track.quality || '320kbps'})`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{ep.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* More Like This (Related Mixtapes) */}
          {relatedTracks.length > 0 && (
            <div className="pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    More Like This
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
                      Use ← / → arrow keys to browse
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Continuous Ateso mixes, live video sets, and cultural club anthems by DJ Emma Pro FX
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevTrack}
                    className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Previous Mix (←)"
                    aria-label="Previous related mix"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTrack}
                    className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Next Mix (→)"
                    aria-label="Next related mix"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {relatedTracks.slice(0, 6).map((relTrack) => (
                  <div
                    key={relTrack.id}
                    onClick={() => handleSelectTrack(relTrack)}
                    className="group bg-[#202020] hover:bg-[#282828] rounded-md overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                      <img
                        src={relTrack.backdrop || relTrack.thumbnail}
                        alt={relTrack.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
                        {relTrack.durationLabel || 'Nonstop'}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[#46d369] font-bold text-xs">{relTrack.matchScore}% Match</span>
                          <span className="text-[10px] text-zinc-400 font-mono border border-zinc-700 px-1 rounded">
                            {relTrack.quality ? relTrack.quality.split('•')[0].trim() : 'HD'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                          {relTrack.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-snug">
                          {relTrack.description}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                        <span>{relTrack.artist}</span>
                        <span className="text-[#E50914] font-semibold group-hover:underline">View Mix →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <VideoPlayerModal
        track={track}
        isOpen={isMovieModalOpen}
        onClose={() => setIsMovieModalOpen(false)}
      />
    </motion.div>
  );
}
