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
  Eye,
  X,
  FileText,
  DollarSign,
  Radio,
  SlidersHorizontal
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
    customer: 'John',
    service: 'DJ Drop',
    serviceType: 'DJ Drop',
    date: '28 Sep, 2025',
    payment: 'Paid',
    status: 'Processing',
    amount: 'UGX 50,000'
  },
  {
    id: '#1023',
    customer: 'Brian',
    service: '3D Logo',
    serviceType: '3D Logo',
    date: '28 Sep, 2025',
    payment: 'Paid',
    status: 'Completed',
    amount: 'UGX 150,000'
  },
  {
    id: '#1022',
    customer: 'Sarah',
    service: 'DJ Drop',
    serviceType: 'DJ Drop',
    date: '27 Sep, 2025',
    payment: 'Paid',
    status: 'Quality Check',
    amount: 'UGX 75,000'
  },
  {
    id: '#1021',
    customer: 'Michael',
    service: '3D Logo',
    serviceType: '3D Logo',
    date: '27 Sep, 2025',
    payment: 'Payment Pending',
    status: 'Pending Payment',
    amount: 'UGX 200,000'
  },
  {
    id: '#1020',
    customer: 'Alice',
    service: 'Movie',
    serviceType: 'Movie',
    date: '26 Sep, 2025',
    payment: 'Paid',
    status: 'Completed',
    amount: 'UGX 30,000'
  },
  {
    id: '#1019',
    customer: 'David',
    service: 'DJ Drop',
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
    id: 'vid-1',
    title: 'DJ EMMA PRO - Live Mix',
    date: '28 Sep, 2025',
    duration: '03:24',
    views: '12.5K',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'vid-2',
    title: '3D Logo Animation',
    date: '27 Sep, 2025',
    duration: '00:45',
    views: '8.2K',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'vid-3',
    title: 'Ateso Movies - Episode 2',
    date: '26 Sep, 2025',
    duration: '02:15',
    views: '15.7K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg'
  },
  {
    id: 'vid-4',
    title: 'TOSH Home Appliances',
    date: '25 Sep, 2025',
    duration: '00:38',
    views: '6.3K',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'vid-5',
    title: 'Nonstop Mix 2025',
    date: '24 Sep, 2025',
    duration: '04:12',
    views: '11.9K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg'
  }
];

const RECENT_PHOTOS: RecentMediaItem[] = [
  {
    id: 'pho-1',
    title: 'DJ Emma Pro FX Live On Stage',
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
    title: 'Master Artwork 2025 Press Kit',
    date: '26 Sep, 2025',
    duration: 'RAW',
    views: '12.1K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png'
  },
  {
    id: 'pho-4',
    title: 'Festival Night Turntables',
    date: '25 Sep, 2025',
    duration: 'HD',
    views: '16.5K',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png'
  },
  {
    id: 'pho-5',
    title: 'VIP Lounge Soundstage Setup',
    date: '24 Sep, 2025',
    duration: 'HD',
    views: '9.4K',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
  }
];

