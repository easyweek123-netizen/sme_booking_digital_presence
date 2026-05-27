import { Box, Grid, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { BusinessWithServices, Service, ServiceCategory } from '../../types';
import { BrandProvider } from './brand';
import { BusinessHero } from './BusinessHero';
import { BusinessHeader } from './BusinessHeader';
import { BusinessTopNav } from './BusinessTopNav';
import { SectionTabs, type SectionTab } from './SectionTabs';
import { ServicesSection } from './sections/ServicesSection';
import { AboutSection } from './sections/AboutSection';
import { LocationSection } from './sections/LocationSection';
import { HoursSection } from './sections/HoursSection';
import { DesktopBookingCard } from './sections/DesktopBookingCard';
import { computeOpenStatus } from './utils';
import { useScrollSpy } from './hooks/useScrollSpy';

const TABS: readonly SectionTab[] = [
  { id: 'section-services', label: 'Services' },
  { id: 'section-about', label: 'About' },
  { id: 'section-location', label: 'Location' },
  { id: 'section-hours', label: 'Opening hours' },
];

interface BusinessBookingPageProps {
  business: BusinessWithServices;
  categories: ServiceCategory[];
  businessTypeName?: string;
  serviceVariant?: 'book' | 'preview';
  /** Required. The orchestrator decides what "desktop" means for its environment
   *  (viewport-driven for /book/:slug routes; canvas-pane-driven for previews). */
  isDesktop: boolean;
  onBook: (service?: Service) => void;
}

export function BusinessBookingPage({
  business,
  categories,
  businessTypeName,
  serviceVariant = 'book',
  isDesktop,
  onBook,
}: BusinessBookingPageProps) {
  const sectionIds = useMemo(() => TABS.map((t) => t.id), []);
  const { activeId, scrolled, scrollTo } = useScrollSpy({
    sectionIds,
    scrolledThreshold: isDesktop ? 280 : 120,
  });

  const { isOpen: coverEnabled } = useDisclosure({ defaultIsOpen: !!business.coverImageUrl });

  const status = computeOpenStatus(business.workingHours);
  const surfacePx = isDesktop ? 12 : 4;

  return (
    <BrandProvider brandColor={business.brandColor} pb={isDesktop ? 10 : 8} bg="white">
      <BusinessTopNav
        business={business}
        visible={scrolled}
        isDesktop={isDesktop}
        tabs={TABS}
        activeId={activeId}
        onSelect={scrollTo}
        onBookNow={() => onBook()}
      />

      <BusinessHero
        coverImageUrl={business.coverImageUrl}
        enabled={coverEnabled}
        isDesktop={isDesktop}
      />

      <Box maxW="1240px" mx="auto" px={surfacePx}>
        <BusinessHeader
          business={business}
          status={status}
          isDesktop={isDesktop}
          businessType={businessTypeName}
          coverEnabled={coverEnabled && !!business.coverImageUrl}
          onBookNow={() => onBook()}
        />

        {isDesktop && (
          <SectionTabs tabs={TABS} activeId={activeId} onSelect={scrollTo} />
        )}

        <Grid
          templateColumns={isDesktop ? 'minmax(0,1fr) 360px' : '1fr'}
          gap={isDesktop ? 12 : 0}
          mt={isDesktop ? 7 : 4}
        >
          <Box>
            <ServicesSection
              services={business.services}
              categories={categories}
              serviceVariant={serviceVariant}
              onBook={onBook}
            />
            <AboutSection aboutContent={business.aboutContent} />
            <LocationSection address={business.address} city={business.city} />
            <HoursSection hours={business.workingHours} />
          </Box>
          {isDesktop && (
            <DesktopBookingCard
              business={business}
              services={business.services}
              status={status}
              onBookNow={() => onBook()}
            />
          )}
        </Grid>
      </Box>
    </BrandProvider>
  );
}
