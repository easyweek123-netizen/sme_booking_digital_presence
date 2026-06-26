import { Box, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import type { BusinessWithServices, Service, ServiceCategory } from '../../types';
import { BrandButton, BrandProvider } from './brand';
import { useDeviceMode } from './context/DeviceModeContext';
import { BusinessHero } from './BusinessHero';
import { BusinessHeader } from './BusinessHeader';
import { BusinessTopNav } from './BusinessTopNav';
import { SectionTabs } from './SectionTabs';
import { ServicesSection } from './sections/ServicesSection';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { HoursSection } from './sections/HoursSection';
import { DesktopBookingCard } from './sections/DesktopBookingCard';
import { BusinessPageContainer } from './atoms/BusinessPageContainer';
import { computeOpenStatus } from './utils';
import { useScrollSpy } from './hooks/useScrollSpy';
import { Footer } from '../Layout';
import { Fragment, type ReactNode } from 'react';
import type { RefCallback } from 'react';
import type { SectionId, SectionModel } from './hooks/useBookingPageSections';

interface BusinessBookingPageProps {
  business: BusinessWithServices;
  categories: ServiceCategory[];
  businessTypeName?: string;
  onBook: (service?: Service) => void;
  sections: SectionModel[];
  /** Scroll registrar for present sections (canvas preview only). */
  registerSection?: (id: SectionId) => RefCallback<HTMLElement> | undefined;
  /** Placeholder for an absent section (preview only). Public page omits it. */
  renderPlaceholder?: (id: SectionId) => ReactNode;
  /** Preview-only banner rendered above the hero (e.g. setup hints). */
  banner?: ReactNode;
  /** Preview-only hero hints. */
  showSetupHints?: boolean;
}

export function BusinessBookingPage({
  business,
  categories,
  onBook,
  sections,
  registerSection,
  renderPlaceholder,
  banner,
  showSetupHints,
}: BusinessBookingPageProps) {
  const isDesktop = useDeviceMode();
  
  const sectionIds = sections.filter((s) => s.present).map((s) => s.id);
  const tabs = sections.filter((s) => s.present).map(({ id, label }) => ({ id, label }));
  const { activeId, scrolled, scrollTo } = useScrollSpy({
    sectionIds, scrolledThreshold: isDesktop ? 480 : 120,
  });

  const { isOpen: coverEnabled } = useDisclosure({
    defaultIsOpen: !!business.coverImageUrl,
  });

  const renderSection = (id: SectionId) => {
    switch (id) {
      case 'section-services':
        return <ServicesSection services={business.services} categories={categories} onBook={onBook} />;
      case 'section-about':
        return <AboutSection aboutContent={business.aboutContent} />;
      case 'section-contact':
        return <ContactSection business={business} />;
      case 'section-hours':
        return <HoursSection hours={business.workingHours} />;
    }
  };

  const status = computeOpenStatus(business.workingHours);

  return (
    <>
      <BrandProvider brandColor={business.brandColor} pb={10} bg="surface.card">
        <BusinessTopNav
          business={business}
          visible={scrolled}
          tabs={tabs}
          activeId={activeId}
          onSelect={scrollTo}
          onBookNow={() => onBook()}
        />
      
        <BusinessPageContainer>
          <Flex direction="column" gap={6} py={4}>
            <BusinessHeader business={business} />

            {banner && banner}

            <BusinessHero 
              coverImageUrl={business.coverImageUrl} 
              enabled={coverEnabled}
              showSetupHints={showSetupHints}
            />

            {!isDesktop && (
              <BrandButton size="lg" w="100%" onClick={() => onBook()}>
                Book now
              </BrandButton>
            )}

            {isDesktop && tabs.length > 0 && (
              <SectionTabs tabs={tabs} activeId={activeId} onSelect={scrollTo} />
            )}

            <Grid
              templateColumns={isDesktop ? 'minmax(0,1fr) 360px' : '1fr'}
              gap={isDesktop ? 12 : 0}
            >
              <Box>
                {sections.map(({ id, present, enabled }) => {
                  if (present) {
                    return (
                      <Box key={id} ref={registerSection?.(id)}>
                        {renderSection(id)}
                      </Box>
                    );
                  }
                  // Intentionally turned off in settings → render nothing (no setup placeholder).
                  if (!enabled) return <Fragment key={id} />;
                  // Not set up yet → show the preview placeholder (preview surface only).
                  return <Fragment key={id}>{renderPlaceholder?.(id) ?? null}</Fragment>;
                })}
              </Box>
              {isDesktop && business.services.length > 0 && (
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
