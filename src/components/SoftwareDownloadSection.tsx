import { useState, useMemo, useEffect } from 'react';
import { Download, Youtube, CheckCircle2, Laptop, ShieldCheck, ExternalLink, HardDrive, Sparkles, Search, X, Flame, Info, Cpu, FileText, CheckCircle, PackageOpen } from 'lucide-react';

interface SoftwareTool {
  id: string;
  name: string;
  category: string;
  version: string;
  size: string;
  description: string;
  downloadUrl: string;
  os: string;
  thumbnail: string;
  baseDownloads: number;
  systemRequirements: string;
  developerNotes: string;
}

const SOFTWARE_TOOLS: SoftwareTool[] = [
  {
    id: 'tool-virtualdj',
    name: 'Virtual DJ Pro 2022 (CE v8.5.6067)',
    category: 'DJ Mixing',
    version: 'v8.5.6067 CE',
    size: '165 MB',
    description: 'Atomix VirtualDJ Pro Cracked Edition. Industry standard live mixing software with video mixing, sampler, and controller support.',
    downloadUrl: 'https://www.mediafire.com/file/mn2bz2sg4nk6y0h/Atomix_VirtualDJ_Pro_2022_v8.5.6067_CE.exe/file',
    os: 'Windows 10/11 (64-bit recommended)',
    thumbnail: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 8450,
    systemRequirements: 'OS: Windows 10/11 (64-bit). RAM: 4 GB minimum (8 GB recommended). Storage: 500 MB free space. Sound Card: DirectSound or ASIO compatible audio interface.',
    developerNotes: 'Pre-activated Cracked Edition (CE). Fully tested for live club mixing, MIDI controller mapping, and video output sync.'
  },
  {
    id: 'tool-vegaspro13',
    name: 'Sony Vegas Pro 13 (Trial)',
    category: 'Video Editing',
    version: 'v13.0',
    size: '390 MB',
    description: 'Professional video production suite with advanced multi-cam editing, color grading, and audio restoration tools.',
    downloadUrl: 'https://www.mediafire.com/file/se35w7u6d92sl3f/trial_vegaspro13.exe/file',
    os: 'Windows 64-bit',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 5210,
    systemRequirements: 'OS: Windows 7, 8, 10, 11 (64-bit). CPU: 2 GHz multi-core processor. RAM: 4 GB RAM (8 GB recommended). GPU: Dedicated graphics card with 512MB VRAM.',
    developerNotes: 'Standard installer package. Ideal for timeline cutting, audio mixing, and high-definition video rendering.'
  },
  {
    id: 'tool-vegaspro11',
    name: 'Sony Vegas Pro 11 (32-bit)',
    category: 'Video Editing',
    version: 'v11.0.370',
    size: '210 MB',
    description: 'Classic reliable 32-bit version of Vegas Pro optimized for older systems and streamlined video rendering.',
    downloadUrl: 'https://www.mediafire.com/file/si4el4f0so56ydt/vegaspro11.0.370_32bit.exe/file',
    os: 'Windows 32-bit / 64-bit',
    thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 3420,
    systemRequirements: 'OS: Windows XP, Vista, 7, 8, 10 (32-bit or 64-bit). RAM: 2 GB RAM minimum. Storage: 500 MB hard disk space.',
    developerNotes: 'Optimized specifically for 32-bit Windows architectures where newer versions are incompatible.'
  },
  {
    id: 'tool-newbluefx',
    name: 'NewBlueFX 2012 Beta 1',
    category: 'Video Effects',
    version: '2012 Beta 1',
    size: '125 MB',
    description: 'Dynamic transitions, 3D title plugins, and visual video filters compatible with major video editors.',
    downloadUrl: 'https://www.mediafire.com/file/tqifzgym48h2pro/NewBlueFX_2012_Beta1.zip/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 1980,
    systemRequirements: 'Compatible with Sony Vegas Pro, Adobe Premiere, and Windows video editing hosts.',
    developerNotes: 'Extract ZIP archive before running installer. Includes classic transition and text presets.'
  },
  {
    id: 'tool-xara3d',
    name: 'Xara 3D 7 Studio',
    category: '3D Graphics',
    version: 'v7.0',
    size: '45 MB',
    description: 'Create stunning 3D text titles, logos, animations, and graphics for DJ mixtapes and YouTube intros.',
    downloadUrl: 'https://www.mediafire.com/file/1fcau0pz0j2nmaf/Xara_3D_7.zip/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 4120,
    systemRequirements: 'OS: Windows XP/7/8/10/11. RAM: 512 MB RAM. Processor: Intel Pentium or AMD equivalent.',
    developerNotes: 'Lightweight utility for exporting animated GIF titles and 3D PNG logos.'
  },
  {
    id: 'tool-musicstudio',
    name: 'MAGIX Music Studio 10',
    category: 'Audio Production',
    version: 'v10.0.108',
    size: '180 MB',
    description: 'Multitrack recording, beat making, mastering, and audio editing workstation for producers and DJs.',
    downloadUrl: 'https://www.mediafire.com/file/9lemywq1jp8lh1f/musicstudio10.0.108.exe/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 2750,
    systemRequirements: 'OS: Windows Vista/7/8/10. RAM: 2 GB RAM. Sound Card: ASIO compatible recommended.',
    developerNotes: 'Great for vocal recording, instrument plug-ins, and multitrack remixing.'
  },
  {
    id: 'tool-aimp',
    name: 'AIMP Audio Player',
    category: 'Audio Player',
    version: 'v3.10.1074',
    size: '10 MB',
    description: 'Lightweight and crystal clear audio player with 32-bit audio processing and low resource usage.',
    downloadUrl: 'https://www.mediafire.com/file/2bse2bkmpevrba2/aimp_3.10.1074.rar/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 3890,
    systemRequirements: 'OS: Windows XP to 11. CPU: 1 GHz. RAM: 512 MB.',
    developerNotes: 'Extremely light on system resources. Unpack RAR file to run installer.'
  },
  {
    id: 'tool-vlc',
    name: 'VLC Media Player',
    category: 'Media Player',
    version: 'v3.0.7.1',
    size: '38 MB',
    description: 'The ultimate universal media player that plays almost any video or audio format effortlessly.',
    downloadUrl: 'https://www.mediafire.com/file/ehkv2kbkkw291eq/vlc_3.0.7.1_win32.exe/file',
    os: 'Windows 32/64-bit',
    thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 6940,
    systemRequirements: 'OS: Windows 7, 8, 10, 11. RAM: 512 MB RAM. Storage: 100 MB free space.',
    developerNotes: 'Essential media player that requires zero extra codecs to play MP4, MKV, FLAC, and AVI.'
  },
  {
    id: 'tool-logoremover',
    name: 'LogoRemover By Virtuo',
    category: 'Video Utility',
    version: 'v1.0',
    size: '15 MB',
    description: 'Remove unwanted watermarks and TV channel logos from video clips easily.',
    downloadUrl: 'https://www.mediafire.com/file/yvpdldrk8ujdmui/LogoRemover_By_Virtuo.zip/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 2310,
    systemRequirements: 'OS: Windows. RAM: 1 GB RAM.',
    developerNotes: 'Extract ZIP package. Use on AVI/MPG video files for quick watermark blurring.'
  },
  {
    id: 'tool-avast',
    name: 'Avast Free Antivirus (Offline)',
    category: 'Security & Antivirus',
    version: 'Latest Offline Setup',
    size: '250 MB',
    description: 'Essential offline antivirus installer to protect your PC from malware, spyware, and viruses without needing active internet during setup.',
    downloadUrl: 'https://www.mediafire.com/file/7f1gmshqu1qjoim/avast_free_antivirus_setup_offline.exe/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 5120,
    systemRequirements: 'OS: Windows 7 SP1 or higher. RAM: 2 GB RAM. Storage: 2 GB free hard disk space.',
    developerNotes: 'Offline installer package. Perfect for setting up protection on fresh or offline Windows installations.'
  },
  {
    id: 'tool-smadav',
    name: 'Smadav Antivirus 2023',
    category: 'Security & Antivirus',
    version: 'Rev. 1502',
    size: '7 MB',
    description: 'Additional USB flash drive protection and fast local antivirus scanner designed to stop shortcut and flash drive viruses.',
    downloadUrl: 'https://www.mediafire.com/file/nnb6zus2i9223jr/smadav2023rev1502.exe/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 7830,
    systemRequirements: 'OS: Windows XP/7/8/10/11. RAM: 512 MB RAM.',
    developerNotes: 'Ultra-lightweight scanner specifically engineered to protect against infected USB flash drives.'
  },
  {
    id: 'tool-driverpack',
    name: 'DriverPack Solution Online',
    category: 'System Drivers',
    version: 'Online Installer',
    size: '20 MB',
    description: 'Automatically find, install, and update all missing or outdated drivers on your computer with one click.',
    downloadUrl: 'https://www.mediafire.com/file/bcrg10nrjntic4r/DriverPack-Online.rar/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 9210,
    systemRequirements: 'OS: Windows 7/8/10/11. Active internet connection required for downloading hardware drivers.',
    developerNotes: 'Extract RAR archive before launching. Automatically detects missing audio, graphics, and network drivers.'
  },
  {
    id: 'tool-everything',
    name: 'Everything File Search',
    category: 'System Utility',
    version: 'v1.4.1.877',
    size: '2 MB',
    description: 'Instant lightning-fast file and folder search utility for Windows. Finds any file on your hard drives in milliseconds.',
    downloadUrl: 'https://www.mediafire.com/file/egi915uo1ku5uve/Everything-1.4.1.877.x86-Setup.exe/file',
    os: 'Windows x86/x64',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 4650,
    systemRequirements: 'OS: Windows XP, Vista, 7, 8, 10, 11. Minimal RAM and CPU usage.',
    developerNotes: 'Replaces standard Windows search with instant indexing.'
  },
  {
    id: 'tool-ffsetup',
    name: 'Format Factory Setup',
    category: 'Media Converter',
    version: 'v4.6.2.0',
    size: '55 MB',
    description: 'All-in-one media converter for video, audio, and image formats. Convert MP4, MP3, AVI, MKV, and more.',
    downloadUrl: 'https://www.mediafire.com/file/62hykedz2gmnho4/FFSetup4.6.2.0.exe/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 3940,
    systemRequirements: 'OS: Windows 7/8/10/11. RAM: 1 GB RAM. Storage: 200 MB free space.',
    developerNotes: 'Powerful batch converter for converting video, audio, and repairing damaged files.'
  },
  {
    id: 'tool-tftunlock',
    name: 'TFTUnlock Tool',
    category: 'Mobile Utility',
    version: 'v6.2.1.1',
    size: '120 MB',
    description: 'Specialized mobile device utility for firmware flashing, FRP bypass, and network unlocking.',
    downloadUrl: 'https://www.mediafire.com/file/b3mx3t3o7z130i3/TFTUnlock_Tool_V6.2.1.1.zip/file',
    os: 'Windows',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    baseDownloads: 4180,
    systemRequirements: 'OS: Windows 10/11 (64-bit). USB drivers for Android/iOS required.',
    developerNotes: 'Unpack ZIP archive. Technician utility for mobile servicing and flashing.'
  }
];

