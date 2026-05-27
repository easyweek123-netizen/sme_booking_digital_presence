import { useEffect, useState } from 'react';

interface UseScrollSpyOptions {
  sectionIds: readonly string[];
  /** Distance from viewport top (in px) where a section becomes "active". */
  offset?: number;
  /** Window scrollY threshold for `scrolled` state. */
  scrolledThreshold?: number;
}

export function useScrollSpy({
  sectionIds,
  offset = 96,
  scrolledThreshold = 240,
}: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '');
  const [scrolled, setScrolled] = useState(false);

  // Scroll position (for the sticky-header reveal)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > scrolledThreshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolledThreshold]);

  // Active-section tracking via IntersectionObserver
  useEffect(() => {
    const ids = sectionIds.filter(Boolean);
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // Track which sections are currently above the activation line.
    const inView = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target.id);
          else inView.delete(entry.target.id);
        }
        // Pick the LAST id from sectionIds order that's in view (deepest scrolled).
        for (let i = ids.length - 1; i >= 0; i--) {
          if (inView.has(ids[i])) {
            setActiveId(ids[i]);
            return;
          }
        }
        // Fallback: first section if none are in the band
        setActiveId(ids[0]);
      },
      {
        // Activate when section top crosses `offset` from viewport top.
        // Negative bottom margin so only sections whose top is above the line count.
        rootMargin: `-${offset}px 0px -70% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, offset]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return { activeId, scrolled, scrollTo };
}
