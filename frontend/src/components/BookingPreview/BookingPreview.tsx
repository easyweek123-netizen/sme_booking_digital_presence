import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useBusiness } from '../../contexts/business';
import { useGetBusinessServicesQuery } from '../../store/api';
import { BusinessBookingPage } from '../Business/BusinessBookingPage';
import { BookingWizard } from '../Business/Book';
import { BrandProvider } from '../Business/brand';
import { DeviceModeProvider } from '../Business/context/DeviceModeContext';
import { BREAKPOINTS } from '../../utils/breakpoints';
import type { BusinessWithServices, Service, ServiceCategory } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dismissSetupHint } from '../../store/slices/previewSlice';
import { useBookingPageSections, type SectionId } from '../Business/hooks/useBookingPageSections';
import { PreviewSetupBanner } from '../Business/PreviewSetupBanner';
import { ServicesPlaceholder, AboutPlaceholder, ContactPlaceholder, HoursPlaceholder } from '../Business/sections/SectionPlaceholders';

interface BookingPreviewProps {
  /**
   * Optional business override. When omitted, falls back to
   * `useBusiness()` (context populated by BusinessProvider). Pass an
   * override only when the caller has a live draft, e.g. the website
   * form's debounced watch().
   */
  business?: BusinessWithServices;
  /**
   * Optional categories override. When omitted, the wrapper calls
   * useGetBusinessServicesQuery for the effective business id. The result
   * is RTK-Query-cached, so multiple consumers share the same response.
   */
  categories?: ServiceCategory[];
  /**
   * Submit handler for the wizard. Defaults to a preview-only flow that
   * toasts "Preview only" and throws 'preview-mode' so useBookingFlow keeps
   * the wizard on the checkout step instead of rendering SuccessStep.
   */
  onSubmit?: () => Promise<void>;
}

/**
 * Shared booking-preview surface. Used by:
 *   - canvas BookingPagePreview (no overrides — pulls from context)
 *   - WebsitePhonePreview / WebsitePreviewMobile (passes draft override)
 *
 * ServiceCard's internal Modal/Drawer behaviour is intentionally untouched.
 */
export function BookingPreview({
  business: businessOverride,
  categories: categoriesOverride,
  onSubmit,
}: BookingPreviewProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const setupHintDismissed = useAppSelector((s) => s.preview.setupHintDismissed);
  const contextBusiness = useBusiness();
  const business = businessOverride ?? contextBusiness;

  const isCanvas = businessOverride == null;          // canvas pulls from context
  const showSetupHints = !setupHintDismissed;
  const { sections, registerSection } = useBookingPageSections(business, {
    autoScrollOnAppear: isCanvas,
  });

  const PLACEHOLDERS: Record<SectionId, React.ReactNode> = {
    'section-services': <ServicesPlaceholder />,
    'section-about': <AboutPlaceholder />,
    'section-contact': <ContactPlaceholder />,
    'section-hours': <HoursPlaceholder />,
  };
  const renderPlaceholder = (id: SectionId) => showSetupHints ? PLACEHOLDERS[id] : null;

  const categoriesQuery = useGetBusinessServicesQuery(business.id, {
    skip: categoriesOverride != null,
  });
  const categories = categoriesOverride ?? categoriesQuery.data ?? [];

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardService, setWizardService] = useState<Service | null>(null);

  const defaultSubmit = async () => {
    toast({
      title: 'Preview only',
      description:
        'Your customers will be able to book here once your page is live.',
      status: 'info',
      duration: 3500,
      isClosable: true,
    });
    throw new Error('preview-mode');
  };

  const handleBook = (service?: Service) => {
    setWizardService(service ?? null);
    setWizardOpen(true);
  };

  const handleClose = () => {
    setWizardOpen(false);
    setWizardService(null);
  };

  return (
    <DeviceModeProvider desktopMinWidth={BREAKPOINTS.lg}>
      <BrandProvider brandColor={business.brandColor} scope="container">
        {wizardOpen ? (
          <BookingWizard
            business={business}
            services={business.services}
            categories={categories}
            initialService={wizardService}
            isAuthenticated={false}
            userEmail={null}
            onSignIn={() => undefined}
            onSubmit={onSubmit ?? defaultSubmit}
            onClose={handleClose}
          />
        ) : (
          <BusinessBookingPage
            business={business}
            categories={categories}
            onBook={handleBook}
            sections={sections}
            registerSection={registerSection}
            renderPlaceholder={renderPlaceholder}
            showSetupHints={showSetupHints}
            banner={showSetupHints
              ? <PreviewSetupBanner onDismiss={() => dispatch(dismissSetupHint())} />
              : undefined}
          />
        )}
      </BrandProvider>
    </DeviceModeProvider>
  );
}
