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
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetBusinessBySlugQuery,
  useGetServicesQuery,
} from '../../store/api';
import { useAppSelector } from '../../store/hooks';
import { useCreateBookingMutation } from '../../store/api/bookingsApi';
import { BookingWizard } from '../../components/Business/Book';
import { endTimeFromSlot } from '../../components/Business/utils';
import { ROUTES } from '../../config/routes';
import type { Service } from '../../types';

export function ServiceBookingPage() {
  const { slug, serviceId } = useParams<{ slug: string; serviceId?: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const userEmail = useAppSelector((s) => s.auth.user?.email ?? null);

  const [signingIn, setSigningIn] = useState(false);

  const businessQuery = useGetBusinessBySlugQuery(slug ?? '', { skip: !slug });
  const business = businessQuery.data;

  const categoriesQuery = useGetServicesQuery(business?.id ?? 0, {
    skip: !business?.id,
  });

  const [createBooking] = useCreateBookingMutation();

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

  const handleSignIn = () => {
    setSigningIn(true);
    setTimeout(() => setSigningIn(false), 600);
  };

  const handleSubmit = async ({
    service,
    date,
    slot,
  }: {
    service: Service;
    date: Date;
    slot: string;
  }) => {
    await createBooking({
      serviceId: service.id,
      businessId: business.id,
      date: toIsoDate(date),
      startTime: slot,
      endTime: endTimeFromSlot(slot, service.durationMinutes),
      customerName: userEmail ?? 'Customer',
      customerEmail: userEmail ?? '',
    }).unwrap();
  };

  return (
    <BookingWizard
      business={business}
      services={business.services}
      categories={categoriesQuery.data ?? []}
      initialService={initialService}
      isAuthenticated={isAuthenticated}
      userEmail={userEmail}
      signingIn={signingIn}
      onSignIn={handleSignIn}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
