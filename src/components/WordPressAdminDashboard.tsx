import React, { useState, useMemo } from 'react';
import {
  Crown,
  Home,
  Mic,
  Box,
  Film,
  ShoppingCart,
  Users,
  CreditCard,
  MessageSquare,
  BarChart3,
  Folder,
  Settings,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Play,
  Image as ImageIcon,
  Calendar,
  Zap,
  PlusCircle,
  Bell,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Eye,
  X,
  FileText,
  DollarSign,
  Radio,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Wrench,
  Palette,
  Puzzle,
  ShieldCheck,
  RefreshCw,
  Check,
  ArrowRight,
  Send,
  Download,
  Flame,
  Music,
  Maximize2
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useContent } from '../context/ContentContext';
import GoogleSearchVisibilityModal from './GoogleSearchVisibilityModal';

export interface WordPressAdminDashboardProps {
  onBackToStore: () => void;
  onOpenUploadCatalog?: (section: 'tracks' | 'drops' | 'logos' | 'movies' | 'files' | 'inquiries') => void;
}

export interface AdminOrder {
  id: string;
  customer: string;
  service: string;
  serviceType: 'DJ Drop' | '3D Logo' | 'Movie' | 'Other';
  date: string;
  payment: 'Paid' | 'Payment Pending' | 'Unpaid';
  status: 'Processing' | 'Completed' | 'Quality Check' | 'Pending Payment' | 'Cancelled';
  amount: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: '#1024',
    customer: 'John (Wakanda Fan)',
    service: 'DJ Drop (Custom Hype Vocals)',
    serviceType: 'DJ Drop',
    date: '28 Sep, 2025',
    payment: 'Paid',
    status: 'Processing',
    amount: 'UGX 50,000'
  },
  {
    id: '#1023',
    customer: 'Brian Beats UG',
    service: '3D Logo (Metallic Gold Chrome)',
    serviceType: '3D Logo',
    date: '28 Sep, 2025',
    payment: 'Paid',
    status: 'Completed',
    amount: 'UGX 150,000'
  },
  {
    id: '#1022',
    customer: 'Sarah Ateso VJ',
    service: 'DJ Drop (Club Intro Package)',
    serviceType: 'DJ Drop',
    date: '27 Sep, 2025',
    payment: 'Paid',
    status: 'Quality Check',
    amount: 'UGX 75,000'
  },
  {
    id: '#1021',
    customer: 'Michael Divine',
    service: '3D Logo (Fire Flames Animation)',
    serviceType: '3D Logo',
    date: '27 Sep, 2025',
    payment: 'Payment Pending',
    status: 'Pending Payment',
    amount: 'UGX 200,000'
  },
  {
    id: '#1020',
    customer: 'Alice Teso Media',
    service: 'Movie (Ateso Translation Series)',
    serviceType: 'Movie',
    date: '26 Sep, 2025',
    payment: 'Paid',
    status: 'Completed',
    amount: 'UGX 30,000'
  },
  {
    id: '#1019',
    customer: 'David Kampala DJ',
    service: 'DJ Drop (Standard Vocal Tag)',
    serviceType: 'DJ Drop',
    date: '26 Sep, 2025',
    payment: 'Unpaid',
    status: 'Cancelled',
    amount: 'UGX 45,000'
  }
];

interface RecentMediaItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  views: string;
  thumbnail: string;
}

const RECENT_VIDEOS: RecentMediaItem[] = [
  {
    id: 'vid-0',
    title: 'STREET ANTHEM 90 • DJ EMMA PRO & WAKANDA DJs',
    date: 'Today',
    duration: '58:40',
    views: '128.5K',
    thumbnail: 'https://res.cloudinary.com/foscgxvd/image/upload/v1790956113/file_00000000956c82439256c2a0ce77b093.png'
  },
  {
    id: 'vid-1',
    title: '2024 ATESO VIDEO MIX VOL 1 VS AFROBEATS',
    date: '28 Sep, 2025',
    duration: '50:15',
    views: '42.5K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png'
  },
  {
    id: 'vid-2',
    title: '3D Logo Master Metal Reveal',
    date: '27 Sep, 2025',
    duration: '00:45',
    views: '28.2K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png'
  },
  {
    id: 'vid-3',
    title: 'Ateso Movies • Crazy Safari VJ Sultan',
    date: '26 Sep, 2025',
    duration: '1h 36m',
    views: '48.2K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg'
  },
  {
    id: 'vid-4',
    title: 'BEST OF VYROOTA NONSTOP 2026',
    date: '24 Sep, 2025',
    duration: '52:18',
    views: '96.4K',
    thumbnail: 'https://i.ytimg.com/vi/17uskDXOuvY/hqdefault.jpg'
  }
];

const RECENT_PHOTOS: RecentMediaItem[] = [
  {
    id: 'pho-0',
    title: 'Street Anthem 90 Master Cover Art',
    date: 'Today',
    duration: '4K HD',
    views: '34.8K',
    thumbnail: 'https://res.cloudinary.com/foscgxvd/image/upload/v1790956113/file_00000000956c82439256c2a0ce77b093.png'
  },
  {
    id: 'pho-1',
    title: 'DJ Emma Pro Live Turntables',
    date: '28 Sep, 2025',
    duration: 'HD',
    views: '14.8K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg'
  },
  {
    id: 'pho-2',
    title: 'Studio Control Room Portrait',
    date: '27 Sep, 2025',
    duration: '4K',
    views: '19.3K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png'
  },
  {
    id: 'pho-3',
    title: 'Master Artwork Press Kit',
    date: '26 Sep, 2025',
    duration: 'RAW',
    views: '12.1K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png'
  },
  {
    id: 'pho-4',
    title: 'Wakanda DJs Soundstage Setup',
    date: '25 Sep, 2025',
    duration: 'HD',
    views: '16.5K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png'
  }
];

