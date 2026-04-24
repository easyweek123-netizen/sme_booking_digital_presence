import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { ServicesTab } from '../../../components/Booking';
import type { Service } from '../../../types';

interface ServicesSectionProps {
  services: Service[];
  brandColor?: string | null;
  onBookService: (service: Service) => void;
}

export function ServicesSection({ services, brandColor, onBookService }: ServicesSectionProps) {
  if (services.length === 0) {
    return (
      <Box as="section" id="services" py={12}>
        <Container maxW="600px" px={6}>
          <Box p={8} textAlign="center" borderRadius="xl" bg="surface.alt">
            <Text color="text.muted">No services available at the moment.</Text>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box as="section" id="services" py={6} bg="surface.alt">
      <Container maxW="600px" px={6}>
        <Heading size="lg" color="text.heading" mb={2} letterSpacing="-0.02em">
          Services
        </Heading>
        <Text color="text.muted" mb={6} fontSize="sm">
          Choose a service to book your appointment
        </Text>
        <ServicesTab
          services={services}
          brandColor={brandColor}
          onBookService={onBookService}
        />
      </Container>
    </Box>
  );
}
