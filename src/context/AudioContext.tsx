import { createContext, useContext, useState, useRef, useEffect, useMemo, ReactNode, RefObject } from 'react';

export interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  durationLabel: string;
  url: string;
  downloadUrl: string;
  filename: string;
  thumbnail: string;
  backdrop: string;
  matchScore: number;
  year: number;
  ageRating: string;
  quality: string;
  genres: string[];
  description: string;
  isTrending?: boolean;
  isVideo?: boolean;
  youtubeId?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  topRank?: number;
}

// Official High-Resolution Cover Art from Cloudflare R2 Storage
export const R2_COVERS = {
  PHOTO: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/WhatsApp%20Image%202026-06-17%20at%2012.23.24%20PM.jpeg',
  NEON: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000289082119a86e31512f2ba3d.png',
  STUDIO: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_0000000082e48206b44f044859a03025.png',
  GOLD: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000981482069a72d0e793ac5391.png',
  MASTER: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/file_00000000bda08211910e147fbb531635.png',
};

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 1,
    title: 'STREET ANTHEM 90 • DJ EMMA PRO & WAKANDA DJs',
    artist: 'DJ EMMA PRO x DIVINE DEEJAY UG (FIRE FLAMES DJs)',
    durationLabel: '58:40 Master Nonstop',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/STREET%20ANTHEM%2090_DJ%20EMMA%20PRO%5BWAKANDA%20DJs%5D_DIVINE%20DEEJAY%20UG%5BFIRE%20FLAMES%20DJs%5D-1.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/STREET%20ANTHEM%2090_DJ%20EMMA%20PRO%5BWAKANDA%20DJs%5D_DIVINE%20DEEJAY%20UG%5BFIRE%20FLAMES%20DJs%5D-1.mp3',
    filename: 'STREET_ANTHEM_90_DJ_EMMA_PRO_WAKANDA_DJs.mp3',
    thumbnail: R2_COVERS.PHOTO,
    backdrop: R2_COVERS.PHOTO,
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Studio Master 320kbps',
    genres: ['Street Anthem', 'Afrobeats', 'Ugandan Hits', 'Wakanda DJs'],
    description: 'Top Featured Nonstop: STREET ANTHEM 90 by DJ EMMA PRO from Wakanda DJs & Divine Deejay UG Fire Flames DJs. High-energy street bangers, viral Ugandan hits, and non-stop hype transitions. Stream on site or download directly to your phone.',
    isTrending: true,
    topRank: 1
  },
  {
    id: 2,
    title: '2024 ATESO VIDEO MIX VOL 1 VS AFROBEATS & UGANDAN HITS',
    artist: 'DJ EMMA PRO',
    durationLabel: '50:15 Nonstop Mix',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2024%20ATESP%20VIDEO%20MIX%20VOLUME%201%20VS%20AFROBEATS%20AND%20UGANDAN%20HITS%20%20BY%20DJ%20EMMA%20PRO.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2024%20ATESP%20VIDEO%20MIX%20VOLUME%201%20VS%20AFROBEATS%20AND%20UGANDAN%20HITS%20%20BY%20DJ%20EMMA%20PRO.mp3',
    filename: '2024_Ateso_Video_Mix_Vol_1_DJ_Emma_Pro.mp3',
    thumbnail: R2_COVERS.MASTER,
    backdrop: R2_COVERS.MASTER,
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Studio Master',
    genres: ['Ateso Nonstop', 'Afrobeats', 'Ugandan Hits'],
    description: '2024 Ateso Video Mix Volume 1 featuring the hottest Afrobeats and Ugandan club hits mixed live by DJ Emma Pro.',
    isTrending: true,
    topRank: 2
  },
  {
    id: 3,
    title: 'BEST OF ATESO GOSPEL VIDEO NONSTOP MIX • WAKANDA EDITION',
    artist: 'DJ EMMA PRO (WAKANDA DJs)',
    durationLabel: '46:30 Gospel Nonstop',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/BEST_OF_ATESO_GOSPEL_VIDEO_NONSTOP_MIX_BY_DJ_EMMA_PRO_%5BWAKANDA%5D_Christmas(480p).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/BEST_OF_ATESO_GOSPEL_VIDEO_NONSTOP_MIX_BY_DJ_EMMA_PRO_%5BWAKANDA%5D_Christmas(480p).mp3',
    filename: 'Best_Of_Ateso_Gospel_Nonstop_DJ_Emma_Pro.mp3',
    thumbnail: R2_COVERS.GOLD,
    backdrop: R2_COVERS.GOLD,
    matchScore: 98,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['Ateso Gospel', 'Praise & Worship', 'Christmas Nonstop'],
    description: 'Uplifting and powerful Ateso gospel praise and worship video nonstop mix curated by DJ Emma Pro Wakanda.',
    isTrending: true,
    topRank: 3
  },
  {
    id: 4,
    title: 'ATESO NONSTOP SERIES • EPISODE 1',
    artist: 'DJ EMMA PRO',
    durationLabel: '42:15 Cultural Mix',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/ATESO%20NONSTOP%20SERRIES%20BY%20DJ%20EMMA%20PRO%20(1).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/ATESO%20NONSTOP%20SERRIES%20BY%20DJ%20EMMA%20PRO%20(1).mp3',
    filename: 'Ateso_Nonstop_Series_Episode_1_DJ_Emma_Pro.mp3',
    thumbnail: R2_COVERS.STUDIO,
    backdrop: R2_COVERS.STUDIO,
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Dolby Master 320k',
    genres: ['Ateso Series', 'Teso Traditional', 'Cultural Vibe'],
    description: 'Official Ateso Nonstop Series Episode 1 by DJ Emma Pro. Rich local cultural sounds and modern Teso rhythms.',
    isTrending: true,
    topRank: 4
  },
  {
    id: 5,
    title: '2025 CLUB BANGERS MIX VOL 1 • DJ JOSH PRO X DJ EMMA PRO',
    artist: 'DJ JOSH PRO OFISHOL x DJ EMMA PRO',
    durationLabel: '55:30 Club Banger',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2025_mixtape_CLUB_BANGERS_MIXXX_VOL_1_DJ_JOSH_PRO_OFISHOL_X_DJ_EMMA_PRO(256k).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/2025_mixtape_CLUB_BANGERS_MIXXX_VOL_1_DJ_JOSH_PRO_OFISHOL_X_DJ_EMMA_PRO(256k).mp3',
    filename: '2025_Club_Bangers_Mix_Vol_1_DJ_Josh_Pro_x_DJ_Emma_Pro.mp3',
    thumbnail: R2_COVERS.NEON,
    backdrop: R2_COVERS.NEON,
    matchScore: 99,
    year: 2025,
    ageRating: 'TV-MA',
    quality: 'Ultra HD 4K • 256kbps Studio Master',
    genres: ['Club Bangers', 'Dancehall', 'Party Mix'],
    description: '2025 Club Bangers Volume 1 — the ultimate weekend party weapon by DJ Josh Pro Ofishol and DJ Emma Pro.',
    isTrending: true,
    topRank: 5
  },
  {
    id: 6,
    title: 'LIVE MIXTAPE 2025 • DJ EMMA PRO FT MC RICKY (KAMPALA UGANDA)',
    artist: 'DJ EMMA PRO ft. MC RICKY',
    durationLabel: '51:40 Live Party',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/LIVE%20MIXTAPE%20BY%20DJ%20EMMA%20PRO%20FT%20MC%20RICKY%20%202025%20MIX%20KAMPALA%20UGANADA.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/LIVE%20MIXTAPE%20BY%20DJ%20EMMA%20PRO%20FT%20MC%20RICKY%20%202025%20MIX%20KAMPALA%20UGANADA.mp3',
    filename: 'Live_Mixtape_2025_DJ_Emma_Pro_ft_MC_Ricky.mp3',
    thumbnail: R2_COVERS.PHOTO,
    backdrop: R2_COVERS.PHOTO,
    matchScore: 99,
    year: 2025,
    ageRating: 'TV-MA',
    quality: 'Ultra HD 4K • Live Master',
    genres: ['Live Hype', 'Club Mixtape', 'Kampala Nightlife'],
    description: 'Electrifying live party mixtape from Kampala Uganda featuring MC Ricky and non-stop club bangers by DJ Emma Pro.',
    isTrending: true,
    topRank: 6
  },
  {
    id: 7,
    title: 'ONE DROP REGGAE MIX VOL 1 • SOROTI CITY EDITION',
    artist: 'DJ EMMA PRO',
    durationLabel: '54:20 Roots Reggae',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/ONE%20DROP%20REGGEA%20MIX.%20VOL%201%20BY%20DJ%20EMMA%20PRO.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/ONE%20DROP%20REGGEA%20MIX.%20VOL%201%20BY%20DJ%20EMMA%20PRO.mp3',
    filename: 'DJ_Emma_Pro_One_Drop_Reggae_Mix_Vol_1.mp3',
    thumbnail: R2_COVERS.STUDIO,
    backdrop: R2_COVERS.STUDIO,
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['One Drop Reggae', 'Roots & Dub', 'Lovers Rock'],
    description: 'Official Soroti City Edition: ONE DROP REGGAE MIX VOL 1 BY DJ EMMA PRO. Smooth conscious reggae rhythms and heavy dub basslines.',
    isTrending: true,
    topRank: 7
  },
  {
    id: 8,
    title: 'LATEST UGANDAN MUSIC 2024 • DJ EMMA PRO X DJ DIVINE 256',
    artist: 'DJ EMMA PRO x DJ DIVINE 256',
    durationLabel: '53:05 Hot Mix',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/LATEST%20UGANDAN%20MUSIC%202024%20MIXED%20BY%20DJ%20EMMA%20PRO%20X%20DJ%20DIVINE%20256.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/LATEST%20UGANDAN%20MUSIC%202024%20MIXED%20BY%20DJ%20EMMA%20PRO%20X%20DJ%20DIVINE%20256.mp3',
    filename: 'Latest_Ugandan_Music_2024_DJ_Emma_Pro_x_DJ_Divine_256.mp3',
    thumbnail: R2_COVERS.NEON,
    backdrop: R2_COVERS.NEON,
    matchScore: 99,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['Latest Ugandan', 'Kampala Hits', 'Afrobeats Nonstop'],
    description: 'The biggest and latest 2024 Ugandan songs mixed with surgical precision by DJ Emma Pro and DJ Divine 256.',
    isTrending: true,
    topRank: 8
  },
  {
    id: 9,
    title: 'CURRENT DJZ & WAKANDA DJZ CONNECTION MIXTAPE',
    artist: 'DJ KING G & DJ EMMA PRO',
    durationLabel: '47:50 Duo Nonstop',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/Current%20Djz%20%26%20Wakanda%20Djz%20Connection%20From%202022%20To%202023%20Mixtape%20Dj%20King%20G%20%26%20Dj%20Emma%20Pro..mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/Current%20Djz%20%26%20Wakanda%20Djz%20Connection%20From%202022%20To%202023%20Mixtape%20Dj%20King%20G%20%26%20Dj%20Emma%20Pro..mp3',
    filename: 'Current_Djz_Wakanda_Djz_Connection_Mixtape_Dj_King_G_Dj_Emma_Pro.mp3',
    thumbnail: R2_COVERS.MASTER,
    backdrop: R2_COVERS.MASTER,
    matchScore: 98,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K',
    genres: ['Wakanda Connection', 'Afrobeats', 'Ugandan Hits'],
    description: 'Wakanda Deejays Connection mixtape combining the heavy selection of DJ King G and DJ Emma Pro.',
    isTrending: true,
    topRank: 9
  },
  {
    id: 10,
    title: 'THE CHALLENGE SCRATCH • TWO HIT SONGS FIRE MIX',
    artist: 'DJ EMMA PRO (WAKANDA DJs)',
    durationLabel: '36:15 Battle Nonstop',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/The_challenge_scratch_two_hit_songs_%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5by_DJ_Emma_pro_from_wakanda_DJZ(480p).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/The_challenge_scratch_two_hit_songs_%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5by_DJ_Emma_pro_from_wakanda_DJZ(480p).mp3',
    filename: 'The_Challenge_Scratch_Two_Hit_Songs_DJ_Emma_Pro.mp3',
    thumbnail: R2_COVERS.NEON,
    backdrop: R2_COVERS.NEON,
    matchScore: 97,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'Master 480p • 320kbps',
    genres: ['Turntablism', 'Live Scratches', 'DJ Battle'],
    description: 'Masterclass scratch and battle skills by DJ Emma Pro, the King of Scratch from Wakanda DJs.',
    isTrending: true,
    topRank: 10
  },
  {
    id: 11,
    title: 'ALIEN SKIN VS PALLASO • DJ EMMA PRO WAKANDA MIX',
    artist: 'DJ EMMA PRO (WAKANDA DJs)',
    durationLabel: '44:20 Clash Nonstop',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/Latest_2023__ALIEN_SKIN_Vs_PALLASO__DJ_EMMA_PRO_WAKANDA_Mix(256k).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/Latest_2023__ALIEN_SKIN_Vs_PALLASO__DJ_EMMA_PRO_WAKANDA_Mix(256k).mp3',
    filename: 'Alien_Skin_Vs_Pallaso_Wakanda_Mix_DJ_Emma_Pro.mp3',
    thumbnail: R2_COVERS.PHOTO,
    backdrop: R2_COVERS.PHOTO,
    matchScore: 98,
    year: 2024,
    ageRating: '16+',
    quality: 'Studio Master 256kbps',
    genres: ['Dancehall Clash', 'Fangone Forest', 'Team Good Music'],
    description: 'The legendary musical clash: Alien Skin vs Pallaso in an explosive head-to-head Wakanda nonstop mix by DJ Emma Pro.',
    isTrending: true
  },
  {
    id: 12,
    title: 'NEW HITS VS OLD HITS • FULL MIXTAPE',
    artist: 'DJ EMMA PRO x DJ MOSES PRO (WAKANDA DJs)',
    durationLabel: '54:10 Throwback Mix',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/NEW_HITS_VS_OLD_HITS_TRIAL_FULL_MIXTAPE_BY_DJ_EMMA_PRO_x_DJ_MOSES_PRO_%5BWAKANDA_DJS_PRESENTS%5D(256k).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/NEW_HITS_VS_OLD_HITS_TRIAL_FULL_MIXTAPE_BY_DJ_EMMA_PRO_x_DJ_MOSES_PRO_%5BWAKANDA_DJS_PRESENTS%5D(256k).mp3',
    filename: 'New_Hits_Vs_Old_Hits_Mixtape_DJ_Emma_Pro.mp3',
    thumbnail: R2_COVERS.GOLD,
    backdrop: R2_COVERS.GOLD,
    matchScore: 98,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Studio Master 256kbps',
    genres: ['New vs Old Hits', 'Throwback Hits', 'Club Banger'],
    description: 'Wakanda DJs presents: New Hits vs Old Hits full mixtape blended with master transitions by DJ Emma Pro & DJ Moses Pro.',
    isTrending: true
  },
  {
    id: 13,
    title: 'DJ EMMA PRO SURPRISE NONSTOP 2022 MIX VOL 2',
    artist: 'DJ EMMA PRO',
    durationLabel: '49:15 Surprise Nonstop',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/DJ%20EMMA%20PRO_%20SUPRISE_%20NONSTOP_%202022%20MIX%20(2).mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/DJ%20EMMA%20PRO_%20SUPRISE_%20NONSTOP_%202022%20MIX%20(2).mp3',
    filename: 'DJ_Emma_Pro_Surprise_Nonstop_2022_Mix_2.mp3',
    thumbnail: R2_COVERS.PHOTO,
    backdrop: R2_COVERS.PHOTO,
    matchScore: 96,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'Lossless 320kbps',
    genres: ['Surprise Nonstop', 'Throwback Hits', 'Party Anthem'],
    description: 'An unpredictable, high-energy party mix packed with surprises, smooth blends, and club favorites.',
    isTrending: true
  },
  {
    id: 14,
    title: 'EPISODE 4 MIX SERIES • DJ EMMA PRO X MC SAMMY',
    artist: 'DJ EMMA PRO x MC SAMMY',
    durationLabel: '48:30 Hype Nonstop',
    url: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/episode%20four%20mix%20searies%20dj%20emma%20pro%20x%20mc%20sammy.mp3',
    downloadUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/episode%20four%20mix%20searies%20dj%20emma%20pro%20x%20mc%20sammy.mp3',
    filename: 'Episode_Four_Mix_Series_DJ_Emma_Pro_x_MC_Sammy.mp3',
    thumbnail: R2_COVERS.STUDIO,
    backdrop: R2_COVERS.STUDIO,
    matchScore: 98,
    year: 2025,
    ageRating: 'TV-MA',
    quality: 'Studio Master 320kbps',
    genres: ['Hype Mixtape', 'Dancehall Series', 'Club Party'],
    description: 'Episode 4 of the official DJ Emma Pro mix series with high-octane hype vocals from MC Sammy.',
    isTrending: true
  }
];