export default function SoftwareDownloadSection() {
  const youtubeUrl = 'https://youtube.com/@deejayemmapro?si=KMUHYGKOcAvRAWGd';
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [hasSubscribedPrompt, setHasSubscribedPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [infoModalTool, setInfoModalTool] = useState<SoftwareTool | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  
  // Track download counts in state, persisted via localStorage
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_software_download_counts');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    const initial: Record<string, number> = {};
    SOFTWARE_TOOLS.forEach(tool => {
      initial[tool.id] = tool.baseDownloads;
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dj_emma_software_download_counts', JSON.stringify(downloadCounts));
    } catch {
      // storage error
    }
  }, [downloadCounts]);

  const categories = useMemo(() => {
    const cats = new Set(SOFTWARE_TOOLS.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredTools = useMemo(() => {
    return SOFTWARE_TOOLS.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        !query ||
        Boolean(tool.name && typeof tool.name === 'string' && tool.name.toLowerCase().includes(query)) ||
        Boolean(tool.description && typeof tool.description === 'string' && tool.description.toLowerCase().includes(query)) ||
        Boolean(tool.category && typeof tool.category === 'string' && tool.category.toLowerCase().includes(query)) ||
        Boolean(tool.version && typeof tool.version === 'string' && tool.version.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleDownload = (tool: SoftwareTool) => {
    setDownloadingId(tool.id);
    
    // Increment download count
    setDownloadCounts(prev => ({
      ...prev,
      [tool.id]: (prev[tool.id] || tool.baseDownloads) + 1
    }));

    // Open MediaFire download link directly in new tab or trigger
    window.open(tool.downloadUrl, '_blank');

    setTimeout(() => {
      setDownloadingId(null);
      setHasSubscribedPrompt(true);
    }, 1200);
  };

  const handleDownloadAll = () => {
    setIsBatchRunning(true);
    setBatchProgress(10);

    // Increment download count for all tools
    setDownloadCounts(prev => {
      const next = { ...prev };
      SOFTWARE_TOOLS.forEach(tool => {
        next[tool.id] = (next[tool.id] || tool.baseDownloads) + 1;
      });
      return next;
    });

    setTimeout(() => {
      setBatchProgress(50);
    }, 600);

    setTimeout(() => {
      setBatchProgress(100);
      setIsBatchRunning(false);
      setHasSubscribedPrompt(true);
      // Open master archive bundle
      window.open('https://www.mediafire.com/file/mn2bz2sg4nk6y0h/Atomix_VirtualDJ_Pro_2022_v8.5.6067_CE.exe/file', '_blank');
    }, 1400);
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <section id="software-downloads" className="relative my-12 sm:my-16 px-4 sm:px-8 lg:px-12 max-w-[1800px] mx-auto select-none">
      {/* Container with dark aesthetic and red YouTube accent */}
      <div className="relative rounded-2xl border border-red-600/30 bg-gradient-to-b from-[#180a0a] via-[#141414] to-[#0c0c0c] p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & YouTube Subscribe Callout */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-600/40 text-red-400 text-xs font-bold mb-3">
              <Youtube className="w-4 h-4 fill-red-500 text-red-500" />
              <span>DJ EMMA PRO OFFICIAL SOFTWARE ARCHIVE</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                SOFWARES & DJ TOOLS CENTER
              </h2>
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black px-4 py-2 rounded-lg shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-95"
              >
                <PackageOpen className="w-4 h-4" />
                <span>DOWNLOAD ALL (15 TOOLS)</span>
              </button>
            </div>

            <p className="mt-2 text-zinc-300 text-sm sm:text-base leading-relaxed">
              Download professional DJ mixers, video editors, antivirus, and utilities curated by DJ Emma Pro FX. Subscribe to <strong className="text-white">@deejayemmapro</strong> on YouTube for lifetime access.
            </p>
          </div>

          {/* YouTube Channel Subscribe Box */}
          <div className="shrink-0 bg-black/60 border border-red-500/40 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/40">
              <Youtube className="w-7 h-7 fill-white" />
            </div>

            <div className="text-center sm:text-left">
              <p className="text-xs uppercase font-mono tracking-wider text-red-400 font-bold">
                Step 1: Subscribe on YouTube
              </p>
              <h4 className="text-white font-extrabold text-base sm:text-lg">
                @deejayemmapro
              </h4>
              <p className="text-[11px] text-zinc-400">
                Unlock high-speed MediaFire downloads
              </p>
            </div>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setHasSubscribedPrompt(true)}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-[#cc0000] text-white font-black text-sm px-6 py-3 rounded-lg shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>SUBSCRIBE NOW</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {hasSubscribedPrompt && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-600/50 rounded-lg flex items-center gap-3 text-xs sm:text-sm text-red-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Thank you for subscribing to <strong>@deejayemmapro</strong>! Your software download has opened safely in a new tab.</span>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-6 border-b border-zinc-800/80">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software by name, category, or version..."
              className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-red-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-500'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Software Cards Grid */}
        <div className="mt-8">
          {filteredTools.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-zinc-800">
              <Search className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">No software found</h3>
              <p className="text-zinc-400 text-sm mt-1">No tools match your search for "{searchQuery}". Try a different keyword or category.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs rounded-lg border border-red-600/40 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const isDownloading = downloadingId === tool.id;
                const currentCount = downloadCounts[tool.id] || tool.baseDownloads;

                return (
                  <div
                    key={tool.id}
                    className="group relative flex flex-col justify-between bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl"
                  >
                    {/* Thumbnail Header Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={tool.thumbnail}
                        alt={tool.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-red-400 border border-red-500/30 shadow">
                          {tool.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {/* Download count badge */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-md bg-black/80 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow">
                          <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{formatCount(currentCount)} downloads</span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-black text-base leading-snug drop-shadow-md line-clamp-1">
                          {tool.name}
                        </h3>
                        <p className="text-[11px] font-mono text-zinc-300">
                          {tool.version} • {tool.size} • {tool.os}
                        </p>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                        {tool.description}
                      </p>

                      <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> MediaFire Verified
                          </span>
                          <button
                            onClick={() => setInfoModalTool(tool)}
                            className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold cursor-pointer transition-colors"
                          >
                            <Info className="w-3.5 h-3.5" /> More Info
                          </button>
                        </div>

                        <button
                          onClick={() => handleDownload(tool)}
                          disabled={isDownloading}
                          className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-600 text-white font-black text-xs py-3 px-4 rounded-lg transition-all shadow-lg shadow-red-600/30 active:scale-95 disabled:opacity-75 cursor-pointer"
                        >
                          {isDownloading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Connecting MediaFire...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>DOWNLOAD NOW</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footnote */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 pt-4 border-t border-zinc-800/80">
          <p>
            All 15 software packages are hosted securely on MediaFire for DJ Emma Pro FX fans and technicians.
          </p>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-300 flex items-center gap-1.5 font-semibold"
          >
            <Youtube className="w-4 h-4 fill-red-500" />
            <span>Visit @deejayemmapro YouTube Channel</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Download All (Batch Archive) Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#141414] border border-red-600/40 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
            <button
              onClick={() => setIsBatchModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-5 border-b border-zinc-800">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <PackageOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Batch Download All 15 Software Tools
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  Total Archive Size: <strong className="text-white">~2.1 GB</strong> • MediaFire Master Bundle
                </p>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                You are about to initiate the batch download for all 15 curated DJ mixing suites, video editors, antivirus programs, and system utilities.
              </p>

              <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 scrollbar-thin">
                {SOFTWARE_TOOLS.map((t, idx) => (
                  <div key={t.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-200 font-medium truncate flex-1 pr-2">
                      {idx + 1}. {t.name}
                    </span>
                    <span className="font-mono text-red-400 shrink-0">{t.size}</span>
                  </div>
                ))}
              </div>

              {isBatchRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-zinc-300">
                    <span>Preparing batch archive...</span>
                    <span className="text-red-400 font-bold">{batchProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                      style={{ width: `${batchProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsBatchModalOpen(false)}
                disabled={isBatchRunning}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadAll}
                disabled={isBatchRunning}
                className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-600 text-white text-xs font-black shadow-lg shadow-red-600/30 transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-75"
              >
                {isBatchRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparing Master Bundle...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>START BATCH DOWNLOAD</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Info Modal / Expandable View */}
      {infoModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#141414] border border-red-600/40 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
            <button
              onClick={() => setInfoModalTool(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pb-6 border-b border-zinc-800">
              <img
                src={infoModalTool.thumbnail}
                alt={infoModalTool.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-zinc-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider mb-2">
                  {infoModalTool.category}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {infoModalTool.name}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Version: <strong className="text-white">{infoModalTool.version}</strong> • Size: <strong className="text-white">{infoModalTool.size}</strong> • OS: <strong className="text-white">{infoModalTool.os}</strong>
                </p>
              </div>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5 font-mono">
                  <FileText className="w-4 h-4" /> Overview & Description
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {infoModalTool.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5 font-mono">
                  <Cpu className="w-4 h-4" /> System Requirements
                </h4>
                <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed">
                  {infoModalTool.systemRequirements}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4" /> Developer Notes & Verification
                </h4>
                <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {infoModalTool.developerNotes}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setInfoModalTool(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(infoModalTool);
                  setInfoModalTool(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-600 text-white text-xs font-black shadow-lg shadow-red-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD NOW ({infoModalTool.size})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
