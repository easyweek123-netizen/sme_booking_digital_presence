import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Center,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBusinessBySlugQuery } from '../../store/api';
import { BusinessBookingPage as BusinessBookingPageView } from '../../components/Business/BusinessBookingPage';
import { ROUTES } from '../../config/routes';
import type { Service } from '../../types';

export function BusinessLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true }) ?? false;

  const businessQuery = useGetBusinessBySlugQuery(slug ?? '', { skip: !slug });
  const business = businessQuery.data;

  if (businessQuery.isLoading) {
    return (
      <Center h="100vh">
        <VStack spacing={3}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.500">Loading…</Text>
        </VStack>
      </Center>
    );
  }

  if (businessQuery.isError || !business) {
    return (
      <Center h="100vh" px={4}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          maxW="md"
          borderRadius="lg"
          py={8}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Page Not Found
          </AlertTitle>
          <AlertDescription maxW="sm">
            The page you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </Center>
    );
  }

  const handleBook = (service?: Service) => {
    if (!slug) return;
    navigate(ROUTES.BUSINESS.bookingPath(slug, service?.id));
  };

  return (
    <BusinessBookingPageView
      business={business}
      categories={[]}
      isDesktop={isDesktop}
      onBook={handleBook}
    />
  );
}
