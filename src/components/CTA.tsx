import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-32 bg-black relative overflow-hidden flex items-center justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2940&auto=format&fit=crop" 
          alt="Studio Background" 
          className="w-full h-full object-cover opacity-20 filter grayscale blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 mix-blend-overlay"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
          READY TO UPGRADE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">DJ BRAND?</span>
        </h2>
        <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Get professional DJ drops, custom audio branding and cinematic 3D logo animations created specifically for your identity.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20order%20a%20DJ%20Drop"
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-black tracking-widest text-sm rounded hover:from-purple-500 hover:to-purple-400 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
          >
            ORDER DJ DROP <ArrowRight className="w-4 h-4" />
          </a>
          <a 
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20order%20a%203D%20Animated%20Logo"
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-cyan-500 text-cyan-400 font-black tracking-widest text-sm rounded hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            ORDER 3D LOGO
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="bg-[#050505] pt-20 pb-10 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          <div className="md:col-span-5">
            <a href="#home" className="text-3xl font-black tracking-tighter text-white group flex items-center gap-2 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">DJ EMMA</span>
              <span className="text-white group-hover:text-purple-400 transition-colors duration-300">PRO FX</span>
            </a>
            <p className="text-zinc-400 font-bold tracking-widest text-sm mb-6">
              PROFESSIONAL DJ DROPS & 3D ANIMATION
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">
              Your source for industry-standard audio branding, custom voice drops, and cinematic 3D visual identities.
            </p>
            <div className="space-y-2 text-zinc-400 text-sm font-medium">
              <p>Email: <a href="mailto:djemmaprouk@gmail.com" className="text-cyan-400 hover:underline">djemmaprouk@gmail.com</a></p>
              <p>Airtel: <a href="tel:+256740754547" className="hover:text-white">+256 740 754 547</a></p>
              <p>MTN: <a href="tel:+256780527361" className="hover:text-white">+256 780 527 361</a></p>
              <p>WhatsApp: <a href="https://wa.me/256780527361" target="_blank" rel="noreferrer" className="text-green-500 hover:underline">Message us</a></p>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-black tracking-widest text-sm mb-6">NAVIGATION</h4>
            <ul className="space-y-3">
              {['Home', 'DJ Drops', '3D Logos', 'Videos', 'Mixes', 'Services', 'Portfolio', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-zinc-400 hover:text-cyan-400 text-sm font-medium tracking-wide transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-black tracking-widest text-sm mb-6">CONNECT</h4>
            <div className="flex gap-4 mb-8">
              {['Facebook', 'TikTok', 'Instagram', 'YouTube'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300">
                  <span className="text-xs font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
            
            <h4 className="text-white font-black tracking-widest text-sm mb-4">NEWSLETTER</h4>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-[#111] border border-white/10 rounded-l-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-full" />
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-r-lg text-sm font-bold tracking-widest transition-colors">
                JOIN
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs font-bold tracking-widest">
            © 2026 DJ EMMA PRO FX. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 text-zinc-600 text-xs font-bold tracking-widest">
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
