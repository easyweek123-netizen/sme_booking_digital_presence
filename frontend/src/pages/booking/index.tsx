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
  Flex,
  Image,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useGetBusinessBySlugQuery } from '../../store/api/businessApi';
import { ROUTES } from '../../config/routes';
import { Logo } from '../../components/ui/Logo';
import { BookingDrawer, BookingTabs, ServicesTab, AboutTab } from '../../components/Booking';
import { BusinessInfoPanel } from './components';
import type { TabId } from '../../components/Booking';
import type { Service } from '../../types';
import { generateBrandColorCss, isValidHexColor } from '../../utils/brandColor';

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: business, isLoading, error } = useGetBusinessBySlugQuery(slug || '');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('services');
  const [coverError, setCoverError] = useState(false);
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  // Responsive layout
  const isDesktop = useBreakpointValue({ base: false, md: true });

  // Generate brand color CSS variables if custom color is set
  const brandColorStyles = useMemo(() => {
    if (business?.brandColor && isValidHexColor(business.brandColor)) {
      return generateBrandColorCss(business.brandColor);
    }
    return {};
  }, [business?.brandColor]);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    openDrawer();
  };

  const handleDrawerClose = () => {
    closeDrawer();
    setSelectedService(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.500">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Error state
  if (error || !business) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <Alert
            status="error"
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
              Business Not Found
            </Heading>
            <Text color="gray.600">
              The booking page you're looking for doesn't exist or has been removed.
            </Text>
          </Alert>
        </Container>
      </Box>
    );
  }

  const activeServices = business.services?.filter((s) => s.isActive) || [];
  const hasCoverImage = business.coverImageUrl && !coverError;
  const hasAboutContent = !!business.aboutContent;

  // Cover background - image or gradient
  const coverBackground = hasCoverImage
    ? `url(${business.coverImageUrl})`
    : business.brandColor
      ? `linear-gradient(135deg, ${business.brandColor}40 0%, ${business.brandColor}20 50%, ${business.brandColor}05 100%)`
      : 'linear-gradient(135deg, #4A7C5940 0%, #4A7C5920 50%, #4A7C5905 100%)';

  // Tab content renderer
  const TabContent = () => (
    <>
      {activeTab === 'services' && (
        <ServicesTab
          services={activeServices}
          brandColor={business.brandColor}
          onBookService={handleBookService}
        />
      )}
      {activeTab === 'about' && (
        <AboutTab content={business.aboutContent} brandColor={business.brandColor} />
      )}
    </>
  );

  return (
    <Box minH="100vh" bg="gray.50" style={brandColorStyles}>
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.100" py={3}>
        <Container maxW="6xl">
          <Logo size="sm" onClick={() => navigate(ROUTES.HOME)} />
        </Container>
      </Box>

      {/* Desktop Layout */}
      {isDesktop ? (
        <Container maxW="6xl" py={6}>
          <Flex gap={6}>
            {/* Left Panel - Cover + Business Info */}
            <Box w="340px" flexShrink={0}>
              <Box
                position="sticky"
                top={6}
                bg="white"
                borderRadius="xl"
                border="1px"
                borderColor="gray.100"
                overflow="hidden"
              >
                {/* Cover Image / Gradient */}
                <Box
                  h="180px"
                  bg={coverBackground}
                  bgSize="cover"
                  bgPosition="center"
                >
                  {hasCoverImage && (
                    <Image
                      src={business.coverImageUrl!}
                      alt=""
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      onError={() => setCoverError(true)}
                      display="none"
                    />
                  )}
                </Box>

                {/* Business Info */}
                <Box p={5}>
                  <BusinessInfoPanel business={business} />
                </Box>
              </Box>
            </Box>

            {/* Right Panel - Tabs + Content */}
            <Box flex={1} minW={0}>
              <Box
                bg="white"
                borderRadius="xl"
                border="1px"
                borderColor="gray.100"
                overflow="hidden"
              >
                {/* Tabs - only show if there's about content */}
                {hasAboutContent && (
                  <BookingTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    brandColor={business.brandColor}
                  />
                )}

                {/* Tab Content */}
                <Box p={5}>
                  {!hasAboutContent && (
                    <Heading size="md" color="gray.900" mb={4}>
                      Select a Service
                    </Heading>
                  )}

                  {activeServices.length === 0 && activeTab === 'services' ? (
                    <Box p={8} textAlign="center" borderRadius="lg" bg="gray.50">
                      <Text color="gray.500">No services available at the moment.</Text>
                    </Box>
                  ) : (
                    <TabContent />
                  )}
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      ) : (
        /* Mobile Layout */
        <>
          {/* Cover Image / Gradient */}
          <Box h="160px" bg={coverBackground} bgSize="cover" bgPosition="center" />

          {/* Business Info */}
          <Box pb={4} pt={4} px={4} borderBottom="1px" borderColor="gray.100" bg="white">
            <Container maxW="lg" px={0}>
              <BusinessInfoPanel business={business} />
            </Container>
          </Box>

          {/* Tabs - only show if there's about content */}
          {hasAboutContent && (
            <BookingTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              brandColor={business.brandColor}
            />
          )}

          {/* Tab Content */}
          <Container maxW="lg" py={4}>
            {!hasAboutContent && (
              <Heading size="md" color="gray.900" mb={4}>
                Select a Service
              </Heading>
            )}

            {activeServices.length === 0 && activeTab === 'services' ? (
              <Box
                bg="white"
                p={8}
                borderRadius="xl"
                textAlign="center"
                border="1px"
                borderColor="gray.100"
              >
                <Text color="gray.500">No services available at the moment.</Text>
              </Box>
            ) : (
              <TabContent />
            )}
          </Container>
        </>
      )}

      {/* Sticky Footer */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        py={3}
        textAlign="center"
        bg="white"
        borderTop="1px"
        borderColor="gray.100"
        zIndex={5}
        boxShadow="0 -2px 10px rgba(0,0,0,0.04)"
      >
        <Text fontSize="sm" color="gray.400">
          Powered by <Text as="span" fontWeight="600" color="gray.500">BookEasy</Text>
        </Text>
      </Box>
      
      {/* Spacer for sticky footer */}
      <Box h="60px" />

      {/* Booking Drawer */}
      {selectedService && business && (
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
