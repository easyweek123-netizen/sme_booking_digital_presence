import { useState } from 'react';
import { Stack, Box, AspectRatio, IconButton, SimpleGrid, Flex, Text } from '@chakra-ui/react';
import { SectionShell } from './shared/SectionShell';
import { SectionHeader } from './shared/SectionHeader';
import { PillCard } from '@/components/LandingV2/shared/PillCard';
import { SmartImage } from '@/components/ui/SmartImage';
import { landingV2Content } from '@/pages/landing-v2/content';

export function VideoShowcase() {
  const { headline, subhead, youtubeEmbedUrl, posterImage, durationLabel, pills } =
    landingV2Content.video;
  const [playing, setPlaying] = useState(false);

  return (
    <SectionShell variant="page" id="video">
      <Stack spacing={{ base: 4, md: 8 }} align="center">
        <SectionHeader headline={headline} subhead={subhead} />

        <Stack w="full" maxW="960px" overflow="hidden" spacing={4}>
          {playing ? (
            <AspectRatio ratio={16 / 9}>
              <iframe
                src={`${youtubeEmbedUrl}?autoplay=1&rel=0`}
                title="BookEasy 90-second tour"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          ) : (
            <Box position="relative" cursor="pointer" onClick={() => setPlaying(true)}>
              <SmartImage
                src={posterImage}
                alt="Video preview"
                ratio={16 / 9}
                borderRadius="none"
                eager
              >
                <Flex
                  align="center"
                  justify="center"
                  direction="column"
                  gap={2}
                  h="full"
                  bg="blackAlpha.100"
                >
                  <IconButton
                    aria-label="Play tour"
                    icon={<Text fontSize="2xl" color="surface.card">▶</Text>}
                    bg="accent.primary"
                    color="surface.card"
                    borderRadius="full"
                    boxSize={16}
                    _hover={{ bg: 'accent.primary', opacity: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setPlaying(true); }}
                  />
                  <Box
                    bg="text.heading"
                    color="surface.card"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                  >
                    ▶ {durationLabel}
                  </Box>
                </Flex>
              </SmartImage>
            </Box>
          )}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
            {pills.map(p => <PillCard key={p.title} {...p} />)}
          </SimpleGrid>
        </Stack>


      </Stack>
    </SectionShell>
  );
}