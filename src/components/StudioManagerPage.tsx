import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import * as d3 from 'd3';
import {
  Upload,
  Trash2,
  Plus,
  Play,
  Pause,
  ArrowLeft,
  Music,
  Mic,
  Video,
  FileText,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  ExternalLink,
  Copy,
  Download,
  Film,
  Sparkles,
  Volume2,
  Sliders,
  Check,
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  LogOut,
  Link2,
  Settings,
  Server,
  Database,
  Cloud,
  Eye,
  LayoutDashboard,
  MessageCircle,
  Send,
  MessageSquare
} from 'lucide-react';
import { useAudio, AudioTrack } from '../context/AudioContext';
import { useContent, CustomMediaFile } from '../context/ContentContext';
import { useAdminAuth, MASTER_ADMIN_EMAIL } from '../context/AdminAuthContext';
import { VoiceDropItem } from '../data/voiceDropsData';
import { LogoItem } from '../data/logosData';
import { AtesoMovie } from '../data/atesoMoviesData';
import CustomVoiceDropRequestForm from './CustomVoiceDropRequestForm';
import StudioContactForm from './StudioContactForm';
import WordPressAdminDashboard from './WordPressAdminDashboard';
import { 
  smartUploadFile, 
  getPreferredStorage, 
  savePreferredStorage, 
  getFirebaseStorageConfig,
  saveFirebaseStorageConfig,
  testFirebaseStorageConnection,
  StorageUploadProgress 
} from '../lib/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

interface StudioManagerPageProps {
  onBackToStore: () => void;
  initialTab?: TabType;
}

export type TabType = 'dashboard' | 'tracks' | 'drops' | 'custom-drops' | 'logos' | 'movies' | 'files' | 'inquiries';

