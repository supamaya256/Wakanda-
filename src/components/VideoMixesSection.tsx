import React, { useState } from 'react';
import { Play, Film, Sparkles, Youtube, Send, Tv, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { AudioTrack } from '../context/AudioContext';
import VideoPlayerModal from './VideoPlayerModal';

interface VideoMixItem {
  id: number;
  title: string;
  artist: string;
  durationLabel: string;
  thumbnail: string;
  quality: string;
  views: string;
  genres: string[];
  description: string;
  videoUrl: string;
  youtubeId?: string;
}

const VIDEO_MIXES: VideoMixItem[] = [
  {
    id: 101,
    title: '2024 ATESO VIDEO MIX VOL 1 VS AFROBEATS & UGANDAN HITS',
    artist: 'DJ EMMA PRO',
    durationLabel: '50:15 Video Nonstop',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000bda08211910e147fbb531635.png',
    quality: 'Ultra HD 4K',
    views: '124.5K Views',
    genres: ['Ateso Video Mix', 'Afrobeats', 'Ugandan Hits'],
    description: 'The monumental 2024 Ateso Video Mix Volume 1 featuring viral Ugandan dancehall hits, heavy percussion basslines, and live scratch transitions by DJ Emma Pro.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2024%20ATESP%20VIDEO%20MIX%20VOLUME%201%20VS%20AFROBEATS%20AND%20UGANDAN%20HITS%20%20BY%20DJ%20EMMA%20PRO.mp3'
  },
  {
    id: 102,
    title: 'BEST OF ATESO GOSPEL VIDEO NONSTOP MIX • WAKANDA EDITION',
    artist: 'DJ EMMA PRO (WAKANDA DJs)',
    durationLabel: '46:30 Video Nonstop',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000981482069a72d0e793ac5391.png',
    quality: 'HD 1080p',
    views: '89.2K Views',
    genres: ['Ateso Gospel', 'Praise & Worship', 'Wakanda Video'],
    description: 'Soul-stirring praise, worship, and energetic traditional gospel video nonstop mix compiled with studio visual effects by DJ Emma Pro.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/BEST_OF_ATESO_GOSPEL_VIDEO_NONSTOP_MIX_BY_DJ_EMMA_PRO_%5BWAKANDA%5D_Christmas(480p).mp3'
  },
  {
    id: 103,
    title: 'STREET ANTHEM 90 • OFFICIAL VIDEO MIX SHOW',
    artist: 'DJ EMMA PRO x DIVINE DEEJAY UG',
    durationLabel: '58:40 Video Nonstop',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/WhatsApp%20Image%202026-06-17%20at%2012.23.24%20PM.jpeg',
    quality: 'Ultra HD 4K',
    views: '215.8K Views',
    genres: ['Street Anthem', 'Afrobeats', 'Wakanda DJs'],
    description: 'The #1 trending street anthem in Uganda: explosive transitions, hype MC chants, and high-energy club anthems blended without interruption.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/STREET%20ANTHEM%2090_DJ%20EMMA%20PRO%5BWAKANDA%20DJs%5D_DIVINE%20DEEJAY%20UG%5BFIRE%20FLAMES%20DJs%5D-1.mp3'
  },
  {
    id: 104,
    title: 'THE CHALLENGE SCRATCH TWO HIT SONGS • WAKANDA DJZ',
    artist: 'DJ EMMA PRO FROM WAKANDA DJZ',
    durationLabel: '38:45 Turntable Show',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_0000000082e48206b44f044859a03025.png',
    quality: 'HD 1080p',
    views: '98.3K Views',
    genres: ['Turntable Scratch', 'Battle Mix', 'Wakanda DJZ'],
    description: 'Extreme turntable scratch showcase and speed-mixing battle session blending Uganda chart toppers with live tone play.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/The_challenge_scratch_two_hit_songs_%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5by_DJ_Emma_pro_from_wakanda_DJZ(480p).mp3'
  },
  {
    id: 105,
    title: 'ONE DROP REGGAE MIX VOL 1 • SOROTI CITY VIDEO BROADCAST',
    artist: 'DJ EMMA PRO',
    durationLabel: '55:30 Reggae Nonstop',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000289082119a86e31512f2ba3d.png',
    quality: 'HD 1080p',
    views: '84.6K Views',
    genres: ['Reggae One-Drop', 'Roots & Dub', 'Soroti City'],
    description: 'Smooth conscious reggae, classic lovers rock, and heavy bass one-drop tracks mastered with live vinyl scratch techniques in Soroti City Studio.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/ONE%20DROP%20REGGEA%20MIX.%20VOL%201%20BY%20DJ%20EMMA%20PRO.mp3'
  },
  {
    id: 106,
    title: '2025 CLUB BANGERS MIXXX VOL 1 • DJ JOSH PRO X DJ EMMA PRO',
    artist: 'DJ JOSH PRO OFISHOL x DJ EMMA PRO',
    durationLabel: '54:20 Nonstop Club Mix',
    thumbnail: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000bda08211910e147fbb531635.png',
    quality: 'Ultra HD 4K',
    views: '110.2K Views',
    genres: ['Club Bangers', 'Dancehall', 'Ugandan Hits'],
    description: 'Electrifying 2025 club bangers mixtape featuring back-to-back mixes, hard kicks, and festival bangers.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2025_mixtape_CLUB_BANGERS_MIXXX_VOL_1_DJ_JOSH_PRO_OFISHOL_X_DJ_EMMA_PRO(256k).mp3'
  }
];

interface VideoMixesSectionProps {
  onOpenTrackModal?: (track: AudioTrack) => void;
}

export default function VideoMixesSection({ onOpenTrackModal }: VideoMixesSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoMixItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'nonstops' | 'gospel' | 'reggae'>('all');

  const filteredVideos = VIDEO_MIXES.filter(v => {
    if (activeTab === 'nonstops') return v.genres.some(g => g.includes('Ateso') || g.includes('Anthem'));
    if (activeTab === 'gospel') return v.genres.some(g => g.includes('Gospel'));
    if (activeTab === 'reggae') return v.genres.some(g => g.includes('Reggae'));
    return true;
  });

  const handlePlayVideo = (video: VideoMixItem) => {
    setSelectedVideo(video);
  };

  // Convert VideoMixItem to AudioTrack shape for VideoPlayerModal
  const activeTrack: AudioTrack | null = selectedVideo ? {
    id: selectedVideo.id,
    title: selectedVideo.title,
    artist: selectedVideo.artist,
    durationLabel: selectedVideo.durationLabel,
    url: selectedVideo.videoUrl,
    downloadUrl: selectedVideo.videoUrl,
    filename: `${selectedVideo.title.replace(/\s+/g, '_')}.mp4`,
    thumbnail: selectedVideo.thumbnail,
    backdrop: selectedVideo.thumbnail,
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: selectedVideo.quality,
    genres: selectedVideo.genres,
    description: selectedVideo.description,
    videoUrl: selectedVideo.videoUrl
  } : null;

  return (
    <section id="videos" className="relative my-10 sm:my-14 px-4 sm:px-8 lg:px-12 select-none scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow">
              VIDEOS
            </span>
            <span className="text-xs text-red-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              <span>NONSTOP VIDEO MIXES & VISUAL SHOWS</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>DJ EMMA PRO VIDEO MIXES</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Watch official nonstop DJ video mixes, high-octane club visualizers, and cultural video broadcasts with live turntable transitions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All Videos' },
            { id: 'nonstops', label: 'Street & Club' },
            { id: 'gospel', label: 'Ateso Gospel' },
            { id: 'reggae', label: 'Reggae One-Drop' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-950/40'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handlePlayVideo(video)}
            className="group relative flex flex-col justify-between rounded-xl overflow-hidden bg-zinc-900/90 border border-zinc-800 hover:border-[#E50914] transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(229,9,20,0.25)] hover:scale-[1.02] cursor-pointer"
          >
            {/* Thumbnail Poster */}
            <div className="relative aspect-video w-full bg-black overflow-hidden shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

              {/* VJ / DJ Tag */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20">
                <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  VIDEO MIX
                </span>
                <span className="bg-black/80 backdrop-blur-xs text-[10px] font-bold text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                  {video.quality}
                </span>
              </div>

              {/* Duration Tag */}
              <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-xs text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded border border-white/10">
                <Clock className="w-3 h-3 text-red-500" />
                <span>{video.durationLabel.split(' ')[0]}</span>
              </div>

              {/* Big Center Play Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-14 h-14 rounded-full bg-[#E50914]/90 group-hover:bg-[#E50914] text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-115">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Genres Overlay */}
              <div className="absolute bottom-2 left-2.5 right-2.5 z-20 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                <span className="truncate">{video.genres.join(' • ')}</span>
                <span className="text-zinc-400 shrink-0 ml-2">{video.views}</span>
              </div>
            </div>

            {/* Video Meta Info */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#E50914] transition-colors">
                  {video.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-zinc-300">{video.artist}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVideo(video);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Watch Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && activeTrack && (
        <VideoPlayerModal
          isOpen={Boolean(selectedVideo)}
          track={activeTrack}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
}