export default function WordPressAdminDashboard({
  onBackToStore,
  onOpenUploadCatalog
}: WordPressAdminDashboardProps) {
  const { voiceDrops, logos, atesoMovies } = useContent();
  const { tracks } = useAudio();

  // WordPress UI states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [showScreenOptions, setShowScreenOptions] = useState<boolean>(false);
  const [showHelpDrawer, setShowHelpDrawer] = useState<boolean>(false);
  const [showWelcomePanel, setShowWelcomePanel] = useState<boolean>(true);

  // Widget visibility toggles (classic WP Screen Options)
  const [visibleWidgets, setVisibleWidgets] = useState({
    welcome: true,
    atAGlance: true,
    quickDraft: true,
    activity: true,
    wooStatus: true,
    recentMedia: true,
    ordersTable: true
  });

  // Collapsible submenus
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    dashboard: true,
    mixes: true,
    drops: false,
    logos: false,
    movies: false,
    woocommerce: true
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter tabs
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);

  // Media tab
  const [mediaTab, setMediaTab] = useState<'Videos' | 'Photos'>('Videos');
  const [previewMedia, setPreviewMedia] = useState<RecentMediaItem | null>(null);

  // Quick Draft State
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftsList, setDraftsList] = useState<{ id: string; title: string; date: string; content: string }[]>([
    {
      id: 'd1',
      title: 'Upcoming Wakanda Street Anthem 91 Concept',
      date: 'Oct 02, 2026',
      content: 'Mix together new Ateso drill rhythm with Ugandan afro-dancehall drops.'
    },
    {
      id: 'd2',
      title: 'Voice Drop Promo Script for Kampala Clubs',
      date: 'Sep 29, 2026',
      content: 'You are now live with DJ Emma Pro, the King of Scratch Wakanda DJs!'
    }
  ]);
  const [draftSavedToast, setDraftSavedToast] = useState<string | null>(null);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;
    const newDraft = {
      id: Date.now().toString(),
      title: draftTitle.trim(),
      date: 'Just now',
      content: draftContent.trim()
    };
    setDraftsList([newDraft, ...draftsList]);
    setDraftTitle('');
    setDraftContent('');
    setDraftSavedToast('Draft saved successfully to WordPress database!');
    setTimeout(() => setDraftSavedToast(null), 3000);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return INITIAL_ORDERS.filter((o) => {
      if (orderFilter === 'DJ Drops' && o.serviceType !== 'DJ Drop') return false;
      if (orderFilter === '3D Logos' && o.serviceType !== '3D Logo') return false;
      if (orderFilter === 'Movies' && o.serviceType !== 'Movie') return false;
      if (orderFilter === 'Pending' && o.status !== 'Pending Payment') return false;
      if (orderFilter === 'Processing' && o.status !== 'Processing') return false;
      if (orderFilter === 'Completed' && o.status !== 'Completed') return false;
      if (orderFilter === 'Paid' && o.payment !== 'Paid') return false;
      if (orderFilter === 'Unpaid' && o.payment !== 'Unpaid') return false;

      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        if (
          !o.id.toLowerCase().includes(q) &&
          !o.customer.toLowerCase().includes(q) &&
          !o.service.toLowerCase().includes(q) &&
          !o.amount.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [orderFilter, orderSearch]);

  return (
    <div className="min-h-screen bg-[#101517] text-[#f0f0f1] font-sans selection:bg-[#2271b1] selection:text-white flex flex-col antialiased relative">
      
      {/* ========================================================
          1. OFFICIAL WORDPRESS ADMIN BAR (TOP BAR - 32px height)
         ======================================================== */}
      <header className="sticky top-0 z-50 h-8 bg-[#1d2327] border-b border-[#2c3338] px-3 flex items-center justify-between text-xs text-[#c3c4c7] select-none shadow-sm">
        {/* Left: Classic WordPress Admin Bar Links */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* WordPress W Logo */}
          <div 
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-[#2271b1] hover:text-white text-white rounded transition-colors cursor-pointer group"
            title="About WordPress 6.7.1"
          >
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#1d2327] font-serif font-black text-[10px]">
              W
            </div>
          </div>

          {/* Site Title with Home Icon */}
          <div 
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#2271b1] hover:text-white rounded transition-colors cursor-pointer text-white font-bold"
            title="Visit Site"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DJ EMMA PRO</span>
          </div>

          {/* Updates Counter */}
          <div 
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 hover:bg-[#2271b1] hover:text-white rounded transition-colors cursor-pointer"
            title="2 Plugin and Core Updates Available"
          >
            <RefreshCw className="w-3 h-3 text-[#72aee6]" />
            <span className="text-[10px] bg-[#d63638] text-white px-1.5 py-0.2 rounded-full font-bold">2</span>
          </div>

          {/* Comments Bubble */}
          <div 
            onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('inquiries')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-[#2271b1] hover:text-white rounded transition-colors cursor-pointer"
            title="14 Pending Client Inquiries / Comments"
          >
            <MessageSquare className="w-3 h-3" />
            <span className="text-[10px] bg-[#d63638] text-white px-1.5 py-0.2 rounded-full font-bold">14</span>
          </div>

          {/* + New Menu */}
          <div className="relative group">
            <button 
              type="button"
              className="flex items-center gap-1 px-2 py-0.5 hover:bg-[#2271b1] hover:text-white rounded transition-colors cursor-pointer text-white"
            >
              <PlusCircle className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline font-medium">New</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-[#2c3338] border border-[#3c434a] shadow-xl py-1 z-50 text-[11px] rounded-b">
              <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('tracks')} className="px-3 py-1.5 hover:bg-[#2271b1] hover:text-white cursor-pointer flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-yellow-400" />
                <span>Nonstop Mix</span>
              </div>
              <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('drops')} className="px-3 py-1.5 hover:bg-[#2271b1] hover:text-white cursor-pointer flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-red-400" />
                <span>DJ Voice Drop</span>
              </div>
              <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('logos')} className="px-3 py-1.5 hover:bg-[#2271b1] hover:text-white cursor-pointer flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-emerald-400" />
                <span>3D Logo Order</span>
              </div>
              <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')} className="px-3 py-1.5 hover:bg-[#2271b1] hover:text-white cursor-pointer flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-blue-400" />
                <span>Ateso Movie</span>
              </div>
              <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('files')} className="px-3 py-1.5 hover:bg-[#2271b1] hover:text-white cursor-pointer flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-purple-400" />
                <span>Media File</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: User Profile & View Website */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Search & SEO Visibility Inspector */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#2271b1] hover:text-white rounded text-[11px] transition-colors cursor-pointer"
            title="Inspect Google Search Results & SEO Indexing"
          >
            <span className="font-bold text-[#4285F4]">G</span>
            <span className="hidden sm:inline">Google SEO</span>
          </button>

          {/* Howdy, DJ Emma Pro */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#2271b1] hover:text-white rounded transition-colors cursor-pointer text-white">
            <span className="hidden sm:inline text-[#c3c4c7]">Howdy,</span>
            <span className="font-bold">DJ Emma Pro</span>
            <img
              src="https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png"
              alt="DJ Emma Pro"
              className="w-4 h-4 rounded-full border border-amber-500/60 object-cover ml-1"
            />
          </div>

          {/* Visit Website Button */}
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-1 px-2.5 py-0.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold text-[11px] transition-all cursor-pointer shadow-sm active:scale-95"
            title="View Live Website Store & Streaming Player"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* ========================================================
          2. MAIN BODY: WORDPRESS SIDEBAR + WORKSPACE
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* --------------------------------------------------------
            OFFICIAL WORDPRESS ADMIN SIDEBAR (160px - 200px width)
           -------------------------------------------------------- */}
        <aside 
          className={`shrink-0 bg-[#1d2327] border-r border-[#2c3338] flex flex-col justify-between overflow-y-auto select-none transition-all duration-200 z-20 ${
            isSidebarCollapsed ? 'w-12' : 'w-52 sm:w-56'
          }`}
        >
          <nav className="text-[13px] text-[#c3c4c7] font-normal py-1">
            
            {/* 1. Dashboard (Active WordPress Blue / Red) */}
            <div className="relative">
              <div 
                className="flex items-center gap-2.5 px-3 py-2 bg-[#2271b1] text-white font-semibold cursor-pointer border-l-4 border-white"
                title="Dashboard"
              >
                <Home className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </div>
              {!isSidebarCollapsed && (
                <div className="bg-[#101517] py-1 text-xs pl-9 pr-2 space-y-1">
                  <div className="text-white font-medium hover:text-[#72aee6] cursor-pointer py-0.5">Home</div>
                  <div className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5 flex items-center justify-between">
                    <span>Updates</span>
                    <span className="text-[10px] bg-[#d63638] text-white px-1.5 py-0.2 rounded-full font-bold">2</span>
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="my-1 border-t border-[#2c3338]/60" />

            {/* 2. Nonstop Mixes / Posts */}
            <div>
              <div 
                onClick={() => toggleSubmenu('mixes')}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
                title="Nonstop Mixes"
              >
                <div className="flex items-center gap-2.5">
                  <Music className="w-4 h-4 text-[#E50914] shrink-0" />
                  {!isSidebarCollapsed && <span className="font-medium">Nonstop Mixes</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] bg-[#2c3338] border border-[#3c434a] text-white px-1.5 py-0.2 rounded-full font-bold">
                    {tracks.length || 25}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && openSubmenus.mixes && (
                <div className="bg-[#101517] py-1 text-xs pl-9 pr-2 space-y-1">
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('tracks')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">All 25 Nonstops</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('tracks')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Add New Nonstop</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('tracks')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Categories & Genres</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('tracks')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">MP3 Audio Master 320k</div>
                </div>
              )}
            </div>

            {/* 3. Media Library */}
            <div 
              onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('files')}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Media Library"
            >
              <Folder className="w-4 h-4 text-[#f0b849] shrink-0" />
              {!isSidebarCollapsed && <span>Media Library</span>}
            </div>

            {/* 4. DJ Voice Drops */}
            <div>
              <div 
                onClick={() => toggleSubmenu('drops')}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
                title="DJ Drops"
              >
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  {!isSidebarCollapsed && <span className="font-medium">DJ Voice Drops</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] bg-[#d63638] text-white px-1.5 py-0.2 rounded-full font-bold">12</span>
                )}
              </div>
              {!isSidebarCollapsed && openSubmenus.drops && (
                <div className="bg-[#101517] py-1 text-xs pl-9 pr-2 space-y-1">
                  <div onClick={() => setOrderFilter('DJ Drops')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">All Orders (12)</div>
                  <div onClick={() => setOrderFilter('Pending')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">New Requests (5)</div>
                  <div onClick={() => setOrderFilter('Processing')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">In Production (3)</div>
                  <div onClick={() => setOrderFilter('Completed')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Completed (8)</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('drops')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Voice Packages</div>
                </div>
              )}
            </div>

            {/* 5. 3D Logos */}
            <div>
              <div 
                onClick={() => toggleSubmenu('logos')}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
                title="3D Logos"
              >
                <div className="flex items-center gap-2.5">
                  <Box className="w-4 h-4 text-[#4ab866] shrink-0" />
                  {!isSidebarCollapsed && <span className="font-medium">3D Logos</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] bg-[#2c3338] border border-[#3c434a] text-white px-1.5 py-0.2 rounded-full font-bold">6</span>
                )}
              </div>
              {!isSidebarCollapsed && openSubmenus.logos && (
                <div className="bg-[#101517] py-1 text-xs pl-9 pr-2 space-y-1">
                  <div onClick={() => setOrderFilter('3D Logos')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Logo Orders (6)</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('logos')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Logo Catalog ({logos.length || 16})</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('logos')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Add New Logo</div>
                </div>
              )}
            </div>

            {/* 6. Ateso Movies */}
            <div>
              <div 
                onClick={() => toggleSubmenu('movies')}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
                title="Ateso Movies"
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-[#f0b849] shrink-0" />
                  {!isSidebarCollapsed && <span className="font-medium">Ateso Movies</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] bg-[#2c3338] border border-[#3c434a] text-white px-1.5 py-0.2 rounded-full font-bold">
                    {atesoMovies.length || 18}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && openSubmenus.movies && (
                <div className="bg-[#101517] py-1 text-xs pl-9 pr-2 space-y-1">
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">All 18 Movies</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Add Ateso Movie</div>
                  <div onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">VJs: Sultan, Bashir, Junior</div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="my-1 border-t border-[#2c3338]/60" />

            {/* 7. WooCommerce Orders & Store */}
            <div>
              <div 
                onClick={() => toggleSubmenu('woocommerce')}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
                title="WooCommerce"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-[#7f54b3] shrink-0" />
                  {!isSidebarCollapsed && <span className="font-medium">WooCommerce</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] bg-[#7f54b3] text-white px-1.5 py-0.2 rounded-full font-bold">24</span>
                )}
              </div>
              {!isSidebarCollapsed && openSubmenus.woocommerce && (
                <div className="bg-[#101517] py-1 text-xs pl-9 pr-2 space-y-1">
                  <div onClick={() => setOrderFilter('All')} className="text-white font-medium hover:text-[#72aee6] cursor-pointer py-0.5 flex items-center justify-between">
                    <span>Orders</span>
                    <span className="text-[10px] bg-[#d63638] text-white px-1.5 py-0.2 rounded-full font-bold">24</span>
                  </div>
                  <div onClick={() => setOrderFilter('Pending')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Pending Payment (7)</div>
                  <div onClick={() => setOrderFilter('Completed')} className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Completed (14)</div>
                  <div className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Customers (1,284)</div>
                  <div className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Coupons & Discounts</div>
                  <div className="text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer py-0.5">Sales Reports</div>
                </div>
              )}
            </div>

            {/* 8. Products */}
            <div 
              onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('drops')}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Products"
            >
              <Box className="w-4 h-4 text-[#72aee6] shrink-0" />
              {!isSidebarCollapsed && <span>Products & Catalog</span>}
            </div>

            {/* 9. Analytics */}
            <div 
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Analytics"
            >
              <BarChart3 className="w-4 h-4 text-[#34D399] shrink-0" />
              {!isSidebarCollapsed && <span>Analytics</span>}
            </div>

            {/* 10. Appearance */}
            <div 
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Appearance"
            >
              <Palette className="w-4 h-4 text-[#f0b849] shrink-0" />
              {!isSidebarCollapsed && <span>Appearance (Theme)</span>}
            </div>

            {/* 11. Plugins */}
            <div 
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Plugins"
            >
              <Puzzle className="w-4 h-4 text-[#e056fd] shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>Plugins</span>
                  <span className="text-[10px] bg-[#2c3338] border border-[#3c434a] text-white px-1.5 py-0.2 rounded-full font-bold">7</span>
                </div>
              )}
            </div>

            {/* 12. Users */}
            <div 
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Users"
            >
              <Users className="w-4 h-4 text-[#c3c4c7] shrink-0" />
              {!isSidebarCollapsed && <span>Users (Admin)</span>}
            </div>

            {/* 13. Tools */}
            <div 
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Tools"
            >
              <Wrench className="w-4 h-4 text-[#c3c4c7] shrink-0" />
              {!isSidebarCollapsed && <span>Tools & Site Health</span>}
            </div>

            {/* 14. Settings */}
            <div 
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-[#c3c4c7] shrink-0" />
              {!isSidebarCollapsed && <span>Settings</span>}
            </div>
          </nav>

          {/* Classic WordPress Collapse Menu Button */}
          <div className="p-2 border-t border-[#2c3338]">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-2 text-xs text-[#c3c4c7] hover:text-white hover:bg-[#2c3338] rounded transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Collapse menu</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* --------------------------------------------------------
            WORDPRESS WORKSPACE / DASHBOARD VIEW
           -------------------------------------------------------- */}
        <main className="flex-1 bg-[#101517] overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Classic WordPress Screen Options & Help Pulldowns Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2c3338] pb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Dashboard</span>
                <span className="text-xs font-mono font-normal text-[#8c8f94] bg-[#1d2327] px-2 py-0.5 rounded border border-[#2c3338]">
                  WP 6.7.1 • Studio Pro Edition
                </span>
              </h1>
              <p className="text-xs text-[#8c8f94] mt-0.5">
                Official Studio Content & E-Commerce Management System
              </p>
            </div>

            {/* Screen Options & Help Buttons */}
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setShowScreenOptions(!showScreenOptions);
                  setShowHelpDrawer(false);
                }}
                className={`px-3 py-1 text-xs border rounded transition-colors flex items-center gap-1 cursor-pointer ${
                  showScreenOptions 
                    ? 'bg-[#2271b1] text-white border-[#2271b1]' 
                    : 'bg-[#1d2327] hover:bg-[#2c3338] text-[#c3c4c7] border-[#2c3338]'
                }`}
              >
                <span>Screen Options</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showScreenOptions ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowHelpDrawer(!showHelpDrawer);
                  setShowScreenOptions(false);
                }}
                className={`px-3 py-1 text-xs border rounded transition-colors flex items-center gap-1 cursor-pointer ${
                  showHelpDrawer 
                    ? 'bg-[#2271b1] text-white border-[#2271b1]' 
                    : 'bg-[#1d2327] hover:bg-[#2c3338] text-[#c3c4c7] border-[#2c3338]'
                }`}
              >
                <HelpCircle className="w-3 h-3 text-[#72aee6]" />
                <span>Help</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showHelpDrawer ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Screen Options Pulldown Panel (Authentic WP Feature!) */}
          {showScreenOptions && (
            <div className="bg-[#1d2327] border border-[#2c3338] p-4 rounded shadow-xl text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="font-bold text-white uppercase text-[11px] tracking-wide">
                Show on screen widgets:
              </p>
              <div className="flex flex-wrap gap-4 text-[#c3c4c7]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleWidgets.welcome}
                    onChange={(e) => setVisibleWidgets({ ...visibleWidgets, welcome: e.target.checked })}
                    className="accent-[#2271b1]"
                  />
                  <span>Welcome</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleWidgets.atAGlance}
                    onChange={(e) => setVisibleWidgets({ ...visibleWidgets, atAGlance: e.target.checked })}
                    className="accent-[#2271b1]"
                  />
                  <span>At a Glance</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleWidgets.wooStatus}
                    onChange={(e) => setVisibleWidgets({ ...visibleWidgets, wooStatus: e.target.checked })}
                    className="accent-[#2271b1]"
                  />
                  <span>WooCommerce Status</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleWidgets.quickDraft}
                    onChange={(e) => setVisibleWidgets({ ...visibleWidgets, quickDraft: e.target.checked })}
                    className="accent-[#2271b1]"
                  />
                  <span>Quick Draft</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleWidgets.activity}
                    onChange={(e) => setVisibleWidgets({ ...visibleWidgets, activity: e.target.checked })}
                    className="accent-[#2271b1]"
                  />
                  <span>Activity</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleWidgets.ordersTable}
                    onChange={(e) => setVisibleWidgets({ ...visibleWidgets, ordersTable: e.target.checked })}
                    className="accent-[#2271b1]"
                  />
                  <span>Orders Table</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleWidgets.recentMedia}
                    onChange={(e) => setVisibleWidgets({ ...visibleWidgets, recentMedia: e.target.checked })}
                    className="accent-[#2271b1]"
                  />
                  <span>Recent Media</span>
                </label>
              </div>
            </div>
          )}

          {/* Help Drawer Panel */}
          {showHelpDrawer && (
            <div className="bg-[#1d2327] border border-[#2c3338] p-4 rounded shadow-xl text-xs space-y-2 text-[#c3c4c7] animate-in fade-in slide-in-from-top-2 duration-150">
              <h4 className="font-bold text-white">Dashboard Overview Help</h4>
              <p>
                Welcome to your DJ Emma Pro Studio WordPress administration screen! You can arrange widgets, draft new mix announcements, inspect incoming voice drop requests, review WooCommerce orders, and preview uploaded media files.
              </p>
              <div className="pt-2 flex items-center gap-4 text-[#72aee6]">
                <a href="https://wa.me/256780527361" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  <span>WhatsApp Admin Support Hotline (+256 780 527361)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* ========================================================
              WORDPRESS WELCOME PANEL (DISMISSIBLE)
             ======================================================== */}
          {showWelcomePanel && visibleWidgets.welcome && (
            <div className="bg-[#1d2327] border border-[#2c3338] p-5 rounded-lg shadow relative">
              <button
                type="button"
                onClick={() => setShowWelcomePanel(false)}
                className="absolute top-3 right-3 text-[#8c8f94] hover:text-white p-1 cursor-pointer text-xs"
                title="Dismiss"
              >
                Dismiss
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Welcome to WordPress 6.7.1 • DJ Emma Pro Studio
                  </h2>
                  <p className="text-xs text-[#8c8f94]">
                    We’ve assembled some quick links to help you manage your entertainment catalog:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-[#2c3338] text-xs">
                {/* Column 1: Get Started */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#72aee6]">
                    Get Started
                  </h4>
                  <p className="text-[#8c8f94]">Upload or publish nonstops directly into the on-site player:</p>
                  <button
                    type="button"
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('tracks')}
                    className="px-3.5 py-1.5 rounded bg-[#2271b1] hover:bg-[#135e96] text-white font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add New Nonstop Mix</span>
                  </button>
                  <p className="text-[11px] text-[#8c8f94]">
                    or, <span onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('logos')} className="text-[#72aee6] hover:underline cursor-pointer">upload a 3D Logo file</span>
                  </p>
                </div>

                {/* Column 2: Next Steps */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                    Next Steps
                  </h4>
                  <ul className="space-y-1.5 text-[#c3c4c7]">
                    <li className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer" onClick={() => setOrderFilter('DJ Drops')}>
                      <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Manage DJ Drop Client Orders (12)</span>
                    </li>
                    <li className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer" onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')}>
                      <Film className="w-3.5 h-3.5 text-[#f0b849]" />
                      <span>Configure Ateso Translated Movies (18)</span>
                    </li>
                    <li className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer" onClick={onBackToStore}>
                      <ExternalLink className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Preview Live Website Streaming Player</span>
                    </li>
                  </ul>
                </div>

                {/* Column 3: More Actions */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                    More Actions
                  </h4>
                  <ul className="space-y-1.5 text-[#c3c4c7]">
                    <li className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer" onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('inquiries')}>
                      <MessageSquare className="w-3.5 h-3.5 text-[#e056fd]" />
                      <span>Manage WhatsApp Client Inquiries (14)</span>
                    </li>
                    <li className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer" onClick={() => setShowGoogleModal(true)}>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#4285F4]" />
                      <span>Inspect Google SEO Search Card Indexing</span>
                    </li>
                    <li className="flex items-center gap-2 text-zinc-400">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>CDN Status: Ultra HD 4K Streaming Active</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              WORDPRESS 2-COLUMN DASHBOARD WIDGETS GRID
             ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* WIDGET 1: AT A GLANCE */}
            {visibleWidgets.atAGlance && (
              <div className="bg-[#1d2327] border border-[#2c3338] rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2c3338] pb-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#72aee6]" />
                    <span>At a Glance</span>
                  </h3>
                  <span className="text-[11px] text-[#8c8f94]">Site Content Summary</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs text-[#c3c4c7]">
                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('tracks')}
                    className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer"
                  >
                    <Music className="w-3.5 h-3.5 text-[#E50914]" />
                    <span><strong className="text-white font-bold">{tracks.length || 25}</strong> Nonstop Mixtapes</span>
                  </div>

                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')}
                    className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-[#f0b849]" />
                    <span><strong className="text-white font-bold">{atesoMovies.length || 18}</strong> Ateso Movies</span>
                  </div>

                  <div 
                    onClick={() => setOrderFilter('DJ Drops')}
                    className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span><strong className="text-white font-bold">12</strong> DJ Voice Drop Orders</span>
                  </div>

                  <div 
                    onClick={() => setOrderFilter('3D Logos')}
                    className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5 text-[#34D399]" />
                    <span><strong className="text-white font-bold">{logos.length || 16}</strong> 3D Logos</span>
                  </div>

                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('inquiries')}
                    className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#e056fd]" />
                    <span><strong className="text-white font-bold">14</strong> Client Comments</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Storage: <strong className="text-white font-bold">4.8 GB</strong> / 25 GB</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2c3338] text-[11px] text-[#8c8f94] flex items-center justify-between">
                  <span>Running <strong>DJ Emma Pro Luxury Cinema Theme</strong></span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    100% Online
                  </span>
                </div>
              </div>
            )}

            {/* WIDGET 2: WOOCOMMERCE STATUS & REVENUE */}
            {visibleWidgets.wooStatus && (
              <div className="bg-[#1d2327] border border-[#2c3338] rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2c3338] pb-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#7f54b3]" />
                    <span>WooCommerce Status</span>
                  </h3>
                  <span className="text-[11px] text-[#8c8f94]">This Month</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-[#101517] p-2.5 rounded border border-[#2c3338]">
                    <span className="text-[10px] text-[#8c8f94] block uppercase font-mono">Net Sales</span>
                    <span className="text-base font-black text-[#D4AF37] font-mono mt-0.5 block">UGX 4.85M</span>
                    <span className="text-[9px] text-emerald-400 font-bold">↗ 28.4%</span>
                  </div>

                  <div className="bg-[#101517] p-2.5 rounded border border-[#2c3338]">
                    <span className="text-[10px] text-[#8c8f94] block uppercase font-mono">Orders</span>
                    <span className="text-base font-black text-white font-mono mt-0.5 block">24</span>
                    <span className="text-[9px] text-[#72aee6]">5 pending</span>
                  </div>

                  <div className="bg-[#101517] p-2.5 rounded border border-[#2c3338]">
                    <span className="text-[10px] text-[#8c8f94] block uppercase font-mono">Avg Value</span>
                    <span className="text-base font-black text-white font-mono mt-0.5 block">UGX 85K</span>
                    <span className="text-[9px] text-emerald-400 font-bold">↗ 12%</span>
                  </div>

                  <div className="bg-[#101517] p-2.5 rounded border border-[#2c3338]">
                    <span className="text-[10px] text-[#8c8f94] block uppercase font-mono">Customers</span>
                    <span className="text-base font-black text-white font-mono mt-0.5 block">1,284</span>
                    <span className="text-[9px] text-[#34D399]">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#8c8f94]">Top Service: <strong>Custom Voice Drops</strong></span>
                  <button 
                    type="button" 
                    onClick={() => setOrderFilter('All')} 
                    className="text-[#72aee6] hover:underline font-bold"
                  >
                    View Orders List &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* WIDGET 3: QUICK DRAFT */}
            {visibleWidgets.quickDraft && (
              <div className="bg-[#1d2327] border border-[#2c3338] rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2c3338] pb-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#f0b849]" />
                    <span>Quick Draft</span>
                  </h3>
                  <span className="text-[11px] text-[#8c8f94]">Write thoughts / ideas</span>
                </div>

                {draftSavedToast && (
                  <div className="p-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{draftSavedToast}</span>
                  </div>
                )}

                <form onSubmit={handleSaveDraft} className="space-y-2">
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Title: e.g. New Ateso Mixtape Vol 2..."
                    className="w-full bg-[#101517] border border-[#2c3338] focus:border-[#2271b1] focus:outline-none rounded px-3 py-1.5 text-xs text-white placeholder-[#8c8f94]"
                  />
                  <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    rows={3}
                    placeholder="What's on your mind? Note down tracklist, client drop script ideas, voice effects..."
                    className="w-full bg-[#101517] border border-[#2c3338] focus:border-[#2271b1] focus:outline-none rounded px-3 py-1.5 text-xs text-white placeholder-[#8c8f94] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8c8f94]">Saved locally in WordPress store</span>
                    <button
                      type="submit"
                      disabled={!draftTitle.trim()}
                      className="px-3 py-1 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      Save Draft
                    </button>
                  </div>
                </form>

                {/* Recent Drafts Preview */}
                <div className="pt-2 border-t border-[#2c3338] space-y-1.5 text-xs">
                  <p className="text-[10px] text-[#8c8f94] font-mono uppercase">Recent Drafts:</p>
                  {draftsList.map((d) => (
                    <div key={d.id} className="p-1.5 bg-[#101517] rounded border border-[#2c3338]/60 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{d.title}</span>
                        <span className="text-[10px] text-[#8c8f94] ml-2 font-mono">{d.date}</span>
                      </div>
                      <span className="text-[10px] text-[#72aee6] hover:underline cursor-pointer">Edit</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WIDGET 4: ACTIVITY & RECENT COMMENTS */}
            {visibleWidgets.activity && (
              <div className="bg-[#1d2327] border border-[#2c3338] rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2c3338] pb-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#34D399]" />
                    <span>Activity</span>
                  </h3>
                  <span className="text-[11px] text-[#8c8f94]">Recently Published & Feedback</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-[10px] text-[#8c8f94] uppercase font-mono mb-1">Recently Published:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center justify-between py-1 border-b border-[#2c3338]/40">
                        <span className="text-white font-medium flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-[#E50914]" />
                          <span>STREET ANTHEM 90 • DJ EMMA PRO & WAKANDA DJs</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">Today, 08:30 AM</span>
                      </li>
                      <li className="flex items-center justify-between py-1 border-b border-[#2c3338]/40">
                        <span className="text-white font-medium flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-[#f0b849]" />
                          <span>2024 ATESO VIDEO MIX VOL 1 VS AFROBEATS</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">Sep 28, 2025</span>
                      </li>
                      <li className="flex items-center justify-between py-1">
                        <span className="text-white font-medium flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-[#34D399]" />
                          <span>BEST OF VYROOTA NONSTOP 2026</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">Sep 24, 2025</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8c8f94] uppercase font-mono mb-1">Recent Client Comments:</p>
                    <div className="p-2 bg-[#101517] rounded border border-[#2c3338] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">Alex From Soroti</span>
                        <span className="text-[10px] text-[#8c8f94]">Yesterday</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] italic">
                        "The Street Anthem 90 is fire! Downloaded straight to my phone. Big up DJ Emma Pro!"
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-[#72aee6]">
                        <span className="hover:underline cursor-pointer">Approve</span>
                        <span>|</span>
                        <span className="hover:underline cursor-pointer">Reply</span>
                        <span>|</span>
                        <span className="text-red-400 hover:underline cursor-pointer">Trash</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              WIDGET 5: WOOCOMMERCE ORDERS DATA TABLE (FULL WIDTH)
             ======================================================== */}
          {visibleWidgets.ordersTable && (
            <div className="bg-[#1d2327] border border-[#2c3338] rounded-lg shadow p-4 sm:p-5 space-y-4">
              
              {/* Header with Title & Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2c3338] pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#7f54b3]" />
                  <h3 className="font-bold text-white text-base">WooCommerce Orders</h3>
                  <span className="text-xs text-[#8c8f94]">({filteredOrders.length} displayed)</span>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  {[
                    'All',
                    'DJ Drops',
                    '3D Logos',
                    'Movies',
                    'Pending',
                    'Processing',
                    'Completed',
                    'Paid'
                  ].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setOrderFilter(f)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        orderFilter === f
                          ? 'bg-[#2271b1] text-white font-bold'
                          : 'bg-[#101517] text-[#c3c4c7] hover:text-white hover:bg-[#2c3338] border border-[#2c3338]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Actions & Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <select className="bg-[#101517] border border-[#2c3338] text-xs text-[#c3c4c7] px-2.5 py-1.5 rounded focus:outline-none">
                    <option>Bulk actions</option>
                    <option>Change status to Processing</option>
                    <option>Change status to Completed</option>
                    <option>Move to Trash</option>
                  </select>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-[#2c3338] hover:bg-[#3c434a] text-white rounded text-xs font-semibold border border-[#3c434a] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#8c8f94] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search orders, customers..."
                    className="w-full bg-[#101517] border border-[#2c3338] focus:border-[#2271b1] focus:outline-none rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#8c8f94]"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2c3338] text-[11px] font-mono uppercase tracking-wider text-[#8c8f94] bg-[#101517]/60">
                      <th className="py-2.5 px-3">
                        <input type="checkbox" className="accent-[#2271b1]" />
                      </th>
                      <th className="py-2.5 px-3 font-semibold">Order</th>
                      <th className="py-2.5 px-3 font-semibold">Service</th>
                      <th className="py-2.5 px-3 font-semibold">Date</th>
                      <th className="py-2.5 px-3 font-semibold">Payment</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Total</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c3338]/60 text-xs">
                    {filteredOrders.map((o) => (
                      <tr
                        key={o.id}
                        className="hover:bg-[#101517] transition-colors cursor-pointer group"
                        onClick={() => setSelectedOrder(o)}
                      >
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="accent-[#2271b1]" />
                        </td>

                        {/* Order ID & Customer */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#72aee6] font-mono block hover:underline">
                            {o.id}
                          </span>
                          <span className="text-[#c3c4c7] font-medium">{o.customer}</span>
                        </td>

                        {/* Service Requested */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 text-white">
                            {o.serviceType === 'DJ Drop' && <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />}
                            {o.serviceType === '3D Logo' && <Box className="w-3.5 h-3.5 text-[#E50914]" />}
                            {o.serviceType === 'Movie' && <Film className="w-3.5 h-3.5 text-[#f0b849]" />}
                            <span>{o.service}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3 text-[#8c8f94] font-mono text-[11px] whitespace-nowrap">
                          {o.date}
                        </td>

                        {/* Payment */}
                        <td className="py-3 px-3">
                          {o.payment === 'Paid' ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#064e3b] text-[#34d399] border border-[#059669]/40">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#78350f] text-[#fbbf24] border border-[#d97706]/40">
                              {o.payment}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            o.status === 'Completed' 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                              : o.status === 'Processing'
                                ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                                : o.status === 'Quality Check'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                                  : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {o.status}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-3 font-mono font-bold text-[#D4AF37]">
                          {o.amount}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="p-1 rounded hover:bg-[#2c3338] text-[#72aee6] hover:text-white"
                              title="View Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`https://wa.me/256780527361?text=Hello%20${encodeURIComponent(o.customer)},%20this%20is%20DJ%20Emma%20Pro%20regarding%20Order%20${o.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded hover:bg-[#2c3338] text-emerald-400 hover:text-emerald-300"
                              title="Chat with customer on WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <div className="pt-2 border-t border-[#2c3338] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8c8f94]">
                <div>
                  <span>Showing {filteredOrders.length} of 24 items</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <button className="px-2 py-0.5 rounded border border-[#2c3338] bg-[#101517] disabled:opacity-40" disabled>&laquo;</button>
                  <button className="px-2 py-0.5 rounded border border-[#2c3338] bg-[#101517] disabled:opacity-40" disabled>&lsaquo;</button>
                  <span className="px-2 py-0.5 bg-[#2271b1] text-white font-bold rounded">1 of 3</span>
                  <button className="px-2 py-0.5 rounded border border-[#2c3338] bg-[#101517] hover:bg-[#2c3338] text-white">&rsaquo;</button>
                  <button className="px-2 py-0.5 rounded border border-[#2c3338] bg-[#101517] hover:bg-[#2c3338] text-white">&raquo;</button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              WIDGET 6: RECENT MEDIA GALLERY
             ======================================================== */}
          {visibleWidgets.recentMedia && (
            <div className="bg-[#1d2327] border border-[#2c3338] rounded-lg shadow p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2c3338] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Recent Media Library</span>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-[#101517] p-0.5 rounded border border-[#2c3338]">
                    <button
                      type="button"
                      onClick={() => setMediaTab('Videos')}
                      className={`px-3 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                        mediaTab === 'Videos' ? 'bg-[#2271b1] text-white shadow-sm' : 'text-[#8c8f94] hover:text-white'
                      }`}
                    >
                      Videos & Nonstops
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('Photos')}
                      className={`px-3 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                        mediaTab === 'Photos' ? 'bg-[#2271b1] text-white shadow-sm' : 'text-[#8c8f94] hover:text-white'
                      }`}
                    >
                      Artwork & Photos
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('files')}
                  className="text-xs text-[#72aee6] hover:underline font-bold"
                >
                  Manage All Media &rarr;
                </button>
              </div>

              {/* 5 Media Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {(mediaTab === 'Videos' ? RECENT_VIDEOS : RECENT_PHOTOS).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPreviewMedia(item)}
                    className="bg-[#101517] border border-[#2c3338] hover:border-[#72aee6] rounded-lg overflow-hidden group cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] relative bg-black overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/85 text-[9px] font-mono text-white font-bold">
                        {item.duration}
                      </span>
                    </div>

                    <div className="p-2.5">
                      <h5 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#72aee6] transition-colors">
                        {item.title}
                      </h5>
                      <div className="flex items-center justify-between text-[10px] text-[#8c8f94] font-mono mt-1">
                        <span>{item.date}</span>
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          WORDPRESS FOOTER BAR (Official style)
         ======================================================== */}
      <footer className="h-8 bg-[#1d2327] border-t border-[#2c3338] px-4 flex items-center justify-between text-[11px] text-[#8c8f94] select-none z-20">
        <div className="flex items-center gap-2">
          <span>Thank you for creating with <a href="https://wordpress.org/" target="_blank" rel="noopener noreferrer" className="text-[#72aee6] hover:underline font-bold">WordPress</a>.</span>
          <span>|</span>
          <span className="text-white font-bold">DJ EMMA PRO Studio</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Version 6.7.1</span>
          <span>|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[#72aee6] hover:underline">
            Back to top &uarr;
          </a>
        </div>
      </footer>

      {/* ========================================================
          ORDER INSPECTOR MODAL
         ======================================================== */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-[#1d2327] border border-[#2c3338] rounded-lg max-w-lg w-full p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2c3338] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#72aee6] font-bold">WooCommerce Order Details</span>
                <h3 className="text-lg font-black text-white">{selectedOrder.id} • {selectedOrder.customer}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded text-[#8c8f94] hover:text-white hover:bg-[#2c3338] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#101517] p-3.5 rounded border border-[#2c3338]">
                <div>
                  <span className="text-[#8c8f94] text-[10px] block font-mono">SERVICE</span>
                  <span className="font-bold text-white text-sm">{selectedOrder.service}</span>
                </div>
                <div>
                  <span className="text-[#8c8f94] text-[10px] block font-mono">TOTAL AMOUNT</span>
                  <span className="font-bold text-[#D4AF37] font-mono text-sm">{selectedOrder.amount}</span>
                </div>
                <div>
                  <span className="text-[#8c8f94] text-[10px] block font-mono">DATE ORDERED</span>
                  <span className="text-zinc-300 font-mono">{selectedOrder.date}</span>
                </div>
                <div>
                  <span className="text-[#8c8f94] text-[10px] block font-mono">ORDER STATUS</span>
                  <span className="font-bold text-emerald-400">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="text-[#8c8f94] text-[10px] block font-mono">PAYMENT METHOD</span>
                  <span className="font-bold text-zinc-200">Mobile Money (MTN / Airtel Uganda)</span>
                </div>
                <div>
                  <span className="text-[#8c8f94] text-[10px] block font-mono">PAYMENT STATUS</span>
                  <span className="font-bold text-[#34D399]">{selectedOrder.payment}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#2c3338] flex items-center justify-between">
              <a
                href={`https://wa.me/256780527361?text=Hello%20${encodeURIComponent(selectedOrder.customer)},%20this%20is%20DJ%20Emma%20Pro%20regarding%20your%20Order%20${selectedOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <span>WhatsApp Customer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded bg-[#2c3338] hover:bg-[#3c434a] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MEDIA PREVIEW LIGHTBOX
         ======================================================== */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewMedia(null)}
        >
          <div 
            className="bg-[#1d2327] border border-[#2c3338] rounded-lg max-w-2xl w-full p-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2c3338]">
              <div>
                <h4 className="text-white font-bold text-sm">{previewMedia.title}</h4>
                <p className="text-xs text-[#8c8f94] font-mono">{previewMedia.date} • {previewMedia.views} views</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1 rounded text-[#8c8f94] hover:text-white hover:bg-[#2c3338] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
              <img
                src={previewMedia.thumbnail}
                alt={previewMedia.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Google Search & SEO Visibility Modal */}
      <GoogleSearchVisibilityModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </div>
  );
}
