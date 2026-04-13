import { Box, Container, Heading } from '@chakra-ui/react';
import { AboutTab } from '../../../components/Booking';

interface AboutSectionProps {
  content: string | null;
  brandColor?: string | null;
}

export function AboutSection({ content, brandColor }: AboutSectionProps) {
  if (!content) return null;

  return (
    <Box as="section" id="about" py={6}>
      <Container maxW="600px" px={6}>
        <Heading size="lg" color="gray.900" mb={6} letterSpacing="-0.02em">
          About
        </Heading>
        <Box
          bg="white"
          borderRadius="xl"
          border="1px"
          borderColor="gray.100"
          p={6}
        >
          <AboutTab content={content} brandColor={brandColor} />
        </Box>
      </Container>
    </Box>
  );
}
