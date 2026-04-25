import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Link,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useGetBusinessBySlugQuery } from '../../store/api/businessApi';
import { BookingHeader, BookingWizard, BusinessInfoFooter } from './components';
import type { BusinessWithServices } from '../../types';
import { generateBrandColorCss, isValidHexColor } from '../../utils/brandColor';
import { MobileBookingFooter } from './components/wizard/MobileBookingFooter';
import { useBookingWizard } from './components/wizard/useBookingWizard';

interface BookingPageV2Props {
  /** Optional business data — if provided, skips slug lookup */
  business?: BusinessWithServices | null;
  /** Preview mode — hides public header/footer; wizard still renders */
  isPreview?: boolean;
  /** Set by canvas preview (`CanvasPreview`); when set, layout follows preview width instead of viewport. */
  isDesktop?: boolean;
}

function BookingPageContent({
  business,
  isPreview,
  brandColorStyles,
  isDesktop,
}: {
  business: BusinessWithServices;
  isPreview: boolean;
  brandColorStyles: CSSProperties;
  isDesktop?: boolean;
}) {
  const wizard = useBookingWizard(business);
  const viewportLgUp = useBreakpointValue({ base: false, lg: true }, { ssr: false }) ?? false;
  const desktopLayout = typeof isDesktop === 'boolean' ? isDesktop : viewportLgUp;

  return (
    <Box minH={isPreview ? 'auto' : '100vh'} bg="surface.page" style={brandColorStyles}>
      {!isPreview && <BookingHeader business={business} />}
      <BookingWizard business={business} wizard={wizard} desktopLayout={desktopLayout} />

      <BusinessInfoFooter business={business} desktopLayout={desktopLayout} />

      {!isPreview && (
        <Box py={6} textAlign="center" borderTop="1px" borderColor="border.subtle">
          <Text fontSize="xs" color="text.faint">
            Powered by{' '}
            <Link href="/" fontWeight="600" color="text.faint" _hover={{ color: 'accent.primary' }}>
              BookEasy
            </Link>
          </Text>
        </Box>
      )}

      {wizard.selectedService && !desktopLayout && (
        <MobileBookingFooter
          selectedService={wizard.selectedService}
          canContinue={wizard.canContinue}
          onContinue={wizard.handleContinue}
          label={wizard.continueLabel}
        />
      )}
    </Box>
  );
}

export function BookingPageV2({
  business: businessProp,
  isPreview = false,
  isDesktop,
}: BookingPageV2Props) {
  const { slug } = useParams<{ slug: string }>();

  const { data: fetchedBusiness, isLoading, error } = useGetBusinessBySlugQuery(slug || '', {
    skip: !!businessProp,
  });

  const business = businessProp ?? fetchedBusiness;

  const brandColor = business?.brandColor;
  const brandColorStyles = useMemo(() => {
    if (brandColor && isValidHexColor(brandColor)) {
      return generateBrandColorCss(brandColor);
    }
    return {};
  }, [brandColor]);

  if (isLoading && !businessProp) {
    return (
      <Box minH={isPreview ? '200px' : '100vh'} bg="surface.card">
        <Center h={isPreview ? '200px' : '100vh'}>
          <VStack spacing={4}>
            <Spinner size="xl" color="accent.primary" thickness="4px" />
            <Text color="text.muted" fontSize="sm">
              Loading...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if ((error && !businessProp) || !business) {
    return (
      <Box minH={isPreview ? '200px' : '100vh'} bg="surface.card" py={isPreview ? 4 : 20}>
        <Container maxW="lg">
          <Alert
            status={isPreview ? 'info' : 'error'}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="xl"
            py={8}
          >
            <AlertIcon boxSize="40px" mr={0} mb={4} />
            <Heading size="md" mb={2}>
              {isPreview ? 'No Preview Available' : 'Page Not Found'}
            </Heading>
            <Text color="text.secondary">
              {isPreview
                ? 'Complete your business setup to see a preview.'
                : "The page you're looking for doesn't exist or has been removed."}
            </Text>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <BookingPageContent
      business={business}
      isPreview={isPreview}
      brandColorStyles={brandColorStyles}
      isDesktop={isDesktop}
    />
  );
}
