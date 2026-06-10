import { Box, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { BusinessWithServices, Service, ServiceCategory } from '../../types';
import { BrandProvider } from './brand';
import { useDeviceMode } from './context/DeviceModeContext';
import { BusinessHero } from './BusinessHero';
import { BusinessHeader } from './BusinessHeader';
import { BusinessTopNav } from './BusinessTopNav';
import { SectionTabs, type SectionTab } from './SectionTabs';
import { ServicesSection } from './sections/ServicesSection';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { HoursSection } from './sections/HoursSection';
import { DesktopBookingCard } from './sections/DesktopBookingCard';
import { BusinessPageContainer } from './atoms/BusinessPageContainer';
import { computeOpenStatus } from './utils';
import { useScrollSpy } from './hooks/useScrollSpy';
import { Footer } from '../Layout';

const TABS: readonly SectionTab[] = [
  { id: 'section-services', label: 'Services' },
  { id: 'section-about', label: 'About' },
  { id: 'section-contact', label: 'Contact' },
  { id: 'section-hours', label: 'Opening hours' },
];

interface BusinessBookingPageProps {
  business: BusinessWithServices;
  categories: ServiceCategory[];
  businessTypeName?: string;
  onBook: (service?: Service) => void;
}

export function BusinessBookingPage({
  business,
  categories,
  businessTypeName,
  onBook,
}: BusinessBookingPageProps) {
  const isDesktop = useDeviceMode();
  const sectionIds = useMemo(() => TABS.map((t) => t.id), []);
  const { activeId, scrolled, scrollTo } = useScrollSpy({
    sectionIds,
    scrolledThreshold: isDesktop ? 480 : 120,
  });

  const { isOpen: coverEnabled } = useDisclosure({
    defaultIsOpen: !!business.coverImageUrl,
  });

  const status = computeOpenStatus(business.workingHours);

  return (
    <>
    <BrandProvider brandColor={business.brandColor} pb={10} bg="surface.card">
      <BusinessTopNav
        business={business}
        visible={scrolled}
        tabs={TABS}
        activeId={activeId}
        onSelect={scrollTo}
        onBookNow={() => onBook()}
      />
    
      <BusinessPageContainer>
        <Flex direction="column" gap={2}>
          <BusinessHero coverImageUrl={business.coverImageUrl} enabled={coverEnabled} />
            <BusinessHeader
              business={business}
              status={status}
              businessType={businessTypeName}
              onBookNow={() => onBook()}
            />

            
            {isDesktop && <SectionTabs tabs={TABS} activeId={activeId} onSelect={scrollTo} />}

            <Grid
              templateColumns={isDesktop ? 'minmax(0,1fr) 360px' : '1fr'}
              gap={isDesktop ? 12 : 0}
            >
              <Box>
                <ServicesSection
                  services={business.services}
                  categories={categories}
                  onBook={onBook}
                />
                <AboutSection aboutContent={business.aboutContent} />
                <ContactSection business={business} />
                {business.showWeeklyHours && <HoursSection hours={business.workingHours} />}
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
        </Flex>
      </BusinessPageContainer>

    </BrandProvider>
    <Footer />
    </>
  );
}
