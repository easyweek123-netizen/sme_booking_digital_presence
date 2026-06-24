import { useMemo } from 'react';
import type { BusinessWithServices } from '../../../types';
import { businessAddressLocation, findBusinessLocation } from '../utils/locationLookup';
import type { SectionTab } from '../SectionTabs';

function hasMeaningfulAbout(html: string | null | undefined): boolean {
  if ((!html || html === '<p></p>') && (html?.length ?? 0) <= 0) return false;
  return true;
}

const TABS: readonly SectionTab[] = [
    { id: 'section-services', label: 'Services' },
    { id: 'section-about', label: 'About' },
    { id: 'section-contact', label: 'Contact' },
    { id: 'section-hours', label: 'Opening hours' },
  ];
export function useBookingPageSections(business: BusinessWithServices) {
  const hasServices = (business.services?.length ?? 0) > 0;
  const hasAbout = hasMeaningfulAbout(business.aboutContent);
  const hasContact =
    !!businessAddressLocation(business) ||
    !!findBusinessLocation(business, 'PHONE') ||
    !!findBusinessLocation(business, 'ONLINE');
  const hasHours = !!business.showWeeklyHours;

  const tabs = useMemo<SectionTab[]>(() => {
    const list: SectionTab[] = [];
    if (hasServices) 
        list.push(TABS[0]);
    if (hasAbout) 
        list.push(TABS[1]);
    if (hasContact) 
        list.push(TABS[2]);
    if (hasHours) 
        list.push(TABS[3]);
    return list;
  }, [hasServices, hasAbout, hasContact, hasHours]);

  const sectionIds = useMemo(() => tabs.map((t) => t.id), [tabs]);

  return {
    tabs,
    sectionIds,
    hasServices,
    hasAbout,
    hasContact,
    hasHours,
  };
}