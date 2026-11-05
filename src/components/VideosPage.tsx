import React, { useState } from 'react';
import { Film, Play, Download, Youtube, ExternalLink, ShieldCheck, Sparkles, Clock, Eye } from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';
import { AdSlot } from './AdSlot';

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
  downloadUrl?: string;
  youtubeId?: string;
}

const OFFICIAL_VIDEOS: VideoMixItem[] = [
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
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2024%20ATESP%20VIDEO%20MIX%20VOLUME%201%20VS%20AFROBEATS%20AND%20UGANDAN%20HITS%20%20BY%20DJ%20EMMA%20PRO.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2024%20ATESP%20VIDEO%20MIX%20VOLUME%201%20VS%20AFROBEATS%20AND%20UGANDAN%20HITS%20%20BY%20DJ%20EMMA%20PRO.mp3'
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
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/BEST_OF_ATESO_GOSPEL_VIDEO_NONSTOP_MIX_BY_DJ_EMMA_PRO_%5BWAKANDA%5D_Christmas(480p).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/BEST_OF_ATESO_GOSPEL_VIDEO_NONSTOP_MIX_BY_DJ_EMMA_PRO_%5BWAKANDA%5D_Christmas(480p).mp3'
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
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/STREET%20ANTHEM%2090_DJ%20EMMA%20PRO%5BWAKANDA%20DJs%5D_DIVINE%20DEEJAY%20UG%5BFIRE%20FLAMES%20DJs%5D-1.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/STREET%20ANTHEM%2090_DJ%20EMMA%20PRO%5BWAKANDA%20DJs%5D_DIVINE%20DEEJAY%20UG%5BFIRE%20FLAMES%20DJs%5D-1.mp3'
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
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/The_challenge_scratch_two_hit_songs_%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5by_DJ_Emma_pro_from_wakanda_DJZ(480p).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/The_challenge_scratch_two_hit_songs_%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5by_DJ_Emma_pro_from_wakanda_DJZ(480p).mp3'
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
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/ONE%20DROP%20REGGEA%20MIX.%20VOL%201%20BY%20DJ%20EMMA%20PRO.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/ONE%20DROP%20REGGEA%20MIX.%20VOL%201%20BY%20DJ%20EMMA%20PRO.mp3'
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
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2025_mixtape_CLUB_BANGERS_MIXXX_VOL_1_DJ_JOSH_PRO_OFISHOL_X_DJ_EMMA_PRO(256k).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2025_mixtape_CLUB_BANGERS_MIXXX_VOL_1_DJ_JOSH_PRO_OFISHOL_X_DJ_EMMA_PRO(256k).mp3'
  }
];

export const VideosPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoMixItem | null>(null);

  return (
    <div className="min-h-screen bg-black text-zinc-100 pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono mb-3">
          <Film className="w-3.5 h-3.5" />
          <span>OFFICIAL VIDEO SHOWS & MIXES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          DJ EMMA PRO <span className="text-red-600">VIDEO MIXES</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
          High-definition video mixtapes and live club performances featuring DJ Emma Pro, Wakanda Deejays, and guest MCs. Optimized for fast mobile streaming with half-screen and full-screen playback.
        </p>
      </div>

      {/* Top Banner AdSlot */}
      <AdSlot slotId="videos-top-banner" format="horizontal" className="mb-8" />

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFICIAL_VIDEOS.map((video) => (
          <div
            key={video.id}
            className="group rounded-2xl bg-zinc-950/90 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-xl"
          >
            {/* Thumbnail */}
            <div
              onClick={() => setSelectedVideo(video)}
              className="relative aspect-video w-full bg-zinc-900 cursor-pointer overflow-hidden"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

              {/* Play Badge Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-red-500 border border-red-500/30">
                  {video.quality}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                  {video.durationLabel}
                </span>
              </div>

              {video.youtubeId && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-red-600/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                  <Youtube className="w-3 h-3" />
                  YouTube Premiere
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3
                  onClick={() => setSelectedVideo(video)}
                  className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-400 transition cursor-pointer"
                  title={video.title}
                >
                  {video.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-medium">
                  {video.artist}
                </p>

                <p className="text-[11px] text-zinc-500 line-clamp-2 mt-2 leading-relaxed">
                  {video.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {video.genres.map((g) => (
                    <span
                      key={g}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video</span>
                </button>

                {video.downloadUrl && (
                  <a
                    href={video.downloadUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-zinc-800 transition cursor-pointer"
                    title="Authorized video download"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Save</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom AdSlot */}
      <AdSlot slotId="videos-bottom-banner" format="rectangle" className="mt-12" />

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          isOpen={Boolean(selectedVideo)}
          onClose={() => setSelectedVideo(null)}
          track={{
            id: selectedVideo.id,
            title: selectedVideo.title,
            artist: selectedVideo.artist,
            durationLabel: selectedVideo.durationLabel,
            url: selectedVideo.videoUrl,
            videoUrl: selectedVideo.videoUrl,
            downloadUrl: selectedVideo.downloadUrl || selectedVideo.videoUrl,
            filename: `${selectedVideo.title}.mp4`,
            thumbnail: selectedVideo.thumbnail,
            backdrop: selectedVideo.thumbnail,
            matchScore: 99,
            year: 2026,
            ageRating: 'All Ages',
            isVideo: true,
            quality: selectedVideo.quality,
            youtubeId: selectedVideo.youtubeId,
            description: selectedVideo.description,
            genres: selectedVideo.genres,
          }}
        />
      )}
    </div>
  );
};
