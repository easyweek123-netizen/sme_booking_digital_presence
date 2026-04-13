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
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState, useMemo, useRef } from 'react';
import { useGetBusinessBySlugQuery } from '../../store/api/businessApi';
import { BookingDrawer } from '../../components/Booking';
import {
  HeroSection,
  ServicesSection,
  AboutSection,
  ContactSection,
  BookingStatusSection,
  FloatingNav,
} from './components';
import type { Service, BusinessWithServices } from '../../types';
import { generateBrandColorCss, isValidHexColor } from '../../utils/brandColor';

interface BookingPageV2Props {
  /** Optional business data — if provided, skips slug lookup */
  business?: BusinessWithServices | null;
  /** Preview mode — disables booking drawer */
  isPreview?: boolean;
}

export function BookingPageV2({
  business: businessProp,
  isPreview = false,
}: BookingPageV2Props) {
  const { slug } = useParams<{ slug: string }>();

  const { data: fetchedBusiness, isLoading, error } = useGetBusinessBySlugQuery(
    slug || '',
    { skip: !!businessProp },
  );

  const business = businessProp ?? fetchedBusiness;
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
  const servicesRef = useRef<HTMLDivElement>(null);

  // Brand color CSS variables
  const brandColorStyles = useMemo(() => {
    if (business?.brandColor && isValidHexColor(business.brandColor)) {
      return generateBrandColorCss(business.brandColor);
    }
    return {};
  }, [business?.brandColor]);

  const handleBookService = (service: Service) => {
    if (isPreview) return;
    setSelectedService(service);
    openDrawer();
  };

  const handleDrawerClose = () => {
    closeDrawer();
    setSelectedService(null);
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Loading state
  if (isLoading && !businessProp) {
    return (
      <Box minH={isPreview ? '200px' : '100vh'} bg="white">
        <Center h={isPreview ? '200px' : '100vh'}>
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.500" fontSize="sm">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Error state
  if ((error && !businessProp) || !business) {
    return (
      <Box minH={isPreview ? '200px' : '100vh'} bg="white" py={isPreview ? 4 : 20}>
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
            <Text color="gray.600">
              {isPreview
                ? 'Complete your business setup to see a preview.'
                : "The page you're looking for doesn't exist or has been removed."}
            </Text>
          </Alert>
        </Container>
      </Box>
    );
  }

  const activeServices = business.services?.filter((s) => s.isActive) || [];

  // Build nav items from available sections
  const navItems = [
    { id: 'services', label: 'Services' },
    ...(business.aboutContent ? [{ id: 'about', label: 'About' }] : []),
    ...(business.phone || business.address || business.workingHours
      ? [{ id: 'contact', label: 'Contact' }]
      : []),
  ];

  return (
    <Box minH={isPreview ? 'auto' : '100vh'} bg="white" style={brandColorStyles}>
      {/* Floating Navigation */}
      {!isPreview && <FloatingNav items={navItems} />}

      {/* Hero */}
      <HeroSection business={business} onBookNow={scrollToServices} />

      {/* Services */}
      <Box ref={servicesRef}>
        <ServicesSection
          services={activeServices}
          brandColor={business.brandColor}
          onBookService={handleBookService}
        />
      </Box>

      {/* About */}
      <AboutSection content={business.aboutContent} brandColor={business.brandColor} />

      {/* Contact & Hours */}
      <ContactSection business={business} />

      {/* Booking Status */}
      <BookingStatusSection />

      {/* Footer */}
      {!isPreview && (
        <Box py={6} textAlign="center" borderTop="1px" borderColor="gray.100">
          <Text fontSize="xs" color="gray.400">
            Powered by{' '}
            <Link href="/" fontWeight="600" color="gray.400" _hover={{ color: 'brand.500' }}>
              BookEasy
            </Link>
          </Text>
        </Box>
      )}

      {/* Booking Drawer — reused as-is */}
      {!isPreview && selectedService && business && (
        <BookingDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          service={selectedService}
          business={business}
        />
      )}
    </Box>
  );
}
