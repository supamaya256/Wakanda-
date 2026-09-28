import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'DJ MIXES', href: '#mixes' },
    { name: 'DJ DROPS', href: '#dj-drops' },
    { name: '3D LOGOS', href: '#3d-logos' },
    { name: 'VIDEOS', href: '#videos' },
    { name: 'SERVICES', href: '#services' },
    { name: 'PORTFOLIO', href: '#portfolio' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-2 z-50 relative">
            <a href="#home" className="text-2xl font-black tracking-tighter text-white group flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">DJ EMMA</span>
              <span className="text-white group-hover:text-purple-400 transition-colors duration-300">PRO FX</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium tracking-widest text-zinc-400 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <a href="#client-login" className="text-zinc-400 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20order"
              target="_blank"
              rel="noopener noreferrer" 
              className="px-6 py-2.5 bg-white text-black font-bold tracking-widest text-sm rounded hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
            >
              ORDER NOW
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-nav-modal"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center min-h-screen"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px w-24 bg-white/10 my-4"></div>
              <a 
                href="#client-login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-medium tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
                <User className="w-6 h-6" /> CLIENT LOGIN
              </a>
              <a 
                href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-8 py-4 bg-white text-black font-black tracking-widest text-lg rounded hover:bg-purple-500 hover:text-white transition-colors"
              >
                ORDER NOW
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
