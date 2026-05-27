import { Box, Center, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useGetMyBusinessQuery, useGetServicesQuery } from '../../store/api';
import { BusinessBookingPage } from '../Business/BusinessBookingPage';
import { BookingWizard } from '../Business/Book';
import { BREAKPOINTS } from '../../utils/breakpoints';
import type { Service } from '../../types';

/**
 * Canvas-only orchestrator for the booking-page preview.
 *
 * Renders the same <BusinessBookingPage> view and <BookingWizard> that the
 * public /book/:slug route uses, but sourced from the authenticated owner's
 * own business (useGetMyBusinessQuery) and with the final submit gated so no
 * real booking is created from inside the preview.
 *
 * Measures its own container width and derives `isDesktop` at BREAKPOINTS.lg
 * to match the view's `{ base: false, lg: true }` responsive contract. This
 * decouples the booking preview from CanvasPreview's md-threshold default
 * (which is suitable for narrower previews like dashboards but not for the
 * landing page's two-column desktop layout).
 */
export function BookingPagePreview() {
  const toast = useToast();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardService, setWizardService] = useState<Service | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const DEBOUNCE_MS = 150;

    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = entries[0].contentRect.width;
        const next = width >= BREAKPOINTS.lg;
        setIsDesktop((prev) => (prev !== next ? next : prev));
      }, DEBOUNCE_MS);
    });

    observer.observe(el);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const businessQuery = useGetMyBusinessQuery();
  const business = businessQuery.data;

  const categoriesQuery = useGetServicesQuery(business?.id ?? 0, {
    skip: !business?.id,
  });

  const handleBook = (service?: Service) => {
    setWizardService(service ?? null);
    setWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
    setWizardService(null);
  };

  const handlePreviewSubmit = async () => {
    toast({
      title: 'Preview only',
      description: 'Your customers will be able to book here once your page is live.',
      status: 'info',
      duration: 3500,
      isClosable: true,
    });
    // Throw so useBookingFlow dispatches SUBMIT_ERROR instead of SUBMIT_SUCCESS,
    // keeping the wizard on the checkout step rather than showing SuccessStep.
    throw new Error('preview-mode');
  };

  const renderContent = () => {
    if (businessQuery.isLoading) {
      return (
        <Center h="full" py={12}>
          <VStack spacing={3}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.500">Loading preview...</Text>
          </VStack>
        </Center>
      );
    }

    if (businessQuery.isError || !business) {
      return (
        <Center h="full" py={12} px={4}>
          <Text color="gray.500" textAlign="center" maxW="sm">
            Finish setting up your business to see how your booking page will look to customers.
          </Text>
        </Center>
      );
    }

    if (wizardOpen) {
      return (
        <BookingWizard
          business={business}
          services={business.services}
          categories={categoriesQuery.data ?? []}
          initialService={wizardService}
          isAuthenticated={false}
          userEmail={null}
          isDesktop={isDesktop}
          onSignIn={() => undefined}
          onSubmit={handlePreviewSubmit}
          onClose={handleCloseWizard}
        />
      );
    }

    return (
      <BusinessBookingPage
        business={business}
        categories={categoriesQuery.data ?? []}
        serviceVariant="preview"
        isDesktop={isDesktop}
        onBook={handleBook}
      />
    );
  };

  return <Box ref={containerRef} h="full">{renderContent()}</Box>;
}
