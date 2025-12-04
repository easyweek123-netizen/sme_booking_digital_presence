import {
  Spinner,
  Center,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/Dashboard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useGetMyBusinessQuery } from '../../store/api/businessApi';
import { ROUTES } from '../../config/routes';
import { useNavigate } from 'react-router-dom';

// Dashboard sub-pages
import { DashboardOverview } from './DashboardOverview';
import { DashboardBookings } from './DashboardBookings';
import { DashboardServices } from './DashboardServices';
import { DashboardSettings } from './DashboardSettings';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: business, isLoading, error } = useGetMyBusinessQuery();

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <Center h="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.500">Loading your dashboard...</Text>
          </VStack>
        </Center>
      </DashboardLayout>
    );
  }

  // No business found - prompt to complete onboarding
  if (error || !business) {
    return (
      <DashboardLayout>
        <Center h="60vh">
          <VStack spacing={6} maxW="md" textAlign="center">
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="xl"
              py={8}
              px={6}
            >
              <AlertIcon boxSize="40px" mr={0} mb={4} />
              <AlertTitle fontSize="lg" mb={2}>
                Complete Your Setup
              </AlertTitle>
              <AlertDescription maxW="sm" mb={6}>
                You haven't set up your business yet. Complete the onboarding to
                start accepting bookings.
              </AlertDescription>
              <PrimaryButton
                onClick={() => navigate(ROUTES.ONBOARDING)}
                size="lg"
              >
                Complete Setup
              </PrimaryButton>
            </Alert>
          </VStack>
        </Center>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout businessName={business.name}>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<DashboardBookings />} />
        <Route path="services" element={<DashboardServices />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD.ROOT} replace />} />
      </Routes>
    </DashboardLayout>
  );
}
