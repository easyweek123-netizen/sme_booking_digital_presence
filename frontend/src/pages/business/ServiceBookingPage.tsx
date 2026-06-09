import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Center,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetBusinessBySlugQuery,
  useGetBusinessServicesQuery,
} from '../../store/api';
import { BookingWizard } from '../../components/Business/Book';
import { useBookingAuth } from '../../components/Business/Book/hooks/useBookingAuth';
import { useGoogleSignIn } from '../../components/Business/Book/hooks/useGoogleSignIn';
import { useSubmitBooking } from '../../components/Business/Book/hooks/useSubmitBooking';
import { ROUTES } from '../../config/routes';
import type { Service } from '../../types';

export function ServiceBookingPage() {
  const { slug, serviceId } = useParams<{ slug: string; serviceId?: string }>();
  const navigate = useNavigate();
  const businessQuery = useGetBusinessBySlugQuery(slug ?? '', { skip: !slug });
  const business = businessQuery.data;

  const categoriesQuery = useGetBusinessServicesQuery(business?.id ?? 0, {
    skip: !business?.id,
  });

  const auth = useBookingAuth();
  const { signingIn, signIn } = useGoogleSignIn();
  const handleSubmit = useSubmitBooking(auth);

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
          textAlign="center"
          maxW="md"
          borderRadius="lg"
          py={8}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">Page Not Found</AlertTitle>
          <AlertDescription>
            The page you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </Center>
    );
  }

  const initialService: Service | null =
    (serviceId && business.services.find((s) => s.id === Number(serviceId))) || null;

  const handleClose = () => {
    if (slug) navigate(ROUTES.BUSINESS.path(slug));
    else navigate(ROUTES.HOME);
  };

  return (
    <BookingWizard
      business={business}
      services={business.services}
      categories={categoriesQuery.data ?? []}
      initialService={initialService}
      isAuthenticated={auth.isAuthenticated}
      userEmail={auth.userEmail}
      signingIn={signingIn}
      onSignIn={signIn}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}
