import { Box, Grid, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
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
  onBook: (service?: Service) => void;
}

export function BusinessBookingPage({
  business,
  categories,
  businessTypeName,
  serviceVariant = 'book',
  onBook,
}: BusinessBookingPageProps) {
  const isDesktop = useBreakpointValue({ base: false, lg: true }) ?? false;
  const sectionIds = useMemo(() => TABS.map((t) => t.id), []);
  const { activeId, scrolled, scrollTo } = useScrollSpy({
    sectionIds,
    scrolledThreshold: isDesktop ? 280 : 120,
  });

  const { isOpen: coverEnabled } = useDisclosure({ defaultIsOpen: !!business.coverImageUrl });

  const status = computeOpenStatus(business.workingHours);
  const surfacePx = { base: 4, lg: 12 };

  return (
    <BrandProvider brandColor={business.brandColor} pb={{ base: 8, lg: 10 }} bg="white">
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
          templateColumns={{ base: '1fr', lg: 'minmax(0,1fr) 360px' }}
          gap={{ base: 0, lg: 12 }}
          mt={{ base: 4, lg: 7 }}
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
