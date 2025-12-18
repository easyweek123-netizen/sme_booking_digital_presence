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
import type { Service, BusinessWithServices } from '../../types';
import { generateBrandColorCss, isValidHexColor } from '../../utils/brandColor';

interface BookingPageProps {
  /** Optional business data - if provided, skips slug lookup */
  business?: BusinessWithServices | null;
  /** Preview mode - disables booking drawer and footer */
  isPreview?: boolean;
  /** Override desktop/mobile layout - if provided, uses this instead of viewport detection */
  isDesktop?: boolean;
}

export function BookingPage({ 
  business: businessProp, 
  isPreview = false,
  isDesktop: isDesktopProp,
}: BookingPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Skip slug query if business prop is provided
  const { data: fetchedBusiness, isLoading, error } = useGetBusinessBySlugQuery(slug || '', {
    skip: !!businessProp,
  });
  
  // Use prop if provided, otherwise use fetched data
  const business = businessProp ?? fetchedBusiness;
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('services');
  const [coverError, setCoverError] = useState(false);
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  // Responsive layout - use prop if provided, otherwise detect from viewport
  const viewportIsDesktop = useBreakpointValue({ base: false, md: true });
  const isDesktop = isDesktopProp ?? viewportIsDesktop;

  // Generate brand color CSS variables if custom color is set
  const brandColorStyles = useMemo(() => {
    if (business?.brandColor && isValidHexColor(business.brandColor)) {
      return generateBrandColorCss(business.brandColor);
    }
    return {};
  }, [business?.brandColor]);

  const handleBookService = (service: Service) => {
    // Disable booking in preview mode
    if (isPreview) return;
    setSelectedService(service);
    openDrawer();
  };

  const handleDrawerClose = () => {
    closeDrawer();
    setSelectedService(null);
  };

  // Loading state (skip if using prop)
  if (isLoading && !businessProp) {
    return (
      <Box minH={isPreview ? "200px" : "100vh"} bg="gray.50">
        <Center h={isPreview ? "200px" : "100vh"}>
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.500">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Error state
  if ((error && !businessProp) || !business) {
    return (
      <Box minH={isPreview ? "200px" : "100vh"} bg="gray.50" py={isPreview ? 4 : 20}>
        <Container maxW="lg">
          <Alert
            status={isPreview ? "info" : "error"}
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
              {isPreview ? "No Preview Available" : "Business Not Found"}
            </Heading>
            <Text color="gray.600">
              {isPreview 
                ? "Complete your business setup to see a preview."
                : "The booking page you're looking for doesn't exist or has been removed."
              }
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
    <Box minH={isPreview ? "auto" : "100vh"} bg="gray.50" style={brandColorStyles}>
      {/* Header - hide in preview mode */}
      {!isPreview && (
      <Box bg="white" borderBottom="1px" borderColor="gray.100" py={3}>
        <Container maxW="6xl">
          <Logo size="sm" onClick={() => navigate(ROUTES.HOME)} />
        </Container>
      </Box>
      )}

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

      {/* Sticky Footer - hide in preview mode */}
      {!isPreview && (
        <>
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
        </>
      )}

      {/* Booking Drawer - hide in preview mode */}
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
