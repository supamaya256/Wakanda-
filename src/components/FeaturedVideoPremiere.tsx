import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, Pause, Download, Youtube, Share2, Sparkles, CheckCircle2, 
  Volume2, Flame, Film, Music, TrendingUp, Sparkle, Tag, Zap,
  Subtitles, Upload, FileText, Check, Settings, FileDown, X, ChevronDown, Globe
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useWatchHistory } from '../context/WatchHistoryContext';

export type VideoCategoryTag = 'All' | 'New Release' | 'Viral' | 'Mixtape' | 'Ateso Movies';

const AUTOPLAY_STORAGE_KEY = 'dj_emma_premiere_video_autoplay_v1';

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  lang: string;
  vttContent: string;
  vttUrl?: string;
  isCustom?: boolean;
}

function parseTimestamp(ts: string): number {
  const parts = ts.trim().split(':');
  if (parts.length === 3) {
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2].replace(',', '.'));
  } else if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1].replace(',', '.'));
  }
  return 0;
}

export function parseVTT(vttText: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const lines = vttText.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.includes('-->')) {
      const parts = line.split('-->');
      const start = parseTimestamp(parts[0]);
      const end = parseTimestamp(parts[1].split(' ')[0]);
      i++;
      let text = '';
      while (i < lines.length && lines[i].trim() !== '') {
        text += (text ? ' ' : '') + lines[i].trim();
        i++;
      }
      if (!isNaN(start) && !isNaN(end) && text) {
        cues.push({ start, end, text });
      }
    }
    i++;
  }
  return cues;
}

export function createVTTBlobUrl(content: string): string {
  if (typeof window === 'undefined') return '';
  const blob = new Blob([content], { type: 'text/vtt' });
  return URL.createObjectURL(blob);
}

const DEFAULT_SUBTITLE_TRACKS: SubtitleTrack[] = [
  {
    id: 'sub-en',
    label: 'English (Studio Lyrics & DJ Drops)',
    lang: 'en',
    vttContent: `WEBVTT - DJ Emma Pro FX Studio Premiere

00:00:01.000 --> 00:00:05.500
[DJ Emma Pro FX] Official Studio Master Premiere

00:00:06.000 --> 00:00:11.500
ONE DROP REGGAE MIX VOL 1 • Soroti City Broadcast

00:00:12.000 --> 00:00:18.000
Feel the heavy conscious roots & dub bassline vibrations

00:00:18.500 --> 00:00:24.500
"You are listening to the official sound of DJ Emma Pro FX!"

00:00:25.000 --> 00:00:32.000
Mastered in lossless 320kbps fidelity with live voice tags

00:00:32.500 --> 00:00:39.000
Ateso Movies All Teso VJs • Exclusive Nonstop Stream

00:00:39.500 --> 00:00:46.500
Continuous uninterrupted session directly on website

00:00:47.000 --> 00:00:54.000
Roots, rock, reggae and modern African club drops`
  },
  {
    id: 'sub-at',
    label: 'Ateso (Commentary & Translation)',
    lang: 'at',
    vttContent: `WEBVTT - Ateso Translation Commentary

00:00:01.000 --> 00:00:05.500
[DJ Emma Pro FX] Esubit loka akolongit da

00:00:06.000 --> 00:00:11.500
Iyalama aitu ekalapatan loka One Drop Reggae Mix

00:00:12.000 --> 00:00:18.000
Soroti City • VJs loka Teso kere da

00:00:18.500 --> 00:00:24.500
"Emma Pro FX ekaulo loka iroto ka aipupunet!"

00:00:25.000 --> 00:00:32.000
Akipi ka apolou naka etete lo ejaasi anyap kere

00:00:32.500 --> 00:00:39.000
Ateso Movies All Teso VJs • Esubit lo epol

00:00:39.500 --> 00:00:46.500
Epurot lo emamei aidoles ejaasi anyap lo

00:00:47.000 --> 00:00:54.000
Esubit loka ateso nonstop 2026`
  }
];

export interface PremiereVideoItem {
  id: string;
  youtubeId?: string;
  videoUrl?: string;
  title: string;
  artist: string;
  category: string;
  tags: ('New Release' | 'Viral' | 'Mixtape' | 'Ateso Movies')[];
  thumbnail: string;
  duration: string;
  views: string;
  description: string;
  matchScore: number;
  downloadUrl?: string;
  audioTrackId?: number;
}

