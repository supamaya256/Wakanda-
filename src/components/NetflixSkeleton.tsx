import { Flame } from 'lucide-react';

/**
 * Netflix Billboard Skeleton
 * Perfectly matches dimensions and gradient overlays of the live Billboard to prevent layout shifts.
 */
export function BillboardSkeleton() {
  return (
    <section 
      aria-label="Loading featured presentation" 
      className="relative w-full min-h-[82vh] lg:min-h-[92vh] flex items-center bg-[#141414] overflow-hidden select-none animate-shimmer"
    >
      {/* Background Dim Placeholder */}
      <div className="absolute inset-0 bg-[#161616]">
        {/* Shimmering subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#111111] via-[#1a1a1a] to-[#141414]" />
        
        {/* Netflix Multi-direction Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/85 to-transparent w-full lg:w-3/4" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
      </div>

      {/* Billboard Content Skeleton */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl lg:max-w-3xl space-y-4">
          {/* Netflix Series Tag Skeleton */}
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-7 rounded-[2px] bg-red-900/60 animate-pulse flex items-center justify-center font-black text-white/40 text-xs">
              N
            </div>
            <div className="h-4 w-44 rounded bg-zinc-800/80 animate-pulse" />
          </div>

          {/* Massive Display Title Skeletons */}
          <div className="space-y-3 pt-1">
            <div className="h-12 sm:h-16 lg:h-20 w-11/12 max-w-xl rounded-lg bg-zinc-800/90 animate-pulse" />
            <div className="h-10 sm:h-14 lg:h-16 w-3/4 max-w-md rounded-lg bg-zinc-800/70 animate-pulse" />
          </div>

          {/* Badges & Match Indicators */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <div className="flex items-center gap-1.5 bg-red-950/70 text-red-400 px-2.5 py-1 rounded text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>#1 IN MIXES TODAY</span>
            </div>
            <div className="h-5 w-24 rounded bg-emerald-950/60 animate-pulse" />
            <div className="h-5 w-12 rounded bg-zinc-800/80 animate-pulse" />
            <div className="h-5 w-14 rounded bg-zinc-800/80 animate-pulse border border-zinc-700/40" />
            <div className="h-5 w-24 rounded bg-zinc-800/80 animate-pulse border border-zinc-700/40 hidden sm:block" />
          </div>

          {/* Description Lines */}
          <div className="space-y-2 pt-2 max-w-xl">
            <div className="h-4 w-full rounded bg-zinc-800/60 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-zinc-800/50 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-zinc-800/40 animate-pulse" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="h-11 sm:h-12 w-32 sm:w-36 rounded bg-zinc-200/90 animate-pulse flex items-center justify-center gap-2" />
            <div className="h-11 sm:h-12 w-36 sm:w-40 rounded bg-zinc-800/80 animate-pulse" />
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-800/80 animate-pulse ml-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Track Card Skeleton
 */
export function CardSkeleton() {
  return (
    <div className="flex-none w-[260px] sm:w-[320px] lg:w-[360px] bg-[#181818] rounded-md overflow-hidden border border-white/5 min-h-[280px] animate-shimmer">
      {/* 16:9 Thumbnail Image Placeholder */}
      <div className="relative aspect-video w-full bg-zinc-850/80 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center">
          <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-zinc-700 border-b-6 border-b-transparent ml-0.5" />
        </div>
        <div className="absolute top-2 right-2 h-4 w-12 rounded bg-black/60" />
      </div>

      {/* Card Info Body */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Title & Duration */}
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-3/4 rounded bg-zinc-800/90 animate-pulse" />
          <div className="h-3.5 w-12 rounded bg-zinc-800/60 animate-pulse shrink-0" />
        </div>

        {/* Subtitle / Artist */}
        <div className="h-3 w-1/2 rounded bg-zinc-800/60 animate-pulse" />

        {/* Match score & tags */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-3.5 w-16 rounded bg-zinc-800/80 animate-pulse" />
          <div className="h-3.5 w-10 rounded bg-zinc-800/60 animate-pulse" />
          <div className="h-3.5 w-14 rounded bg-zinc-800/50 animate-pulse" />
        </div>

        {/* Action button circles */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-zinc-800/80 animate-pulse" />
            <div className="w-7 h-7 rounded-full bg-zinc-800/80 animate-pulse" />
            <div className="w-7 h-7 rounded-full bg-zinc-800/80 animate-pulse" />
          </div>
          <div className="w-7 h-7 rounded-full bg-zinc-800/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Standard Netflix Row Skeleton
 */
export function RowSkeleton({ 
  title = "Loading Mixes...", 
  subtitle,
  cardCount = 5 
}: { 
  title?: string; 
  subtitle?: string; 
  cardCount?: number; 
}) {
  return (
    <section className="relative my-6 lg:my-10 px-4 sm:px-8 lg:px-12 select-none">
      {/* Row Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-6 sm:h-7 w-48 sm:w-64 rounded bg-zinc-800/90 animate-pulse" />
            <div className="h-4 w-16 rounded bg-red-950/40 animate-pulse hidden sm:block" />
          </div>
          {subtitle && (
            <div className="h-3.5 w-36 rounded bg-zinc-800/50 animate-pulse" />
          )}
        </div>
      </div>

      {/* Cards Row Container */}
      <div className="flex gap-3 sm:gap-4 overflow-x-hidden py-2">
        {Array.from({ length: cardCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * Top 10 Today Row Skeleton
 */
export function Top10RowSkeleton() {
  return (
    <section className="relative my-6 lg:my-10 px-4 sm:px-8 lg:px-12 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-red-950/70 text-red-400 px-2 py-0.5 rounded text-xs font-black animate-pulse">
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span>TOP 10</span>
        </div>
        <div className="h-6 sm:h-7 w-56 rounded bg-zinc-800/90 animate-pulse" />
      </div>

      {/* Numbered Cards Horizontal Row */}
      <div className="flex gap-4 sm:gap-6 overflow-x-hidden py-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex-none flex items-center group relative animate-shimmer">
            {/* Massive Rank Number Silhouette */}
            <span className="font-bebas text-7xl sm:text-8xl lg:text-9xl font-black text-zinc-800/60 select-none -mr-4 sm:-mr-6 z-0">
              {num}
            </span>

            {/* Poster Card Skeleton */}
            <div className="relative z-10 w-[140px] sm:w-[170px] lg:w-[190px] h-[200px] sm:h-[240px] lg:h-[270px] bg-[#181818] rounded-md border border-white/5 overflow-hidden flex flex-col justify-between p-2.5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-10 rounded bg-red-950/60 animate-pulse" />
                <div className="h-3 w-8 rounded bg-zinc-800/80 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-5/6 rounded bg-zinc-800/90 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-zinc-800/60 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * DJ Voice Drops Row Skeleton
 */
export function VoiceDropsRowSkeleton() {
  return (
    <section className="relative my-6 lg:my-10 px-4 sm:px-8 lg:px-12 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-60 rounded bg-zinc-800/90 animate-pulse" />
            <div className="h-5 w-20 rounded bg-red-950/60 animate-pulse" />
          </div>
          <div className="h-3.5 w-44 rounded bg-zinc-800/50 animate-pulse" />
        </div>
      </div>

      {/* Voice Drop Cards Skeleton Grid / Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div 
            key={i} 
            className="bg-[#181818] border border-zinc-800/70 rounded-lg p-3 sm:p-4 flex items-center gap-3 animate-shimmer"
          >
            {/* Play Circle Skeleton */}
            <div className="w-10 h-10 rounded-full bg-zinc-800/90 animate-pulse shrink-0 flex items-center justify-center" />
            
            {/* Tag / Text Lines & Equalizer Skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 w-3/4 rounded bg-zinc-800/90 animate-pulse" />
              <div className="flex items-center gap-1 h-3">
                {[12, 18, 8, 22, 14, 16, 10, 20].map((h, idx) => (
                  <div 
                    key={idx} 
                    style={{ height: `${h}px` }} 
                    className="w-1 bg-zinc-700/60 rounded-full animate-pulse" 
                  />
                ))}
              </div>
            </div>

            {/* Order Button Skeleton */}
            <div className="h-8 w-16 rounded bg-zinc-800/80 animate-pulse shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 3D Logos Row Skeleton
 */
export function LogosRowSkeleton() {
  return (
    <section className="relative my-6 lg:my-10 px-4 sm:px-8 lg:px-12 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-64 rounded bg-zinc-800/90 animate-pulse" />
            <div className="h-5 w-28 rounded bg-emerald-950/60 animate-pulse" />
          </div>
          <div className="h-3.5 w-52 rounded bg-zinc-800/50 animate-pulse" />
        </div>
      </div>

      {/* 3D Video Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="bg-[#181818] border border-white/5 rounded-lg overflow-hidden animate-shimmer"
          >
            <div className="aspect-video w-full bg-zinc-850/80 flex items-center justify-center relative">
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center" />
              <div className="absolute top-2 left-2 h-4 w-16 rounded bg-red-950/80" />
              <div className="absolute bottom-2 right-2 h-4 w-20 rounded bg-emerald-950/80" />
            </div>
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 rounded bg-zinc-800/90 animate-pulse" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-7 w-20 rounded bg-zinc-800/80 animate-pulse" />
                <div className="h-7 w-24 rounded bg-emerald-900/60 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Ateso Movies Row Skeleton
 */
export function AtesoMoviesRowSkeleton() {
  return (
    <section className="relative my-6 px-4 sm:px-8 lg:px-12 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-64 rounded bg-zinc-800/90 animate-pulse" />
          <div className="h-5 w-24 rounded bg-red-950/60 animate-pulse" />
        </div>
        <div className="h-5 w-20 rounded bg-zinc-800/80 animate-pulse" />
      </div>

      {/* Movie Cards Row */}
      <div className="flex gap-3 sm:gap-4 overflow-x-hidden py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className="flex-none w-[200px] sm:w-[240px] lg:w-[260px] bg-[#181818] rounded-md border border-white/5 overflow-hidden animate-shimmer"
          >
            <div className="aspect-[3/4] w-full bg-zinc-850/80 flex items-center justify-center relative">
              <div className="w-11 h-11 rounded-full bg-zinc-800/80 flex items-center justify-center" />
              <div className="absolute top-2 left-2 h-4 w-12 rounded bg-black/60" />
            </div>
            <div className="p-3 space-y-2">
              <div className="h-4 w-4/5 rounded bg-zinc-800/90 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-zinc-800/60 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
