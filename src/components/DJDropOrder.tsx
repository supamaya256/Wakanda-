import { useState } from 'react';
import type { FormEvent } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function DJDropOrder() {
  const { isPlaying, togglePlay, currentTrack } = useAudio();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const djName = formData.get('djName');
    const pronunciation = formData.get('pronunciation');
    const type = formData.get('type');
    const voiceStyle = formData.get('voiceStyle');
    const gender = formData.get('gender');
    const energy = formData.get('energy');
    const genre = formData.get('genre');
    const script = formData.get('script');
    const instructions = formData.get('instructions');

    const text = encodeURIComponent(
      `Hello DJ Emma Pro FX, I would like to order a DJ Drop.\n\n` +
      `DJ Name: ${djName}\n` +
      `Pronunciation: ${pronunciation}\n` +
      `Type: ${type}\n` +
      `Voice Style: ${voiceStyle} (${gender}, ${energy} energy)\n` +
      `Genre: ${genre || 'N/A'}\n` +
      `Script/Words: ${script}\n` +
      `Extra Instructions: ${instructions || 'None'}`
    );

    window.open(`https://wa.me/256780527361?text=${text}`, '_blank');
  };

  return (
    <section id="dj-drops" className="py-24 bg-black relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6">
              ORDER YOUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">DJ DROP</span>
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Get premium quality, professionally mixed and mastered voice drops to elevate your DJ sets, radio shows, and mixes.
            </p>
            
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold tracking-widest text-sm">SAMPLE AUDIO PREVIEW</h3>
                <span className="text-[10px] text-cyan-400 font-mono tracking-wider">{isPlaying ? 'PLAYING NOW' : 'CLICK TO SAMPLE'}</span>
              </div>
              <div className="flex items-center gap-4 bg-black rounded-lg p-3 border border-white/5">
                <button 
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center hover:scale-105 transition-transform shrink-0 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
                <div className="flex-grow overflow-hidden">
                  <div className="text-xs text-white font-bold truncate mb-1">{currentTrack.title}</div>
                  <div className="h-4 flex items-center gap-1 opacity-70">
                    {[...Array(22)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-full transition-all duration-200 ${isPlaying ? 'bg-cyan-400' : 'bg-zinc-700'}`} 
                        style={{ height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '30%' }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                <h4 className="text-white font-bold mb-2">BASIC</h4>
                <p className="text-zinc-400 text-sm mb-4">Dry vocals, high quality WAV, 1 revision.</p>
                <div className="text-2xl font-black text-cyan-400 mb-4">$15</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 tracking-widest rounded-bl-lg">POPULAR</div>
                <h4 className="text-white font-bold mb-2">PRO</h4>
                <p className="text-zinc-300 text-sm mb-4">Fully mastered, SFX, vocal effects, 2 revisions.</p>
                <div className="text-2xl font-black text-purple-400 mb-4">$35</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">DJ / ARTIST NAME</label>
                  <input name="djName" required type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="e.g. DJ Emma Pro" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">DJ NAME TO BE ANNOUNCED</label>
                  <input name="pronunciation" required type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="Pronunciation guide" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">DROP TYPE</label>
                  <select name="type" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                    <option>DJ Intro</option>
                    <option>DJ Tag</option>
                    <option>Shout Out</option>
                    <option>Radio Drop</option>
                    <option>Club Drop</option>
                    <option>Producer Tag</option>
                    <option>Custom Drop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">VOICE STYLE</label>
                  <select name="voiceStyle" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                    <option>Deep & Cinematic</option>
                    <option>Hype & Energetic</option>
                    <option>Smooth & Urban</option>
                    <option>Aggressive / Hard</option>
                    <option>Neutral / Professional</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">VOICE GENDER</label>
                  <select name="gender" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Any</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">ENERGY LEVEL</label>
                  <select name="energy" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low / Chill</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">MUSIC GENRE</label>
                  <input name="genre" type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="e.g. Afrobeats, House" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">SPECIAL WORDS / PHRASE</label>
                <textarea name="script" rows={3} required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none" placeholder="Type exactly what you want the voice to say..."></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">UPLOAD REFERENCE AUDIO</label>
                  <div className="w-full bg-black border border-dashed border-white/20 rounded-lg px-4 py-3 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                    <span className="text-zinc-500 text-sm">Send Audio via WhatsApp</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">ADDITIONAL INSTRUCTIONS</label>
                  <input name="instructions" type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="Any extra effects or notes?" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-white text-black font-black tracking-widest rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                ORDER VIA WHATSAPP
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
