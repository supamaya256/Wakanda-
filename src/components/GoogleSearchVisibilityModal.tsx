/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
  Globe,
  Star,
  Copy,
  Check,
  Film,
  Zap,
  Mic,
  Share2,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface GoogleSearchVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function GoogleSearchVisibilityModal({
  isOpen,
  onClose,
  initialQuery = 'DJ EMMA PRO'
}: GoogleSearchVisibilityModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'quick-search' | 'tools'>('preview');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://djemmapro.com';

  const quickSearches = [
    {
      title: 'DJ EMMA PRO',
      category: 'Brand Search',
      query: 'DJ EMMA PRO',
      description: 'Official artist brand, studio catalog & nonstop broadcasts',
      icon: Sparkles,
      iconColor: 'text-amber-400'
    },
    {
      title: 'Electric Shockwave 3D Logo Reveal',
      category: '3D Animations',
      query: 'Electric Shockwave 3D Logo Reveal DJ Emma',
      description: 'Find the #1 featured 3D motion logo reveal animation',
      icon: Zap,
      iconColor: 'text-cyan-400'
    },
    {
      title: 'DJ Emma Voice Drops Uganda',
      category: 'Audio Production',
      query: 'DJ Emma Voice Drops Uganda',
      description: 'Search professional custom DJ drops & studio name tags',
      icon: Mic,
      iconColor: 'text-red-400'
    },
    {
      title: 'DJ Emma Ateso Movies Poison Break',
      category: 'Movie Cinema',
      query: 'DJ Emma Ateso Movies Poison Break',
      description: 'Search exclusive Ateso translated action movie series',
      icon: Film,
      iconColor: 'text-emerald-400'
    },
    {
      title: 'Site Indexing on Google',
      category: 'Google Index',
      query: `site:djemmapro.com OR "DJ EMMA PRO"`,
      description: 'Verify all pages currently indexed by Googlebot',
      icon: Globe,
      iconColor: 'text-blue-400'
    }
  ];

  const handleOpenGoogle = (customQ?: string, type: 'web' | 'images' | 'videos' = 'web') => {
    const q = encodeURIComponent(customQ || searchQuery || 'DJ EMMA PRO');
    let googleUrl = `https://www.google.com/search?q=${q}`;
    if (type === 'images') googleUrl = `https://www.google.com/search?tbm=isch&q=${q}`;
    if (type === 'videos') googleUrl = `https://www.google.com/search?tbm=vid&q=${q}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyGoogleLink = (q?: string) => {
    const queryToCopy = q || searchQuery || 'DJ EMMA PRO';
    const link = `https://www.google.com/search?q=${encodeURIComponent(queryToCopy)}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#141419] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Top Bar with Google Branding */}
          <div className="p-4 sm:p-5 bg-[#181820] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Google 4-color 'G' icon */}
              <div className="w-10 h-10 rounded-xl bg-white p-2 flex items-center justify-center shadow-md shrink-0">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Google Search & Visibility
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SEO Indexed
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Search Google for any item on this website or check live indexing snippets
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Query Input Bar */}
          <div className="p-4 bg-[#101016] border-b border-white/5">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type anything to check on Google Search (e.g., Electric Shockwave, DJ Emma)..."
                  className="w-full bg-[#181822] border border-white/15 focus:border-[#4285F4] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 transition-all shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenGoogle();
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleOpenGoogle()}
                className="px-4 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-blue-900/40 cursor-pointer shrink-0"
              >
                <span>Search Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-actions for query */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-[11px]">Direct search:</span>
                <button
                  type="button"
                  onClick={() => handleOpenGoogle(searchQuery, 'web')}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-[11px] cursor-pointer"
                >
                  All Web
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenGoogle(searchQuery, 'videos')}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-[11px] cursor-pointer"
                >
                  Videos
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenGoogle(searchQuery, 'images')}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-[11px] cursor-pointer"
                >
                  Images
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopyGoogleLink()}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Google Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center px-4 pt-3 border-b border-white/5 gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-[#4285F4] text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Google Result Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quick-search')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'quick-search'
                  ? 'border-[#4285F4] text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Popular Website Searches
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'tools'
                  ? 'border-[#4285F4] text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Webmaster & Rich Test Tools
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {activeTab === 'preview' && (
              <div className="space-y-4">
                {/* Simulated Google Search Result Snippet Card */}
                <div className="bg-[#1b1b22] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Google Search Live Snippet
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Schema.org Sitelinks Active
                    </span>
                  </div>

                  {/* Google Result URL Breadcrumbs */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[9px] font-bold text-white">
                      E
                    </div>
                    <div className="text-xs text-zinc-300 font-mono">
                      <span>djemmapro.com</span>
                      <span className="text-zinc-500 mx-1">›</span>
                      <span className="text-zinc-400">3d-logos</span>
                      <span className="text-zinc-500 mx-1">›</span>
                      <span className="text-blue-400">electric-shockwave</span>
                    </div>
                  </div>

                  {/* Clickable Blue Google Title */}
                  <h4 
                    onClick={() => handleOpenGoogle()}
                    className="text-base sm:text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug"
                  >
                    DJ EMMA PRO | Professional DJ Drops, 3D Logo Reveal & Ateso Movies
                  </h4>

                  {/* Rating / Rich Snippet Details */}
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="ml-1 text-white font-bold">4.9</span>
                    </div>
                    <span>(1,840 reviews)</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium">UGX 10,000 – 50,000</span>
                    <span>·</span>
                    <span className="text-zinc-300">In Stock</span>
                  </div>

                  {/* Meta Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                    Official DJ EMMA PRO studio. Order custom DJ voice drops, download 3D logo reveal animations including Electric Shockwave, and watch exclusive Ateso translated action movies.
                  </p>

                  {/* Google Sitelinks Grid (High Visibility) */}
                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div 
                      onClick={() => handleOpenGoogle('Electric Shockwave 3D Logo Reveal DJ Emma')}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-blue-500/40 cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-[#8ab4f8] hover:underline flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>Electric Shockwave 3D Logo</span>
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        High-voltage 360p 3D logo reveal animations
                      </p>
                    </div>

                    <div 
                      onClick={() => handleOpenGoogle('DJ Emma Voice Drops Uganda')}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-blue-500/40 cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-[#8ab4f8] hover:underline flex items-center gap-1.5">
                        <Mic className="w-3 h-3 text-red-400" />
                        <span>Custom DJ Voice Drops</span>
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Order personalized club hype tags and DJ drops
                      </p>
                    </div>

                    <div 
                      onClick={() => handleOpenGoogle('DJ Emma Ateso Movies Poison Break')}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-blue-500/40 cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-[#8ab4f8] hover:underline flex items-center gap-1.5">
                        <Film className="w-3 h-3 text-emerald-400" />
                        <span>Ateso Movies (Poison Break)</span>
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Watch exclusive translated action films and series
                      </p>
                    </div>

                    <div 
                      onClick={() => handleOpenGoogle('DJ Emma Pro FX Official Studio')}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-blue-500/40 cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-[#8ab4f8] hover:underline flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>WhatsApp Studio VIP</span>
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Direct 24/7 client booking and custom production
                      </p>
                    </div>
                  </div>
                </div>

                {/* How Google Indexing Works for This Site */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#111116] border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Schema.org JSON-LD</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Structured schemas embedded for WebSite, SearchAction, EntertainmentBusiness, and ItemList.
                    </p>
                  </div>

                  <div className="p-3 bg-[#111116] border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Open Indexing</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Robots meta directives allow Googlebot full crawling, rich snippets, and large previews.
                    </p>
                  </div>

                  <div className="p-3 bg-[#111116] border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Social Cards</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      OpenGraph & Twitter cards with official 1200x630 master studio artwork configured.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quick-search' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">
                  Click any query below to test how it opens and displays on Google Search:
                </p>

                <div className="space-y-2.5">
                  {quickSearches.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleOpenGoogle(item.query)}
                        className="group p-3.5 rounded-xl bg-[#181822] hover:bg-[#1f1f2c] border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                            <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyGoogleLink(item.query);
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            title="Copy Google Search Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <div className="p-2 rounded-lg bg-[#4285F4]/20 text-[#4285F4] group-hover:bg-[#4285F4] group-hover:text-white transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Rich Results Test */}
                  <a
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#181822] hover:bg-[#1f1f2c] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Google Rich Results Test</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Validate Structured Data (JSON-LD)
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Inspect Schema.org rich snippets, breadcrumbs, search actions, and product ratings directly with Google's official testing engine.
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                      <span>Run Test on Google</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>

                  {/* Google Search Console */}
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#181822] hover:bg-[#1f1f2c] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Google Search Console</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        Inspect URL & Indexing Status
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Submit sitemap (`/sitemap.xml`), request re-indexing for new 3D logo reveals, and monitor search impressions and clicks.
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-semibold">
                      <span>Open Search Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                </div>

                {/* Sitemap & Robots Links */}
                <div className="p-4 rounded-xl bg-[#111116] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white block">Crawling & Robots Directives:</span>
                    <span className="text-zinc-400">
                      Sitemap: <a href="/sitemap.xml" target="_blank" className="text-blue-400 hover:underline">/sitemap.xml</a> | Robots: <a href="/robots.txt" target="_blank" className="text-blue-400 hover:underline">/robots.txt</a>
                    </span>
                  </div>

                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>View Sitemap XML</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 sm:p-4 bg-[#111116] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Full Googlebot Crawling & Sitelinks Search Enabled</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenGoogle('Electric Shockwave 3D Logo Reveal DJ Emma')}
                className="px-3 py-1.5 rounded-lg bg-[#4285F4]/20 hover:bg-[#4285F4]/30 text-blue-300 font-semibold transition-colors cursor-pointer"
              >
                Search "Electric Shockwave"
              </button>
              <button
                type="button"
                onClick={() => handleOpenGoogle()}
                className="px-3.5 py-1.5 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
