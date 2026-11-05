import React, { useState, useMemo } from 'react';
import { Play, Pause, Download, Search, Music, Disc3, Sparkles, Filter, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { useAudio, AudioTrack } from '../context/AudioContext';
import { AdSlot } from './AdSlot';

interface AudiosPageProps {
  onOpenTrackDetails?: (track: AudioTrack) => void;
}

export const AudiosPage: React.FC<AudiosPageProps> = ({ onOpenTrackDetails }) => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrackById,
    togglePlay,
    downloadTrack,
    downloadState,
    toggleFavorite,
    isFavorite,
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Extract all unique genres
  const genres = useMemo(() => {
    const set = new Set<string>();
    tracks.forEach((t) => {
      if (Array.isArray(t.genres)) {
        t.genres.forEach((g) => set.add(g));
      }
    });
    return ['All', ...Array.from(set).slice(0, 8)];
  }, [tracks]);

  // Filter tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.genres && t.genres.some((g) => g.toLowerCase().includes(q))) ||
        (t.description && t.description.toLowerCase().includes(q));

      const matchesGenre =
        selectedGenre === 'All' ||
        (t.genres && t.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()));

      return matchesSearch && matchesGenre;
    });
  }, [tracks, searchQuery, selectedGenre]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono mb-3">
          <Disc3 className="w-3.5 h-3.5 animate-spin" />
          <span>OFFICIAL AUDIO LIBRARY</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          DJ EMMA PRO <span className="text-red-600">AUDIO MIXES</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
          Mastered studio nonstop mixtapes, high-energy Afrobeats, Ateso cultural rhythms, and Wakanda club recordings. Stream directly or download authorized high-fidelity files to your device.
        </p>
      </div>

      {/* Top Banner AdSlot for AdSense */}
      <AdSlot slotId="audios-top-banner" format="horizontal" className="mb-8" />

      {/* Search & Genre Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audio mixes by title, artist, genre, or vibe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Genre Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedGenre === g
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Mixes Grid */}
      {filteredTracks.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-zinc-900 bg-zinc-950/50 p-8">
          <Music className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No mixes found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            We couldn't find any audio mixes matching "{searchQuery}". Try searching for "Street Anthem", "Wakanda", "Ateso", or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTracks.map((track) => {
            const isThisPlaying = currentTrack.id === track.id && isPlaying;
            const isThisSelected = currentTrack.id === track.id;
            const isFav = isFavorite(track.id);
            const isDownloading = downloadState.trackId === track.id && downloadState.status === 'downloading';

            return (
              <div
                key={track.id}
                className={`group relative rounded-2xl bg-zinc-950/90 border transition-all duration-300 overflow-hidden flex flex-col ${
                  isThisSelected
                    ? 'border-red-600/60 ring-1 ring-red-600/40 shadow-xl shadow-red-950/20'
                    : 'border-zinc-800/80 hover:border-zinc-700 hover:shadow-lg'
                }`}
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                  {/* Quality & Duration Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-red-500 border border-red-500/30">
                      {track.durationLabel || 'Nonstop'}
                    </span>
                    {track.isTrending && (
                      <span className="px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/70 backdrop-blur-md text-zinc-400 hover:text-red-500 hover:bg-black/90 transition cursor-pointer"
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600 text-red-600' : ''}`} />
                  </button>

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => {
                      if (isThisPlaying) {
                        togglePlay();
                      } else {
                        playTrackById(track.id);
                      }
                    }}
                    className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                      isThisPlaying
                        ? 'bg-red-600 text-white ring-4 ring-red-600/30 scale-105'
                        : 'bg-white/90 text-black hover:bg-red-600 hover:text-white hover:scale-110'
                    }`}
                    aria-label={isThisPlaying ? 'Pause mix' : 'Play mix'}
                  >
                    {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onOpenTrackDetails?.(track)}
                      className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-400 transition cursor-pointer"
                      title={track.title}
                    >
                      {track.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-medium">
                      {track.artist}
                    </p>

                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-2 leading-relaxed">
                      {track.description}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {track.genres?.slice(0, 3).map((genre) => (
                        <span
                          key={genre}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        if (isThisPlaying) {
                          togglePlay();
                        } else {
                          playTrackById(track.id);
                        }
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isThisPlaying ? 'Playing' : 'Stream Now'}</span>
                    </button>

                    <button
                      onClick={() => downloadTrack(track)}
                      disabled={isDownloading}
                      title="Download authorized audio file directly to your device"
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isDownloading
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-950/40'
                      }`}
                    >
                      {isDownloading ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mid-content AdSense slot */}
      <AdSlot slotId="audios-bottom-banner" format="rectangle" className="mt-12" />

      {/* Authorized Rights Notice */}
      <div className="mt-8 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          <strong className="text-zinc-200">DJ Emma Pro FX Authorized Audio Distribution:</strong> All promotional mixes, Wakanda Deejay editions, and non-stop street anthems are compiled and broadcast for promotional entertainment. Free direct downloads are provided for files owned or legally authorized for listener distribution.
        </p>
      </div>
    </div>
  );
};
