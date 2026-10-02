import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useFavorites, FavoriteType } from '../context/FavoritesContext';
import { useAudio } from '../context/AudioContext';

interface HeartLikeButtonProps {
  trackId?: number | string;
  item?: any;
  type?: FavoriteType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function HeartLikeButton({ 
  trackId, 
  item, 
  type = 'mixtape', 
  size = 'md',
  className = ''
}: HeartLikeButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { tracks } = useAudio();

  const effectiveId = trackId !== undefined ? trackId : item?.id;
  const liked = effectiveId !== undefined ? isFavorite(effectiveId) : false;

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (item) {
      toggleFavorite(item, type);
    } else if (effectiveId !== undefined) {
      const matchedTrack = tracks.find(t => t.id === Number(effectiveId));
      if (matchedTrack) {
        toggleFavorite(matchedTrack, 'mixtape');
      } else {
        toggleFavorite({ id: effectiveId, title: 'Saved Item', thumbnail: '', type, addedAt: Date.now() });
      }
    }
  };

  const iconSizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5';
  const buttonSizeClass = size === 'sm' ? 'h-7 min-w-[28px] px-1.5' : size === 'lg' ? 'h-9 min-w-[36px] px-2.5' : 'h-8 min-w-[32px] px-2';

  return (
    <button
      type="button"
      onClick={handleClick}
      title={liked ? "Remove from Favorites" : "Add to Favorites"}
      aria-label={liked ? "Remove from Favorites" : "Add to Favorites"}
      className={`group flex items-center justify-center gap-1.5 rounded-full border transition-all cursor-pointer overflow-hidden shadow ${
        liked 
          ? 'border-[#E50914]/80 bg-red-950/40 text-[#E50914]' 
          : 'border-zinc-700 bg-zinc-800/80 hover:border-red-500 hover:bg-zinc-700 text-white'
      } ${buttonSizeClass} ${className}`}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Heart 
          className={`${iconSizeClass} transition-colors ${
            liked ? 'text-[#E50914] fill-current drop-shadow-[0_0_6px_rgba(229,9,20,0.6)]' : 'text-zinc-300 group-hover:text-red-400'
          }`} 
        />
      </motion.div>
    </button>
  );
}