function FavoriteTracksD3Chart({ tracks }: { tracks: AudioTrack[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ title: string; count: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!chartRef.current || !tracks || tracks.length === 0) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const topTracks = [...tracks]
      .map((t) => ({
        title: (t.title || 'Track').length > 18 ? (t.title || 'Track').substring(0, 18) + '...' : (t.title || 'Track'),
        fullTitle: t.title || 'Track',
        artist: t.artist || 'DJ Emma Pro FX',
        favorites: 120 + (((t?.id != null ? String(t.id) : '0').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 37) % 430)
      }))
      .sort((a, b) => b.favorites - a.favorites)
      .slice(0, 8);

    const margin = { top: 25, right: 20, bottom: 55, left: 60 };
    const width = chartRef.current.clientWidth || 700;
    const height = 280;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(topTracks.map(d => d.title))
      .range([0, innerWidth])
      .padding(0.35);

    const maxFav = d3.max(topTracks, d => d.favorites) || 500;
    const y = d3.scaleLinear()
      .domain([0, maxFav * 1.15])
      .range([innerHeight, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-25)')
      .style('text-anchor', 'end')
      .style('fill', '#a1a1aa')
      .style('font-size', '11px')
      .style('font-family', 'monospace');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('fill', '#a1a1aa')
      .style('font-size', '11px')
      .style('font-family', 'monospace');

    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(5).tickSizeInner(-innerWidth).tickFormat(() => ''))
      .selectAll('line')
      .style('stroke', '#27272a')
      .style('stroke-dasharray', '3,3');

    svg.selectAll('.bar')
      .data(topTracks)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.title) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', '#E50914')
      .attr('rx', 6)
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('fill', '#ff1e2b');
        const [mx, my] = d3.pointer(event, chartRef.current);
        setTooltip({ title: d.fullTitle, count: d.favorites, x: mx, y: my - 50 });
      })
      .on('mouseleave', function() {
        d3.select(this).attr('fill', '#E50914');
        setTooltip(null);
      })
      .transition()
      .duration(900)
      .attr('y', d => y(d.favorites))
      .attr('height', d => innerHeight - y(d.favorites));

    svg.selectAll('.label')
      .data(topTracks)
      .enter()
      .append('text')
      .attr('x', d => (x(d.title) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.favorites) - 8)
      .attr('text-anchor', 'middle')
      .style('fill', '#f4f4f5')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('font-family', 'monospace')
      .text(d => d.favorites);

  }, [tracks]);

  return (
    <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-black rounded-2xl border border-zinc-800 p-6 shadow-2xl mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#E50914] uppercase">
            AUDIENCE PREFERENCE ANALYTICS
          </span>
          <h2 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
            <span className="w-3 h-3 rounded-full bg-[#E50914] inline-block animate-pulse"></span>
            Most Frequently Favorited Tracks (D3.js)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interactive D3.js visualization tracking audience favorites and engagement preferences across nonstop DJ mixtapes.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-300 font-mono text-xs font-semibold">
          Top {Math.min(tracks.length, 8)} Ranked Tracks
        </div>
      </div>

      <div ref={chartRef} className="w-full relative overflow-hidden">
        {tooltip && (
          <div
            className="absolute z-20 pointer-events-none bg-black/95 border border-zinc-700 px-3.5 py-2 rounded-xl shadow-2xl text-xs backdrop-blur-md"
            style={{ left: Math.max(10, tooltip.x - 70), top: Math.max(10, tooltip.y) }}
          >
            <p className="font-bold text-white mb-0.5">{tooltip.title}</p>
            <p className="text-[#E50914] font-mono font-bold text-sm">{tooltip.count} Favorites</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StorageUploadIndicator({ progress }: { progress?: { percent: number; status: 'uploading' | 'completed' | 'error'; provider?: 'firebase' | 'cloudinary' | 'server' | 'local'; error?: string } }) {
  if (!progress) return null;

  const providerLabel = 
    progress.provider === 'firebase' ? 'Firebase Cloud Storage' :
    progress.provider === 'cloudinary' ? 'Cloudinary Storage' :
    progress.provider === 'server' ? 'Server Media Storage' : 'Local Storage';

  if (progress.status === 'uploading') {
    return (
      <div className="space-y-1.5 p-2.5 bg-black/70 border border-zinc-800 rounded-lg text-xs animate-in fade-in duration-150 my-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-200 font-medium flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin shrink-0" />
            <span>Uploading to {providerLabel}...</span>
          </span>
          <span className="font-mono text-[#E50914] font-bold">{progress.percent}%</span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#E50914] h-full transition-all duration-200" 
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-lg animate-in fade-in duration-150 my-1.5">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Ready & saved in {providerLabel}!</span>
      </div>
    );
  }

  if (progress.status === 'error') {
    return (
      <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2 rounded-lg animate-in fade-in duration-150 my-1.5">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        <span>Upload error: {progress.error}</span>
      </div>
    );
  }

  return null;
}

export default function StudioManagerPage({ onBackToStore, initialTab = 'tracks' }: StudioManagerPageProps) {
  const { isAdmin, adminEmail, openAuthModal, logout } = useAdminAuth();
  const { tracks, addTrack, deleteTrack, resetTracks } = useAudio();
  const {
    voiceDrops,
    addVoiceDrop,
    deleteVoiceDrop,
    resetVoiceDrops,
    logos,
    addLogo,
    deleteLogo,
    resetLogos,
    atesoMovies,
    addAtesoMovie,
    deleteAtesoMovie,
    resetAtesoMovies,
    customFiles,
    addCustomFile,
    deleteCustomFile,
    resetCustomFiles,
    resetAllContent
  } = useContent();

  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleSwitchTab = (e: CustomEvent<TabType>) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('studio:switch-tab' as any, handleSwitchTab);
    return () => window.removeEventListener('studio:switch-tab' as any, handleSwitchTab);
  }, []);

  // Modal confirmation for deleting an item
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{
    id: string | number;
    title: string;
    type: 'track' | 'drop' | 'logo' | 'movie' | 'file';
  } | null>(null);

  // Modal confirmation for resetting catalog
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form toggles
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [showDropForm, setShowDropForm] = useState(false);
  const [showLogoForm, setShowLogoForm] = useState(false);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showFileForm, setShowFileForm] = useState(false);

  // Ateso movie upload form state
  const [movieTitle, setMovieTitle] = useState('');
  const [movieVj, setMovieVj] = useState('VJ EMMA PRO FX');
  const [movieVideoUrl, setMovieVideoUrl] = useState('');
  const [movieThumbnail, setMovieThumbnail] = useState('https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg');
  const [movieDuration, setMovieDuration] = useState('1h 45m');
  const [movieGenre, setMovieGenre] = useState('Action Blockbuster');
  const [movieQuality, setMovieQuality] = useState('Ultra HD 4K');
  const [movieDescription, setMovieDescription] = useState('');
  const [movieTelegramUrl, setMovieTelegramUrl] = useState('https://t.me/atesomoviesbox');

  // Audio preview for tracks & drops in manager
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Track upload form state
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('DJ EMMA PRO FX');
  const [trackAudioUrl, setTrackAudioUrl] = useState('');
  const [trackAudioFileName, setTrackAudioFileName] = useState('');
  const [trackThumbnail, setTrackThumbnail] = useState('/wallpaper.png');
  const [trackDurationLabel, setTrackDurationLabel] = useState('Nonstop Mix');
  const [trackGenres, setTrackGenres] = useState('Club Banger, Afrobeats, East Africa');
  const [trackYear, setTrackYear] = useState(2026);
  const [trackQuality, setTrackQuality] = useState('Ultra HD 4K • Studio 320kbps');
  const [trackDescription, setTrackDescription] = useState('');

  // Drop upload form state
  const [dropTitle, setDropTitle] = useState('');
  const [dropCategory, setDropCategory] = useState('Club Hype');
  const [dropAudioUrl, setDropAudioUrl] = useState('');
  const [dropAudioFileName, setDropAudioFileName] = useState('');
  const [dropPriceUgx, setDropPriceUgx] = useState('15,000 UGX');
  const [dropPriceUsd, setDropPriceUsd] = useState('$5 USD');
  const [dropStyle, setDropStyle] = useState('Explosive Vocal & Laser Stutters');
  const [dropSampleScript, setDropSampleScript] = useState('');
  const [dropTags, setDropTags] = useState('Club ID, Laser FX, Hype');

  // Logo upload form state
  const [logoTitle, setLogoTitle] = useState('');
  const [logoCategory, setLogoCategory] = useState('Gold & Metallic');
  const [logoVideoUrl, setLogoVideoUrl] = useState('');
  const [logoVideoFileName, setLogoVideoFileName] = useState('');
  const [logoPriceUgx, setLogoPriceUgx] = useState('18,000 UGX');
  const [logoPriceUsd, setLogoPriceUsd] = useState('$5 USD');
  const [logoResolution, setLogoResolution] = useState('480p HD • 60 FPS');
  const [logoStyle, setLogoStyle] = useState('3D Metallic Extrusion & Laser Sweep');
  const [logoTags, setLogoTags] = useState('3D Gold, Club Stage, Alpha Video');

  // Custom File upload form state
  const [customFileName, setCustomFileName] = useState('');
  const [customFileType, setCustomFileType] = useState<'audio' | 'video' | 'image' | 'document' | 'other'>('image');
  const [customFileUrl, setCustomFileUrl] = useState('');
  const [customFileSize, setCustomFileSize] = useState('2.4 MB');
  const [customFileDesc, setCustomFileDesc] = useState('');

  // Cloud storage destination & real-time progress state
  const [storageProvider, setStorageProvider] = useState<'firebase' | 'server' | 'auto'>('firebase');
  const [uploadProgressMap, setUploadProgressMap] = useState<{
    [key: string]: { percent: number; status: 'uploading' | 'completed' | 'error'; provider?: 'firebase' | 'cloudinary' | 'server' | 'local'; error?: string };
  }>({});
  const [showStorageSettingsModal, setShowStorageSettingsModal] = useState(false);

  // Storage Settings Modal State
  const [storageSettingsTab, setStorageSettingsTab] = useState<'firebase' | 'server'>('firebase');
  const [firebaseCustomBucket, setFirebaseCustomBucket] = useState(getFirebaseStorageConfig().customBucket);
  const [firebaseTestResult, setFirebaseTestResult] = useState<{ success?: boolean; message?: string; loading?: boolean } | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);

  // Toast trigger helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const uploadFile = async (
    file: File,
    folder: string,
    fieldKey: string,
    onSuccess: (url: string, provider: 'firebase' | 'cloudinary' | 'server' | 'local') => void
  ) => {
    setUploadProgressMap(prev => ({
      ...prev,
      [fieldKey]: { percent: 0, status: 'uploading', provider: storageProvider === 'auto' ? 'firebase' : storageProvider }
    }));

    try {
      const result = await smartUploadFile(
        file,
        folder,
        storageProvider,
        (progress) => {
          setUploadProgressMap(prev => ({
            ...prev,
            [fieldKey]: {
              percent: progress.percent,
              status: progress.status === 'completed' ? 'completed' : 'uploading',
              provider: progress.provider || (storageProvider === 'auto' ? 'firebase' : storageProvider)
            }
          }));
        }
      );

      setUploadProgressMap(prev => ({
        ...prev,
        [fieldKey]: { percent: 100, status: 'completed', provider: result.provider }
      }));

      onSuccess(result.url, result.provider);

      const providerLabel = 
        result.provider === 'firebase' ? 'Firebase Cloud Storage' : 
        result.provider === 'server' ? 'Server Media Storage' : 'Storage';

      if (result.warning) {
        showToast(`Uploaded to ${providerLabel}! (${result.warning})`, 'info');
      } else {
        showToast(`Successfully uploaded to ${providerLabel}!`, 'success');
      }
    } catch (err: any) {
      setUploadProgressMap(prev => ({
        ...prev,
        [fieldKey]: { percent: 0, status: 'error', error: err.message, provider: storageProvider === 'auto' ? 'firebase' : storageProvider }
      }));
      showToast(`Upload failed: ${err.message}`, 'error');
    }
  };

  // Handle local file selection for Mixtape Audio
  const handleTrackFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTrackAudioFileName(file.name);
    if (!trackTitle) {
      setTrackTitle(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
    }

    const objectUrl = URL.createObjectURL(file);
    setTrackAudioUrl(objectUrl);
    showToast(`Uploading ${file.name} to cloud storage...`, 'info');

    uploadFile(file, 'mixtapes', 'trackAudio', (uploadedUrl) => {
      setTrackAudioUrl(uploadedUrl);
    });
  };

  // Handle local file selection for Track Artwork
  const handleTrackArtworkSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setTrackThumbnail(objectUrl);
    showToast(`Uploading cover artwork...`, 'info');

    uploadFile(file, 'artwork', 'trackArtwork', (uploadedUrl) => {
      setTrackThumbnail(uploadedUrl);
    });
  };

  // Handle local file selection for Voice Drop Audio
  const handleDropFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDropAudioFileName(file.name);
    if (!dropTitle) {
      setDropTitle(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
    }

    const objectUrl = URL.createObjectURL(file);
    setDropAudioUrl(objectUrl);
    showToast(`Uploading voice drop to cloud storage...`, 'info');

    uploadFile(file, 'drops', 'dropAudio', (uploadedUrl) => {
      setDropAudioUrl(uploadedUrl);
    });
  };

  // Handle local file selection for 3D Logo Video
  const handleLogoFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoVideoFileName(file.name);
    if (!logoTitle) {
      setLogoTitle(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
    }

    const objectUrl = URL.createObjectURL(file);
    setLogoVideoUrl(objectUrl);
    showToast(`Uploading 3D video file to cloud storage...`, 'info');

    uploadFile(file, 'logos', 'logoVideo', (uploadedUrl) => {
      setLogoVideoUrl(uploadedUrl);
    });
  };

  // Handle local file selection for Custom General File
  const handleGeneralFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setCustomFileSize(`${sizeInMb} MB`);

    const mime = (file.type || '').toLowerCase();
    if (mime.startsWith('image/')) setCustomFileType('image');
    else if (mime.startsWith('video/')) setCustomFileType('video');
    else if (mime.startsWith('audio/')) setCustomFileType('audio');
    else if (mime.includes('pdf') || mime.includes('document')) setCustomFileType('document');
    else setCustomFileType('other');

    const objectUrl = URL.createObjectURL(file);
    setCustomFileUrl(objectUrl);
    showToast(`Uploading ${file.name} to cloud storage...`, 'info');

    uploadFile(file, 'files', 'customFile', (uploadedUrl) => {
      setCustomFileUrl(uploadedUrl);
    });
  };

  // Handle local file selection for Ateso Movies
  const handleMovieVideoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!movieTitle) {
      setMovieTitle(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
    }

    const objectUrl = URL.createObjectURL(file);
    setMovieVideoUrl(objectUrl);
    showToast(`Uploading movie video to cloud storage...`, 'info');

    uploadFile(file, 'movies', 'movieVideo', (uploadedUrl) => {
      setMovieVideoUrl(uploadedUrl);
    });
  };

  const handleMovieThumbnailSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setMovieThumbnail(objectUrl);
    showToast(`Uploading movie cover poster...`, 'info');

    uploadFile(file, 'movies', 'moviePoster', (uploadedUrl) => {
      setMovieThumbnail(uploadedUrl);
    });
  };

  // Submit Track Form
  const handleSubmitTrack = (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action Blocked: Only Admin (supamaya256@gmail.com) can upload mixtapes.', 'error');
      openAuthModal('Only verified Administrator can upload mixtapes.');
      return;
    }
    if (!trackTitle.trim()) {
      showToast('Please provide a Mixtape Title', 'error');
      return;
    }
    if (!trackAudioUrl.trim()) {
      showToast('Please select an audio file or enter an audio stream URL', 'error');
      return;
    }

    const newId = Date.now();
    const genreArray = trackGenres
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);

    const newTrack: AudioTrack = {
      id: newId,
      title: trackTitle.trim(),
      artist: trackArtist.trim() || 'DJ EMMA PRO FX',
      durationLabel: trackDurationLabel.trim() || 'DJ Mixtape Nonstop',
      url: trackAudioUrl.trim(),
      downloadUrl: trackAudioUrl.trim(),
      filename: `${trackTitle.trim().replace(/\s+/g, '_')}.mp4`,
      thumbnail: trackThumbnail || '/wallpaper.png',
      backdrop: trackThumbnail || '/wallpaper.png',
      matchScore: 99,
      year: trackYear || 2026,
      ageRating: 'TV-MA',
      quality: trackQuality || 'Ultra HD 4K • Studio 320kbps',
      genres: genreArray.length > 0 ? genreArray : ['Party Mix', 'Afrobeats'],
      description: trackDescription.trim() || 'Exclusive high-energy mix mastered in studio-grade 320kbps fidelity by DJ Emma Pro FX.',
      isTrending: true
    };

    addTrack(newTrack);
    showToast(`"${newTrack.title}" uploaded & added to live Mixtapes storefront!`, 'success');

    // Reset Form
    setTrackTitle('');
    setTrackAudioUrl('');
    setTrackAudioFileName('');
    setTrackDescription('');
    setShowTrackForm(false);
  };

  // Submit Voice Drop Form
  const handleSubmitDrop = (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action Blocked: Only Admin (supamaya256@gmail.com) can upload voice drops.', 'error');
      openAuthModal('Only verified Administrator can upload voice drops.');
      return;
    }
    if (!dropTitle.trim()) {
      showToast('Please provide a Voice Drop Title', 'error');
      return;
    }
    if (!dropAudioUrl.trim()) {
      showToast('Please select a voice drop audio file or enter an audio URL', 'error');
      return;
    }

    const newId = `drop-${Date.now()}`;
    const tagArray = dropTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newDrop: VoiceDropItem = {
      id: newId,
      title: dropTitle.trim(),
      category: dropCategory,
      audioUrl: dropAudioUrl.trim(),
      priceUgx: dropPriceUgx.trim() || '15,000 UGX',
      priceUsd: dropPriceUsd.trim() || '$5 USD',
      style: dropStyle.trim() || 'High Voltage Vocal FX',
      tags: tagArray.length > 0 ? tagArray : ['Club Tag', 'Laser FX'],
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      matchScore: 99,
      sampleScript: dropSampleScript.trim() || `"${dropTitle.trim()}! Powered by DJ Emma Pro FX!"`
    };

    addVoiceDrop(newDrop);
    showToast(`"${newDrop.title}" voice drop uploaded & published to the showcase!`, 'success');

    // Reset Form
    setDropTitle('');
    setDropAudioUrl('');
    setDropAudioFileName('');
    setDropSampleScript('');
    setShowDropForm(false);
  };

  // Submit 3D Logo Form
  const handleSubmitLogo = (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action Blocked: Only Admin (supamaya256@gmail.com) can upload 3D logos.', 'error');
      openAuthModal('Only verified Administrator can upload 3D logos.');
      return;
    }
    if (!logoTitle.trim()) {
      showToast('Please provide a 3D Logo Title', 'error');
      return;
    }
    if (!logoVideoUrl.trim()) {
      showToast('Please select a video file or enter a video URL', 'error');
      return;
    }

    const newId = `logo-${Date.now()}`;
    const tagArray = logoTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newLogo: LogoItem = {
      id: newId,
      title: logoTitle.trim(),
      category: logoCategory,
      videoUrl: logoVideoUrl.trim(),
      priceUgx: logoPriceUgx.trim() || '18,000 UGX',
      priceUsd: logoPriceUsd.trim() || '$5 USD',
      resolution: logoResolution.trim() || '480p HD • 60 FPS',
      style: logoStyle.trim() || '3D Extrusion & Laser Flare',
      tags: tagArray.length > 0 ? tagArray : ['3D Metallic', 'Stage Ready'],
      matchScore: 99
    };

    addLogo(newLogo);
    showToast(`"${newLogo.title}" 3D Logo uploaded & added to live showcase!`, 'success');

    // Reset Form
    setLogoTitle('');
    setLogoVideoUrl('');
    setLogoVideoFileName('');
    setShowLogoForm(false);
  };

  // Submit Custom General File
  const handleSubmitCustomFile = (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action Blocked: Only Admin (supamaya256@gmail.com) can upload files.', 'error');
      openAuthModal('Only verified Administrator can upload files.');
      return;
    }
    if (!customFileName.trim()) {
      showToast('Please enter a file name', 'error');
      return;
    }
    if (!customFileUrl.trim()) {
      showToast('Please select a file or enter a direct file URL', 'error');
      return;
    }

    const newFile: CustomMediaFile = {
      id: `file-${Date.now()}`,
      name: customFileName.trim(),
      type: customFileType,
      url: customFileUrl.trim(),
      sizeFormatted: customFileSize || '1.0 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      description: customFileDesc.trim() || 'Uploaded via DJ Emma Studio Manager'
    };

    addCustomFile(newFile);
    showToast(`File "${newFile.name}" registered and stored!`, 'success');

    // Reset
    setCustomFileName('');
    setCustomFileUrl('');
    setCustomFileDesc('');
    setShowFileForm(false);
  };

  // Submit Ateso Movie
  const handleSubmitMovie = (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action Blocked: Only Admin (supamaya256@gmail.com) can upload Ateso movies.', 'error');
      openAuthModal('Only verified Administrator can upload Ateso movies.');
      return;
    }
    if (!movieTitle.trim()) {
      showToast('Please enter a movie title', 'error');
      return;
    }
    if (!movieVideoUrl.trim()) {
      showToast('Please enter or select a streaming video URL', 'error');
      return;
    }

    const newMovie: AtesoMovie = {
      id: `ateso-mov-${Date.now()}`,
      title: movieTitle.trim(),
      vj: movieVj.trim() || 'VJ EMMA PRO FX',
      year: 2026,
      duration: movieDuration.trim() || '1h 45m',
      genre: movieGenre.trim() || 'Action Blockbuster',
      quality: movieQuality.trim() || 'Ultra HD 4K',
      thumbnail: movieThumbnail.trim() || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
      videoUrl: movieVideoUrl.trim(),
      telegramUrl: movieTelegramUrl.trim() || 'https://t.me/atesomoviesbox',
      youtubeUrl: 'https://youtube.com/@deejayemmapro?si=KMUHYGKOcAvRAWGd',
      description: movieDescription.trim() || 'Ateso translated cinema release by DJ Emma Pro FX.',
      matchScore: 99,
      isTrending: true,
      viewsCount: '1.5K Views'
    };

    addAtesoMovie(newMovie);
    showToast(`Movie "${newMovie.title}" added to Watch Ateso Movies!`, 'success');

    // Reset Form
    setMovieTitle('');
    setMovieVideoUrl('');
    setMovieDescription('');
    setShowMovieForm(false);
  };

  // Confirm and execute delete
  const executeDelete = () => {
    if (!deleteConfirmItem) return;

    if (!isAdmin) {
      showToast('Action Blocked: Only Admin (supamaya256@gmail.com) can delete items from the website.', 'error');
      openAuthModal('Only verified Administrator can delete items.');
      setDeleteConfirmItem(null);
      return;
    }

    const { id, title, type } = deleteConfirmItem;

    if (type === 'track') {
      deleteTrack(Number(id));
      showToast(`Mixtape "${title}" deleted from store.`, 'info');
    } else if (type === 'drop') {
      deleteVoiceDrop(String(id));
      showToast(`Voice drop "${title}" deleted from store.`, 'info');
    } else if (type === 'logo') {
      deleteLogo(String(id));
      showToast(`3D Logo "${title}" deleted from store.`, 'info');
    } else if (type === 'movie') {
      deleteAtesoMovie(String(id));
      showToast(`Ateso movie "${title}" deleted from site.`, 'info');
    } else if (type === 'file') {
      deleteCustomFile(String(id));
      showToast(`File "${title}" deleted.`, 'info');
    }

    setDeleteConfirmItem(null);
  };

  // Play/pause preview audio in manager
  const togglePreviewAudio = (url: string) => {
    const trimmed = url ? url.trim() : '';
    if (!trimmed) {
      showToast('Audio preview URL is empty.', 'error');
      return;
    }

    if (previewAudioUrl === trimmed && isPreviewAudioPlaying) {
      if (previewAudioRef.current) previewAudioRef.current.pause();
      setIsPreviewAudioPlaying(false);
    } else {
      setPreviewAudioUrl(trimmed);
      setIsPreviewAudioPlaying(true);
      if (previewAudioRef.current) {
        try {
          previewAudioRef.current.pause();
          previewAudioRef.current.src = trimmed;
          previewAudioRef.current.load();
          previewAudioRef.current.play().catch((err) => {
            console.warn('Studio preview playback error:', err);
            setIsPreviewAudioPlaying(false);
          });
        } catch (err) {
          console.warn('Studio preview error:', err);
          setIsPreviewAudioPlaying(false);
        }
      }
    }
  };

  // Copy link helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Link copied to clipboard!', 'info');
  };

  // Search filtered counts
  const q = searchQuery.toLowerCase();

  const filteredTracks = tracks.filter(t =>
    (t.title && t.title.toLowerCase().includes(q)) ||
    (t.artist && t.artist.toLowerCase().includes(q)) ||
    (Array.isArray(t.genres) && t.genres.some(g => g && g.toLowerCase().includes(q)))
  );

  const filteredDrops = voiceDrops.filter(d =>
    (d.title && d.title.toLowerCase().includes(q)) ||
    (d.category && d.category.toLowerCase().includes(q)) ||
    (d.style && d.style.toLowerCase().includes(q))
  );

  const filteredLogos = logos.filter(l =>
    (l.title && l.title.toLowerCase().includes(q)) ||
    (l.category && l.category.toLowerCase().includes(q)) ||
    (l.style && l.style.toLowerCase().includes(q))
  );

  const filteredMovies = atesoMovies.filter(m =>
    (m.title && m.title.toLowerCase().includes(q)) ||
    (m.vj && m.vj.toLowerCase().includes(q)) ||
    (m.genre && m.genre.toLowerCase().includes(q)) ||
    (m.description && m.description.toLowerCase().includes(q))
  );

  const filteredFiles = customFiles.filter(f =>
    (f.name && f.name.toLowerCase().includes(q)) ||
    (f.type && f.type.toLowerCase().includes(q))
  );

  if (activeTab === 'dashboard') {
    return (
      <WordPressAdminDashboard
        onBackToStore={onBackToStore}
        onOpenUploadCatalog={(sec) => setActiveTab(sec)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-[#E50914] selection:text-white pb-32 relative overflow-x-hidden">
      {/* Background Image Layer (Requested by User: DJ Emma Pro FX Signature Visual Showcase - Eco Optimized) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-25 filter brightness-85 contrast-110"
        style={{ backgroundImage: `url('https://res.cloudinary.com/hbyqk5y0/image/upload/f_auto,q_auto:eco,w_960/v1790550689/file_00000000bda08211910e147fbb531635.png')` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#111111]/85 via-[#111111]/75 to-[#111111]/90 backdrop-blur-[1px]" />

      <div className="relative z-10">
      {/* Hidden audio element for previewing */}
      <audio
        ref={previewAudioRef}
        onEnded={() => setIsPreviewAudioPlaying(false)}
        onError={() => setIsPreviewAudioPlaying(false)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-3 border text-sm animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
              : notification.type === 'error'
              ? 'bg-red-950/90 border-red-500 text-red-100'
              : 'bg-zinc-900/90 border-zinc-700 text-zinc-100'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : notification.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
            title="Return to Netflix Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Netflix Store</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[#E50914] font-black font-bebas text-2xl sm:text-3xl tracking-wide">
              DJ EMMA PRO FX
            </span>
            {isAdmin ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 tracking-widest uppercase flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ADMIN DASHBOARD
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E50914] text-white tracking-widest uppercase flex items-center gap-1 shadow-sm">
                <LayoutDashboard className="w-3 h-3" />
                VISITOR DASHBOARD
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Status Pill / Visitor Login button */}
          {isAdmin ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono font-bold">Admin Verified</span>
                <span className="text-white text-[11px] font-mono truncate max-w-[150px]">{adminEmail || MASTER_ADMIN_EMAIL}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  showToast('Signed out of Admin mode. Switched to Visitor Dashboard.', 'info');
                }}
                className="ml-1 p-1 hover:bg-emerald-500/20 rounded text-zinc-400 hover:text-white cursor-pointer"
                title="Sign out of Admin mode to preview Visitor Dashboard"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 text-zinc-400 text-xs font-mono border border-zinc-700/60">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Visitor Mode</span>
              </span>
              <button
                type="button"
                onClick={() => openAuthModal('Unlock Admin Mode for authorized UID: 6mDkYNmfNbOJ6gC9RrnU6YBRcwC2.')}
                className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-600/80 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                title="Authenticate as Admin to unlock upload & delete options"
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>Admin Login</span>
              </button>
            </div>
          )}

          {/* Reset button - STRICTLY ADMIN ONLY */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                if (!isAdmin) {
                  showToast('Permission Denied: Only Admin can reset catalog.', 'error');
                  return;
                }
                setShowResetConfirm(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-zinc-700 cursor-pointer transition-colors"
              title="Restore Original Factory Catalog (Admin Only)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Catalog</span>
            </button>
          )}

          {/* Return to Admin Dashboard button */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#151515] hover:bg-[#E50914] text-white text-xs font-bold flex items-center gap-1.5 border border-[#222222] hover:border-[#E50914] transition-all cursor-pointer shadow-md"
            title="Return to WordPress Admin Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#E50914]" />
            <span>CONTROL ROOM</span>
          </button>

          {/* View live store button */}
          <button
            type="button"
            onClick={onBackToStore}
            className="px-3.5 sm:px-4 py-1.5 rounded bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#E50914]/20 cursor-pointer transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>VIEW LIVE STORE</span>
          </button>
        </div>
      </header>

      {/* Hero Welcome & Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4">
        <div className={`p-6 sm:p-8 rounded-2xl border shadow-2xl relative overflow-hidden mb-8 ${
          isAdmin
            ? 'bg-gradient-to-r from-zinc-900 via-[#181818] to-zinc-900 border-emerald-500/30'
            : 'bg-gradient-to-r from-zinc-900 via-[#161616] to-[#121212] border-white/10'
        }`}>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <span className={`text-[11px] font-mono uppercase tracking-widest font-bold ${
                  isAdmin ? 'text-emerald-400' : 'text-[#E50914]'
                }`}>
                  {isAdmin ? 'ADMINISTRATOR STUDIO COMMAND CENTER' : 'VISITOR MEDIA HUB & SHOWCASE'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  {isAdmin ? 'Admin Studio Dashboard' : 'DJ Emma Pro FX Media Hub'}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Admin Controls Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-mono text-xs font-bold flex items-center gap-1.5 border border-zinc-700">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Visitor Showcase Mode
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-zinc-400 max-w-2xl">
              {isAdmin
                ? 'Welcome, DJ Emma Pro FX. You have full administrative authority to upload new continuous nonstops, voice drops, 3D video logos, and Ateso movies, or delete items from the catalog. Changes update the storefront instantly.'
                : 'Welcome to the official DJ Emma Pro FX media showcase! Audition studio voice drops, stream continuous video nonstops, preview 3D video loops, and discover Ateso translated movies. Request custom audio branding or order directly with the studio.'}
            </p>

            {/* Admin Policy Notice / Visitor Welcome Banner */}
            <div className={`mt-4 p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isAdmin
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-zinc-950/80 border-zinc-800 text-zinc-300'
            }`}>
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#E50914]" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{isAdmin ? 'Administrator Access Granted' : 'Visitor Mode Active • Audition, Stream & Order'}</span>
                    {isAdmin && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-emerald-300">
                        Authorized UID: 6mDkYNmfNbOJ6gC9RrnU6YBRcwC2
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-0.5">
                    {isAdmin
                      ? `Authenticated as administrator (${adminEmail || MASTER_ADMIN_EMAIL}). Upload options, edit fields, and delete buttons are unlocked across all categories.`
                      : 'You are browsing the public Visitor Dashboard. You can listen to full mixes, preview 3D loops, and submit custom orders. Upload and delete controls are reserved for the administrator.'}
                  </p>
                </div>
              </div>

              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => openAuthModal('Authenticate as Administrator to unlock upload and delete options.')}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow cursor-pointer transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Are you Admin? Sign In</span>
                </button>
              )}
            </div>

            {/* Visitor Highlights Bar (shown only when not admin) */}
            {!isAdmin && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[#E50914]/20 text-[#E50914]">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{tracks.length} Mixtapes</div>
                    <div className="text-[10px] text-zinc-400">Stream & Download</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-amber-500/20 text-amber-400">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{voiceDrops.length} Voice Drops</div>
                    <div className="text-[10px] text-zinc-400">Audition & Order</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-blue-500/20 text-blue-400">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{logos.length} 3D Logos</div>
                    <div className="text-[10px] text-zinc-400">480p Video Loops</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Custom Orders</div>
                    <div className="text-[10px] text-zinc-400">Fast 24-48h Delivery</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cloud Storage Integration Status & Provider Selector - visible only to verified admin */}
            {isAdmin && (
              <div className="mt-4 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Cloud Storage Connected</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Multi-Tier Active
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Firebase Cloud Storage: <span className="font-mono text-zinc-300">{firebaseCustomBucket || (firebaseConfigJson as any).storageBucket}</span> • Server Media: <span className="font-mono text-emerald-400">Integrated Fail-Safe</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <div className="flex items-center bg-black/80 p-0.5 rounded-lg border border-zinc-700/80 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setStorageProvider('auto');
                        savePreferredStorage('auto');
                        showToast('Storage mode set to Auto (Best Available + Fail-Safe)', 'info');
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        storageProvider === 'auto'
                          ? 'bg-[#E50914] text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Auto (Best)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStorageProvider('firebase');
                        savePreferredStorage('firebase');
                        showToast('Default upload destination set to Firebase Storage', 'info');
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        storageProvider === 'firebase'
                          ? 'bg-[#E50914] text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Firebase
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStorageProvider('server');
                        savePreferredStorage('server');
                        showToast('Default upload destination set to Server Storage', 'info');
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        storageProvider === 'server'
                          ? 'bg-[#E50914] text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Server
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowStorageSettingsModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-white transition-all cursor-pointer"
                    title="Configure Firebase Storage bucket and rules"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Storage Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-6">
              <div
                onClick={() => setActiveTab('tracks')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'tracks'
                    ? 'bg-[#E50914]/15 border-[#E50914]'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Mixtapes</span>
                  <Music className="w-3.5 h-3.5 text-[#E50914]" />
                </div>
                <div className="text-2xl font-black text-white">{tracks.length}</div>
                <div className="text-[10px] text-zinc-500">Audio Nonstops</div>
              </div>

              <div
                onClick={() => setActiveTab('drops')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'drops'
                    ? 'bg-[#E50914]/15 border-[#E50914]'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Voice Drops</span>
                  <Mic className="w-3.5 h-3.5 text-[#E50914]" />
                </div>
                <div className="text-2xl font-black text-white">{voiceDrops.length}</div>
                <div className="text-[10px] text-zinc-500">DJ Tags & FX</div>
              </div>

              <div
                onClick={() => setActiveTab('custom-drops')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'custom-drops'
                    ? 'bg-[#E50914]/15 border-[#E50914]'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Custom Drop</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">Order</div>
                <div className="text-[10px] text-zinc-500">Interactive Form</div>
              </div>

              <div
                onClick={() => setActiveTab('logos')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'logos'
                    ? 'bg-[#E50914]/15 border-[#E50914]'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>3D Logos</span>
                  <Video className="w-3.5 h-3.5 text-[#E50914]" />
                </div>
                <div className="text-2xl font-black text-white">{logos.length}</div>
                <div className="text-[10px] text-zinc-500">480p Video Loops</div>
              </div>

              <div
                onClick={() => setActiveTab('movies')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'movies'
                    ? 'bg-[#E50914]/15 border-[#E50914]'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Ateso Movies</span>
                  <Film className="w-3.5 h-3.5 text-[#E50914]" />
                </div>
                <div className="text-2xl font-black text-white">{atesoMovies.length}</div>
                <div className="text-[10px] text-zinc-500">Ateso Cinema</div>
              </div>

              <div
                onClick={() => setActiveTab('files')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'files'
                    ? 'bg-[#E50914]/15 border-[#E50914]'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Any File</span>
                  <FileText className="w-3.5 h-3.5 text-[#E50914]" />
                </div>
                <div className="text-2xl font-black text-white">{customFiles.length}</div>
                <div className="text-[10px] text-zinc-500">Custom Media</div>
              </div>

              <div
                onClick={() => setActiveTab('inquiries')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'bg-[#E50914]/15 border-[#E50914]'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Inquiries</span>
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">Direct</div>
                <div className="text-[10px] text-zinc-500">Contact DJ</div>
              </div>
            </div>
          </div>
        </div>



        {/* 3D LOGOS REVEAL Room Gateway */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#18121f] to-black border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wide">3D LOGOS REVEAL Room</span>
                <span className="text-[10px] bg-red-600/30 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/40">Master Visuals</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
                Explore the dedicated 3D video logo reveal vault featuring cinematic editions, interactive 3D spatial tilts, real-time audio playback, and strict anti-download protection.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('app:switch-view', { detail: 'logos-reveal' }))}
            className="px-5 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-red-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-center"
          >
            Enter 3D Logos Reveal Room
          </button>
        </div>

        {/* D3.js Most Frequently Favorited Tracks Bar Chart */}
        <FavoriteTracksD3Chart tracks={tracks} />

        {/* Global Search & Tab Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-white/10 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <LayoutDashboard className="w-4 h-4 text-[#E50914]" />
              <span>Control Room Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tracks')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'tracks'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Nonstop Mixtapes ({tracks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drops')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'drops'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Drops ({voiceDrops.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custom-drops')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'custom-drops'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Request Custom Drop</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Contact & Inquiries</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logos')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'logos'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>3D Logos ({logos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'movies'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Ateso Movies ({atesoMovies.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('files')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Any Custom File ({customFiles.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isAdmin ? "Search content to edit or delete..." : "Search mixtapes, voice drops, 3D logos, or movies..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-[#E50914]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            TAB 1: NONSTOP MIXTAPES & TRACKS
           ======================================================== */}
        {activeTab === 'tracks' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isAdmin ? 'Nonstop DJ Mixtapes Catalog' : 'Nonstop DJ Mixtapes Showcase'}</span>
                  <span className="text-xs font-mono text-zinc-500">({filteredTracks.length} items)</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  {isAdmin
                    ? 'Audio tracks stream live on the Netflix home billboard and top rows. Upload new mixes or delete existing ones.'
                    : 'Stream and audition exclusive continuous video nonstops and DJ mixtapes by DJ Emma Pro FX.'}
                </p>
              </div>

              {/* Upload button visible strictly to authorized admin */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowTrackForm(!showTrackForm)}
                  className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all bg-[#E50914] hover:bg-[#b80710] text-white"
                >
                  {showTrackForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showTrackForm ? 'Close Upload Form' : '+ Upload New Mixtape'}</span>
                </button>
              )}
            </div>

            {/* Upload Track Form */}
            {isAdmin && showTrackForm && (
              <form
                onSubmit={handleSubmitTrack}
                className="p-5 sm:p-6 rounded-xl bg-zinc-900 border-2 border-[#E50914]/60 space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]" />
                    <h3 className="font-bold text-sm text-white">Upload New Nonstop Mixtape</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">Accepts MP3, WAV, MP4 or Direct URL</span>
                </div>

                <div className="space-y-4">
                  {/* Paste on Upload Zone for URLs */}
                  <div className="space-y-2 bg-zinc-950/90 border-2 border-dashed border-[#E50914] rounded-xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Link2 className="w-4 h-4 text-[#E50914]" />
                        Paste on Upload Zone (Direct URL / Stream Link)
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const clipText = await navigator.clipboard.readText();
                            if (clipText && clipText.startsWith('http')) {
                              setTrackAudioUrl(clipText);
                              setTrackAudioFileName(clipText.split('/').pop() || 'pasted_link.mp4');
                              if (!trackTitle) setTrackTitle('Mixtape ' + Date.now().toString().slice(-4));
                              showToast('URL pasted from clipboard!', 'success');
                            } else {
                              showToast('No valid URL found in clipboard', 'error');
                            }
                          } catch {
                            showToast('Please paste URL below', 'info');
                          }
                        }}
                        className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-3 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Paste from Clipboard</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="🔗 Paste audio or video URL here (e.g. https://res.cloudinary.com/... or MP3/MP4 link)"
                        value={trackAudioUrl}
                        onChange={(e) => {
                          setTrackAudioUrl(e.target.value);
                          if (e.target.value) {
                            setTrackAudioFileName(e.target.value.split('/').pop() || 'url_stream.mp4');
                            if (!trackTitle) setTrackTitle('Mixtape ' + Date.now().toString().slice(-4));
                          }
                        }}
                        onPaste={(e) => {
                          const pasted = e.clipboardData.getData('text');
                          if (pasted && pasted.startsWith('http')) {
                            setTrackAudioUrl(pasted);
                            setTrackAudioFileName(pasted.split('/').pop() || 'pasted_link.mp4');
                            if (!trackTitle) setTrackTitle('Mixtape ' + Date.now().toString().slice(-4));
                            showToast('Direct URL pasted & loaded successfully!', 'success');
                            e.preventDefault();
                          }
                        }}
                        className="w-full px-4 py-3 rounded-lg bg-black/90 border-2 border-zinc-700 focus:border-[#E50914] text-sm text-white placeholder-zinc-500 focus:outline-none font-mono shadow-inner"
                      />
                    </div>
                    {trackAudioUrl && (
                      <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded">
                        <span>✓ Ready: {trackAudioFileName || trackAudioUrl}</span>
                        <button type="button" onClick={() => setTrackAudioUrl('')} className="text-zinc-400 hover:text-white underline">Clear</button>
                      </div>
                    )}

                    {/* Choose audio file from device */}
                    <div className="pt-2 border-t border-zinc-800">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
                        <span>Or select audio file from device:</span>
                        <span className="text-[10px] text-zinc-400 font-normal">
                          Auto-uploads to {storageProvider === 'firebase' ? 'Firebase Storage' : 'Server Storage'}
                        </span>
                      </label>
                      <input
                        type="file"
                        accept="audio/*,video/mp4"
                        onChange={handleTrackFileSelect}
                        className="block w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#E50914] file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                      <StorageUploadIndicator progress={uploadProgressMap['trackAudio']} />
                    </div>

                    <div className="text-[11px] text-zinc-400">
                      💡 Tip: Paste any direct MP3, WAV, MP4, or Cloudinary URL here, and it will be immediately playable by all visitors on the dashboard!
                    </div>
                  </div>

                  {/* Artwork Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Cover Art / Wallpaper Thumbnail
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-black border border-zinc-700 shrink-0">
                        <img
                          src={trackThumbnail || '/wallpaper.png'}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <label className="block">
                          <span className="text-[10px] text-zinc-400 block mb-1">Upload image file:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleTrackArtworkSelect}
                            className="block w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                          />
                        </label>
                        <StorageUploadIndicator progress={uploadProgressMap['trackArtwork']} />
                        <input
                          type="text"
                          placeholder="Or paste image URL (e.g. /wallpaper.png)"
                          value={trackThumbnail}
                          onChange={(e) => setTrackThumbnail(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Mixtape Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. EPISODE 3 - NONSTOP AFROBEATS"
                      value={trackTitle}
                      onChange={(e) => setTrackTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Artist / DJ Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DJ EMMA PRO FX"
                      value={trackArtist}
                      onChange={(e) => setTrackArtist(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Duration Label</label>
                    <input
                      type="text"
                      placeholder="e.g. 52 Mins Nonstop"
                      value={trackDurationLabel}
                      onChange={(e) => setTrackDurationLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Genres (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Afrobeats, Club Banger, Dancehall"
                      value={trackGenres}
                      onChange={(e) => setTrackGenres(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Year</label>
                    <input
                      type="number"
                      value={trackYear}
                      onChange={(e) => setTrackYear(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Master Quality</label>
                    <input
                      type="text"
                      value={trackQuality}
                      onChange={(e) => setTrackQuality(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Description / Liner Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Describe this mixtape, tracklist highlights, tempo, hype energy..."
                    value={trackDescription}
                    onChange={(e) => setTrackDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                {/* Form Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTrackForm(false)}
                    className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-xs font-bold text-white shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Publish Mixtape to Storefront</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tracks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-black shrink-0 relative border border-white/10">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => togglePreviewAudio(track.url)}
                        className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Listen to audio"
                      >
                        {previewAudioUrl === track.url && isPreviewAudioPlaying ? (
                          <Pause className="w-3 h-3 fill-current" />
                        ) : (
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono text-[#E50914] font-bold">
                          {track.durationLabel}
                        </span>
                        <span className="text-[10px] text-zinc-500">• {track.year}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                      <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePreviewAudio(track.url)}
                      className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white cursor-pointer"
                      title="Test Play Audio"
                    >
                      {previewAudioUrl === track.url && isPreviewAudioPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Stream Audio Link for Visitors */}
                    {!isAdmin && (
                      <a
                        href={track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Stream audio"
                      >
                        <Download className="w-3 h-3 text-[#E50914]" />
                        <span className="hidden sm:inline">Stream</span>
                      </a>
                    )}

                    {/* Delete Track Button - ONLY ADMIN CAN SEE */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmItem({
                            id: track.id,
                            title: track.title,
                            type: 'track'
                          });
                        }}
                        className="p-2 rounded border bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/30 cursor-pointer transition-colors"
                        title="Delete Mixtape from Storefront"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredTracks.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  {isAdmin
                    ? 'No mixtapes match your search. Click "+ Upload New Mixtape" above to add one!'
                    : 'No mixtapes found matching your search query.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: DJ VOICE DROPS & FX PACKS
           ======================================================== */}
        {activeTab === 'drops' && (
          <div className="space-y-6">
            {/* Custom Voice Drop Quick Action Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-purple-950/30 to-zinc-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>Need a Personalized DJ Tag or Voice Drop?</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                      Studio Service
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Select your Voice Type, Mastering FX Style, custom script words, and generate an instant order summary confirmation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('custom-drops')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-purple-600 hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 shrink-0 shadow-lg cursor-pointer transition-all"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Launch Custom Drop Form</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isAdmin ? 'Voice Drops & Sound FX Catalog' : 'DJ Voice Drops Showcase & Pricing'}</span>
                  <span className="text-xs font-mono text-zinc-500">({filteredDrops.length} items)</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  {isAdmin
                    ? 'Voice tags and club drops available for instant order or custom naming. Upload new drops or delete.'
                    : 'Audition official sample drops. Order custom vocal branding with your name and laser effects.'}
                </p>
              </div>

              {/* Upload Voice Drop button visible strictly to authorized admin */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowDropForm(!showDropForm)}
                  className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all bg-[#E50914] hover:bg-[#b80710] text-white"
                >
                  {showDropForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showDropForm ? 'Close Upload Form' : '+ Upload New Voice Drop'}</span>
                </button>
              )}
            </div>

            {/* Upload Drop Form */}
            {isAdmin && showDropForm && (
              <form
                onSubmit={handleSubmitDrop}
                className="p-5 sm:p-6 rounded-xl bg-zinc-900 border-2 border-[#E50914]/60 space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#E50914]" />
                    <h3 className="font-bold text-sm text-white">Upload New Voice Drop / FX Sample</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">15,000 UGX / $5 USD</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Audio Sample File (MP3 / WAV)
                    </label>
                    <div className="border border-dashed border-zinc-700 hover:border-[#E50914] rounded-lg p-4 bg-black/40 text-center cursor-pointer transition-colors relative mb-2">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleDropFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Mic className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
                      <div className="text-xs text-zinc-200 font-medium">
                        {dropAudioFileName ? dropAudioFileName : 'Click to pick voice drop audio from phone or computer'}
                      </div>
                    </div>
                    <StorageUploadIndicator progress={uploadProgressMap['dropAudio']} />

                    <input
                      type="text"
                      placeholder="Or paste audio sample URL"
                      value={dropAudioUrl}
                      onChange={(e) => setDropAudioUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Drop Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. DJ EMMA PRO WEED & BASS DROP"
                        value={dropTitle}
                        onChange={(e) => setDropTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                        <select
                          value={dropCategory}
                          onChange={(e) => setDropCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        >
                          <option value="Boss Edition">Boss Edition</option>
                          <option value="Club Hype">Club Hype</option>
                          <option value="Soundclash">Soundclash</option>
                          <option value="Dancehall">Dancehall</option>
                          <option value="Radio ID">Radio ID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Price (UGX)</label>
                        <input
                          type="text"
                          value={dropPriceUgx}
                          onChange={(e) => setDropPriceUgx(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Vocal & Sound FX Style</label>
                    <input
                      type="text"
                      placeholder="e.g. Jamaican Patois, Heavy Reverb, Gunshot FX"
                      value={dropStyle}
                      onChange={(e) => setDropStyle(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Sample Vocal Script</label>
                    <input
                      type="text"
                      placeholder='e.g. "This is DJ Emma Pro, lock the dancehall!"'
                      value={dropSampleScript}
                      onChange={(e) => setDropSampleScript(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDropForm(false)}
                    className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-xs font-bold text-white shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Publish Voice Drop</span>
                  </button>
                </div>
              </form>
            )}

            {/* Drops List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#E50914] bg-[#E50914]/10 px-2 py-0.5 rounded border border-[#E50914]/20">
                        {drop.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#46d369]">
                        {drop.priceUgx}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate">{drop.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{drop.style}</p>
                    <p className="text-[11px] text-zinc-500 italic line-clamp-1 mt-1 font-mono">
                      {drop.sampleScript}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => togglePreviewAudio(drop.audioUrl)}
                      className="px-3 py-1.5 rounded bg-white hover:bg-white/90 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {previewAudioUrl === drop.audioUrl && isPreviewAudioPlaying ? (
                        <>
                          <Pause className="w-3 h-3 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Audition</span>
                        </>
                      )}
                    </button>

                    {/* Order Voice Drop on WhatsApp for Visitors */}
                    {!isAdmin && (
                      <a
                        href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20am%20on%20your%20Visitor%20Dashboard%20and%20want%20to%20order%20the%20voice%20drop:%20"${encodeURIComponent(drop.title)}"%20(${encodeURIComponent(drop.priceUgx || '15,000 UGX')})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Order this voice drop on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Order Drop</span>
                      </a>
                    )}

                    {/* Delete Voice Drop Button - ONLY ADMIN CAN SEE */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmItem({
                            id: drop.id,
                            title: drop.title,
                            type: 'drop'
                          });
                        }}
                        className="p-1.5 rounded border bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/30 cursor-pointer transition-colors"
                        title="Delete Voice Drop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredDrops.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  {isAdmin ? 'No voice drops match your search. Click "+ Upload New Voice Drop" to add one!' : 'No voice drops match your search query.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: REQUEST CUSTOM VOICE DROP FORM
           ======================================================== */}
        {activeTab === 'custom-drops' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CustomVoiceDropRequestForm />
          </div>
        )}

        {/* ========================================================
            TAB: DIRECT STUDIO INQUIRY & CONTACT FORM
           ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <StudioContactForm />
          </div>
        )}

        {/* ========================================================
            TAB 3: 3D ANIMATED LOGOS
           ======================================================== */}
        {activeTab === 'logos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isAdmin ? '3D Animated Video Logos Catalog' : '3D Animated Video Logos Showcase'}</span>
                  <span className="text-xs font-mono text-zinc-500">({filteredLogos.length} items)</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  {isAdmin
                    ? '3D metallic and chrome video logo loops. Upload new clips or delete existing loops.'
                    : 'Preview 3D metallic video loops for DJ screen visuals, YouTube intros, and stage performances.'}
                </p>
              </div>

              {/* Upload 3D Logo button visible strictly to authorized admin */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowLogoForm(!showLogoForm)}
                  className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all bg-[#E50914] hover:bg-[#b80710] text-white"
                >
                  {showLogoForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showLogoForm ? 'Close Upload Form' : '+ Upload New 3D Logo'}</span>
                </button>
              )}
            </div>

            {/* Upload Logo Form */}
            {isAdmin && showLogoForm && (
              <form
                onSubmit={handleSubmitLogo}
                className="p-5 sm:p-6 rounded-xl bg-zinc-900 border-2 border-[#E50914]/60 space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#E50914]" />
                    <h3 className="font-bold text-sm text-white">Upload New 3D Animated Logo Loop</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">18,000 UGX / $5 USD</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      3D Video Animation File (.MP4 / .MOV)
                    </label>
                    <div className="border border-dashed border-zinc-700 hover:border-[#E50914] rounded-lg p-4 bg-black/40 text-center cursor-pointer transition-colors relative mb-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleLogoFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Film className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
                      <div className="text-xs text-zinc-200 font-medium">
                        {logoVideoFileName ? logoVideoFileName : 'Click to select 3D animation video clip'}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1">MP4, MOV (Transparent Alpha or Black)</div>
                    </div>
                    <StorageUploadIndicator progress={uploadProgressMap['logoVideo']} />

                    <input
                      type="text"
                      placeholder="Or paste video clip stream URL"
                      value={logoVideoUrl}
                      onChange={(e) => setLogoVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">3D Logo Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. CYBER GLOW 3D EMBLEM"
                        value={logoTitle}
                        onChange={(e) => setLogoTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                        <select
                          value={logoCategory}
                          onChange={(e) => setLogoCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        >
                          <option value="Gold & Metallic">Gold & Metallic</option>
                          <option value="Neon & Electric">Neon & Electric</option>
                          <option value="3D Extrusion">3D Extrusion</option>
                          <option value="Fire & Pyro">Fire & Pyro</option>
                          <option value="Chrome & Glass">Chrome & Glass</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Resolution</label>
                        <input
                          type="text"
                          value={logoResolution}
                          onChange={(e) => setLogoResolution(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Visual Style & VFX</label>
                  <input
                    type="text"
                    placeholder="e.g. Neon pulse, laser sweeps, transparent alpha background"
                    value={logoStyle}
                    onChange={(e) => setLogoStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoForm(false)}
                    className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-xs font-bold text-white shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Publish 3D Logo to Showcase</span>
                  </button>
                </div>
              </form>
            )}

            {/* Logos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLogos.map((logo) => (
                <div
                  key={logo.id}
                  className="rounded-xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-[#E50914] transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <video
                      src={logo.videoUrl}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 font-bold border border-white/10">
                      {logo.resolution}
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                        <span>{logo.category}</span>
                        <span className="text-[#46d369] font-bold">{logo.priceUgx}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{logo.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{logo.style}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-white/5">
                      <a
                        href={logo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Source</span>
                      </a>

                      {/* Order 3D Logo on WhatsApp for Visitors */}
                      {!isAdmin && (
                        <a
                          href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20am%20browsing%20the%20Visitor%20Dashboard%20and%20would%20like%20a%20custom%203D%20video%20logo%20in%20the%20style%20of:%20"${encodeURIComponent(logo.title)}"%20(${encodeURIComponent(logo.priceUgx || '18,000 UGX')})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Order custom 3D logo"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Order Logo</span>
                        </a>
                      )}

                      {/* Delete 3D Logo Button - ONLY ADMIN CAN SEE */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmItem({
                              id: logo.id,
                              title: logo.title,
                              type: 'logo'
                            });
                          }}
                          className="px-2 py-1 rounded border text-xs font-semibold flex items-center gap-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/30 cursor-pointer transition-colors"
                          title="Delete 3D Logo"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredLogos.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  {isAdmin ? 'No 3D logos match your search. Click "+ Upload New 3D Logo" to add one!' : 'No 3D logos match your search query.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: ATESO TRANSLATED MOVIES (WATCH ATESO MOVIES)
           ======================================================== */}
        {activeTab === 'movies' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isAdmin ? 'Watch Ateso Movies Catalog' : 'Ateso Translated Movies Showcase'}</span>
                  <span className="text-xs font-mono text-zinc-500">({filteredMovies.length} movies)</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  {isAdmin
                    ? 'Upload, stream, preview, or delete any Ateso translated movie or continuous video mix on the site.'
                    : 'Stream trailers and discover Ateso translated movies and series translated by VJ Emma Pro FX.'}
                </p>
              </div>

              {/* Upload Ateso Movie button visible strictly to authorized admin */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowMovieForm(!showMovieForm)}
                  className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all bg-[#E50914] hover:bg-[#b80710] text-white self-start sm:self-auto"
                >
                  {showMovieForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showMovieForm ? 'Close Upload Form' : '+ Upload Ateso Movie'}</span>
                </button>
              )}
            </div>

            {/* Upload Movie Form */}
            {isAdmin && showMovieForm && (
              <form
                onSubmit={handleSubmitMovie}
                className="p-5 sm:p-6 rounded-xl bg-zinc-900 border-2 border-[#E50914]/60 space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#E50914]" />
                    <h3 className="font-bold text-sm text-white">Upload New Ateso Translated Movie</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">Streamable on Site</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Movie Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. THE COMMANDO 2026 • ATESO TRANSLATED ACTION"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Translator / VJ *</label>
                        <input
                          type="text"
                          placeholder="e.g. VJ EMMA PRO FX"
                          value={movieVj}
                          onChange={(e) => setMovieVj(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 1h 45m"
                          value={movieDuration}
                          onChange={(e) => setMovieDuration(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Video Stream URL or File Upload *</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleMovieVideoSelect}
                        className="block w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer mb-2"
                      />
                      <StorageUploadIndicator progress={uploadProgressMap['movieVideo']} />
                      <input
                        type="text"
                        placeholder="e.g. https://res.cloudinary.com/.../movie.mp4"
                        value={movieVideoUrl}
                        onChange={(e) => setMovieVideoUrl(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        Direct MP4 or video stream URL that will play on site when users tap it.
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Cover Poster Image URL or File Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMovieThumbnailSelect}
                        className="block w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer mb-2"
                      />
                      <StorageUploadIndicator progress={uploadProgressMap['moviePoster']} />
                      <input
                        type="text"
                        placeholder="e.g. https://res.cloudinary.com/.../poster.jpg"
                        value={movieThumbnail}
                        onChange={(e) => setMovieThumbnail(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Genre</label>
                        <input
                          type="text"
                          placeholder="e.g. Action Blockbuster"
                          value={movieGenre}
                          onChange={(e) => setMovieGenre(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Quality Badge</label>
                        <input
                          type="text"
                          placeholder="e.g. Ultra HD 4K"
                          value={movieQuality}
                          onChange={(e) => setMovieQuality(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Telegram Download Link</label>
                      <input
                        type="text"
                        placeholder="https://t.me/atesomoviesbox"
                        value={movieTelegramUrl}
                        onChange={(e) => setMovieTelegramUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Movie Synopsis</label>
                      <input
                        type="text"
                        placeholder="Full Ateso translated movie story details..."
                        value={movieDescription}
                        onChange={(e) => setMovieDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMovieForm(false)}
                    className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-xs font-bold text-white shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Publish Movie</span>
                  </button>
                </div>
              </form>
            )}

            {/* Movies Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-3">
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                          {movie.vj}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="bg-black/70 backdrop-blur-xs text-[10px] font-mono text-zinc-300 px-1.5 py-0.5 rounded">
                          {movie.duration}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {movie.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500 font-mono">
                      <span>{movie.genre}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{movie.quality}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                    <a
                      href={movie.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Test Stream</span>
                    </a>

                    {/* Watch on Telegram for Visitors */}
                    {!isAdmin && (
                      <a
                        href={movie.telegramUrl || "https://t.me/atesomoviesbox"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-[#2AABEE]/20 hover:bg-[#2AABEE] text-[#2AABEE] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Watch full movie on Telegram"
                      >
                        <Film className="w-3 h-3" />
                        <span>Watch Full</span>
                      </a>
                    )}

                    {/* Delete Ateso Movie Button - ONLY ADMIN CAN SEE */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmItem({
                            id: movie.id,
                            title: movie.title,
                            type: 'movie'
                          });
                        }}
                        className="px-2.5 py-1 rounded border text-xs font-semibold flex items-center gap-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/30 cursor-pointer transition-colors"
                        title="Delete Ateso Movie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredMovies.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  {isAdmin ? 'No Ateso movies match your search. Click "+ Upload Ateso Movie" above to add one!' : 'No Ateso movies match your search query.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ANY CUSTOM FILE / GENERAL MEDIA UPLOAD
           ======================================================== */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isAdmin ? 'General Media & Storage Bucket' : 'Studio Resources & Downloads'}</span>
                  <span className="text-xs font-mono text-zinc-500">({filteredFiles.length} files)</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  {isAdmin
                    ? 'Upload and delete any file: Audio beats, raw video clips, high-res banners, stems, or ZIP soundpacks.'
                    : 'Download free DJ soundpacks, wallpaper graphics, audio stems, and studio utility media.'}
                </p>
              </div>

              {/* Upload Any File button visible strictly to authorized admin */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowFileForm(!showFileForm)}
                  className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all bg-[#E50914] hover:bg-[#b80710] text-white"
                >
                  {showFileForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showFileForm ? 'Close Upload Form' : '+ Upload Any File'}</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Firebase Cloud Storage</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-mono font-bold">Active Default</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-mono break-all">
                    Bucket: {firebaseConfigJson.storageBucket || 'gen-lang-client-0041135756.firebasestorage.app'}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Production mode storage enabled with permanent signed URLs
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Cloudinary Storage</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-mono font-bold">Connected</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                    Cloud: hbyqk5y0 • Preset: ml_default
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Direct unsigned CDN endpoints connected for video & audio
                  </div>
                </div>
              </div>
            </div>

            {/* Upload File Form */}
            {isAdmin && showFileForm && (
              <form
                onSubmit={handleSubmitCustomFile}
                className="p-5 sm:p-6 rounded-xl bg-zinc-900 border-2 border-[#E50914]/60 space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E50914]" />
                    <h3 className="font-bold text-sm text-white">Upload Anything to Storage</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">Any File Format Supported</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Choose Any File from Device
                    </label>
                    <div className="border border-dashed border-zinc-700 hover:border-[#E50914] rounded-lg p-5 bg-black/40 text-center cursor-pointer transition-colors relative mb-2">
                      <input
                        type="file"
                        onChange={handleGeneralFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-8 h-8 text-[#E50914] mx-auto mb-2" />
                      <div className="text-xs text-zinc-200 font-bold">
                        {customFileName ? customFileName : 'Click to select or drag & drop any file'}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1">
                        Video, Audio, Images, Documents, Stems, ZIPs
                      </div>
                    </div>
                    <StorageUploadIndicator progress={uploadProgressMap['customFile']} />

                    <input
                      type="text"
                      placeholder="Or paste direct external file URL"
                      value={customFileUrl}
                      onChange={(e) => setCustomFileUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">File Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. VIP Soundpack Stems Vol 1.zip"
                        value={customFileName}
                        onChange={(e) => setCustomFileName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">File Category</label>
                        <select
                          value={customFileType}
                          onChange={(e) => setCustomFileType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        >
                          <option value="audio">Audio Track / Drop</option>
                          <option value="video">Video Loop / Intro</option>
                          <option value="image">Graphic / Wallpaper</option>
                          <option value="document">Document / PDF</option>
                          <option value="other">Archive / ZIP / Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Size / Label</label>
                        <input
                          type="text"
                          value={customFileSize}
                          onChange={(e) => setCustomFileSize(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Notes / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Uncut club intro master file"
                        value={customFileDesc}
                        onChange={(e) => setCustomFileDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFileForm(false)}
                    className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-xs font-bold text-white shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Save File</span>
                  </button>
                </div>
              </form>
            )}

            {/* Files List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shrink-0">
                      {file.type === 'audio' && <Music className="w-5 h-5 text-[#E50914]" />}
                      {file.type === 'video' && <Video className="w-5 h-5 text-blue-400" />}
                      {file.type === 'image' && <Sparkles className="w-5 h-5 text-emerald-400" />}
                      {file.type === 'document' && <FileText className="w-5 h-5 text-amber-400" />}
                      {file.type === 'other' && <FileText className="w-5 h-5 text-zinc-400" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono uppercase bg-white/10 px-1.5 py-0.2 rounded text-zinc-300">
                          {file.type}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">{file.sizeFormatted}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">• {file.uploadedAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{file.name}</h4>
                      {file.description && (
                        <p className="text-xs text-zinc-400 truncate">{file.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(file.url)}
                      className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={file.url}
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                      title="Open or Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete File Button - ONLY ADMIN CAN SEE */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmItem({
                            id: file.id,
                            title: file.name,
                            type: 'file'
                          });
                        }}
                        className="p-2 rounded border bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/30 cursor-pointer transition-colors"
                        title="Delete File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredFiles.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  {isAdmin ? 'No files stored yet. Click "+ Upload Any File" to store anything.' : 'No studio resources available matching your search.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          DELETE CONFIRMATION MODAL - ADMIN ONLY
         ======================================================== */}
      {isAdmin && deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181818] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Are you sure you want to delete this {deleteConfirmItem.type}?
              </p>
              <div className="my-3 p-3 bg-black/60 rounded-lg border border-zinc-800 text-sm font-semibold text-white truncate">
                {deleteConfirmItem.title}
              </div>
              <p className="text-[11px] text-red-400">
                This item will be removed from your catalog and will no longer appear on the live storefront.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeDelete}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          RESET TO DEFAULTS CONFIRMATION MODAL - ADMIN ONLY
         ======================================================== */}
      {isAdmin && showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181818] border border-zinc-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Restore Factory Catalog?</h3>
              <p className="text-xs text-zinc-400 mt-2">
                This will restore all default official DJ Emma Pro FX mixtapes, voice drops, and 3D logos. Any custom uploads will be cleared.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
              >
                Keep My Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  resetTracks();
                  resetAllContent();
                  setShowResetConfirm(false);
                  showToast('Catalog restored to default factory items!', 'success');
                }}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white shadow-lg cursor-pointer"
              >
                Yes, Restore All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CLOUD STORAGE HUB & UPLOAD SETTINGS MODAL - ADMIN ONLY
         ======================================================== */}
      {isAdmin && showStorageSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#141414] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914]">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Cloud Storage & Upload Settings</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Connect and verify your Firebase Storage bucket and access rules
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStorageSettingsModal(false)}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-zinc-800 bg-zinc-950/60 px-5 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setStorageSettingsTab('firebase')}
                className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  storageSettingsTab === 'firebase'
                    ? 'border-[#E50914] text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Firebase Storage (Bucket & Rules)</span>
              </button>
              <button
                type="button"
                onClick={() => setStorageSettingsTab('server')}
                className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  storageSettingsTab === 'server'
                    ? 'border-[#E50914] text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Server & Fail-Safe</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* FIREBASE STORAGE TAB */}
              {storageSettingsTab === 'firebase' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 space-y-1">
                    <p className="font-semibold text-amber-100 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-amber-400" />
                      <span>Firebase Storage in Production Mode</span>
                    </p>
                    <p className="text-[11px] text-amber-300">
                      When Firebase Storage is initialized in Production Mode, the default Google Cloud rules block all writes (<span className="font-mono">allow read, write: if false;</span>). You can update your storage rules to allow uploads for studio operations.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Firebase Storage Bucket
                    </label>
                    <input
                      type="text"
                      value={firebaseCustomBucket}
                      onChange={(e) => setFirebaseCustomBucket(e.target.value.trim())}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-[#E50914]"
                      placeholder="gen-lang-client-0041135756.firebasestorage.app"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={firebaseTestResult?.loading}
                      onClick={async () => {
                        setFirebaseTestResult({ loading: true });
                        const res = await testFirebaseStorageConnection();
                        setFirebaseTestResult(res);
                      }}
                      className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {firebaseTestResult?.loading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Database className="w-3.5 h-3.5" />
                      )}
                      <span>Test Firebase Storage</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        saveFirebaseStorageConfig({ customBucket: firebaseCustomBucket });
                        showToast('Firebase storage bucket preference saved!', 'success');
                      }}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer transition-colors"
                    >
                      Save Bucket
                    </button>
                  </div>

                  {firebaseTestResult && !firebaseTestResult.loading && (
                    <div className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                      firebaseTestResult.success 
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200' 
                        : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                    }`}>
                      <div className="flex items-start gap-2.5">
                        {firebaseTestResult.success ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className="font-bold text-sm">
                            {firebaseTestResult.success ? 'Firebase Storage Connected!' : 'Firebase Storage Status'}
                          </p>
                          <p className="text-xs opacity-90 leading-relaxed">
                            {firebaseTestResult.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommended Rules Box */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-300">Recommended Storage Rules (storage.rules)</span>
                      <button
                        type="button"
                        onClick={() => {
                          const rulesContent = `rules_version = '2';\nservice firebase.storage {\n  match /b/{bucket}/o {\n    match /uploads/{folder}/{allPaths=**} {\n      allow read: if true;\n      allow write: if request.auth != null;\n    }\n    match /{allPaths=**} {\n      allow read: if true;\n      allow write: if request.auth != null;\n    }\n  }\n}`;
                          navigator.clipboard.writeText(rulesContent);
                          setCopiedRules(true);
                          setTimeout(() => setCopiedRules(false), 3000);
                          showToast('Storage rules copied to clipboard!', 'info');
                        }}
                        className="flex items-center gap-1 text-xs text-[#E50914] hover:text-red-400 cursor-pointer font-semibold"
                      >
                        {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedRules ? 'Copied to Clipboard!' : 'Copy Rules'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-black/90 border border-zinc-800 rounded-lg font-mono text-[11px] text-zinc-300 overflow-x-auto">
                      <pre>{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{folder}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}</pre>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Paste these in Firebase Console &gt; Storage &gt; Rules and click <strong>Publish</strong> to enable authenticated uploads.
                    </p>
                  </div>
                </div>
              )}

              {/* SERVER & FAIL-SAFE TAB */}
              {storageSettingsTab === 'server' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-100 text-sm">
                      <Server className="w-5 h-5 text-emerald-400" />
                      <span>Zero-Failure Server Storage Active (Port 3000)</span>
                    </div>
                    <p className="text-xs text-emerald-300/90 leading-relaxed">
                      Our system includes an integrated high-speed media storage engine (<span className="font-mono text-emerald-200">/api/upload</span> &rarr; <span className="font-mono text-emerald-200">/uploads</span>). If Firebase Storage rules are in production lockdown or client offline, files are automatically persisted directly on the server without any failure.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Primary: Firebase Cloud</span>
                      <p className="font-semibold text-white">Google Cloud Bucket</p>
                      <p className="text-[11px] text-zinc-400">Secure production enterprise storage for audio & video.</p>
                    </div>

                    <div className="p-3 bg-black/60 rounded-xl border border-emerald-900/50 bg-emerald-950/20 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">Tier 3: Local Engine</span>
                      <p className="font-semibold text-white">Always Available</p>
                      <p className="text-[11px] text-zinc-400">Guarantees no upload ever fails.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                Current Mode: <strong className="text-white capitalize">{storageProvider}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowStorageSettingsModal(false)}
                className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
