import { useState } from 'react';
import type { FormEvent } from 'react';

export default function LogoOrder() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientName = formData.get('clientName');
    const style = formData.get('style');
    const color = formData.get('color');
    const background = formData.get('background');
    const length = formData.get('length');
    const instructions = formData.get('instructions');

    const text = encodeURIComponent(
      `Hello DJ Emma Pro FX, I would like to order a 3D Animated Logo.\n\n` +
      `Client Name: ${clientName}\n` +
      `Style: ${style}\n` +
      `Color: ${color || 'N/A'}\n` +
      `Background: ${background || 'N/A'}\n` +
      `Length: ${length}\n` +
      `Special Instructions: ${instructions || 'None'}`
    );

    window.open(`https://wa.me/256780527361?text=${text}`, '_blank');
  };

  return (
    <section id="3d-logos" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
            ORDER YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">3D ANIMATED LOGO</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Upgrade your brand visuals with a high-end cinematic 3D logo animation. Perfect for YouTube, live shows, Twitch streams, and promos.
          </p>
        </div>

        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">CLIENT / DJ NAME</label>
                  <input required name="clientName" type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="e.g. DJ Emma Pro" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">ANIMATION STYLE</label>
                  <select name="style" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none">
                    <option>Cinematic</option>
                    <option>Metallic</option>
                    <option>Chrome</option>
                    <option>Gold</option>
                    <option>Neon</option>
                    <option>Futuristic</option>
                    <option>Mechanical</option>
                    <option>Luxury</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">COLOR STYLE</label>
                    <input name="color" type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="e.g. Purple & Cyan" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">BACKGROUND</label>
                    <input name="background" type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Dark / Transparent" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">UPLOAD YOUR LOGO</label>
                  <div className="w-full h-32 bg-black/50 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors">
                    <svg className="w-8 h-8 text-zinc-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span className="text-zinc-500 text-sm">Send Logo via WhatsApp</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">ANIMATION LENGTH</label>
                  <select name="length" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none">
                    <option>5 Seconds (Intro)</option>
                    <option>10 Seconds (Standard)</option>
                    <option>15+ Seconds (Extended)</option>
                    <option>Looping Animation</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 mb-2">SPECIAL INSTRUCTIONS</label>
              <textarea name="instructions" rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none" placeholder="Describe how you want it to move, any specific effects, etc..."></textarea>
            </div>

            <div className="flex justify-center pt-4">
              <button type="submit" className="px-12 py-4 bg-transparent border border-cyan-500 text-cyan-400 font-black tracking-widest rounded-lg hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                ORDER VIA WHATSAPP
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
