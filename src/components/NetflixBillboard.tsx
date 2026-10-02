import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Download, Info, Volume2, VolumeX, Flame, Award, Sparkles, CheckCircle2, Youtube, X } from 'lucide-react';
import { useAudio, AudioTrack } from '../context/AudioContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { useLanguage } from '../context/LanguageContext';
import EmojiReactionPicker from './EmojiReactionPicker';
import { BillboardSkeleton } from './NetflixSkeleton';

interface NetflixBillboardProps {
  onOpenModal: (track: AudioTrack) => void;
  onOpenTrustModal?: () => void;
  isLoading?: boolean;
}

export default function NetflixBillboard({ onOpenModal, onOpenTrustModal, isLoading = false }: NetflixBillboardProps) {
  const { t } = useLanguage();
  const { tracks, currentTrackIndex, isPlaying, togglePlay, playTrack, volume, setVolume, downloadTrack } = useAudio();
  const { recordMixtapePlayed } = useWatchHistory();
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isPlayingDirectVideo, setIsPlayingDirectVideo] = useState(false);
  const [selectedBillboardId, setSelectedBillboardId] = useState<'street-anthem' | 'vyroota' | 'reggae'>('street-anthem');

  if (isLoading) {
    return <BillboardSkeleton />;
  }

  const streetAnthemTrack: AudioTrack = tracks.find(t => t.url.includes('STREET_ANTHEM_90')) || tracks[0] || {
    id: 1,
    title: 'STREET ANTHEM 90 • DJ EMMA PRO & WAKANDA DJs',
    artist: 'DJ EMMA PRO x DIVINE DEEJAY UG (FIRE FLAMES DJs)',
    durationLabel: '58:40 Master Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790955038/STREET_ANTHEM_90_DJ_EMMA_PRO_WAKANDA_DJs__DIVINE_DEEJAY_UG_FIRE_FLAMES_DJs_-1.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Street_Anthem_90_DJ_Emma_Pro_Wakanda_DJs/v1790955038/STREET_ANTHEM_90_DJ_EMMA_PRO_WAKANDA_DJs__DIVINE_DEEJAY_UG_FIRE_FLAMES_DJs_-1.mp3',
    filename: 'Street_Anthem_90_DJ_Emma_Pro_Wakanda_DJs.mp3',
    thumbnail: 'https://res.cloudinary.com/foscgxvd/image/upload/v1790956113/file_00000000956c82439256c2a0ce77b093.png',
    backdrop: 'https://res.cloudinary.com/foscgxvd/image/upload/v1790956113/file_00000000956c82439256c2a0ce77b093.png',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Studio Master 320kbps',
    genres: ['Street Anthem', 'Afrobeats', 'Ugandan Hits', 'Wakanda DJs'],
    description: 'Top Featured Nonstop: STREET ANTHEM 90 by DJ EMMA PRO from Wakanda DJs & Divine Deejay UG Fire Flames DJs. High-energy street bangers, viral Ugandan hits, and non-stop hype transitions. Stream on site or download directly to your phone.',
    isTrending: true,
    topRank: 1
  };

  const vyrootaTrack: AudioTrack = tracks.find(t => t.youtubeId === '17uskDXOuvY') || {
    id: 18,
    title: 'BEST OF VYROOTA NONSTOP 2026 • DJ EMMA PRO',
    artist: 'DJ EMMA PRO',
    durationLabel: '52:18 Nonstop Mix',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786103/best_of_vyroota_full_mixtape.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Best_Of_Vyroota_Nonstop_2026/v1789786103/best_of_vyroota_full_mixtape.mp3',
    filename: 'Best_Of_Vyroota_Nonstop_2026.mp3',
    thumbnail: 'https://i.ytimg.com/vi/17uskDXOuvY/hqdefault.jpg',
    backdrop: 'https://i.ytimg.com/vi/17uskDXOuvY/hqdefault.jpg',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['Vyroota Nonstop', 'YouTube Premiere', 'Ugandan Hits', 'Afrobeats'],
    description: 'Official YouTube Nonstop Premiere: BEST OF VYROOTA NONSTOP 2026 (From New Songs to Old Songs Hot Mix) by DJ EMMA PRO. Continuous streaming of Vyroota acoustic gems, club bangers, and chart-topping Ugandan hits. Direct play on site & fast phone download.',
    isTrending: true,
    isVideo: true,
    youtubeId: '17uskDXOuvY',
    youtubeUrl: 'https://youtu.be/17uskDXOuvY?si=vsg9XUaI1t83bI0L',
    videoUrl: 'https://www.youtube.com/embed/17uskDXOuvY',
    topRank: 1
  };

  const reggaeTrack: AudioTrack = tracks.find(t => t.youtubeId === 'TcVAuZcXB5U') || {
    id: 16,
    title: 'ONE DROP REGGEA MIX VOL 1 BY DJ EMMA PRO',
    artist: 'DJ EMMA PRO',
    durationLabel: 'YouTube Premiere Nonstop',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786241/ONE_DROP_REGGEA_MIX_VOL_ONE.mp3',
    thumbnail: 'https://i.ytimg.com/vi/TcVAuZcXB5U/hqdefault.jpg',
    backdrop: 'https://i.ytimg.com/vi/TcVAuZcXB5U/hqdefault.jpg',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    description: 'Official YouTube Video Premiere: ONE DROP REGGEA MIX VOL 1 BY DJ EMMA PRO. Continuous reggae rhythms and heavy basslines. Anyone can play and stream directly from the website without redirects.',
    genres: ['One Drop Reggae', 'YouTube Premiere', 'Roots & Culture'],
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:DJ_Emma_Pro_One_Drop_Reggae_Mix_Vol_1/v1789786241/ONE_DROP_REGGEA_MIX_VOL_ONE.mp3',
    filename: 'DJ_Emma_Pro_One_Drop_Reggae_Mix_Vol_1.mp3',
    youtubeId: 'TcVAuZcXB5U'
  };

  const featuredTrack: AudioTrack = 
    selectedBillboardId === 'street-anthem'
      ? streetAnthemTrack
      : selectedBillboardId === 'vyroota' 
        ? vyrootaTrack 
        : reggaeTrack;

  const featuredTrackIndex = tracks.findIndex(t => t.id === featuredTrack.id || t.url === featuredTrack.url);
  const isCurrentPlaying = isPlaying && currentTrackIndex === (featuredTrackIndex >= 0 ? featuredTrackIndex : 0);

  const handleToggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.8);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative w-full min-h-[82vh] lg:min-h-[92vh] flex items-center bg-transparent overflow-hidden select-none"
    >
      {/* Background Poster Image (Cinematic Wallpaper with Translucency) */}
      <div className="absolute inset-0 opacity-65">
        <img
          key={featuredTrack.id}
          src={featuredTrack.backdrop || "https://i.ytimg.com/vi/17uskDXOuvY/hqdefault.jpg"}
          alt="DJ Emma Pro FX Featured Billboard"
          className="w-full h-full object-cover object-center lg:object-right-top brightness-90 filter transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Netflix Multi-direction Gradient Vignettes (Translucent so website background shows through) */}
        {/* Dark bottom fade into content rows */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* Dark left fade for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent w-full lg:w-3/4" />
        {/* Top bar vignette */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
      </div>

      {/* Direct Interactive Video Player Modal/Container when playing */}
      <AnimatePresence>
        {isPlayingDirectVideo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col justify-center items-center p-4 sm:p-8"
          >
            <div className="w-full max-w-5xl">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E50914]"></span>
                  </span>
                  <span className="text-white font-black text-sm sm:text-base tracking-wide flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-[#E50914] fill-current" />
                    STREAMING DIRECT FROM WEBSITE: {featuredTrack.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingDirectVideo(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-[#E50914] text-white text-xs font-bold transition-all cursor-pointer border border-zinc-700 hover:border-red-600"
                >
                  <X className="w-4 h-4" />
                  <span>Close Video</span>
                </button>
              </div>

              {/* YouTube Responsive iFrame Player */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(229,9,20,0.4)] border border-red-600/40 bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${featuredTrack.youtubeId || '17uskDXOuvY'}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={featuredTrack.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>Direct on-site player powered by DJ EMMA PRO</span>
                <button
                  type="button"
                  onClick={() => setIsPlayingDirectVideo(false)}
                  className="text-zinc-300 hover:text-white underline cursor-pointer"
                >
                  Return to Dashboard Billboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billboard Main Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Nonstop Display Switcher Tabs */}
          <div className="inline-flex flex-wrap items-center p-1 bg-black/70 backdrop-blur-md rounded-2xl sm:rounded-full border border-white/15 mb-4 shadow-xl gap-1">
            <button
              type="button"
              onClick={() => setSelectedBillboardId('street-anthem')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide transition-all cursor-pointer ${
                selectedBillboardId === 'street-anthem'
                  ? 'bg-gradient-to-r from-[#E50914] to-red-600 text-white shadow-lg shadow-red-900/50 scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>🔥 #1 STREET ANTHEM 90 (TOP FEATURED)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedBillboardId('vyroota')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedBillboardId === 'vyroota'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>BEST OF VYROOTA</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedBillboardId('reggae')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedBillboardId === 'reggae'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ONE DROP REGGAE</span>
            </button>
          </div>

          {/* Netflix Series Tag */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-7 rounded-[2px] bg-[#E50914] flex items-center justify-center font-black text-white text-xs shadow-md">
              N
            </div>
            <span className="text-zinc-300 font-mono uppercase tracking-[0.3em] text-xs font-bold">
              {selectedBillboardId === 'street-anthem' ? 'TOP FEATURED NONSTOP • 2026 MASTER' : 'ORIGINAL SERIES • SEASON 2026'}
            </span>
          </div>

          {/* Massive Display Title */}
          <h1 className="font-bebas text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[0.95] drop-shadow-2xl uppercase">
            {selectedBillboardId === 'street-anthem' ? (
              <>
                STREET ANTHEM 90 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  WAKANDA DJs <span className="text-[#E50914]">&amp; DJ EMMA PRO</span>
                </span>
              </>
            ) : selectedBillboardId === 'vyroota' ? (
              <>
                BEST OF VYROOTA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  NONSTOP 2026 <span className="text-[#E50914]">BY DJ EMMA PRO</span>
                </span>
              </>
            ) : (
              <>
                ONE DROP REGGEA MIX <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  VOL 1 <span className="text-[#E50914]">BY DJ EMMA PRO</span>
                </span>
              </>
            )}
          </h1>

          {/* Top 10 Badge & Match Indicators */}
          <div className="flex flex-wrap items-center gap-3 my-4 text-xs sm:text-sm font-semibold">
            {/* Top 10 in Uganda */}
            <div className="flex items-center gap-1.5 bg-[#E50914] text-white px-2 py-0.5 rounded font-black tracking-wider text-xs shadow-md">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>#1 IN MIXES TODAY</span>
            </div>

            {/* Direct Playable Badge */}
            <div className="flex items-center gap-1.5 bg-red-600/30 border border-red-500/50 text-red-300 px-2 py-0.5 rounded font-black tracking-wider text-xs backdrop-blur-sm">
              <Youtube className="w-3.5 h-3.5 fill-current" />
              <span>DIRECT WEBSITE VIDEO</span>
            </div>

            {/* Match Score (Netflix Signature Green) */}
            <span className="text-[#46d369] font-bold text-sm tracking-wide">
              {featuredTrack.matchScore}% Match
            </span>

            {/* Year */}
            <span className="text-zinc-400 font-medium">2026</span>

            {/* Maturity Rating */}
            <span className="border border-zinc-600/70 bg-black/30 px-1.5 py-0.5 text-[11px] text-zinc-300 font-mono rounded">
              TV-MA
            </span>

            {/* Quality Badges */}
            <span className="border border-zinc-600/70 bg-black/30 px-1.5 py-0.5 text-[10px] text-zinc-300 font-mono rounded">
              ULTRA HD 4K
            </span>
            <span className="border border-zinc-600/70 bg-black/30 px-1.5 py-0.5 text-[10px] text-zinc-300 font-mono rounded hidden sm:inline">
              SPATIAL AUDIO
            </span>
            <span className="bg-white/10 px-2 py-0.5 text-[11px] text-zinc-300 rounded hidden md:inline backdrop-blur-sm">
              {featuredTrack.durationLabel || 'Nonstop Edition'}
            </span>
          </div>

          {/* Emoji Reactions */}
          <div className="mb-4">
            <EmojiReactionPicker trackId={featuredTrack.id} />
          </div>

          {/* Synopsis */}
          <p className="text-zinc-200 text-sm sm:text-base lg:text-lg line-clamp-3 mb-7 font-sans leading-relaxed drop-shadow-md max-w-xl">
            {featuredTrack.description}
          </p>

          {/* Netflix Billboard Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {featuredTrack.youtubeId ? (
              <>
                {/* Play Video Direct on Website Button (Primary Red) */}
                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying) togglePlay(); // Pause background audio
                    setIsPlayingDirectVideo(true);
                    recordMixtapePlayed(featuredTrack);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded bg-[#E50914] hover:bg-[#b80710] active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-xl shadow-red-950/60 cursor-pointer hover:scale-105"
                  title="Play this video directly from the website"
                >
                  <Youtube className="w-5 h-5 fill-current" />
                  <span>Play Video Direct</span>
                </button>

                {/* Audio Play Button (White with black text) */}
                <button
                  onClick={() => {
                    setIsPlayingDirectVideo(false);
                    if (isCurrentPlaying) {
                      togglePlay();
                    } else {
                      recordMixtapePlayed(featuredTrack);
                      const targetIndex = tracks.findIndex(t => t.id === featuredTrack.id || t.url === featuredTrack.url);
                      playTrack(targetIndex >= 0 ? targetIndex : 0);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded bg-white hover:bg-white/80 active:scale-95 text-black font-bold text-sm sm:text-base tracking-wide transition-all shadow-xl cursor-pointer"
                >
                  {isCurrentPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Listen Audio</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Street Anthem Master Audio Play Button (Primary Red) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingDirectVideo(false);
                    if (isCurrentPlaying) {
                      togglePlay();
                    } else {
                      recordMixtapePlayed(featuredTrack);
                      const targetIndex = tracks.findIndex(t => t.id === featuredTrack.id || t.url === featuredTrack.url);
                      playTrack(targetIndex >= 0 ? targetIndex : 0);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded bg-gradient-to-r from-[#E50914] via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-xl shadow-red-950/70 cursor-pointer hover:scale-105"
                  title="Stream Street Anthem 90 Master Nonstop directly on site"
                >
                  {isCurrentPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Pause Nonstop</span>
                      <span className="flex items-center gap-0.5 ml-1">
                        <span className="w-1 h-3 bg-white rounded-full animate-bounce"></span>
                        <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
                        <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Stream Nonstop (58:40)</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Download to Phone Button */}
            <a
              href={featuredTrack.downloadUrl}
              download={featuredTrack.filename}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => downloadTrack(featuredTrack)}
              title="Download to phone directly"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-emerald-950/40 cursor-pointer hover:scale-105 border border-emerald-400/40"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Download MP3</span>
            </a>

            {/* More Info Button */}
            <button
              onClick={() => onOpenModal(featuredTrack)}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded bg-zinc-700/60 hover:bg-zinc-600/80 active:scale-95 text-white font-bold text-sm sm:text-base tracking-wide transition-all backdrop-blur-md cursor-pointer border border-white/10"
            >
              <Info className="w-5 h-5" />
              <span>{t('hero.info')}</span>
            </button>

            {/* 3D Logos Reveal Button */}
            <a
              href="#welcome-3d-logos-hero"
              onClick={(e) => {
                const el = document.getElementById('welcome-3d-logos-hero');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/50 hover:border-red-400 active:scale-95 font-bold text-sm sm:text-base tracking-wide transition-all backdrop-blur-md cursor-pointer shadow-lg shadow-red-950/40 hover:scale-105"
              title="Watch 3D LOGO REVEAL Welcome Video Animations"
            >
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>3D Logos</span>
            </a>

            {/* How it Works / Proof Button */}
            <button
              type="button"
              onClick={onOpenTrustModal}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/70 active:scale-95 font-bold text-sm sm:text-base tracking-wide transition-all backdrop-blur-md cursor-pointer shadow-lg shadow-emerald-950/40 hover:scale-105"
              title="View verified WhatsApp delivery screenshots"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Verified Proof</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right-Side Netflix Audio & Maturity Overlay */}
      <div className="absolute right-0 bottom-24 lg:bottom-32 flex items-center z-20">
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="w-10 h-10 rounded-full border border-white/40 bg-black/50 hover:bg-black/80 flex items-center justify-center text-white mr-4 transition-colors cursor-pointer backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="bg-zinc-900/80 border-l-2 border-white px-3.5 py-1.5 text-xs font-mono text-zinc-300 font-bold backdrop-blur-sm">
          TV-MA
        </div>
      </div>
    </motion.section>
  );
}
