import { Box } from 'lucide-react';

const logos = [
  { name: 'DJ NOVA', style: 'Neon Cyberpunk' },
  { name: 'DJ VYBE', style: 'Metallic Chrome' },
  { name: 'DJ REX', style: 'Dark Matter' },
  { name: 'DJ KAY', style: 'Liquid Gold' },
  { name: 'DJ FLEX', style: 'Holographic' },
  { name: 'DJ MARZ', style: 'Deep Space' },
];

export default function LogoShowcase() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2">
              3D LOGO <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">SHOWCASE</span>
            </h2>
            <p className="text-zinc-400">Sample styles. Order your own custom 3D DJ logo today.</p>
          </div>
          <a href="#3d-logos" className="mt-6 md:mt-0 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold tracking-widest text-sm rounded hover:bg-white hover:text-black transition-all duration-300">
            CREATE MY 3D LOGO
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {logos.map((logo, i) => (
            <div key={i} className="group relative aspect-square bg-[#111] border border-white/5 rounded-xl flex flex-col items-center justify-center p-4 hover:border-purple-500/50 hover:bg-[#151515] transition-all duration-300 overflow-hidden">
              {/* Fake 3D Logo Element */}
              <div className="w-16 h-16 relative mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <Box className={`w-full h-full ${i % 2 === 0 ? 'text-purple-500' : 'text-cyan-400'} drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]`} />
              </div>
              <h4 className="text-white font-black tracking-widest text-center text-sm mb-1 z-10">{logo.name}</h4>
              <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest z-10">{logo.style}</div>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
