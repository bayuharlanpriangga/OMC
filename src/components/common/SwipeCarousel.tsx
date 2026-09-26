import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface SwipeCarouselProps {
  itemsCount: number;
  renderItem: (index: number) => React.ReactNode;
  /** How many items are visible per page at each breakpoint. */
  itemsPerView?: { xs: number; md: number };
  gap?: number;
  /** Max dot indicators shown before collapsing into a "+N" overflow badge. */
  maxDots?: number;
}

/**
 * Horizontal, touch-swipeable carousel with native scroll-snap (so it always
 * settles fully on a card, never a free/partial horizontal scroll) and a
 * dot-pagination indicator underneath instead of a visible scrollbar. When
 * there are more pages than `maxDots`, the hidden pages on either side
 * collapse into a "+N" counter that slides to whichever side the user has
 * scrolled past.
 */
export const SwipeCarousel: React.FC<SwipeCarouselProps> = ({
  itemsCount,
  renderItem,
  itemsPerView = { xs: 1, md: 2 },
  gap = 16,
  maxDots = 4,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const perView = Math.max(1, isDesktop ? itemsPerView.md : itemsPerView.xs);
  const totalPages = Math.max(1, Math.ceil(itemsCount / perView));

  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const isProgrammaticScroll = useRef(false);

  const scrollToPage = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(totalPages - 1, index));
      isProgrammaticScroll.current = true;
      el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
      setPage(clamped);
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 450);
    },
    [totalPages]
  );

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || isProgrammaticScroll.current) return;
    const width = el.clientWidth || 1;
    const newPage = Math.max(0, Math.min(totalPages - 1, Math.round(el.scrollLeft / width)));
    setPage((prev) => (prev === newPage ? prev : newPage));
  }, [totalPages]);

  // Don't strand the view on a page that no longer exists after the item
  // count or breakpoint (itemsPerView) changes.
  useEffect(() => {
    setPage(0);
    const el = containerRef.current;
    if (el) el.scrollTo({ left: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsCount, perView]);

  // Windowed pagination: at most `maxDots` slots. Overflow on either side
  // collapses into a "+N" badge, which slides across as `page` changes.
  let windowStart = 0;
  let windowEnd = totalPages - 1;
  let leftOverflow = 0;
  let rightOverflow = 0;

  if (totalPages > maxDots) {
    const hasLeft = page > 0;
    const hasRight = page < totalPages - 1;
    let slots = maxDots - (hasLeft ? 1 : 0) - (hasRight ? 1 : 0);
    slots = Math.max(slots, 1);
    windowStart = Math.max(0, page - Math.floor((slots - 1) / 2));
    windowEnd = windowStart + slots - 1;
    if (windowEnd > totalPages - 1) {
      windowEnd = totalPages - 1;
      windowStart = Math.max(0, windowEnd - slots + 1);
    }
    leftOverflow = windowStart;
    rightOverflow = totalPages - 1 - windowEnd;
  }

  return (
    <Box>
      <Box
        ref={containerRef}
        onScroll={handleScroll}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          gap: `${gap}px`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {Array.from({ length: itemsCount }).map((_, i) => (
          <Box
            key={i}
            sx={{
              flex: `0 0 calc(${100 / perView}% - ${(gap * (perView - 1)) / perView}px)`,
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          >
            {renderItem(i)}
          </Box>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.75, mt: 2 }}>
          {leftOverflow > 0 && (
            <Box
              onClick={() => scrollToPage(windowStart - 1)}
              sx={{
                cursor: 'pointer',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: '#94A3B8',
                px: 0.5,
                minWidth: 20,
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              +{leftOverflow}
            </Box>
          )}
          {Array.from({ length: windowEnd - windowStart + 1 }).map((_, i) => {
            const pageIndex = windowStart + i;
            const active = pageIndex === page;
            return (
              <Box
                key={pageIndex}
                onClick={() => scrollToPage(pageIndex)}
                sx={{
                  width: active ? 18 : 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: active ? '#E0C99A' : '#3A3A3A',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            );
          })}
          {rightOverflow > 0 && (
            <Box
              onClick={() => scrollToPage(windowEnd + 1)}
              sx={{
                cursor: 'pointer',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: '#94A3B8',
                px: 0.5,
                minWidth: 20,
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              +{rightOverflow}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