export default function WordPressAdminDashboard({
  onBackToStore,
  onOpenUploadCatalog
}: WordPressAdminDashboardProps) {
  const { voiceDrops, logos, atesoMovies } = useContent();

  // Collapsible submenus
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    drops: true,
    logos: true,
    movies: true,
    orders: true
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
    <div className="min-h-screen bg-[#08080a] text-white font-sans selection:bg-[#E50914] selection:text-white flex flex-col antialiased relative overflow-x-hidden">
      {/* Background Image Layer (Requested by User: DJ Emma Pro FX Signature Visual Showcase - Eco Optimized) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-30 filter brightness-90 contrast-110"
        style={{ backgroundImage: `url('https://res.cloudinary.com/hbyqk5y0/image/upload/f_auto,q_auto:eco,w_960/v1790550689/file_00000000bda08211910e147fbb531635.png')` }}
      />
      {/* Cinematic dark ambient overlay for sharp readable UI panels */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#08080a]/85 via-[#08080a]/75 to-[#08080a]/90 backdrop-blur-[1px]" />

      {/* ========================================================
          TOP NAVBAR
         ======================================================== */}
      <header className="sticky top-0 z-50 h-16 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-[#1f1f23]/80 px-4 sm:px-6 flex items-center justify-between shadow-lg relative">
        {/* Left: Brand Logo & Hamburger */}
        <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-2xl">
          {/* Logo with Golden Crown */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Crown className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]/20 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight flex items-center leading-none">
                <span className="text-white">DJ</span>
                <span className="text-[#E50914] ml-1">EMMA</span>
                <span className="text-white ml-1.5 font-bold">PRO FX</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium leading-tight mt-0.5 tracking-tight">
                Official Studio & Nonstop Broadcast
              </p>
            </div>
          </div>

          {/* Hamburger Menu Icon */}
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span className="h-0.5 w-full bg-zinc-300"></span>
              <span className="h-0.5 w-3/4 bg-[#E50914]"></span>
              <span className="h-0.5 w-full bg-zinc-300"></span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, customers, services..."
              className="w-full bg-[#141417] border border-[#242429] focus:border-[#E50914] focus:outline-none rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 transition-colors"
            />
          </div>
        </div>

        {/* Right: Notifications, Messages, Admin Profile & VIEW WEBSITE */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Notification bell with badge 5 */}
          <button
            type="button"
            className="relative p-2 rounded-lg bg-[#141417] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-[#242429] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E50914] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
              5
            </span>
          </button>

          {/* Message chat bubble with badge 3 */}
          <button
            type="button"
            onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('inquiries')}
            className="relative p-2 rounded-lg bg-[#141417] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-[#242429] transition-colors cursor-pointer"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E50914] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
              3
            </span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg bg-[#141417] border border-[#242429] cursor-pointer hover:border-zinc-700 transition-colors">
            <img
              src="https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png"
              alt="Admin"
              className="w-7 h-7 rounded-full border border-amber-500/40 object-cover"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-none">Admin</p>
              <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </div>

          {/* Google Search & SEO Visibility Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141417] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-[#242429] text-xs font-semibold transition-colors cursor-pointer"
            title="Inspect Google Search Results & SEO Indexing"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google SEO</span>
          </button>

          {/* VIEW WEBSITE Button (Bright Red with Subtle Glow) */}
          <button
            type="button"
            onClick={onBackToStore}
            className="px-4 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#ff0f1e] text-white text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] active:scale-95 flex items-center gap-1.5 cursor-pointer border border-red-500/30"
          >
            <span>VIEW WEBSITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================
          BODY: LEFT SIDEBAR + MAIN WORKSPACE
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* --------------------------------------------------------
            LEFT SIDEBAR
           -------------------------------------------------------- */}
        <aside className="w-60 sm:w-64 shrink-0 bg-[#0c0c0e]/92 backdrop-blur-md border-r border-[#1f1f23]/80 flex flex-col justify-between overflow-y-auto select-none py-4 px-3 space-y-4 relative z-10">
          <nav className="space-y-1 text-xs font-medium">
            {/* 1. Dashboard (Active Red Pill) */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#E50914] text-white font-bold text-xs shadow-[0_0_15px_rgba(229,9,20,0.4)] cursor-pointer">
              <Home className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </div>

            {/* 2. DJ DROPS (Dropdown) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleSubmenu('drops')}
                className="w-full flex items-center justify-between px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#141417] rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-zinc-300" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">DJ DROPS</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${openSubmenus.drops ? '' : '-rotate-90'}`} />
              </button>
              {openSubmenus.drops && (
                <div className="ml-6 mt-1 space-y-1 pl-2 border-l border-[#242429]">
                  <div 
                    onClick={() => setOrderFilter('DJ Drops')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>All Orders</span>
                    <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">12</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Pending')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>New Orders</span>
                    <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">5</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Processing')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>In Production</span>
                    <span className="w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center">3</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Completed')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Completed</span>
                    <span className="w-4 h-4 rounded-full bg-[#10B981] text-white text-[9px] font-bold flex items-center justify-center">8</span>
                  </div>
                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('drops')} 
                    className="py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    DJ Drop Services
                  </div>
                </div>
              )}
            </div>

            {/* 3. 3D LOGOS (Dropdown) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleSubmenu('logos')}
                className="w-full flex items-center justify-between px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#141417] rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Box className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">3D LOGOS</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${openSubmenus.logos ? '' : '-rotate-90'}`} />
              </button>
              {openSubmenus.logos && (
                <div className="ml-6 mt-1 space-y-1 pl-2 border-l border-[#242429]">
                  <div 
                    onClick={() => setOrderFilter('3D Logos')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Logo Orders</span>
                    <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">6</span>
                  </div>
                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('logos')} 
                    className="py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Logo Services
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Processing')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>In Production</span>
                    <span className="w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center">2</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Completed')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Completed</span>
                    <span className="w-4 h-4 rounded-full bg-[#10B981] text-white text-[9px] font-bold flex items-center justify-center">4</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. ATESO MOVIES (Dropdown) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleSubmenu('movies')}
                className="w-full flex items-center justify-between px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#141417] rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">ATESO MOVIES</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${openSubmenus.movies ? '' : '-rotate-90'}`} />
              </button>
              {openSubmenus.movies && (
                <div className="ml-6 mt-1 space-y-1 pl-2 border-l border-[#242429]">
                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>All Movies</span>
                    <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">18</span>
                  </div>
                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')} 
                    className="py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Add Movie
                  </div>
                  <div 
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')} 
                    className="py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Categories
                  </div>
                  <div className="py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors">
                    Movie Analytics
                  </div>
                </div>
              )}
            </div>

            {/* 5. ORDERS (Dropdown) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleSubmenu('orders')}
                className="w-full flex items-center justify-between px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#141417] rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">ORDERS</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${openSubmenus.orders ? '' : '-rotate-90'}`} />
              </button>
              {openSubmenus.orders && (
                <div className="ml-6 mt-1 space-y-1 pl-2 border-l border-[#242429]">
                  <div 
                    onClick={() => setOrderFilter('All')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>All Orders</span>
                    <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">24</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Pending')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Pending Payment</span>
                    <span className="w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center">7</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Processing')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Processing</span>
                    <span className="w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center">10</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Completed')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Completed</span>
                    <span className="w-4 h-4 rounded-full bg-[#10B981] text-white text-[9px] font-bold flex items-center justify-center">14</span>
                  </div>
                  <div 
                    onClick={() => setOrderFilter('Unpaid')} 
                    className="flex items-center justify-between py-1.5 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Cancelled</span>
                    <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">2</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. CUSTOMERS */}
            <div 
              onClick={() => setOrderFilter('All')}
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#141417] rounded-lg cursor-pointer transition-colors"
            >
              <Users className="w-4 h-4 text-zinc-400" />
              <span>CUSTOMERS</span>
            </div>

            {/* 7. PAYMENTS */}
            <div 
              onClick={() => setOrderFilter('Paid')}
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#141417] rounded-lg cursor-pointer transition-colors"
            >
              <CreditCard className="w-4 h-4 text-zinc-400" />
              <span>PAYMENTS</span>
            </div>

            {/* 8. MESSAGES */}
            <div 
              onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('inquiries')}
              className="flex items-center justify-between px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#141417] rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <span>MESSAGES</span>
              </div>
              <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">
                6
              </span>
            </div>

            {/* 9. ANALYTICS */}
            <div className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#141417] rounded-lg cursor-pointer transition-colors">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
              <span>ANALYTICS</span>
            </div>

            {/* 10. MEDIA LIBRARY */}
            <div 
              onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('files')}
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#141417] rounded-lg cursor-pointer transition-colors"
            >
              <Folder className="w-4 h-4 text-zinc-400" />
              <span>MEDIA LIBRARY</span>
            </div>

            {/* 11. SETTINGS */}
            <div 
              onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('files')}
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#141417] rounded-lg cursor-pointer transition-colors"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>SETTINGS</span>
            </div>
          </nav>
        </aside>

        {/* --------------------------------------------------------
            MAIN CONTENT AREA
           -------------------------------------------------------- */}
        <main className="flex-1 bg-transparent p-4 sm:p-5 lg:p-6 overflow-y-auto space-y-4 sm:space-y-5 relative z-10">
          {/* ========================================================
              WELCOME BACK BANNER
             ======================================================== */}
          <div className="bg-[#111114] border border-[#202024] rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Crown Emblem + Welcome Title */}
            <div className="flex items-center gap-4">
              {/* Circular Gold Emblem */}
              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-black/60 flex flex-col items-center justify-center p-1 shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                <Crown className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/30" />
                <span className="text-[9px] font-black text-[#E50914] leading-none mt-0.5 tracking-tighter">DJ EMMA</span>
                <span className="text-[7px] font-bold text-[#D4AF37] leading-none">PRO FX</span>
              </div>

              {/* Text */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-1.5">
                  <span>WELCOME BACK,</span>
                  <span className="text-[#E50914]">DJ EMMA PRO</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  Manage your DJ services, 3D logo orders, customers, payments and entertainment content from one professional dashboard.
                </p>
              </div>
            </div>

            {/* Right: Date/Time + Gold Script "Big Dreams Bigger Moves" */}
            <div className="flex flex-col items-start md:items-end justify-between self-stretch shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Sept 28, 2025 | 10:24 AM</span>
              </div>

              {/* Gold cursive script */}
              <div className="mt-2 text-right">
                <span className="font-serif italic font-normal text-xl sm:text-2xl text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] tracking-wide">
                  Big Dreams
                </span>
                <br />
                <span className="font-serif italic font-normal text-xl sm:text-2xl text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] tracking-wide -mt-2 inline-block">
                  Bigger Moves
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              ROW OF 6 STATISTIC METRIC CARDS
             ======================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
            {/* 1. NEW ORDERS */}
            <div className="bg-[#111114] border border-[#202024] p-3.5 sm:p-4 rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-center text-[#E50914] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    NEW ORDERS
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">24</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[11px]">
                <span className="text-emerald-400 font-bold">↗ 32%</span>
                <span className="text-zinc-500 text-[10px]">vs last 7 days</span>
              </div>
            </div>

            {/* 2. DJ DROP ORDERS */}
            <div className="bg-[#111114] border border-[#202024] p-3.5 sm:p-4 rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    DJ DROP ORDERS
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">128</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[11px]">
                <span className="text-emerald-400 font-bold">↗ 18%</span>
                <span className="text-zinc-500 text-[10px]">vs last 7 days</span>
              </div>
            </div>

            {/* 3. 3D LOGO ORDERS */}
            <div className="bg-[#111114] border border-[#202024] p-3.5 sm:p-4 rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-center text-[#E50914] shrink-0">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    3D LOGO ORDERS
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">86</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[11px]">
                <span className="text-emerald-400 font-bold">↗ 24%</span>
                <span className="text-zinc-500 text-[10px]">vs last 7 days</span>
              </div>
            </div>

            {/* 4. TOTAL REVENUE */}
            <div className="bg-[#111114] border border-[#202024] p-3.5 sm:p-4 rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    TOTAL REVENUE
                  </span>
                  <div className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">
                    UGX 18.45M
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[11px]">
                <span className="text-emerald-400 font-bold">↗ 32%</span>
                <span className="text-zinc-500 text-[10px]">vs last 7 days</span>
              </div>
            </div>

            {/* 5. CUSTOMERS */}
            <div className="bg-[#111114] border border-[#202024] p-3.5 sm:p-4 rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-center text-[#E50914] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    CUSTOMERS
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">1,284</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[11px]">
                <span className="text-emerald-400 font-bold">↗ 16%</span>
                <span className="text-zinc-500 text-[10px]">vs last 7 days</span>
              </div>
            </div>

            {/* 6. MOVIE VIEWS */}
            <div className="bg-[#111114] border border-[#202024] p-3.5 sm:p-4 rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Play className="w-4 h-4 fill-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    MOVIE VIEWS
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">126.8K</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[11px]">
                <span className="text-emerald-400 font-bold">↗ 48%</span>
                <span className="text-zinc-500 text-[10px]">vs last 7 days</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              MIDDLE SECTION: ORDERS OVERVIEW (LEFT) + VIDEO/PHOTO VIEWS (RIGHT)
             ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* LEFT COLUMN: Orders Overview (8 cols) */}
            <div className="lg:col-span-8 bg-[#111114] border border-[#202024] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
              <div>
                {/* Header row: Orders Overview, Search, Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      Orders Overview
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative w-44 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search orders..."
                        className="w-full bg-[#18181c] border border-[#26262b] focus:border-[#E50914] focus:outline-none rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500"
                      />
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-[#18181c] border border-[#26262b] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 transition-colors"
                    >
                      <Filter className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 hide-scrollbar">
                  {[
                    'All',
                    'DJ Drops',
                    '3D Logos',
                    'Movies',
                    'Pending',
                    'Processing',
                    'Completed',
                    'Paid',
                    'Unpaid'
                  ].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        orderFilter === f
                          ? 'bg-[#E50914] text-white font-bold'
                          : 'bg-[#18181c] text-zinc-400 hover:text-white hover:bg-zinc-800 border border-[#26262b]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#202024] text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        <th className="py-2.5 px-3 font-semibold">ORDER ID</th>
                        <th className="py-2.5 px-3 font-semibold">CUSTOMER</th>
                        <th className="py-2.5 px-3 font-semibold">SERVICE</th>
                        <th className="py-2.5 px-3 font-semibold">DATE</th>
                        <th className="py-2.5 px-3 font-semibold">PAYMENT</th>
                        <th className="py-2.5 px-3 font-semibold">STATUS</th>
                        <th className="py-2.5 px-3 font-semibold">AMOUNT</th>
                        <th className="py-2.5 px-3 font-semibold text-center">ACTION</th>
                        <th className="py-2.5 px-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18181d] text-xs">
                      {filteredOrders.map((o) => (
                        <tr
                          key={o.id}
                          className="hover:bg-[#16161a] transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(o)}
                        >
                          {/* ORDER ID */}
                          <td className="py-2.5 px-3 font-mono font-bold text-white">{o.id}</td>

                          {/* CUSTOMER */}
                          <td className="py-2.5 px-3 font-medium text-white">{o.customer}</td>

                          {/* SERVICE WITH ICON */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5 text-zinc-200">
                              {o.serviceType === 'DJ Drop' && <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />}
                              {o.serviceType === '3D Logo' && <Box className="w-3.5 h-3.5 text-[#E50914]" />}
                              {o.serviceType === 'Movie' && <Film className="w-3.5 h-3.5 text-[#D4AF37]" />}
                              <span>{o.service}</span>
                            </div>
                          </td>

                          {/* DATE */}
                          <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                            {o.date}
                          </td>

                          {/* PAYMENT BADGE */}
                          <td className="py-2.5 px-3">
                            {o.payment === 'Paid' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#064E3B]/80 text-[#34D399] border border-[#059669]/40">
                                Paid
                              </span>
                            )}
                            {o.payment === 'Payment Pending' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#78350F]/80 text-[#FBBF24] border border-[#D97706]/40 whitespace-nowrap">
                                Payment Pending
                              </span>
                            )}
                            {o.payment === 'Unpaid' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7F1D1D]/80 text-[#F87171] border border-[#DC2626]/40">
                                Unpaid
                              </span>
                            )}
                          </td>

                          {/* STATUS BADGE */}
                          <td className="py-2.5 px-3">
                            {o.status === 'Processing' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#451A03]/90 text-[#F59E0B] border border-[#D97706]/50">
                                Processing
                              </span>
                            )}
                            {o.status === 'Completed' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#064E3B]/80 text-[#34D399] border border-[#059669]/40">
                                Completed
                              </span>
                            )}
                            {o.status === 'Quality Check' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#451A03]/90 text-[#F59E0B] border border-[#D97706]/50 whitespace-nowrap">
                                Quality Check
                              </span>
                            )}
                            {o.status === 'Pending Payment' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#78350F]/80 text-[#FBBF24] border border-[#D97706]/40 whitespace-nowrap">
                                Pending Payment
                              </span>
                            )}
                            {o.status === 'Cancelled' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46]">
                                Cancelled
                              </span>
                            )}
                          </td>

                          {/* AMOUNT */}
                          <td className="py-2.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                            {o.amount}
                          </td>

                          {/* ACTION BUTTON */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(o);
                              }}
                              className="px-3 py-0.5 rounded bg-[#18181c] hover:bg-[#E50914] text-zinc-300 hover:text-white border border-[#26262b] text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              View
                            </button>
                          </td>

                          {/* MORE THREE DOTS */}
                          <td className="py-2.5 px-2 text-right text-zinc-500 hover:text-white">
                            <MoreVertical className="w-3.5 h-3.5 inline cursor-pointer" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Video Views & Photo Views (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* CARD 1: Video Views */}
              <div className="bg-[#111114] border border-[#202024] rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-red-950/60 border border-red-500/40 flex items-center justify-center text-[#E50914]">
                      <Play className="w-3 h-3 fill-[#E50914]" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Video Views</h4>
                  </div>
                  <span className="text-[10px] font-bold text-[#E50914] hover:underline cursor-pointer">
                    View All
                  </span>
                </div>

                <div className="text-[10px] text-zinc-400 font-mono">Total Video Views</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-white">126.8K</span>
                  <span className="text-emerald-400 font-bold text-xs flex items-center">
                    ↗ 48% <span className="text-zinc-500 font-normal text-[10px] ml-1">vs last 7 days</span>
                  </span>
                </div>

                {/* Red Line Spline Chart */}
                <div className="h-28 w-full mt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartRedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E50914" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#E50914" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Area */}
                    <path
                      d="M 15,90 Q 75,80 140,75 T 260,50 T 385,20 L 385,115 L 15,115 Z"
                      fill="url(#chartRedGrad)"
                    />

                    {/* Red Spline Line */}
                    <path
                      d="M 15,90 Q 75,80 140,75 T 260,50 T 385,20"
                      fill="none"
                      stroke="#E50914"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Glowing dots */}
                    {[
                      { cx: 15, cy: 90 },
                      { cx: 76, cy: 82 },
                      { cx: 138, cy: 75 },
                      { cx: 200, cy: 68 },
                      { cx: 262, cy: 50 },
                      { cx: 323, cy: 38 },
                      { cx: 385, cy: 20 }
                    ].map((dot, idx) => (
                      <circle
                        key={idx}
                        cx={dot.cx}
                        cy={dot.cy}
                        r="3.5"
                        fill="#FFFFFF"
                        stroke="#E50914"
                        strokeWidth="2"
                        className="shadow-[0_0_8px_#E50914]"
                      />
                    ))}
                  </svg>
                </div>

                {/* X-axis days */}
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-1 pt-1.5 border-t border-[#1d1d21]">
                  <span>22 Sep</span>
                  <span>23 Sep</span>
                  <span>24 Sep</span>
                  <span>25 Sep</span>
                  <span>26 Sep</span>
                  <span>27 Sep</span>
                  <span>28 Sep</span>
                </div>
              </div>

              {/* CARD 2: Photo Views */}
              <div className="bg-[#111114] border border-[#202024] rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-[#D4AF37]">
                      <ImageIcon className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Photo Views</h4>
                  </div>
                  <span className="text-[10px] font-bold text-[#D4AF37] hover:underline cursor-pointer">
                    View All
                  </span>
                </div>

                <div className="text-[10px] text-zinc-400 font-mono">Total Photo Views</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-white">58.4K</span>
                  <span className="text-emerald-400 font-bold text-xs flex items-center">
                    ↗ 35% <span className="text-zinc-500 font-normal text-[10px] ml-1">vs last 7 days</span>
                  </span>
                </div>

                {/* Gold Vertical Bar Chart */}
                <div className="h-28 w-full mt-2 flex items-end justify-between gap-2 px-1">
                  {[
                    { day: '22 Sep', h: 32 },
                    { day: '23 Sep', h: 42 },
                    { day: '24 Sep', h: 54 },
                    { day: '25 Sep', h: 65 },
                    { day: '26 Sep', h: 76 },
                    { day: '27 Sep', h: 88 },
                    { day: '28 Sep', h: 100 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        style={{ height: `${bar.h}%` }}
                        className="w-full bg-[#D4AF37] hover:bg-[#ffcf40] rounded-t-sm transition-all shadow-[0_0_6px_rgba(212,175,55,0.3)]"
                      />
                    </div>
                  ))}
                </div>

                {/* X-axis days */}
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-1 pt-1.5 border-t border-[#1d1d21]">
                  <span>22 Sep</span>
                  <span>23 Sep</span>
                  <span>24 Sep</span>
                  <span>25 Sep</span>
                  <span>26 Sep</span>
                  <span>27 Sep</span>
                  <span>28 Sep</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              BOTTOM ROW: RECENT MEDIA (50%) + QUICK ACTIONS (25%) + TOP SERVICES (25%)
             ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* 1. RECENT MEDIA (6 cols) */}
            <div className="lg:col-span-6 bg-[#111114] border border-[#202024] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                      <span>Recent Media</span>
                    </div>

                    {/* Tab pills */}
                    <div className="flex items-center gap-1 bg-[#18181c] p-0.5 rounded-full border border-[#26262b]">
                      <button
                        type="button"
                        onClick={() => setMediaTab('Videos')}
                        className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          mediaTab === 'Videos' ? 'bg-[#E50914] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Videos
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaTab('Photos')}
                        className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          mediaTab === 'Photos' ? 'bg-[#E50914] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Photos
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#E50914] hover:underline cursor-pointer">
                    View All
                  </span>
                </div>

                {/* 5 Media Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {(mediaTab === 'Videos' ? RECENT_VIDEOS : RECENT_PHOTOS).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setPreviewMedia(item)}
                      className="bg-[#18181c] border border-[#26262b] hover:border-zinc-600 rounded-xl overflow-hidden group cursor-pointer transition-all flex flex-col justify-between"
                    >
                      {/* Image Thumbnail with duration overlay */}
                      <div className="aspect-[4/3] relative bg-black overflow-hidden">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                        />
                        {/* Play button icon in center */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                            <Play className="w-2.5 h-2.5 fill-white translate-x-0.5" />
                          </div>
                        </div>

                        {/* Duration badge */}
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white font-bold backdrop-blur-sm">
                          {item.duration}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-2">
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-[#E50914] transition-colors">
                            {item.title}
                          </h5>
                          <MoreVertical className="w-3 h-3 text-zinc-500 shrink-0" />
                        </div>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{item.date}</p>
                        <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-mono mt-1">
                          <Eye className="w-2.5 h-2.5 text-zinc-500" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. QUICK ACTIONS (3 cols) */}
            <div className="lg:col-span-3 bg-[#111114] border border-[#202024] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/20" />
                  <h3 className="text-sm font-bold text-white">Quick Actions</h3>
                </div>

                {/* 2x2 Grid of Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Button 1: New DJ Drop Order (Solid Red) */}
                  <button
                    type="button"
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('drops')}
                    className="h-24 rounded-xl bg-[#E50914] hover:bg-[#ff0f1e] text-white p-2.5 flex flex-col items-center justify-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer active:scale-95 transition-all text-center"
                  >
                    <Mic className="w-5 h-5 text-white" />
                    <span className="text-[11px] font-bold leading-tight">New DJ Drop Order</span>
                  </button>

                  {/* Button 2: New 3D Logo Order (Gold outline) */}
                  <button
                    type="button"
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('logos')}
                    className="h-24 rounded-xl bg-[#18181c] hover:bg-zinc-800 text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] p-2.5 flex flex-col items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all text-center"
                  >
                    <Box className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[11px] font-bold leading-tight text-white">New 3D Logo Order</span>
                  </button>

                  {/* Button 3: Add Movie */}
                  <button
                    type="button"
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('movies')}
                    className="h-24 rounded-xl bg-[#18181c] hover:bg-zinc-800 text-white border border-[#26262b] hover:border-zinc-600 p-2.5 flex flex-col items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all text-center"
                  >
                    <Film className="w-5 h-5 text-zinc-300" />
                    <span className="text-[11px] font-bold leading-tight text-white">Add Movie</span>
                  </button>

                  {/* Button 4: Add Service */}
                  <button
                    type="button"
                    onClick={() => onOpenUploadCatalog && onOpenUploadCatalog('inquiries')}
                    className="h-24 rounded-xl bg-[#18181c] hover:bg-zinc-800 text-white border border-[#26262b] hover:border-zinc-600 p-2.5 flex flex-col items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all text-center"
                  >
                    <PlusCircle className="w-5 h-5 text-zinc-300" />
                    <span className="text-[11px] font-bold leading-tight text-white">Add Service</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. TOP SERVICES (3 cols) */}
            <div className="lg:col-span-3 bg-[#111114] border border-[#202024] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/30" />
                    <h3 className="text-sm font-bold text-white">Top Services</h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#D4AF37] hover:underline cursor-pointer">
                    View All
                  </span>
                </div>

                {/* Progress bars list */}
                <div className="space-y-3 pt-1">
                  {/* Item 1: DJ Drops */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <div className="w-4 h-4 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-[#E50914]">
                          <Mic className="w-2.5 h-2.5" />
                        </div>
                        <span>DJ Drops</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">128 orders</span>
                    </div>
                    <div className="w-full bg-[#18181c] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#E50914] h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Item 2: 3D Logos */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <div className="w-4 h-4 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-[#D4AF37]">
                          <Box className="w-2.5 h-2.5" />
                        </div>
                        <span>3D Logos</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">86 orders</span>
                    </div>
                    <div className="w-full bg-[#18181c] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#D4AF37] h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  {/* Item 3: Movies */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <div className="w-4 h-4 rounded-full bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-[#3B82F6]">
                          <Film className="w-2.5 h-2.5" />
                        </div>
                        <span>Movies</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">42 orders</span>
                    </div>
                    <div className="w-full bg-[#18181c] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  {/* Item 4: Posters */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <div className="w-4 h-4 rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-[#A855F7]">
                          <ImageIcon className="w-2.5 h-2.5" />
                        </div>
                        <span>Posters</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">28 orders</span>
                    </div>
                    <div className="w-full bg-[#18181c] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#A855F7] h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  {/* Item 5: 2D Logos */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <div className="w-4 h-4 rounded-full bg-teal-950/60 border border-teal-500/40 flex items-center justify-center text-[#06B6D4]">
                          <Zap className="w-2.5 h-2.5" />
                        </div>
                        <span>2D Logos</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">19 orders</span>
                    </div>
                    <div className="w-full bg-[#18181c] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#06B6D4] h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================
          FOOTER BAR
         ======================================================== */}
      <footer className="h-10 bg-[#0c0c0e]/95 backdrop-blur-md border-t border-[#1f1f23]/80 px-4 sm:px-6 flex items-center justify-between text-[11px] text-zinc-500 font-mono select-none relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-zinc-300 font-bold">DJ EMMA PRO FX</span>
          <span>|</span>
          <span>Official Studio & Nonstop Broadcast</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Powered by WordPress + WooCommerce</span>
          <span>|</span>
          <span className="text-zinc-400">Your Success, Our Priority</span>
          <Crown className="w-3 h-3 text-[#D4AF37]" />
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
            className="bg-[#111114] border border-[#202024] rounded-2xl max-w-md w-full p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#202024] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#E50914] font-bold">Order Details</span>
                <h3 className="text-lg font-black text-white">{selectedOrder.id} • {selectedOrder.customer}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#18181c] p-3 rounded-xl border border-[#26262b]">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">SERVICE</span>
                  <span className="font-bold text-white">{selectedOrder.service}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">AMOUNT</span>
                  <span className="font-bold text-[#D4AF37] font-mono">{selectedOrder.amount}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">DATE</span>
                  <span className="text-zinc-300 font-mono">{selectedOrder.date}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-mono">STATUS</span>
                  <span className="font-bold text-emerald-400">{selectedOrder.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#202024] flex items-center justify-between">
              <a
                href={`https://wa.me/256780527361?text=Hello%20${encodeURIComponent(selectedOrder.customer)},%20this%20is%20DJ%20Emma%20Pro%20FX%20regarding%20Order%20${selectedOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>WhatsApp Client</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-3 py-1.5 rounded-lg bg-[#18181c] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold"
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
            className="bg-[#111114] border border-[#202024] rounded-2xl max-w-2xl w-full p-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#202024]">
              <div>
                <h4 className="text-white font-bold text-sm">{previewMedia.title}</h4>
                <p className="text-xs text-zinc-400 font-mono">{previewMedia.date} • {previewMedia.views} views</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
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
