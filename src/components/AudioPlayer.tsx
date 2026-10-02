import { Play, Pause, Disc3, Radio, Volume2, Download, Smartphone } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function AudioPlayer() {
  const { tracks, currentTrackIndex, isPlaying, togglePlay, playTrack, currentTime, duration, formatTime, downloadTrack } = useAudio();

  return (
    <section id="mixes" className="py-24 bg-black/60 backdrop-blur-xl relative border-y border-[#00ffcc]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono font-bold tracking-widest mb-4 uppercase shadow-[0_0_15px_rgba(0,255,204,0.15)]">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Official DJ Mixes & Drops
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4 flex items-center justify-center gap-4">
            <Disc3 className={`w-10 h-10 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} />
            LATEST DJ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">MIXES & EPISODES</span>
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto font-sans text-sm sm:text-base">
            Listen and download official DJ EMMA PRO nonstops and mixtapes directly to your phone in high fidelity audio.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {tracks.map((mix, index) => {
            const isThisTrackPlaying = isPlaying && currentTrackIndex === index;
            const isThisTrackActive = currentTrackIndex === index;

            return (
              <div 
                key={mix.id} 
                className={`border rounded-2xl p-6 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 group relative overflow-hidden ${
                  isThisTrackActive 
                    ? 'bg-black/85 backdrop-blur-md border-[#00ffcc]/60 shadow-[0_0_35px_rgba(0,255,204,0.2)]' 
                    : 'bg-black/60 backdrop-blur-md border-white/10 hover:border-white/25 hover:bg-black/75'
                }`}
              >
                {/* Active glow gradient */}
                {isThisTrackActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
                )}

                <button 
                  onClick={() => playTrack(index)}
                  title={isThisTrackPlaying ? 'Pause Mix' : 'Play Mix'}
                  className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isThisTrackPlaying 
                      ? 'bg-gradient-to-br from-cyan-400 to-[#00ffcc] text-black scale-105 shadow-[0_0_25px_rgba(0,255,204,0.6)]' 
                      : 'bg-gradient-to-br from-purple-600 to-cyan-500 text-white hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  }`}
                >
                  {isThisTrackPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>
                
                <div className="flex-grow w-full">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-purple-400 border border-purple-500/20 font-bold">
                          VOL 0{mix.id}
                        </span>
                        {isThisTrackPlaying && (
                          <span className="text-[10px] font-mono font-bold text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                            PLAYING
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-black tracking-wide text-base sm:text-lg group-hover:text-cyan-400 transition-colors">
                        {mix.title}
                      </h3>
                      <p className="text-zinc-400 text-xs font-bold tracking-widest mt-0.5">
                        {mix.artist}
                      </p>
                    </div>

                    <div className="text-zinc-500 text-xs font-mono shrink-0">
                      {isThisTrackActive && duration > 0 
                        ? `${formatTime(currentTime)} / ${formatTime(duration)}` 
                        : mix.durationLabel}
                    </div>
                  </div>
                  
                  {/* Waveform Visualization */}
                  <div 
                    onClick={() => playTrack(index)}
                    className="h-8 w-full flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer mt-3"
                  >
                    {[...Array(36)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-full transition-all duration-200 ${
                          isThisTrackPlaying 
                            ? 'bg-gradient-to-t from-cyan-500 to-purple-400' 
                            : isThisTrackActive
                              ? 'bg-cyan-700/60'
                              : 'bg-zinc-700'
                        }`}
                        style={{ 
                          height: isThisTrackPlaying 
                            ? `${Math.max(15, ((Math.sin(i * 0.8 + currentTime * 3) + 1) / 2) * 85 + 15)}%` 
                            : `${20 + Math.sin(i * 0.5) * 20 + 25}%`
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Actions Bar: Stream & Direct Download To Phone */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-400">HQ AUDIO</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[10px] font-mono text-[#00ffcc] font-bold">FREE NONSTOP</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => playTrack(index)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                      >
                        {isThisTrackPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isThisTrackPlaying ? 'PAUSE' : 'PLAY'}</span>
                      </button>

                      <a
                        href={mix.downloadUrl}
                        download={mix.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          downloadTrack(mix);
                        }}
                        title={`Download ${mix.title} directly to phone`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00ffcc] to-cyan-400 hover:from-white hover:to-[#00ffcc] text-black font-mono text-xs font-black tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,255,204,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        <span>DOWNLOAD TO PHONE</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
