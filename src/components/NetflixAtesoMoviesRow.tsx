import StarRating from './StarRating';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Film, Send, Sparkles, Lock, Unlock, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { AtesoMovie } from '../data/atesoMoviesData';
import YoutubeSubscribeUnlockModal from './YoutubeSubscribeUnlockModal';
import { AtesoMoviesRowSkeleton } from './NetflixSkeleton';

interface NetflixAtesoMoviesRowProps {
  onWatchMovie: (movie: AtesoMovie) => void;
  onViewAllMovies: () => void;
  isLoading?: boolean;
}

export default function NetflixAtesoMoviesRow({ onWatchMovie, onViewAllMovies, isLoading = false }: NetflixAtesoMoviesRowProps) {
  const { atesoMovies, isYoutubeSubscribed } = useContent();
  const { recordMoviePlayed } = useWatchHistory();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [modalMovie, setModalMovie] = useState<AtesoMovie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <AtesoMoviesRowSkeleton />;
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const handleCardClick = (movie: AtesoMovie) => {
    recordMoviePlayed(movie);
    if (!isYoutubeSubscribed) {
      // Prompt user to subscribe to YouTube to unlock Telegram movie viewing
      setModalMovie(movie);
      setIsModalOpen(true);
    } else {
      // Already unlocked: navigate to movie player with direct Telegram & on-site playback
      onWatchMovie(movie);
    }
  };

  return (
    <section id="ateso-movies" className="relative my-6 px-4 sm:px-8 lg:px-12 select-none group/row">
      {/* Row Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-end justify-between mb-3"
      >
        <div>
          <div className="flex items-center gap-2">
            <motion.span 
              animate={{ 
                rotate: [0, 5, -5, 0],
                filter: ["drop-shadow(0px 0px 0px rgba(229,9,20,0))", "drop-shadow(0px 0px 8px rgba(229,9,20,0.8))", "drop-shadow(0px 0px 0px rgba(229,9,20,0))"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded"
            >
              CINEMA
            </motion.span>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-white tracking-tight flex items-center gap-2">
              <span>POISON BREAK</span>
              <motion.span 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs text-red-500 font-bold uppercase tracking-wider hidden sm:inline drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
              >
                • Episodes 1 to 9 (Play on Site • 320p)
              </motion.span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 opacity-80">
            Full Ateso translation by VJ Emma Pro FX • Subscribe on YouTube to unlock and watch from Telegram!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewAllMovies}
            className="text-xs text-[#E50914] hover:text-red-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All 9 Episodes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Horizontal Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity backdrop-blur-xs rounded-r shadow-lg cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Movies Track */}
        <div
          ref={rowRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-2 scroll-smooth"
        >
          {atesoMovies.map((movie, idx) => {
            const epNum = movie.episodeNumber || (idx + 1);

            return (
              <div
                key={movie.id}
                onClick={() => handleCardClick(movie)}
                className="group/card relative flex-none w-[240px] sm:w-[280px] lg:w-[320px] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-[#E50914] transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-lg"
              >
                {/* Poster Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* VJ and Part Tag */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                    <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                      {movie.partNumber ? `PART ${epNum < 10 ? `0${epNum}` : epNum}` : (movie.vj || 'ATESO')}
                    </span>
                    {!isYoutubeSubscribed ? (
                      <span className="bg-red-950/90 border border-red-500/50 text-red-300 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>LOCKED</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Unlock className="w-2.5 h-2.5" />
                        <span>UNLOCKED</span>
                      </span>
                    )}
                  </div>

                  {/* Category Badges */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-20">
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-blue-400/30 uppercase shadow">
                      VIDEO
                    </span>
                    <span className="bg-amber-500/90 backdrop-blur-sm text-black text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border border-amber-300/50 uppercase shadow">
                      EXCLUSIVE
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className="bg-black/70 backdrop-blur-xs text-[10px] font-mono text-zinc-300 px-1.5 py-0.5 rounded">
                      {movie.duration}
                    </span>
                  </div>

                  {/* Center Action Button Always Visible */}
                  <div className="absolute inset-0 m-auto w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl opacity-90 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all z-20">
                    {!isYoutubeSubscribed ? (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-xs">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Bottom title inside poster */}
                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      {movie.quality}
                    </span>
                    <h3 className="text-white font-black text-xs sm:text-sm line-clamp-1">
                      {movie.title}
                    </h3>
                  </div>
                </div>

                {/* Card Footer info */}
                <div className="p-3 bg-zinc-950 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="text-zinc-300 font-medium truncate max-w-[150px]">Episode {epNum}</span>
                    {!isYoutubeSubscribed ? (
                      <span className="text-red-400 font-bold group-hover/card:underline flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Subscribe to Watch</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold group-hover/card:underline flex items-center gap-1">
                        <Send className="w-3 h-3 fill-current" />
                        <span>Watch on Telegram</span>
                      </span>
                    )}
                  </div>
                  <StarRating trackId={movie.id} size="sm" readonly={true} showCount={false} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/75 hover:bg-black text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity backdrop-blur-xs rounded-l shadow-lg cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Unlock / Subscribe Modal */}
      <YoutubeSubscribeUnlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={modalMovie}
        onWatchOnSite={(movie) => {
          setIsModalOpen(false);
          onWatchMovie(movie);
        }}
      />
    </section>
  );
}
