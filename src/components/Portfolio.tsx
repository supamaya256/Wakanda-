import { useState } from 'react';

const categories = ['ALL', 'DJ DROPS', '3D LOGOS', 'LOGO ANIMATIONS', 'DJ MIXES', 'AUDIO BRANDING'];

const projects = [
  { id: 1, name: 'DJ EMMA IDENTITY', category: '3D LOGOS', image: '/WhatsApp Image 2026-06-17 at 12.23.24 PM.jpeg' },
  { id: 2, name: 'SUMMER FESTIVAL DROP', category: 'DJ DROPS', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2874&auto=format&fit=crop' },
  { id: 3, name: 'CLUB VIBES INTRO', category: 'LOGO ANIMATIONS', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2787&auto=format&fit=crop' },
  { id: 4, name: 'AFROBEATS MASTER MIX', category: 'DJ MIXES', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2940&auto=format&fit=crop' },
  { id: 5, name: 'DJ REX IDENTITY', category: '3D LOGOS', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2940&auto=format&fit=crop' },
  { id: 6, name: 'RADIO STATION ID', category: 'AUDIO BRANDING', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2787&auto=format&fit=crop' },
];

export default function Portfolio() {
  const [activeCat, setActiveCat] = useState('ALL');

  const filtered = activeCat === 'ALL' ? projects : projects.filter(p => p.category === activeCat);

  return (
    <section id="portfolio" className="py-24 bg-black relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-8">
            RECENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">PROJECTS</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 border ${
                  activeCat === cat 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(project => (
            <div key={project.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-[#111]">
              <img 
                src={project.image} 
                alt={project.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-60 group-hover:opacity-100"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Glowing Border on Hover */}
              <div className="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/50 rounded-xl transition-all duration-500 shadow-[inset_0_0_20px_rgba(168,85,247,0)] group-hover:shadow-[inset_0_0_30px_rgba(168,85,247,0.3)]"></div>

              <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-cyan-400 text-[10px] font-bold tracking-widest mb-1">{project.category}</div>
                <h3 className="text-white text-xl font-black tracking-wide mb-2">{project.name}</h3>
                <div className="text-white/0 group-hover:text-white/100 text-sm font-medium tracking-widest flex items-center gap-2 transition-colors duration-300 delay-100">
                  VIEW PROJECT <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