const PREMIERE_VIDEOS: PremiereVideoItem[] = [
  {
    id: 'one-drop-reggae-vol-1',
    youtubeId: 'TcVAuZcXB5U',
    title: 'ONE DROP REGGEA MIX VOL 1 BY DJ EMMA PRO',
    artist: 'DJ EMMA PRO FX',
    category: 'Reggae Nonstop Mixtape',
    tags: ['New Release', 'Viral', 'Mixtape'],
    thumbnail: 'https://i.ytimg.com/vi/TcVAuZcXB5U/hqdefault.jpg',
    duration: '54:20',
    views: '84.6K Views',
    description: 'Official YouTube Premiere: ONE DROP REGGEA MIX VOL 1 BY DJ EMMA PRO. Smooth conscious reggae vibes, heavy dub basslines, and studio-grade audio. Anyone can play and stream directly from the website.',
    matchScore: 99,
    audioTrackId: 1,
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:DJ_Emma_Pro_One_Drop_Reggae_Mix_Vol_1/v1789786241/ONE_DROP_REGGEA_MIX_VOL_ONE.mp3'
  },
  {
    id: 'crazy-safari-vj-sultan',
    youtubeId: 'm1cfa_PY6AY',
    title: 'CRAZY SAFARI • VJ Sultan 3',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['New Release', 'Viral', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/m1cfa_PY6AY/hqdefault.jpg',
    duration: '1h 36m',
    views: '48.2K Views',
    description: 'Crazy Safari translated into rich Ateso dialect by VJ Sultan 3. Nonstop martial arts comedy, hopping vampires, and classic commentary.',
    matchScore: 99
  },
  {
    id: '36-deadly-styles-vj-bashir',
    youtubeId: 'zDIeVLTq9BM',
    title: '36 DEADLY STYLES • VJ Bashir',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['Viral', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/zDIeVLTq9BM/hqdefault.jpg',
    duration: '1h 32m',
    views: '41.5K Views',
    description: '36 Deadly Styles with authentic Ateso translation by VJ Bashir. Epic Shaolin fighting sequences, rivalry, and intense action commentary.',
    matchScore: 98
  },
  {
    id: 'karate-kill-vj-sultan',
    youtubeId: 'WUu0c7_t6mE',
    title: 'KARATE KILL HD • VJ Sultan',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['New Release', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/WUu0c7_t6mE/hqdefault.jpg',
    duration: '1h 29m',
    views: '39.8K Views',
    description: 'Karate Kill HD in dynamic Ateso translation by VJ Sultan. High-octane martial arts, ruthless revenge thriller, and raw combat.',
    matchScore: 97
  },
  {
    id: 'missing-in-action-2-vj-sultan',
    youtubeId: 'KVdFBjxVN4Q',
    title: 'MISSING IN ACTION 2 • VJ Sultan',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['Viral', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/KVdFBjxVN4Q/hqdefault.jpg',
    duration: '1h 40m',
    views: '52.0K Views',
    description: 'Missing in Action 2: The Beginning translated into rich Ateso by VJ Sultan. POW camp survival, jungle combat, and heroic rescue missions.',
    matchScore: 98
  },
  {
    id: 'balance-of-power-vj-sultan',
    youtubeId: '69LOunrlrD4',
    title: 'BALANCE OF POWER • VJ Sultan',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['New Release', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/69LOunrlrD4/hqdefault.jpg',
    duration: '1h 38m',
    views: '35.1K Views',
    description: 'Balance of Power featuring explosive street combat and martial arts showdowns translated with punchy Ateso dialogue by VJ Sultan.',
    matchScore: 96
  },
  {
    id: 'bhaag-johnny-vj-sultan',
    youtubeId: '9GngBH1lxAo',
    title: 'BHAAG JOHNNY • VJ Sultan 1',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['New Release', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/9GngBH1lxAo/hqdefault.jpg',
    duration: '2h 05m',
    views: '37.4K Views',
    description: 'Bhaag Johnny Part 1 in Ateso translation by VJ Sultan. High-stakes espionage, dual-choice decisions, suspense, and thriller action.',
    matchScore: 95
  },
  {
    id: 'american-ninja-3-vj-sultan',
    youtubeId: '3GKvISmI2c0',
    title: 'AMERICAN NINJA 3 • VJ Sultan',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['Viral', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/3GKvISmI2c0/hqdefault.jpg',
    duration: '1h 30m',
    views: '44.3K Views',
    description: 'American Ninja 3: Blood Hunt translated into lively Ateso by VJ Sultan. Genetic super-soldiers, martial arts tournament, and ninja combat.',
    matchScore: 97
  },
  {
    id: 'crying-freeman-vj-sultan',
    youtubeId: 'IwB6rQNBAuk',
    title: 'CRYING FREEMAN • VJ Sultan',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['Viral', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/IwB6rQNBAuk/hqdefault.jpg',
    duration: '1h 42m',
    views: '46.7K Views',
    description: 'Crying Freeman in gripping Ateso translation by VJ Sultan. The lethal assassin who sheds tears for his victims, Yakuza underworld war.',
    matchScore: 96
  },
  {
    id: 'mary-vj-genius',
    youtubeId: 'UrljTcLlZlw',
    title: 'MARY • VJ Genius',
    artist: 'ATESO MOVIES ALL TESO VJS',
    category: 'Ateso Translated Movie',
    tags: ['New Release', 'Ateso Movies'],
    thumbnail: 'https://i.ytimg.com/vi/UrljTcLlZlw/hqdefault.jpg',
    duration: '1h 24m',
    views: '31.2K Views',
    description: 'Mary horror movie translated into Ateso by VJ Genius. An eerie isolated ship with a terrifying past terrorizes a struggling family.',
    matchScore: 94
  },
  {
    id: 'episode-2-mc-ricky',
    youtubeId: undefined,
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789611461/episode_2_dj_emma_pro_ft_mc_ricky.mp4',
    title: 'EPISODE 2 • DJ EMMA PRO FT MC RICKY',
    artist: 'DJ EMMA PRO FX',
    category: 'Live Club Hype Mixtape',
    tags: ['Viral', 'Mixtape'],
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
    duration: '48:10',
    views: '76.4K Views',
    description: 'High energy non-stop club banger mixtape mixed live by DJ Emma Pro featuring MC Ricky.',
    matchScore: 98,
    audioTrackId: 4,
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:DJ_Emma_Pro_ft_MC_Ricky_Episode_2/v1789786272/episode_2_dj_emma_pro_ft_mc_ricky.mp3'
  },
  {
    id: 'best-of-acholi-traditional',
    youtubeId: undefined,
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789785554/best_of_acholi_nonstop_traditional.mp3',
    title: 'BEST OF ACHOLI NONSTOP TRADITIONAL',
    artist: 'DJ EMMA PRO FX',
    category: 'Traditional Culture Mixtape',
    tags: ['Mixtape', 'New Release'],
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    duration: '52:45',
    views: '63.9K Views',
    description: 'The finest collection of Acholi traditional nonstop rhythms expertly curated by DJ Emma Pro FX.',
    matchScore: 99,
    audioTrackId: 2,
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Best_Of_Acholi_Nonstop_Traditional/v1789785554/best_of_acholi_nonstop_traditional.mp3'
  },
  {
    id: 'best-of-vyroota-mixtape',
    youtubeId: undefined,
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786103/best_of_vyroota_full_mixtape.mp3',
    title: 'BEST OF VYROOTA FULL MIXTAPE',
    artist: 'DJ EMMA PRO FX',
    category: 'Afrobeats Mixtape',
    tags: ['Mixtape', 'Viral'],
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    duration: '45:15',
    views: '58.3K Views',
    description: 'The definitive Best of Vyroota full mixtape expertly blended by DJ Emma Pro FX.',
    matchScore: 98,
    audioTrackId: 3,
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Best_Of_Vyroota_Full_Mixtape/v1789786103/best_of_vyroota_full_mixtape.mp3'
  }
];

interface FeaturedVideoPremiereProps {
  onOpenTrustModal?: () => void;
  onOpenAiHub?: () => void;
}

export default function FeaturedVideoPremiere({ onOpenTrustModal }: FeaturedVideoPremiereProps) {
  const { tracks, isPlaying, currentTrackIndex, playTrack, togglePlay, downloadTrack } = useAudio();
  const { recordMixtapePlayed, recordMoviePlayed } = useWatchHistory();
  const [copied, setCopied] = useState(false);
  const [selectedTag, setSelectedTag] = useState<VideoCategoryTag>('All');
  const [activeVideo, setActiveVideo] = useState<PremiereVideoItem>(PREMIERE_VIDEOS[0]);

  // Read autoplay preference from localStorage (persists for returning visitors)
  const [autoplayEnabled, setAutoplayEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTOPLAY_STORAGE_KEY);
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  // Start with player active immediately if returning visitor has autoplay enabled
  const [isPlayerActive, setIsPlayerActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTOPLAY_STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [autoplayFeedback, setAutoplayFeedback] = useState<string | null>(null);

  // Subtitle & WebVTT Track Support
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [activeSubtitleTrackId, setActiveSubtitleTrackId] = useState<string>('sub-en');
  const [subtitleTracks, setSubtitleTracks] = useState<SubtitleTrack[]>(() => {
    return DEFAULT_SUBTITLE_TRACKS.map(track => ({
      ...track,
      vttUrl: createVTTBlobUrl(track.vttContent)
    }));
  });
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [subtitleFeedback, setSubtitleFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Subtitle Track
  const activeTrack = useMemo(() => {
    return subtitleTracks.find(t => t.id === activeSubtitleTrackId) || subtitleTracks[0];
  }, [subtitleTracks, activeSubtitleTrackId]);

  // Parsed cues for active track
  const parsedCues = useMemo(() => {
    if (!activeTrack?.vttContent) return [];
    return parseVTT(activeTrack.vttContent);
  }, [activeTrack]);

  // Current active cue on screen
  const activeCue = useMemo(() => {
    if (!subtitlesEnabled || parsedCues.length === 0) return null;
    return parsedCues.find(c => playbackSeconds >= c.start && playbackSeconds <= c.end) || null;
  }, [subtitlesEnabled, parsedCues, playbackSeconds]);

  // Timer progression for subtitle cue synchronization while player is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayerActive) {
      interval = setInterval(() => {
        setPlaybackSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setPlaybackSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayerActive]);

  // Handle uploading custom .VTT file
  const handleVTTUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.vtt') && !file.name.toLowerCase().endsWith('.srt')) {
      setSubtitleFeedback('Please select a valid .vtt or .srt subtitle file');
      setTimeout(() => setSubtitleFeedback(null), 3500);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      let content = (event.target?.result as string) || '';
      if (!content.trim().startsWith('WEBVTT')) {
        content = 'WEBVTT\n\n' + content;
      }
      const blobUrl = createVTTBlobUrl(content);
      const newTrackId = `custom-vtt-${Date.now()}`;
      const newTrack: SubtitleTrack = {
        id: newTrackId,
        label: file.name.replace(/\.[^/.]+$/, ''),
        lang: 'custom',
        vttContent: content,
        vttUrl: blobUrl,
        isCustom: true
      };

      setSubtitleTracks(prev => [newTrack, ...prev]);
      setActiveSubtitleTrackId(newTrackId);
      setSubtitlesEnabled(true);
      setSubtitleFeedback(`Subtitle file loaded: ${file.name}`);
      setTimeout(() => setSubtitleFeedback(null), 3500);
      setShowSubtitleMenu(false);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Download active or sample .VTT template
  const handleDownloadSampleVTT = () => {
    const sampleContent = activeTrack?.vttContent || DEFAULT_SUBTITLE_TRACKS[0].vttContent;
    const blob = new Blob([sampleContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeVideo.title.replace(/[^a-zA-Z0-9]/g, '_')}_subtitles.vtt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSubtitleFeedback('Downloaded .VTT subtitle file');
    setTimeout(() => setSubtitleFeedback(null), 3000);
  };

  // If autoplay is enabled on mount, pause global audio so sound doesn't overlap
  useEffect(() => {
    if (autoplayEnabled) {
      if (isPlaying) togglePlay();
    }
  }, []);

  const handleToggleAutoplay = () => {
    setAutoplayEnabled((prev) => {
      const nextVal = !prev;
      try {
        localStorage.setItem(AUTOPLAY_STORAGE_KEY, String(nextVal));
      } catch (e) {
        console.warn('Failed to save autoplay preference in local storage:', e);
      }
      if (nextVal) {
        setIsPlayerActive(true);
        if (isPlaying) togglePlay();
        setAutoplayFeedback('Autoplay Enabled • Saved to this device');
      } else {
        setAutoplayFeedback('Autoplay Disabled • Saved to this device');
      }
      setTimeout(() => setAutoplayFeedback(null), 3000);
      return nextVal;
    });
  };

  // Filter video list based on selected category tag
  const filteredVideos = useMemo(() => {
    if (selectedTag === 'All') return PREMIERE_VIDEOS;
    return PREMIERE_VIDEOS.filter(video => video.tags.includes(selectedTag));
  }, [selectedTag]);

  // Audio track linked to currently active video
  const matchedAudioTrack = activeVideo.audioTrackId 
    ? tracks.find(t => t.id === activeVideo.audioTrackId)
    : (activeVideo.youtubeId ? tracks.find(t => t.youtubeId === activeVideo.youtubeId) : null);

  const isAudioPlaying = isPlaying && matchedAudioTrack && currentTrackIndex === tracks.indexOf(matchedAudioTrack);

  const trackVideoInHistory = (video: PremiereVideoItem) => {
    if (video.tags.includes('Ateso Movies') || video.category.toLowerCase().includes('movie')) {
      recordMoviePlayed({
        id: video.id,
        title: video.title,
        vj: video.artist.includes('VJ') ? video.artist : (video.title.includes('VJ') ? video.title.split('•')[1]?.trim() : 'ATESO MOVIES'),
        year: 2026,
        duration: video.duration,
        genre: video.category,
        quality: 'HD 1080p • Direct Video Premiere',
        thumbnail: video.thumbnail,
        videoUrl: video.videoUrl || '',
        videoUrl320: video.videoUrl || '',
        telegramUrl: 'https://t.me/atesomoviesbox',
        youtubeUrl: video.youtubeId ? `https://youtu.be/${video.youtubeId}` : '',
        youtubeId: video.youtubeId,
        description: video.description,
        matchScore: video.matchScore
      });
    } else {
      const matched = (video.audioTrackId ? tracks.find(t => t.id === video.audioTrackId) : null) || {
        id: video.audioTrackId || 1,
        title: video.title,
        artist: video.artist,
        durationLabel: video.duration,
        url: video.videoUrl || '',
        downloadUrl: video.downloadUrl || '',
        filename: `${video.title}.mp3`,
        thumbnail: video.thumbnail,
        backdrop: video.thumbnail,
        matchScore: video.matchScore,
        year: 2026,
        ageRating: 'All Ages',
        quality: 'Ultra HD 4K • Premiere Stream',
        genres: ['Video Premiere', 'Nonstop Mix'],
        description: video.description,
        youtubeId: video.youtubeId
      };
      recordMixtapePlayed(matched);
    }
  };

  const handleSelectVideo = (video: PremiereVideoItem) => {
    if (isPlaying) togglePlay(); // Stop global audio playback to avoid overlapping sound
    setActiveVideo(video);
    setIsPlayerActive(true);
    trackVideoInHistory(video);
    // Smooth scroll to video player
    const el = document.getElementById('featured-video-premiere');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = () => {
    const videoUrl = activeVideo.youtubeId 
      ? `https://youtu.be/${activeVideo.youtubeId}`
      : window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      All: PREMIERE_VIDEOS.length,
      'New Release': PREMIERE_VIDEOS.filter(v => v.tags.includes('New Release')).length,
      Viral: PREMIERE_VIDEOS.filter(v => v.tags.includes('Viral')).length,
      Mixtape: PREMIERE_VIDEOS.filter(v => v.tags.includes('Mixtape')).length,
      'Ateso Movies': PREMIERE_VIDEOS.filter(v => v.tags.includes('Ateso Movies')).length,
    };
  }, []);

  return (
    <section 
      id="featured-video-premiere" 
      className="relative z-30 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 pb-8"
      aria-label="Direct Video Premiere"
    >
      <div className="bg-gradient-to-br from-[#1b1012] via-[#141414] to-[#0d0d0d] border-2 border-red-600/40 hover:border-red-500/70 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[0_10px_40px_rgba(229,9,20,0.25)] transition-all">
        
        {/* Top Header / Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E50914]"></span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase bg-[#E50914] text-white shadow-md flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 fill-current" />
              #1 VIDEO ON DASHBOARD • PLAY DIRECT
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Direct Website Stream
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-mono">By DJ Emma Pro</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-bold">Ateso Movies All Teso VJs</span>
          </div>
        </div>

        {/* Category Tag Filter Buttons & Autoplay Setting */}
        <div className="mb-6 pb-3 border-b border-zinc-800/80">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Filter Video Feed:</span>
            </div>

            {/* Persistent Autoplay Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAutoplay}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border select-none active:scale-95 ${
                  autoplayEnabled 
                    ? 'bg-red-950/80 border-red-500/80 text-white shadow-md shadow-red-950/60 ring-1 ring-red-500'
                    : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-500'
                }`}
                title={autoplayEnabled ? "Autoplay on page load is ON (click to turn off)" : "Autoplay on page load is OFF (click to turn on)"}
                aria-pressed={autoplayEnabled}
              >
                <Zap className={`w-3.5 h-3.5 ${autoplayEnabled ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-zinc-500'}`} />
                <span>Autoplay on Load:</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-black ${
                  autoplayEnabled ? 'bg-[#E50914] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {autoplayEnabled ? 'ON' : 'OFF'}
                </span>
                <div 
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${
                    autoplayEnabled ? 'bg-red-600' : 'bg-zinc-700'
                  }`}
                >
                  <div 
                    className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform ${
                      autoplayEnabled ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>

              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                ({filteredVideos.length} titles)
              </span>
            </div>
          </div>

          {/* Autoplay Feedback Toast */}
          {autoplayFeedback && (
            <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-red-950/90 border border-red-500/50 text-red-200 text-xs flex items-center justify-between gap-2 shadow-lg shadow-black/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{autoplayFeedback}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Preference saved</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'New Release', 'Viral', 'Mixtape', 'Ateso Movies'] as VideoCategoryTag[]).map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/60 ring-2 ring-red-500/80 scale-105'
                      : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {tag === 'New Release' && <Sparkle className={`w-3 h-3 ${isSelected ? 'text-yellow-300' : 'text-zinc-400'}`} />}
                  {tag === 'Viral' && <Flame className={`w-3 h-3 ${isSelected ? 'text-yellow-300 fill-current' : 'text-zinc-400'}`} />}
                  {tag === 'Mixtape' && <Music className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />}
                  {tag === 'Ateso Movies' && <Film className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />}
                  <span>{tag}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-normal ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-zinc-900 text-zinc-400'
                  }`}>
                    {categoryCounts[tag]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid: Active Video Player + Media Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left/Main Column: 16:9 Responsive Direct YouTube / Video Player */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 group">
              {!isPlayerActive ? (
                <div className="relative w-full h-full">
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Direct Play Overlay Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPlaying) togglePlay(); // Pause background audio so sound doesn't overlap
                        setIsPlayerActive(true);
                        trackVideoInHistory(activeVideo);
                      }}
                      className="group/btn flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E50914] hover:bg-red-600 text-white shadow-[0_0_30px_rgba(229,9,20,0.8)] cursor-pointer hover:scale-110 active:scale-95 transition-all"
                      title="Click to play video directly on this website"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                    </button>
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm tracking-wide border border-white/20">
                      ▶ Tap to Play Directly on Website
                    </span>
                  </div>

                  {/* Corner indicator */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>{activeVideo.duration} • Direct Website Playback</span>
                  </div>
                </div>
              ) : activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  poster={activeVideo.thumbnail}
                  controls
                  autoPlay
                  onTimeUpdate={(e) => setPlaybackSeconds(Math.floor(e.currentTarget.currentTime))}
                  className="w-full h-full object-contain"
                >
                  {subtitlesEnabled && activeTrack?.vttUrl && (
                    <track
                      kind="subtitles"
                      src={activeTrack.vttUrl}
                      srcLang={activeTrack.lang}
                      label={activeTrack.label}
                      default={subtitlesEnabled}
                    />
                  )}
                </video>
              )}

              {/* On-Screen Subtitle / Closed Caption Floating Banner */}
              {subtitlesEnabled && activeCue && (
                <div className="absolute bottom-6 sm:bottom-10 left-4 right-4 z-20 flex justify-center pointer-events-none select-none">
                  <div className="bg-black/90 text-yellow-300 font-semibold px-4 py-2 rounded-lg border border-yellow-500/40 text-xs sm:text-sm md:text-base backdrop-blur-md shadow-2xl text-center max-w-2xl leading-snug animate-fadeIn">
                    {activeCue.text}
                  </div>
                </div>
              )}

              {/* Subtitle / CC Quick Toggle in Player Corner */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black tracking-wider shadow-lg transition-all cursor-pointer border ${
                    subtitlesEnabled
                      ? 'bg-[#E50914] text-white border-red-500 shadow-red-950/80 scale-105'
                      : 'bg-black/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700'
                  }`}
                  title="Toggle Subtitles & CC Menu"
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span>{subtitlesEnabled ? 'CC ON' : 'CC OFF'}</span>
                </button>
              </div>

              {/* Subtitle Dropdown / Configuration Popover */}
              {showSubtitleMenu && (
                <div className="absolute top-12 right-3 z-40 w-72 bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-2xl p-3 text-xs backdrop-blur-md">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Subtitles className="w-4 h-4 text-[#E50914]" />
                      <span>Subtitles & Captions (.VTT)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSubtitleMenu(false)}
                      className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Subtitles ON/OFF */}
                  <div className="flex items-center justify-between py-1 mb-2">
                    <span className="text-zinc-300">Show Subtitles:</span>
                    <button
                      type="button"
                      onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                        subtitlesEnabled ? 'bg-[#E50914] text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {subtitlesEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Subtitle Tracks List */}
                  <div className="mb-2">
                    <p className="text-[10px] uppercase font-mono text-zinc-500 font-bold mb-1">Select Track:</p>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {subtitleTracks.map((track) => {
                        const isTrackActive = track.id === activeSubtitleTrackId;
                        return (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => {
                              setActiveSubtitleTrackId(track.id);
                              setSubtitlesEnabled(true);
                              setShowSubtitleMenu(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-xs transition-colors cursor-pointer ${
                              isTrackActive 
                                ? 'bg-red-950/80 border border-red-500/50 text-white font-bold'
                                : 'hover:bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            <span className="truncate pr-2">{track.label}</span>
                            {isTrackActive && <Check className="w-3.5 h-3.5 text-[#E50914] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions: Upload .VTT / Download Sample / View Transcript */}
                  <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <span>Upload .VTT File</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={handleDownloadSampleVTT}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Download active .VTT subtitle file"
                      >
                        <FileDown className="w-3 h-3 text-emerald-400" />
                        <span>Sample .VTT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowTranscriptModal(true);
                          setShowSubtitleMenu(false);
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-yellow-400" />
                        <span>Transcript</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Track Info & Direct Action Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#E50914] font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Video Player</span>
                </div>
                {autoplayEnabled && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Autoplay Active</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bebas text-white leading-tight tracking-wide">
                {activeVideo.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                {activeVideo.artist} • {activeVideo.duration} • {activeVideo.views}
              </p>
              <p className="text-zinc-300 text-xs sm:text-sm mt-2 leading-relaxed">
                {activeVideo.description}
              </p>

              {/* Tags Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {activeVideo.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-[#E50914] text-zinc-200 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                  Ultra HD 4K
                </span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* Play Video Direct Button */}
              <button
                type="button"
                onClick={() => {
                  if (isPlaying) togglePlay();
                  setIsPlayerActive(true);
                  const el = document.getElementById('featured-video-premiere');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-red-950/50 cursor-pointer active:scale-98 hover:scale-[1.02]"
              >
                <Youtube className="w-5 h-5 fill-current" />
                <span>Play Video Direct (Website)</span>
              </button>

              {/* Play / Pause Audio if Mixtape has audio track */}
              {matchedAudioTrack && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = tracks.findIndex(t => t.id === matchedAudioTrack.id);
                    if (isAudioPlaying) {
                      togglePlay();
                    } else {
                      playTrack(idx !== -1 ? idx : 0);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-md"
                >
                  {isAudioPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Background Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Listen 320kbps MP3 Audio</span>
                    </>
                  )}
                </button>
              )}

              {/* Download & Share Row */}
              <div className="grid grid-cols-2 gap-2">
                {activeVideo.downloadUrl ? (
                  <a
                    href={activeVideo.downloadUrl}
                    download
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Download MP3</span>
                  </a>
                ) : (
                  <a
                    href="https://t.me/atesomoviesbox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>Telegram Full</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                  title="Copy video link"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{copied ? 'Copied Link!' : 'Share Video'}</span>
                </button>
              </div>

              {/* Subtitles & Captions Control Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    subtitlesEnabled
                      ? 'bg-red-950/80 border-red-500/60 text-white shadow-sm'
                      : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Subtitles className={`w-4 h-4 ${subtitlesEnabled ? 'text-[#E50914]' : 'text-zinc-400'}`} />
                    <span>Subtitles & VTT:</span>
                    <span className="font-mono text-[11px] text-zinc-300 font-semibold truncate max-w-[120px]">
                      {subtitlesEnabled ? activeTrack.label.split(' ')[0] : 'OFF'}
                    </span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                    subtitlesEnabled ? 'bg-[#E50914] text-white' : 'bg-zinc-700 text-zinc-400'
                  }`}>
                    {subtitlesEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Subtitle feedback message */}
              {subtitleFeedback && (
                <div className="px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/40 text-blue-200 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{subtitleFeedback}</span>
                </div>
              )}

              {/* Direct WhatsApp Ordering link */}
              <a
                href={`https://wa.me/256780527361?text=${encodeURIComponent(`Hello DJ Emma Pro FX, I am watching "${activeVideo.title}" on the website dashboard and would like to order custom DJ drops or mixtapes.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 hover:text-emerald-200 text-xs font-bold border border-emerald-500/40 transition-colors"
              >
                <span>💬 WhatsApp Studio Order Hotline</span>
              </a>
            </div>
          </div>
        </div>

        {/* Hidden File Input for .VTT / .SRT Subtitle Upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleVTTUpload} 
          accept=".vtt,.srt" 
          className="hidden" 
        />

        {/* Subtitle Transcript Modal */}
        {showTranscriptModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#181818] border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Subtitles className="w-5 h-5 text-[#E50914]" />
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base">
                      VTT Subtitle Script: {activeTrack.label}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {parsedCues.length} caption cues • {activeVideo.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTranscriptModal(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Transcript Cues List */}
              <div className="p-4 overflow-y-auto flex-1 space-y-2.5 text-xs">
                {parsedCues.map((cue, idx) => {
                  const isCurrent = playbackSeconds >= cue.start && playbackSeconds <= cue.end;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setPlaybackSeconds(cue.start);
                        setSubtitlesEnabled(true);
                      }}
                      className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                        isCurrent 
                          ? 'bg-red-950/60 border-red-500/60 text-white shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                        <span className="text-amber-400/90 font-bold">
                          {Math.floor(cue.start / 60)}:{(cue.start % 60 < 10 ? '0' : '') + Math.floor(cue.start % 60)} - {Math.floor(cue.end / 60)}:{(cue.end % 60 < 10 ? '0' : '') + Math.floor(cue.end % 60)}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-bold uppercase text-[9px]">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-sm leading-relaxed">{cue.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDownloadSampleVTT}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download .VTT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTranscriptModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#E50914] hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Feed Carousel / Grid filtered by category tags */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>{selectedTag === 'All' ? 'Complete Video Feed' : `${selectedTag} Videos`}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 font-mono">
                  {filteredVideos.length} Titles
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Click any title below to play directly on this website.
              </p>
            </div>
          </div>

          {/* Horizontal scroll cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-2">
            {filteredVideos.map((video) => {
              const isCurrent = activeVideo.id === video.id;
              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`group/card relative rounded-xl overflow-hidden bg-zinc-900 border transition-all cursor-pointer hover:scale-105 active:scale-95 flex flex-col ${
                    isCurrent
                      ? 'border-[#E50914] ring-2 ring-red-500/80 shadow-lg shadow-red-950/60'
                      : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {/* Thumbnail container */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover/card:bg-black/10 transition-colors" />

                    {/* Duration badge */}
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-200">
                      {video.duration}
                    </span>

                    {/* Active playing indicator */}
                    {isCurrent && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#E50914] text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>NOW PLAYING</span>
                      </div>
                    )}

                    {/* Center play icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover/card:text-[#E50914] transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-1 truncate">
                        {video.artist}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 mt-2 pt-1 border-t border-zinc-800/60">
                      {video.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag} 
                          className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
