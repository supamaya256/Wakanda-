import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TrustProofModalProps {
  onClose: () => void;
}

const proofImages = [
  "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789669152/Screenshot_20260917_211525_WhatsAppBusiness.jpg",
  "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789669155/Screenshot_20260917_211712_WhatsAppBusiness.jpg",
  "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789669156/Screenshot_20260917_211510_WhatsAppBusiness.jpg",
  "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789669155/Screenshot_20260917_211538_WhatsAppBusiness.jpg"
];

const TRUST_AUDIO_URL = "https://res.cloudinary.com/hbyqk5y0/video/upload/v1789671239/Mendy-2026-09-17-21-51-_emphasis_-Trust-as-beforeweTrust-you_-thank-you.mp3";

export default function TrustProofModal({ onClose }: TrustProofModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play audio when modal opens
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.warn("Audio autoplay blocked or failed:", error);
      });
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % proofImages.length);
    }, 3500); // Changes image every 3.5 seconds

    const handleEscape = () => onClose();
    window.addEventListener('app:escape', handleEscape);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('app:escape', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Background click area to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      {/* Hidden audio element */}
      <audio ref={audioRef} src={TRUST_AUDIO_URL} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-[#141414] rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Verified Client Deliveries
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </h2>
              <p className="text-sm text-zinc-400">See how it works and trust the process</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Looping Carousel */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-black/50">
          <p className="text-center text-zinc-300 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            We deliver 100% of our orders directly via WhatsApp. Here is real proof from our happy clients receiving their high-quality DJ Drops, Mixtapes, and 3D Logos.
          </p>
          
          <div className="relative w-full max-w-sm mx-auto aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentIndex}
                src={proofImages[currentIndex]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`Client Delivery Proof ${currentIndex + 1}`}
              />
            </AnimatePresence>
            
            {/* Overlay gradient for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none flex flex-col justify-end p-6">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={`text-${currentIndex}`}
                className="text-emerald-400 font-bold text-lg flex items-center gap-2 drop-shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6" /> 
                Order Delivered Successfully
              </motion.span>
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 z-10">
              {proofImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
