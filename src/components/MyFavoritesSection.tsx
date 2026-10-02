import React, { useState } from 'react';
import { Heart, Play, Film, MessageSquare, Download, Sparkles, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFavorites, FavoriteItem } from '../context/FavoritesContext';
import { useAudio } from '../context/AudioContext';
import AutoScrollCarousel from './AutoScrollCarousel';

interface MyFavoritesSectionProps {
  onOpenModal?: (track: any) => void;
  onWatchMovie?: (movie: any) => void;
}

export default function MyFavoritesSection({ onOpenModal, onWatchMovie }: MyFavoritesSectionProps) {
  const { favorites, favoriteMixtapes, favoriteMovies, favoriteDrops, removeFavorite, clearFavorites } = useFavorites();
  const { playTrackById, isPlaying, currentTrack, downloadTrack } = useAudio();
  const [activeTab, setActiveTab] = useState<'all' | 'mixtapes' | 'movies' | 'drops'>('all');

  if (!favorites || favorites.length === 0) {
    return null;
  }

  const displayedItems = 
    activeTab === 'mixtapes' ? favoriteMixtapes :
    activeTab === 'movies' ? favoriteMovies :
    activeTab === 'drops' ? favoriteDrops :
    favorites;

  const handleItemClick = (item: FavoriteItem) => {
    if (item.type === 'mixtape' || item.type === 'song') {
      if (typeof item.id === 'number') {
        playTrackById(item.id);
      }
    } else if (item.type === 'movie' && onWatchMovie) {
      onWatchMovie(item);
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
              SAVED TO YOUR ACCOUNT & DEVICE
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

          {favoriteMovies.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('movies')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeTab === 'movies'
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              Movies ({favoriteMovies.length})
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
                {/* Thumbnail Header */}
                <div 
                  className="relative aspect-video w-full bg-zinc-900 overflow-hidden cursor-pointer shrink-0"
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/40 pointer-events-none" />

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                    <span className="bg-[#E50914] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                      {item.type === 'movie' ? 'MOVIE' : item.type === 'drop' ? 'VOICE DROP' : 'MIXTAPE'}
                    </span>
                    {item.duration && (
                      <span className="bg-black/75 backdrop-blur-sm text-zinc-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                        {item.duration}
                      </span>
                    )}
                  </div>

                  {/* Remove from favorites button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(item.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow"
                    title="Remove from favorites"
                    aria-label="Remove from favorites"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-[#E50914] hover:text-white" />
                  </button>

                  {/* Center Play / Action Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-15">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                      {item.type === 'movie' ? (
                        <Film className="w-4 h-4" />
                      ) : item.type === 'drop' ? (
                        <MessageSquare className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Body Meta */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 
                      onClick={() => handleItemClick(item)}
                      className="font-bold text-white text-xs sm:text-sm truncate hover:text-[#E50914] transition-colors cursor-pointer"
                      title={item.title}
                    >
                      {item.title}
                    </h4>
                    <p className="text-zinc-400 text-[11px] truncate mt-0.5">
                      {item.artistOrVj || 'DJ Emma Pro'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="flex-1 py-1.5 px-2 rounded bg-zinc-800 hover:bg-[#E50914] text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{item.type === 'movie' ? 'Watch Movie' : item.type === 'drop' ? 'Order on WhatsApp' : 'Play Mix'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      ) : (
        <div className="text-center py-8 text-zinc-500 text-xs">
          No items in this category yet. Tap the heart on any mix, movie, or drop to save it!
        </div>
      )}
    </section>
  );
}
