import React, { useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface AutoScrollCarouselProps<T> {
  id?: string;
  items: T[];
  renderItem: (item: T, index: number, uniqueKey: string, isCenter?: boolean) => ReactNode;
  getItemKey: (item: T, index: number) => string | number;
  speed?: number; // Pixels per frame (default 0.6)
  resumeDelay?: number; // Milliseconds to wait before resuming auto-scroll (default 2500)
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
  ariaLabel?: string;
}

export default function AutoScrollCarousel<T>({
  id,
  items,
  renderItem,
  getItemKey,
  speed = 0.6,
  resumeDelay = 2500,
  className = '',
  itemClassName = '',
  showArrows = true,
  ariaLabel = 'Content carousel'
}: AutoScrollCarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // States
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(true);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeCenterKey, setActiveCenterKey] = useState<string | null>(null);
  const lastCenterCheckRef = useRef<number>(0);

  // Dragging coordinates
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const singleCycleWidthRef = useRef<number>(0);
  const isSetupDoneRef = useRef(false);

  // Repeat count: ensure enough duplicates for continuous infinite wrap
  const repeatCount = items.length < 4 ? 6 : items.length < 8 ? 4 : 3;

  // Flatten repeated items with unique keys
  const duplicatedItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    const list: { item: T; originalIndex: number; cycle: number; key: string }[] = [];
    for (let c = 0; c < repeatCount; c++) {
      items.forEach((item, idx) => {
        list.push({
          item,
          originalIndex: idx,
          cycle: c,
          key: `${getItemKey(item, idx)}-cycle-${c}`
        });
      });
    }
    return list;
  }, [items, repeatCount, getItemKey]);

  // Schedule auto-scroll resumption after user interaction
  const scheduleResume = useCallback((delay = resumeDelay) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      setIsPaused(false);
    }, delay);
  }, [resumeDelay]);

  // Pause immediate handler
  const pauseAutoScroll = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    setIsPaused(true);
    setIsUserInteracting(true);
  }, []);

  // Viewport intersection observer to avoid unnecessary animation offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { rootMargin: '150px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Measure single cycle width and initialize scroll to middle cycle
  const updateCycleWidth = useCallback(() => {
    const container = containerRef.current;
    if (!container || duplicatedItems.length === 0) return;

    // A single cycle is total scrollWidth divided by repeatCount
    const singleWidth = container.scrollWidth / repeatCount;
    singleCycleWidthRef.current = singleWidth;

    if (!isSetupDoneRef.current && singleWidth > 0) {
      // Start in the middle cycle so user can scroll left or right immediately
      container.scrollLeft = singleWidth;
      isSetupDoneRef.current = true;
    }
  }, [duplicatedItems.length, repeatCount]);

  useEffect(() => {
    // Initial measure after DOM renders
    const timer = setTimeout(updateCycleWidth, 100);
    window.addEventListener('resize', updateCycleWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateCycleWidth);
    };
  }, [updateCycleWidth]);

  // Seamless Infinite Looping check:
  // When scrollLeft goes past cycle 2, teleport back to cycle 1.
  // When scrollLeft goes before cycle 1, teleport forward to cycle 2.
  const handleSeamlessLoop = useCallback(() => {
    const container = containerRef.current;
    const cycleWidth = singleCycleWidthRef.current;
    if (!container || cycleWidth <= 0) return;

    const currentScroll = container.scrollLeft;

    // Past boundary on right: seamlessly wrap backwards by 1 cycle
    if (currentScroll >= cycleWidth * (repeatCount - 1)) {
      container.scrollLeft = currentScroll - cycleWidth;
    } 
    // Past boundary on left: seamlessly wrap forward by 1 cycle
    else if (currentScroll <= cycleWidth * 0.2) {
      container.scrollLeft = currentScroll + cycleWidth;
    }

    // Throttled center item detection for subtle prominence
    const now = performance.now();
    if (now - lastCenterCheckRef.current > 160) {
      lastCenterCheckRef.current = now;
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      const itemElements = container.querySelectorAll<HTMLElement>('[data-carousel-key]');
      let closestKey: string | null = null;
      let minDistance = Infinity;

      itemElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - itemCenterX);
        if (distance < minDistance) {
          minDistance = distance;
          closestKey = el.getAttribute('data-carousel-key');
        }
      });

      if (closestKey && closestKey !== activeCenterKey) {
        setActiveCenterKey(closestKey);
      }
    }
  }, [repeatCount, activeCenterKey]);

  // Animation Loop (60fps requestAnimationFrame)
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const container = containerRef.current;

      if (
        container &&
        !isPaused &&
        !isUserInteracting &&
        !isDragging &&
        isInViewport &&
        !document.hidden
      ) {
        // Delta time normalization (ensures smooth consistent speed on 60Hz, 120Hz, 144Hz displays)
        const elapsed = timestamp - lastTimestamp;
        if (elapsed > 0 && elapsed < 100) {
          const delta = (speed * (elapsed / 16.667));
          container.scrollLeft += delta;
          handleSeamlessLoop();
        }
      }

      lastTimestamp = timestamp;
      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPaused, isUserInteracting, isDragging, isInViewport, speed, handleSeamlessLoop]);

  // Desktop Mouse Drag Handling
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on left click and not on interactive buttons/links
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    pauseAutoScroll();
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = container.scrollLeft;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const container = containerRef.current;
      if (!container) return;

      const deltaX = e.clientX - dragStartXRef.current;
      if (Math.abs(deltaX) > 6) {
        hasMovedRef.current = true;
      }

      container.scrollLeft = dragStartScrollLeftRef.current - deltaX;
      handleSeamlessLoop();
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      scheduleResume(resumeDelay);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleSeamlessLoop, scheduleResume, resumeDelay]);

  // Click capture: if the user dragged significantly, prevent accidental card click
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasMovedRef.current = false;
    }
  };

  // Mobile Touch Handling
  const handleTouchStart = () => {
    pauseAutoScroll();
  };

  const handleTouchMove = () => {
    pauseAutoScroll();
    handleSeamlessLoop();
  };

  const handleTouchEnd = () => {
    scheduleResume(resumeDelay);
  };

  // Hover Handling
  const handleMouseEnter = () => {
    pauseAutoScroll();
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      scheduleResume(1500);
    }
  };

  // Navigation Arrows click handlers
  const handleArrowScroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    pauseAutoScroll();
    const scrollAmount = Math.max(container.clientWidth * 0.75, 320);
    const target = direction === 'left' ? -scrollAmount : scrollAmount;

    container.scrollBy({ left: target, behavior: 'smooth' });
    setTimeout(handleSeamlessLoop, 400);
    scheduleResume(3500);
  };

  if (!items || items.length === 0) return null;

  return (
    <div 
      id={id}
      className={`relative group/carousel select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
    >
      {/* Left Chevron Button */}
      {showArrows && (
        <button
          type="button"
          onClick={() => handleArrowScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-14 bg-gradient-to-r from-black/90 via-black/60 to-transparent hover:from-black text-white flex items-center justify-start pl-2 transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-[2px]"
          title="Slide Previous (or drag with mouse)"
          aria-label="Previous items"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-[#E50914] text-white flex items-center justify-center shadow-lg transition-transform border border-white/10 hover:border-[#E50914]">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>
      )}

      {/* Auto-Scrollable Horizontal Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onClickCapture={handleClickCapture}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleSeamlessLoop}
        className={`flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-3 px-1 sm:px-2 ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain'
        }}
      >
        <div ref={trackRef} className="flex items-stretch gap-3 sm:gap-4 flex-nowrap shrink-0 group-hover/carousel:gap-3 sm:group-hover/carousel:gap-4">
          {duplicatedItems.map(({ item, originalIndex, cycle, key }) => {
            const isCenter = key === activeCenterKey;
            return (
              <div 
                key={key} 
                data-carousel-key={key}
                className={`shrink-0 transition-all duration-300 ease-out ${
                  isCenter 
                    ? 'scale-[1.02] opacity-100 z-10' 
                    : 'opacity-90 hover:opacity-100 hover:scale-[1.03] hover:z-20'
                } ${itemClassName}`}
              >
                {renderItem(item, originalIndex, key, isCenter)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chevron Button */}
      {showArrows && (
        <button
          type="button"
          onClick={() => handleArrowScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-14 bg-gradient-to-l from-black/90 via-black/60 to-transparent hover:from-black text-white flex items-center justify-end pr-2 transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-[2px]"
          title="Slide Next (or drag with mouse)"
          aria-label="Next items"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-[#E50914] text-white flex items-center justify-center shadow-lg transition-transform border border-white/10 hover:border-[#E50914]">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>
      )}

      {/* Subtle indicator of auto-motion status (discreet pill on bottom-right hover) */}
      <div className="absolute -top-6 right-0 hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono opacity-0 group-hover/carousel:opacity-80 transition-opacity">
        <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
        <span>{isPaused ? 'Paused (drag or hover)' : 'Auto-sliding'}</span>
      </div>
    </div>
  );
}
