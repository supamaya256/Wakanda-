import React, { useState } from 'react';
import { Heart, Play, MessageSquare, Download, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFavorites, FavoriteItem } from '../context/FavoritesContext';
import { useAudio } from '../context/AudioContext';
import AutoScrollCarousel from './AutoScrollCarousel';

interface MyFavoritesSectionProps {
  onOpenModal?: (track: any) => void;
}

export default function MyFavoritesSection({ onOpenModal }: MyFavoritesSectionProps) {
  const { favorites, favoriteMixtapes, favoriteDrops, removeFavorite, clearFavorites } = useFavorites();
  const { playTrackById, isPlaying, currentTrack, downloadTrack } = useAudio();
  const [activeTab, setActiveTab] = useState<'all' | 'mixtapes' | 'drops'>('all');

  if (!favorites || favorites.length === 0) {
    return null;
  }

  const displayedItems = 
    activeTab === 'mixtapes' ? favoriteMixtapes :
    activeTab === 'drops' ? favoriteDrops :
    favorites;

  const handleItemClick = (item: FavoriteItem) => {
    if (item.type === 'mixtape' || item.type === 'song') {
      if (typeof item.id === 'number') {
        playTrackById(item.id);
      }
    } else if (item.type === 'drop') {
      const msg = encodeURIComponent(`Hello DJ Emma Pro FX, I want to order this saved voice drop: ${item.title}`);
      window.open(`https://wa.me/256780527361?text=${msg}`, '_blank');
    }
  };

  return (
    <section id="my-favorites-section" className="relative my-8 sm:my-12 px-4 sm:px-8 lg:px-12 select-none group/fav">
      {/* Header with Title & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-md">
              <Heart className="w-3 h-3 fill-current text-white" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
              SAVED TO YOUR DEVICE
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-red-100 to-zinc-300">
              My Favorites
            </span>
            <span className="text-xs bg-red-950/80 border border-red-500/40 text-red-300 font-mono px-2 py-0.5 rounded-full">
              {favorites.length} Saved
            </span>
          </h2>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'all'
                ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            All ({favorites.length})
          </button>

          {favoriteMixtapes.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('mixtapes')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeTab === 'mixtapes'
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              Mixtapes ({favoriteMixtapes.length})
            </button>
          )}

          {favoriteDrops.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('drops')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeTab === 'drops'
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              DJ Drops ({favoriteDrops.length})
            </button>
          )}
        </div>
      </div>

      {/* Auto-scrolling carousel for Saved Items */}
      {displayedItems.length > 0 ? (
        <AutoScrollCarousel<FavoriteItem>
          id="favorites-carousel"
          items={displayedItems}
          getItemKey={(item) => `fav-${item.type}-${item.id}`}
          speed={0.6}
          resumeDelay={2500}
          ariaLabel="My Favorites carousel"
          renderItem={(item) => {
            const isPlayingThis = (item.type === 'mixtape' || item.type === 'song') && isPlaying && currentTrack?.id === item.id;

            return (
              <div
                className={`group/card relative flex flex-col justify-between w-[260px] sm:w-[300px] bg-[#181818] rounded-lg overflow-hidden border transition-all duration-300 min-h-[310px] ${
                  isPlayingThis
                    ? 'border-[#E50914] shadow-[0_0_24px_rgba(229,9,20,0.45)] ring-1 ring-[#E50914]'
                    : 'border-white/10 hover:border-zinc-500 hover:shadow-xl'
                }`}
              >
                {/* Poster Artwork */}
                <div 
                  className="relative aspect-video w-full overflow-hidden bg-black shrink-0 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                    <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                      {item.type === 'drop' ? 'VOICE DROP' : 'MIXTAPE'}
                    </span>
                  </div>

                  {item.duration && (
                    <div className="absolute top-2 right-2 z-20">
                      <span className="bg-black/75 backdrop-blur-xs text-[10px] font-mono text-zinc-300 px-1.5 py-0.5 rounded">
                        {item.duration}
                      </span>
                    </div>
                  )}

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-20 bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover/card:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 
                      onClick={() => handleItemClick(item)}
                      className="text-xs sm:text-sm font-bold text-white line-clamp-1 cursor-pointer hover:text-[#E50914] transition-colors"
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1 font-mono">
                      {item.artistOrVj} • {item.category}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="px-2.5 py-1 rounded bg-[#E50914] hover:bg-[#b80710] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{item.type === 'drop' ? 'Order' : 'Play'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFavorite(item.id)}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      ) : null}
    </section>
  );
}