export interface ContinueListeningItem {
  track: AudioTrack;
  position: number;
  duration: number;
  formattedPosition: string;
  formattedDuration: string;
  progressPercent: number;
  updatedAt: number;
}

export interface DownloadProgressState {
  trackId: number | null;
  status: 'idle' | 'downloading' | 'completed' | 'error';
  progress: number;
  filename: string | null;
  message?: string;
}

interface AudioContextType {
  tracks: AudioTrack[];
  recentTracks: AudioTrack[];
  currentTrackIndex: number;
  currentTrack: AudioTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  downloadStatus: string | null;
  downloadState: DownloadProgressState;
  continueListeningItem: ContinueListeningItem | null;
  resumeTrack: (trackId?: number, targetTime?: number) => void;
  togglePlay: () => void;
  playTrack: (index: number) => void;
  playTrackById: (id: number) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  seekRelative: (deltaSeconds: number) => void;
  setVolume: (volume: number) => void;
  adjustVolume: (delta: number) => number;
  toggleMute: () => boolean;
  formatTime: (seconds: number) => string;
  downloadTrack: (track: AudioTrack) => void;
  addTrack: (track: AudioTrack) => void;
  deleteTrack: (id: number) => void;
  resetTracks: () => void;
  togglePiP: () => void;
  favorites: number[];
  favoriteTracks: AudioTrack[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  audioRef: RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const TRACKS_STORAGE_KEY = 'dj_emma_audio_tracks_v25_r2_nonstops';

/**
 * Format raw seconds into standard MM:SS or H:MM:SS format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<AudioTrack[]>(() => {
    try {
      const saved = localStorage.getItem(TRACKS_STORAGE_KEY);
      if (saved) {
        const parsed: AudioTrack[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === AUDIO_TRACKS.length) {
          const hasR2Storage = parsed.every(t => typeof t.url === 'string' && t.url.includes('pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev'));
          const hasStreetAnthemTop = parsed[0]?.url?.includes('STREET%20ANTHEM%2090');
          if (!hasR2Storage || !hasStreetAnthemTop) {
            localStorage.removeItem(TRACKS_STORAGE_KEY);
            return AUDIO_TRACKS;
          }
          return parsed.map((t, idx) => ({
            ...t,
            id: t.id || (idx + 1),
            title: t.title || 'Nonstop Mixtape',
            artist: t.artist || 'DJ EMMA PRO',
            url: t.url || (t as any).audioUrl || '',
            downloadUrl: t.downloadUrl || t.url || '',
            filename: t.filename || `${t.title || 'track'}.mp3`,
            genres: Array.isArray(t.genres) ? t.genres : ['Nonstop Mix'],
            durationLabel: t.durationLabel || 'Nonstop',
            thumbnail: t.thumbnail || R2_COVERS.PHOTO,
            backdrop: t.backdrop || R2_COVERS.PHOTO,
            matchScore: t.matchScore || 99,
            year: t.year || 2026,
            ageRating: t.ageRating || 'All Ages',
            quality: t.quality || 'Studio Master',
            description: t.description || 'Mastered studio nonstop mixtape by DJ Emma Pro.'
          }));
        }
      }
    } catch (e) {
      console.warn('Failed reading tracks from storage:', e);
    }
    return AUDIO_TRACKS;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(0.85);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const [recentTracks, setRecentTracks] = useState<AudioTrack[]>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_recent_tracks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load recent tracks:', e);
    }
    return [];
  });

  // Continue Listening & playback position persistence
  const [playbackPositions, setPlaybackPositions] = useState<{ [trackId: number]: { position: number; duration: number; updatedAt: number } }>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_playback_positions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load playback positions:', e);
    }
    // Default initial demonstration for visitor if empty (e.g. Street Anthem 90 paused midway)
    return {
      1: {
        position: 1935, // 32:15
        duration: 3520, // 58:40
        updatedAt: Date.now() - 1000 * 60 * 45 // 45 mins ago
      }
    };
  });

  const [downloadState, setDownloadState] = useState<DownloadProgressState>({
    trackId: null,
    status: 'idle',
    progress: 0,
    filename: null
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not load favorites:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      if (Array.isArray(favorites)) {
        localStorage.setItem('dj_emma_favorites', JSON.stringify(favorites));
      }
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.includes(id)) {
        return list.filter(item => item !== id);
      } else {
        return [...list, id];
      }
    });
  };

  const isFavorite = (id: number) => Boolean(Array.isArray(favorites) && favorites.includes(id));

  const favoriteTracks = useMemo(() => {
    if (!Array.isArray(favorites) || !Array.isArray(tracks)) return [];
    return tracks.filter(t => t && favorites.includes(t.id));
  }, [tracks, favorites]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playbackRate, setPlaybackRateState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_playback_rate');
      if (saved) return parseFloat(saved) || 1;
    } catch (e) {}
    return 1;
  });

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    try {
      localStorage.setItem('dj_emma_playback_rate', rate.toString());
    } catch (e) {}
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(TRACKS_STORAGE_KEY, JSON.stringify(tracks));
    } catch (e) {
      console.warn('Could not save tracks to storage:', e);
    }
  }, [tracks]);

  useEffect(() => {
    try {
      localStorage.setItem('dj_emma_recent_tracks', JSON.stringify(recentTracks));
    } catch (e) {
      console.warn('Could not save recent tracks:', e);
    }
  }, [recentTracks]);

  // Ensure index is valid
  const safeIndex = tracks.length > 0 ? Math.min(currentTrackIndex, tracks.length - 1) : 0;
  const currentTrack: AudioTrack = tracks[safeIndex] || AUDIO_TRACKS[0];

  const addTrack = (newTrack: AudioTrack) => {
    if (!newTrack) return;
    const sanitized: AudioTrack = {
      ...newTrack,
      id: newTrack.id || Date.now(),
      title: newTrack.title || 'Nonstop Mixtape',
      artist: newTrack.artist || 'DJ EMMA PRO FX',
      url: newTrack.url || (newTrack as any).audioUrl || '',
      downloadUrl: newTrack.downloadUrl || newTrack.url || '',
      filename: newTrack.filename || `${newTrack.title || 'mixtape'}.mp3`,
      genres: Array.isArray(newTrack.genres) ? newTrack.genres : ['Nonstop Mix'],
      durationLabel: newTrack.durationLabel || 'Nonstop',
      thumbnail: newTrack.thumbnail || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
      backdrop: newTrack.backdrop || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
      matchScore: newTrack.matchScore || 99,
      year: newTrack.year || 2026,
      ageRating: newTrack.ageRating || 'All Ages',
      quality: newTrack.quality || 'Studio Master',
      description: newTrack.description || 'Mastered studio nonstop mixtape by DJ Emma Pro FX.'
    };
    setTracks(prev => [sanitized, ...(Array.isArray(prev) ? prev : [])]);
  };

  const deleteTrack = (id: number) => {
    setTracks(prev => {
      const updated = prev.filter(t => t.id !== id);
      return updated.length > 0 ? updated : AUDIO_TRACKS.slice(0, 1);
    });
    if (currentTrack?.id === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setCurrentTrackIndex(0);
    }
  };

  const resetTracks = () => {
    setTracks(AUDIO_TRACKS);
    localStorage.removeItem(TRACKS_STORAGE_KEY);
  };

  const togglePiP = async () => {
    if (audioRef.current && (document as any).pictureInPictureEnabled) {
      try {
        if ((document as any).pictureInPictureElement) {
          await (document as any).exitPictureInPicture();
        } else if (typeof (audioRef.current as any).requestPictureInPicture === 'function') {
          await (audioRef.current as any).requestPictureInPicture();
        }
      } catch (error) {
        console.error('Failed to enter/exit PIP:', error);
      }
    }
  };

  const downloadTrack = async (track: AudioTrack) => {
    // Prevent accidental multiple downloads
    if (downloadState.status === 'downloading') {
      setDownloadStatus(`Download already in progress: "${downloadState.filename}". Please wait a moment.`);
      return;
    }

    setDownloadState({
      trackId: track.id,
      status: 'downloading',
      progress: 25,
      filename: track.filename,
      message: `Starting download: "${track.title}"...`
    });
    setDownloadStatus(`Downloading "${track.title}" to your phone...`);

    let progress = 25;
    const progressTimer = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 90) {
        clearInterval(progressTimer);
        progress = 92;
      }
      setDownloadState(prev => ({
        ...prev,
        progress,
        message: `Saving to device (${progress}%)...`
      }));
    }, 200);

    try {
      const link = document.createElement('a');
      link.href = track.downloadUrl;
      link.setAttribute('download', track.filename);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        clearInterval(progressTimer);
        setDownloadState({
          trackId: track.id,
          status: 'completed',
          progress: 100,
          filename: track.filename,
          message: `Successfully saved "${track.filename}" to your phone!`
        });
        setDownloadStatus(`Saved "${track.title}" to device!`);

        setTimeout(() => {
          setDownloadState({
            trackId: null,
            status: 'idle',
            progress: 0,
            filename: null
          });
          setDownloadStatus(null);
        }, 4000);
      }, 900);
    } catch (e) {
      clearInterval(progressTimer);
      setDownloadState({
        trackId: track.id,
        status: 'error',
        progress: 0,
        filename: track.filename,
        message: 'Download error. Please retry.'
      });
      setTimeout(() => {
        setDownloadState({
          trackId: null,
          status: 'idle',
          progress: 0,
          filename: null
        });
        setDownloadStatus(null);
      }, 3000);
    }
  };

  // Continue Listening computation
  const continueListeningItem = useMemo<ContinueListeningItem | null>(() => {
    const entries = Object.entries(playbackPositions);
    if (entries.length === 0) return null;

    let candidate: { trackId: number; position: number; duration: number; updatedAt: number } | null = null;
    for (const [idStr, data] of entries) {
      const trackId = Number(idStr);
      // Valid if visitor stopped after at least 15 seconds and before the final 20 seconds
      if (data.position >= 15 && (!data.duration || data.position < data.duration - 20)) {
        if (!candidate || data.updatedAt > candidate.updatedAt) {
          candidate = { trackId, ...data };
        }
      }
    }

    if (!candidate) return null;
    const matchedTrack = tracks.find(t => t.id === candidate!.trackId) || AUDIO_TRACKS.find(t => t.id === candidate!.trackId);
    if (!matchedTrack) return null;

    const totalDur = candidate.duration || 3520;
    const progressPercent = Math.min(100, Math.round((candidate.position / totalDur) * 100));

    return {
      track: matchedTrack,
      position: candidate.position,
      duration: totalDur,
      formattedPosition: formatTime(candidate.position),
      formattedDuration: formatTime(totalDur),
      progressPercent,
      updatedAt: candidate.updatedAt
    };
  }, [playbackPositions, tracks]);

  // Resume playback function
  const resumeTrack = (targetTrackId?: number, targetTime?: number) => {
    const id = targetTrackId || continueListeningItem?.track.id || currentTrack.id;
    const savedPos = targetTime !== undefined 
      ? targetTime 
      : (playbackPositions[id]?.position || continueListeningItem?.position || 0);

    const targetIndex = tracks.findIndex(t => t.id === id);
    if (targetIndex !== -1) {
      setCurrentTrackIndex(targetIndex);
      const audio = audioRef.current;
      if (audio) {
        audio.src = tracks[targetIndex].url;
        audio.load();
        audio.currentTime = savedPos;
        safePlay(audio);
      }
    }
  };

  // Position save throttler ref
  const lastSavedPosRef = useRef<number>(0);

  // Initialize audio element once
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.preload = 'metadata';
    audio.volume = volume;

    const onTimeUpdate = () => {
      const cur = audio.currentTime;
      setCurrentTime(cur);

      // Throttled position persistence every 2.5 seconds
      const now = Date.now();
      if (cur > 10 && now - lastSavedPosRef.current > 2500) {
        lastSavedPosRef.current = now;
        const dur = audio.duration || duration || 0;
        setPlaybackPositions(prev => {
          const updated = {
            ...prev,
            [currentTrack.id]: {
              position: Math.floor(cur),
              duration: Math.floor(dur),
              updatedAt: now
            }
          };
          try {
            localStorage.setItem('dj_emma_playback_positions', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % (tracks.length > 0 ? tracks.length : AUDIO_TRACKS.length));
    };

    const onError = (e: Event) => {
      const target = e.target as HTMLAudioElement | null;
      const mediaError = target?.error;
      // Code 1: MEDIA_ERR_ABORTED, Code 2: MEDIA_ERR_NETWORK, Code 3: MEDIA_ERR_DECODE, Code 4: MEDIA_ERR_SRC_NOT_SUPPORTED
      if (mediaError && (mediaError.code === 1 || mediaError.code === 4)) {
        // Aborted or format error on empty src - ignore
        return;
      }
      console.warn('Audio playback error code:', mediaError?.code, 'message:', mediaError?.message);
      // Attempt recovery
      setTimeout(() => {
        if (audioRef.current && currentTrack?.url) {
          try {
            audioRef.current.load();
            if (isPlaying) {
              audioRef.current.play().catch(() => {});
            }
          } catch {
            // ignore
          }
        }
      }, 1500);
    };

    const onStalled = () => {
      console.warn('Playback stalled, attempting recovery...');
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('stalled', onStalled);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('stalled', onStalled);
      audio.pause();
      try {
        audio.removeAttribute('src');
      } catch {}
    };
  }, []);

  const safePlay = async (audio: HTMLAudioElement) => {
    try {
      audio.playbackRate = playbackRate;
      audio.volume = isMuted ? 0 : volume;
      await audio.play();
      setIsPlaying(true);
      if (typeof window !== 'undefined' && currentTrack) {
        window.dispatchEvent(new CustomEvent('app:track-played', { detail: currentTrack }));
      }
    } catch (err: any) {
      if (
        err &&
        (err.name === 'AbortError' ||
          err.code === 20 ||
          err.message?.includes('interrupted by a new load request') ||
          err.message?.includes('aborted'))
      ) {
        // Interrupted by new load request - normal when switching tracks fast, ignore
        return;
      }
      console.warn('Playback error:', err);
      setIsPlaying(false);
    }
  };

  // Track initial mount to prevent premature audio.load() call on idle page load
  const isInitialAudioMount = useRef<boolean>(true);

  // Sync track URL change
  useEffect(() => {
    if (isInitialAudioMount.current) {
      isInitialAudioMount.current = false;
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = isPlaying;
    audio.src = currentTrack.url;
    audio.load();

    if (wasPlaying) {
      safePlay(audio);
    }

    setRecentTracks(prev => {
      const filtered = prev.filter(t => t.id !== currentTrack.id);
      return [currentTrack, ...filtered].slice(0, 5);
    });
  }, [currentTrackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === '') {
        audio.src = currentTrack.url;
      }
      safePlay(audio);
    }
  };

  const playTrack = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (index === currentTrackIndex) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        safePlay(audio);
      }
      return;
    }

    setCurrentTrackIndex(index);
    if (tracks[index]) {
      audio.src = tracks[index].url;
      audio.load();
      safePlay(audio);
    }
  };

  const playTrackById = (id: number) => {
    const idx = tracks.findIndex(t => t.id === id);
    if (idx !== -1) {
      playTrack(idx);
    } else {
      const fallbackIdx = AUDIO_TRACKS.findIndex(t => t.id === id);
      if (fallbackIdx !== -1) {
        const targetTrack = AUDIO_TRACKS[fallbackIdx];
        setTracks(prev => [targetTrack, ...prev]);
        setTimeout(() => {
          playTrack(0);
        }, 50);
      }
    }
  };

  const pauseTrack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIdx);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIdx);
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(duration || audio.duration || seconds, seconds));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const seekRelative = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const cur = audio.currentTime || currentTime || 0;
    const maxDur = duration || audio.duration || 0;
    const target = Math.max(0, maxDur > 0 ? Math.min(maxDur, cur + deltaSeconds) : cur + deltaSeconds);
    seek(target);
  };

  const setVolume = (val: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audio) {
      audio.volume = clamped;
    }
  };

  const adjustVolume = (delta: number): number => {
    const nextVal = Math.max(0, Math.min(1, Math.round((volume + delta) * 100) / 100));
    setVolume(nextVal);
    return nextVal;
  };

  const toggleMute = (): boolean => {
    if (isMuted || volume === 0) {
      const restored = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.85;
      setVolume(restored);
      setIsMuted(false);
      return false; // not muted
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
      return true; // muted
    }
  };

  return (
    <AudioContext.Provider
      value={{
        tracks,
        recentTracks,
        currentTrackIndex,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        downloadStatus,
        togglePlay,
        playTrack,
        playTrackById,
        pauseTrack,
        nextTrack,
        prevTrack,
        seek,
        seekRelative,
        setVolume,
        adjustVolume,
        toggleMute,
        formatTime,
        downloadTrack,
        downloadState,
        continueListeningItem,
        resumeTrack,
        addTrack,
        deleteTrack,
        resetTracks,
        togglePiP,
        favorites,
        favoriteTracks,
        toggleFavorite,
        isFavorite,
        playbackRate,
        setPlaybackRate,
        audioRef
      }}
    >
      {children}
      
      {/* Global Audio Player - preload none to save mobile bandwidth */}
      <audio 
        ref={audioRef}
        src={currentTrack?.url || undefined}
        preload="none"
        onError={(e) => {
          // Gracefully suppress unhandled error event
          e.stopPropagation();
        }}
      >
        {currentTrack?.url && (
          <source src={currentTrack.url} type="audio/mpeg" />
        )}
      </audio>

      {/* Phone Download Notification Toast */}
      {downloadStatus && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm bg-[#090909]/95 text-white border border-[#00ffcc] p-4 rounded-xl shadow-[0_0_30px_rgba(0,255,204,0.4)] backdrop-blur-xl flex items-center gap-3 animate-bounce font-mono">
          <div className="w-8 h-8 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc] flex items-center justify-center shrink-0">
            <span className="text-[#00ffcc] text-sm font-bold">⬇</span>
          </div>
          <div className="text-xs">
            <div className="text-[#00ffcc] font-bold uppercase tracking-wider">SAVING TO DEVICE</div>
            <div className="text-zinc-300 mt-0.5">{downloadStatus}</div>
          </div>
        </div>
      )}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
