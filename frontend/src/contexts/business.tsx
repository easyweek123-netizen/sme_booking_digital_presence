import { createContext, useContext, type ReactNode } from 'react';
import {
  Box, Button, Center, Circle, Divider, HStack, Heading, Text, VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGetMyBusinessQuery } from '../store/api/businessApi';
import { PageLoading } from '../components/ui/states';
import { ROUTES } from '../config/routes';
import { CalendarIcon, CheckIcon } from '../components/icons';
import type { BusinessWithServices } from '../types';

const BusinessContext = createContext<BusinessWithServices | null>(null);

/**
 * Fetches the current owner's business and gates its children on a successful
 * load. While loading, renders <PageLoading />. On error or missing business,
 * renders the "complete your setup" CTA. Children only mount when `business`
 * is defined — that's why `useBusiness()` below never returns null.
 */
export function BusinessProvider({ children }: { children: ReactNode }) {
  const { data: business, isLoading, error } = useGetMyBusinessQuery();
  if (isLoading) return <PageLoading variant="list" />;
  if (error || !business) return <NoBusinessBody />;
  return <BusinessContext.Provider value={business}>{children}</BusinessContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBusiness(): BusinessWithServices {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used within <BusinessProvider>.');
  return ctx;
}

function NoBusinessBody() {
  const navigate = useNavigate();
  return (
    <Center h="70vh" px={4}>
      <Box
        bg="surface.card"
        p={{ base: 6, md: 10 }}
        maxW="xl"
        w="full"
        borderRadius="md"
        boxShadow="card"
        border="1px solid"
        borderColor="border.subtle"
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative corner ambient glow */}
        <Box
          position="absolute"
          top="-40px"
          right="-40px"
          w="100px"
          h="100px"
          bg="brand.50"
          filter="blur(40px)"
          borderRadius="full"
          pointerEvents="none"
        />
        
        <VStack spacing={6} align="center">
          {/* Header Icon */}
          <Circle
            size="72px"
            bg="brand.50"
            color="brand.500"
            mb={2}
            transition="all 0.3s ease"
            _hover={{ transform: 'scale(1.08) rotate(5deg)', bg: 'brand.100' }}
          >
            <CalendarIcon size={32} />
          </Circle>

          {/* Typography */}
          <VStack spacing={2}>
            <Heading size="md" color="text.heading" fontWeight="600" letterSpacing="-0.01em">
              Complete Your Business Setup
            </Heading>
            <Text color="text.secondary" fontSize="sm" maxW="md" lineHeight="relaxed">
              You haven't set up your business yet. Complete the onboarding assistant to activate your booking engine and start accepting customer reservations.
            </Text>
          </VStack>

          <Divider borderColor="border.subtle" maxW="xs" />

          {/* Checklist Step Indicators */}
          <VStack spacing={3.5} align="stretch" w="full" maxW="xs" py={2} textAlign="left">
            <HStack spacing={3}>
              <Circle size="22px" bg="sage.100" color="sage.700">
                <CheckIcon size={12} />
              </Circle>
              <Text fontSize="sm" color="text.secondary" fontWeight="500">
                Name your business and write a tagline
              </Text>
            </HStack>
            <HStack spacing={3}>
              <Circle size="22px" bg="sage.100" color="sage.700">
                <CheckIcon size={12} />
              </Circle>
              <Text fontSize="sm" color="text.secondary" fontWeight="500">
                Select your working availability hours
              </Text>
            </HStack>
            <HStack spacing={3}>
              <Circle size="22px" bg="sage.100" color="sage.700">
                <CheckIcon size={12} />
              </Circle>
              <Text fontSize="sm" color="text.secondary" fontWeight="500">
                Publish your services list & page
              </Text>
            </HStack>
          </VStack>

          {/* Premium Call to Action */}
          <Button
            onClick={() => navigate(ROUTES.ONBOARDING)}
            size="lg"
            bg="brand.500"
            color="white"
            borderRadius="full"
            px={8}
            h="50px"
            fontSize="sm"
            fontWeight="600"
            boxShadow="sm"
            _hover={{
              bg: 'brand.600',
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            }}
            _active={{
              bg: 'brand.700',
              transform: 'translateY(0)',
            }}
            transition="all 0.2s ease"
            rightIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            }
          >
            Complete Setup
          </Button>

        </VStack>
      </Box>
    </Center>
  );
}
