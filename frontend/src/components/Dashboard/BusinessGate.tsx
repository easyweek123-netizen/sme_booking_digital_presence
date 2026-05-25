import type { ReactNode } from 'react';
import {
  Center,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useBusinessOptional } from '../../contexts/useBusiness';
import { PageLoading } from '../ui/states';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ROUTES } from '../../config/routes';

interface BusinessGateProps {
  children: ReactNode;
}

export function BusinessGate({ children }: BusinessGateProps) {
  const { business, isLoading, error } = useBusinessOptional();

  if (isLoading) return <PageLoading variant="list" />;
  if (error || !business) return <NoBusinessBody />;
  return <>{children}</>;
}

function NoBusinessBody() {
  const navigate = useNavigate();
  return (
    <Center h="60vh">
      <VStack spacing={6} maxW="md" textAlign="center">
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="sm"
          py={8}
          px={6}
        >
          <AlertIcon boxSize="40px" mr={0} mb={4} />
          <AlertTitle fontSize="lg" mb={2}>
            Complete Your Setup
          </AlertTitle>
          <AlertDescription maxW="sm" mb={6}>
            You haven't set up your business yet. Complete the onboarding to start accepting bookings.
          </AlertDescription>
          <PrimaryButton onClick={() => navigate(ROUTES.ONBOARDING)} size="lg">
            Complete Setup
          </PrimaryButton>
        </Alert>
      </VStack>
    </Center>
  );
}
