import { Mic2, Box, Waves, Disc3, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'dj-drops',
    title: 'DJ DROPS',
    description: 'Professional DJ drops and voice tags customized for your DJ brand.',
    icon: Mic2,
    button: 'ORDER DJ DROP',
    delay: 0,
  },
  {
    id: '3d-logos',
    title: '3D ANIMATED LOGOS',
    description: 'Cinematic 3D animated logos created for DJs, artists, businesses and brands.',
    icon: Box,
    button: 'ORDER 3D LOGO',
    delay: 100,
  },
  {
    id: 'audio-branding',
    title: 'AUDIO BRANDING',
    description: 'Custom intros, outros, tags and sound branding for your music identity.',
    icon: Waves,
    button: 'GET STARTED',
    delay: 200,
  },
  {
    id: 'dj-mixes',
    title: 'DJ MIXES',
    description: 'Professional DJ mixes and promotional audio content.',
    icon: Disc3,
    button: 'REQUEST A MIX',
    delay: 300,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-black/60 backdrop-blur-md relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
            WHAT CAN WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CREATE FOR YOU?</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="group relative bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Hover Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 mb-6 group-hover:border-purple-500/50 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <Icon className="w-7 h-7 text-cyan-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold tracking-widest text-white mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                  
                  <a 
                    href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-white group-hover:text-cyan-400 transition-colors"
                  >
                    {service.button} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
