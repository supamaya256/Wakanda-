import { motion } from 'motion/react';
import { ArrowRight, Disc3, Radio, Activity, Play, Pause, Volume2, Headphones, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';

export default function Hero() {
  const { tracks, currentTrackIndex, currentTrack, isPlaying, togglePlay, playTrack, currentTime, duration, formatTime, downloadTrack } = useAudio();

  const images = [
    '/wallpaper.png',
    '/WhatsApp Image 2026-06-17 at 12.23.24 PM.jpeg',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2787&auto=format&fit=crop'
  ];
  
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-transparent">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffcc1a_1px,transparent_1px),linear-gradient(to_bottom,#00ffcc1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      {/* Signal Routes (Animated lines) */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div 
          animate={{ y: ['-100%', '200%'] }} 
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute left-[15%] top-0 w-px h-[200px] bg-gradient-to-b from-transparent via-[#00ffcc] to-transparent"
        ></motion.div>
        <motion.div 
          animate={{ y: ['-100%', '200%'] }} 
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
          className="absolute right-[20%] top-0 w-px h-[150px] bg-gradient-to-b from-transparent via-[#ff00ff] to-transparent"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left relative"
          >
            <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00ffcc] via-[#ff00ff] to-transparent hidden md:block"></div>
            
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-black/60 border border-[#00ffcc]/40 backdrop-blur-md text-[#00ffcc] text-xs font-bold tracking-[0.2em] mb-6 rounded-sm uppercase shadow-[0_0_15px_rgba(0,255,204,0.15)]" style={{fontFamily: "'Space Mono', monospace"}}>
              <Radio className="w-4 h-4 animate-pulse text-[#ff00ff]" />
              <span>TRANSMITTING LIVE • HQ DJ AUDIO</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-white mb-2 leading-[0.9] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              DJ EMMA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] via-cyan-400 to-[#00b3ff]">
                PRO FX
              </span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl font-semibold tracking-widest text-[#ff00ff] mb-6 uppercase drop-shadow-[0_2px_10px_rgba(255,0,255,0.4)]" style={{fontFamily: "'Space Mono', monospace"}}>
              PROFESSIONAL DJ DROPS & 3D ANIMATION
            </h2>
            
            <p className="text-zinc-300 text-lg mb-8 max-w-lg leading-relaxed font-medium">
              Create a powerful identity for your DJ brand with professional voice drops, custom audio branding, and cinematic 3D animated logos.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a 
                href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20order%20a%20DJ%20Drop"
                target="_blank"
                rel="noopener noreferrer" 
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00ffcc] text-black font-bold tracking-[0.1em] text-sm hover:bg-white transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(0,255,204,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <Activity className="w-5 h-5 relative z-10" />
                <span className="relative z-10">ORDER YOUR DJ DROP</span>
              </a>
              <a 
                href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20order%20a%203D%20Animated%20Logo"
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center px-8 py-4 bg-black/60 backdrop-blur-md border border-[#ff00ff]/60 text-white font-bold tracking-[0.1em] text-sm hover:bg-[#ff00ff]/20 hover:border-[#ff00ff] transition-all duration-300 shadow-[0_0_20px_rgba(255,0,255,0.2)]"
              >
                EXPLORE 3D LOGOS
              </a>
            </div>

            {/* LIVE MIX PLAYER AT THE STARTING OF THE WEBSITE */}
            <div className="p-4 sm:p-5 bg-black/80 backdrop-blur-xl border border-[#00ffcc]/40 rounded-xl shadow-[0_0_35px_rgba(0,255,204,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffcc]/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-[#00ffcc]' : 'bg-purple-400'} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-[#00ffcc]' : 'bg-purple-500'}`}></span>
                  </span>
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#00ffcc] uppercase flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    STREAMING MIXES • VOL 0{currentTrack.id}
                  </span>
                </div>
                <a href="#mixes" className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors underline decoration-[#00ffcc]/50">
                  ALL MIXES ({tracks.length}) ↓
                </a>
              </div>

              {/* Main Player Display */}
              <div className="flex items-center gap-3 sm:gap-4 bg-[#0d0d0d]/90 border border-white/10 p-3 rounded-lg mb-3 relative z-10">
                <button
                  type="button"
                  onClick={togglePlay}
                  title={isPlaying ? "Pause Mix" : "Play Mix"}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-[#00ffcc] text-white flex items-center justify-center shrink-0 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,204,0.5)] cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00ffcc]/20 text-[#00ffcc] font-mono border border-[#00ffcc]/30 font-bold">
                      VOL 0{currentTrack.id}
                    </span>
                    <div className="text-white text-xs sm:text-sm font-black truncate">
                      {currentTrack.title}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1">
                    <span className="truncate mr-2">{currentTrack.artist}</span>
                    <span className="text-[#00ffcc] shrink-0 font-bold">
                      {currentTime > 0 ? formatTime(currentTime) : '0:00'} / {duration > 0 ? formatTime(duration) : currentTrack.durationLabel}
                    </span>
                  </div>
                </div>

                <a
                  href={currentTrack.downloadUrl}
                  download={currentTrack.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => downloadTrack(currentTrack)}
                  title={`Download ${currentTrack.title} to phone`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00ffcc] hover:bg-white text-black font-mono font-bold text-[11px] shrink-0 transition-all shadow-[0_0_15px_rgba(0,255,204,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">DOWNLOAD</span>
                  <span className="sm:hidden">GET</span>
                </a>
              </div>

              {/* Quick Mix Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 relative z-10">
                {tracks.map((track, idx) => {
                  const isActive = currentTrackIndex === idx;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => playTrack(idx)}
                      className={`text-left px-2.5 py-2 rounded text-[10px] font-mono transition-all truncate border cursor-pointer ${
                        isActive
                          ? 'bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc] font-bold shadow-[0_0_12px_rgba(0,255,204,0.25)]'
                          : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="truncate font-bold">{track?.title ? track.title.split('-')[0].trim() : 'TRACK'}</div>
                      <div className="text-[8px] text-zinc-500 uppercase mt-0.5">{isActive && isPlaying ? '▶ PLAYING' : track.durationLabel}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Cyberpunk Visual / Carousel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Technical Frame */}
            <div className="relative w-full max-w-lg aspect-[4/5] bg-black border border-[#00ffcc]/30 p-2 shadow-[0_0_50px_rgba(0,255,204,0.1)] group">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffcc]"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff00ff]"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff00ff]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffcc]"></div>

              <div className="relative w-full h-full overflow-hidden bg-[#111]">
                {images.map((img, i) => (
                  <img 
                    key={i}
                    src={img} 
                    alt={`DJ EMMA PRO FX Presentation ${i+1}`} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentImg ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                
                {/* Tech overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>

                {/* Animated Equalizer UI inside Frame */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 flex flex-col gap-2">
                  <div className="text-[10px] text-[#00ffcc] font-mono tracking-widest flex justify-between">
                    <span>FREQ: 432Hz</span>
                    <span>SYS.ONLINE</span>
                  </div>
                  <div className="h-8 flex items-end justify-between gap-[2px]">
                    {[...Array(24)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${Math.random() * 40 + 20}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 40 + 20}%`] }}
                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity, repeatType: "mirror" }}
                        className="flex-1 bg-[#ff00ff]"
                        style={{ filter: 'drop-shadow(0 0 5px #ff00ff)' }}
                      ></motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Info Panels */}
            <div className="absolute -right-8 top-20 bg-black/80 backdrop-blur border border-[#00ffcc]/40 p-3 hidden md:block">
              <div className="text-[10px] text-zinc-500 font-mono mb-1">SIGNAL STR</div>
              <div className="text-[#00ffcc] font-mono text-sm">99.9% VOL</div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
