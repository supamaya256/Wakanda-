import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useAudio } from '../context/AudioContext';

interface HeartLikeButtonProps {
  trackId: number;
}

export default function HeartLikeButton({ trackId }: HeartLikeButtonProps) {
  const { isFavorite, toggleFavorite } = useAudio();
  const liked = isFavorite(trackId);

  const handleClick = (e: any) => {
    e.stopPropagation();
    toggleFavorite(trackId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={liked ? "Remove from Favorites" : "Add to Favorites"}
      className="group flex items-center justify-center gap-1.5 h-8 min-w-[32px] px-2 rounded-full border border-zinc-600 bg-zinc-800/80 hover:border-red-500 hover:bg-zinc-700 text-white transition-all cursor-pointer overflow-hidden shadow"
    >
      <motion.div
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`w-3.5 h-3.5 transition-colors ${
            liked ? 'text-[#E50914] fill-current' : 'text-zinc-300 group-hover:text-red-400'
          }`} 
        />
      </motion.div>
    </button>
  );
}
