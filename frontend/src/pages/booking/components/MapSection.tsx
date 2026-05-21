import { Box, Container, Heading, AspectRatio, Text, Link, Stack, Image } from '@chakra-ui/react';
import type { BusinessWithServices } from '../../../types';

interface MapSectionProps {
  business: BusinessWithServices;
}

export function MapSection({ business }: MapSectionProps) {
  const hasLocation = business.address || business.city;

  if (!hasLocation) return null;

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    [business.address, business.city].filter(Boolean).join(', ')
  )}`;

  return (
    <Box as="section" bg="surface.page" py={{ base: 8, md: 12 }} id="map">
      <Container maxW="container.xl" px={{ base: 4 }}>
        <Heading size="lg" color="text.heading" mb={6} letterSpacing="-0.02em">
          Location
        </Heading>
        
        <Stack spacing={4}>
          <AspectRatio ratio={16 / 9} maxW="100%">
            <Box
              borderRadius="xl"
              border="1px solid"
              borderColor="border.subtle"
              overflow="hidden"
              bg="gray.100"
              position="relative"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              onClick={() => window.open(mapsUrl, '_blank')}
              as="a"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://api.mapbox.com/styles/v1/mapbox/light-v11/static/0,20,1,0,0/1280x720@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazAwMDAwMDAwMDAwIn0.000000000000000000000000"
                alt="Map location"
                w="100%"
                h="100%"
                objectFit="cover"
                fallback={
                  <Box
                    w="100%"
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  >
                    <Box textAlign="center" color="white">
                      <Text fontSize="4xl" mb={2}>
                        📍
                      </Text>
                      <Text fontSize="sm" fontWeight="500">
                        {[business.address, business.city].filter(Boolean).join(', ')}
                      </Text>
                    </Box>
                  </Box>
                }
              />
            </Box>
          </AspectRatio>
          
          <Link
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="accent.primary"
            fontSize="sm"
            fontWeight="500"
            _hover={{ textDecoration: 'underline' }}
          >
            Get directions
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
