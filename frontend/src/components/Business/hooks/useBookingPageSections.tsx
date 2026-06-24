import { useCallback, useMemo, useRef } from 'react';
import type { RefCallback } from 'react';
import type { BusinessWithServices } from '../../../types';
import { businessAddressLocation, findBusinessLocation } from '../utils/locationLookup';
import type { SectionTab } from '../SectionTabs';

function hasMeaningfulAbout(html: string | null | undefined): boolean {
  if ((!html || html === '<p></p>') && (html?.length ?? 0) <= 0) return false;
  return true;
}
function hasContactInfo(b: BusinessWithServices): boolean {
  return (
    !!businessAddressLocation(b) ||
    !!findBusinessLocation(b, 'PHONE') ||
    !!findBusinessLocation(b, 'ONLINE')
  );
}

// Single source of truth for section ids, labels, and presence test (display order).
const SECTION_DEFS = [
  { id: 'section-services', label: 'Services',      present: (b: BusinessWithServices) => (b.services?.length ?? 0) > 0 },
  { id: 'section-about',    label: 'About',         present: (b: BusinessWithServices) => hasMeaningfulAbout(b.aboutContent) },
  { id: 'section-contact',  label: 'Contact',       present: hasContactInfo },
  { id: 'section-hours',    label: 'Opening hours', present: (b: BusinessWithServices) => !!b.showWeeklyHours },
] as const;

export type SectionId = (typeof SECTION_DEFS)[number]['id'];
export interface SectionModel { id: SectionId; label: string; present: boolean; }

interface Options {
  /** Smooth-scroll a section into view the first time it appears (canvas only). */
  autoScrollOnAppear?: boolean;
}

export function useBookingPageSections(
  business: BusinessWithServices | undefined | null,
  { autoScrollOnAppear = false }: Options = {},
) {
  if (!business) return { sections: [], tabs: [], registerSection: () => undefined };

  const sections: SectionModel[] = SECTION_DEFS.map((s) => ({
    id: s.id,
    label: s.label,
    present: s.present(business),
  }));

  const tabs = useMemo<SectionTab[]>(
    () => sections.filter((s) => s.present).map(({ id, label }) => ({ id, label })),
    // presence is derived from `business`; recompute when it changes
    [business],
  );

  const seenRef = useRef<Set<SectionId> | null>(null);
  if (seenRef.current === null) {
    // Seed with sections already present on first render so they don't scroll.
    seenRef.current = new Set(sections.filter((s) => s.present).map((s) => s.id));
  }

  // Stable callback refs (identity must not change between renders, so they only
  // fire on actual mount/unmount — i.e. when a section appears/disappears).
  const refs = useMemo<Record<SectionId, RefCallback<HTMLElement>>>(() => {
    const make = (id: SectionId): RefCallback<HTMLElement> => (node) => {
      if (!node || seenRef.current!.has(id)) return; // unmount, or already seen
      seenRef.current!.add(id);
      const behavior: ScrollBehavior =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      requestAnimationFrame(() => node.scrollIntoView({ behavior, block: 'start' }));
    };
    return {
      'section-services': make('section-services'),
      'section-about': make('section-about'),
      'section-contact': make('section-contact'),
      'section-hours': make('section-hours'),
    };
  }, []);

  const registerSection = useCallback(
    (id: SectionId): RefCallback<HTMLElement> | undefined =>
      autoScrollOnAppear ? refs[id] : undefined,
    [autoScrollOnAppear, refs],
  );

  return { sections, tabs, registerSection };
}