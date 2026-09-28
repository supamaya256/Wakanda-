import { Play } from 'lucide-react';
import { useState } from 'react';

const videos = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `DJ Visualizer Pack ${i + 1}`,
  price: '18,000 UGX',
  videoSrc: `/video-${i + 1}.mp4`, 
  thumbnail: [
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2874&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2787&auto=format&fit=crop'
  ][i % 4]
}));

export default function VideoShowcase() {
  return (
    <section id="videos" className="py-24 bg-[#0a0a0a] relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase">
              DJ PRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">VIDEOS</span>
            </h2>
            <p className="text-zinc-400 font-mono text-sm tracking-wide">High-quality promotional visualizers and videos for your brand.</p>
          </div>
          <a href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20request%20a%20Custom%20Video" target="_blank" rel="noopener noreferrer" className="mt-6 md:mt-0 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold tracking-widest text-sm rounded hover:bg-[#00ffcc] hover:text-black hover:border-[#00ffcc] transition-all duration-300">
            REQUEST CUSTOM VIDEO
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="group relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00ffcc]/50 transition-all duration-300 shadow-lg">
              <div className="aspect-video bg-black relative border-b border-white/10">
                 <video 
                  src={video.videoSrc}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  controls
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  preload="none"
                  poster={video.thumbnail}
                 />
              </div>
              <div className="p-5 flex flex-col justify-between h-[120px]">
                <h3 className="text-white font-black tracking-widest text-sm mb-2 uppercase">{video.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[#ff00ff] font-mono font-bold tracking-widest">{video.price}</span>
                  <a href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20order%20${encodeURIComponent(video.title)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-transparent border border-[#00ffcc] hover:bg-[#00ffcc] text-[#00ffcc] hover:text-black text-[10px] font-bold tracking-widest rounded-sm transition-colors uppercase">
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
