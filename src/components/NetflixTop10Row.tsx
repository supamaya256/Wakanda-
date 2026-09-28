import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Download, ExternalLink, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio, AudioTrack } from '../context/AudioContext';
import { Top10RowSkeleton } from './NetflixSkeleton';

interface Top10Item {
  rank: number;
  id: number;
  title: string;
  artist: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  audioTrackIndex?: number;
  audioTrack?: AudioTrack;
  matchScore: number;
}

interface NetflixTop10RowProps {
  onOpenModal: (track: AudioTrack) => void;
  isLoading?: boolean;
}

export default function NetflixTop10Row({ onOpenModal, isLoading = false }: NetflixTop10RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollAudioRef = useRef<HTMLAudioElement | null>(null);
  const [hasPlayedScrollAudio, setHasPlayedScrollAudio] = useState(false);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const { tracks, playTrack, downloadTrack } = useAudio();

  // Scroll Audio Autoplay
  useEffect(() => {
    if (isLoading) return;
    scrollAudioRef.current = new Audio("https://res.cloudinary.com/hbyqk5y0/video/upload/v1789671239/wigman-2026-09-17-21-45-DJ-DROPS-BY-EMMA-PRO-AND-3D-ANIMATION-LOGO_S.mp3");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedScrollAudio && scrollAudioRef.current) {
            scrollAudioRef.current.play().catch(e => console.warn("Scroll autoplay blocked:", e));
            setHasPlayedScrollAudio(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (scrollAudioRef.current) {
        scrollAudioRef.current.pause();
        scrollAudioRef.current = null;
      }
    };
  }, [hasPlayedScrollAudio, isLoading]);

  if (isLoading) {
    return <Top10RowSkeleton />;
  }

  const top10Items: Top10Item[] = [
    {
      rank: 1,
      id: 1,
      title: 'ONE DROP REGGEA MIX VOL 1',
      artist: 'DJ EMMA PRO',
      category: 'YouTube Premiere • Reggae Nonstop',
      thumbnail: 'https://i.ytimg.com/vi/TcVAuZcXB5U/hqdefault.jpg',
      audioTrackIndex: 0,
      audioTrack: tracks[0],
      matchScore: 99
    },
    {
      rank: 2,
      id: 2,
      title: 'FULL ATESO MIXTAPE 2026',
      artist: 'DJ EMMA PRO',
      category: 'Cultural Nonstop',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      audioTrackIndex: 1,
      audioTrack: tracks[1],
      matchScore: 98
    },
    {
      rank: 3,
      id: 3,
      title: 'SOROTI CITY DJS 3D LOGO',
      artist: '3D ANIMATION STUDIO',
      category: 'Cinema 4K Visualizer',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
      matchScore: 99
    },
    {
      rank: 4,
      id: 4,
      title: 'ONE DROP REGGAE VOL. 1',
      artist: 'DJ EMMA PRO',
      category: 'Roots & Dub Nonstop',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
      audioTrackIndex: 3,
      audioTrack: tracks[3],
      matchScore: 99
    },
    {
      rank: 5,
      id: 5,
      title: 'EPISODE 1 FT. DJ EMMA PRO',
      artist: 'MC RICKY',
      category: 'Hype Dancehall',
      thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1200&auto=format&fit=crop',
      audioTrackIndex: 2,
      audioTrack: tracks[2],
      matchScore: 97
    },
    {
      rank: 6,
      id: 6,
      title: 'CLUB HYPE VOICE DROPS',
      artist: 'STUDIO FX PACK',
      category: 'Custom Audio Branding',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
      matchScore: 98
    }
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  return (
    <section ref={sectionRef} id="top10" className="relative my-6 lg:my-10 px-4 sm:px-8 lg:px-12 select-none group">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex items-center gap-3 mb-3"
      >
        <motion.div 
          animate={{ 
            boxShadow: ["0px 0px 0px 0px rgba(229,9,20,0)", "0px 0px 15px 4px rgba(229,9,20,0.5)", "0px 0px 0px 0px rgba(229,9,20,0)"],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-6 rounded bg-[#E50914] flex items-center justify-center text-white"
        >
          <Flame className="w-4 h-4 fill-current" />
        </motion.div>
        <motion.h2 
          className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide flex items-center gap-2"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff9999] to-[#E50914] animate-pulse">
            Top 10 in Uganda Today
          </span>
          <span className="text-xs text-[#E50914] font-normal tracking-normal group-hover:translate-x-1 transition-transform inline-flex items-center drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]">
            Explore All &rsaquo;
          </span>
        </motion.h2>
      </motion.div>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-r cursor-pointer backdrop-blur-xs shadow-lg"
            title="Scroll Left"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Top 10 Cards Slider */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4"
        >
          {top10Items.map((item) => (
            <div
              key={item.rank}
              className="flex-none flex items-center group/card cursor-pointer"
            >
              {/* Giant Netflix Outlined Number */}
              <div className="relative -mr-6 sm:-mr-8 select-none z-10">
                <span
                  className="font-bebas text-8xl sm:text-9xl font-black leading-none tracking-tighter"
                  style={{
                    color: '#141414',
                    WebkitTextStroke: '4px #595959',
                    textShadow: '0 4px 20px rgba(0,0,0,0.9)'
                  }}
                >
                  {item.rank}
                </span>
              </div>

              {/* Poster Card */}
              <div
                onClick={() => {
                  if (item.audioTrack) {
                    onOpenModal(item.audioTrack);
                  }
                }}
                className="relative w-[160px] sm:w-[200px] aspect-[2/3] bg-zinc-900 rounded-md overflow-hidden transition-all duration-300 group-hover/card:scale-105 group-hover/card:z-20 group-hover/card:shadow-[0_10px_30px_rgba(0,0,0,0.9)] border border-white/5 group-hover/card:border-zinc-600"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover/card:opacity-90" />

                {/* Top Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
                  <span className="w-3.5 h-4.5 rounded-[1px] bg-[#E50914] flex items-center justify-center font-black text-white text-[9px]">
                    N
                  </span>
                  <span className="bg-[#E50914] text-white text-[9px] font-black px-1 rounded uppercase tracking-wider">
                    TOP 10
                  </span>
                </div>

                {/* Category Badges */}
                {item.audioTrack && (
                  <div className="absolute bottom-16 left-2 flex flex-col gap-1 z-20">
                    {item.audioTrack.isVideo ? (
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-blue-400/30 uppercase shadow w-fit">
                        VIDEO
                      </span>
                    ) : (
                      <span className="bg-[#E50914]/90 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-[#E50914]/50 uppercase shadow w-fit">
                        DJ MIX
                      </span>
                    )}
                    {item.audioTrack.isTrending && (
                      <span className="bg-amber-500/90 backdrop-blur-sm text-black text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-amber-300/50 uppercase shadow w-fit">
                        EXCLUSIVE
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-[#46d369] font-bold text-[10px] block mb-0.5">
                    {item.matchScore}% Match
                  </span>
                  <h4 className="text-white font-bold text-xs sm:text-sm line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-zinc-400 text-[10px] font-mono truncate">
                    {item.category}
                  </p>

                  {/* Action buttons on card */}
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10">
                    {item.audioTrackIndex !== undefined ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(item.audioTrackIndex!);
                          }}
                          className="w-7 h-7 rounded-full bg-white hover:bg-white/80 text-black flex items-center justify-center cursor-pointer transition-colors"
                          title="Play Track"
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </button>
                        {item.audioTrack && (
                          <a
                            href={item.audioTrack.downloadUrl}
                            download={item.audioTrack.filename}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadTrack(item.audioTrack!);
                            }}
                            title="Download to Phone"
                            className="w-7 h-7 rounded-full bg-[#E50914] hover:bg-[#b80710] text-white flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        )}
                      </>
                    ) : (
                      <a
                        href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20want%20to%20order%20the%20Top%2010%203D%20Visualizer"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-1 rounded bg-[#E50914] hover:bg-[#b80710] text-white text-[10px] font-bold text-center block"
                      >
                        ORDER
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 rounded-l cursor-pointer backdrop-blur-xs shadow-lg"
            title="Scroll Right"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
}
