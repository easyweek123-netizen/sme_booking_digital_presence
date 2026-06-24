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
import { useBookingPageSections } from './hooks/useBookingPageSections';
import { PreviewSetupBanner } from './PreviewSetupBanner';
import { ServicesPlaceholder, AboutPlaceholder, HoursPlaceholder, ContactPlaceholder } from './sections/SectionPlaceholders';

interface BusinessBookingPageProps {
  business: BusinessWithServices;
  categories: ServiceCategory[];
  businessTypeName?: string;
  onBook: (service?: Service) => void;
  showSetupHints?: boolean;
  onDismissPreview?: () => void;
}

export function BusinessBookingPage({
  business,
  categories,
  onBook,
  showSetupHints = false,
  onDismissPreview,
}: BusinessBookingPageProps) {
  const isDesktop = useDeviceMode();
  
  const {
    tabs,
    sectionIds,
    hasServices,
    hasAbout,
    hasContact,
    hasHours,
  } = useBookingPageSections(business);
  
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
        tabs={tabs}
        activeId={activeId}
        onSelect={scrollTo}
        onBookNow={() => onBook()}
      />
    
      <BusinessPageContainer>
        <Flex direction="column" gap={6} py={4}>
          <BusinessHeader business={business} />

          {showSetupHints && onDismissPreview && (
            <PreviewSetupBanner onDismiss={onDismissPreview} />
          )}

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
              {hasServices ? (
                <ServicesSection services={business.services} categories={categories} onBook={onBook} />
              ) : (
                showSetupHints && <ServicesPlaceholder />
              )}
              {hasAbout ? (
                <AboutSection aboutContent={business.aboutContent} />
              ) : (
                showSetupHints && <AboutPlaceholder />
              )}
              {hasContact ? (
                <ContactSection business={business} />
              ) : (
                showSetupHints && <ContactPlaceholder />
              )}
              {hasHours ? (
                <HoursSection hours={business.workingHours} />
              ) : (
                showSetupHints && <HoursPlaceholder />
              )}
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
