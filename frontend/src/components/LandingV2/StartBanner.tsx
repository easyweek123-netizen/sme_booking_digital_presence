import { Box, Button, Stack, Heading, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { landingV2Content } from '@/pages/landing-v2/content';

export function StartBanner() {
  const { headline, subhead, cta, microTrust } = landingV2Content.startBanner;

  return (
    <Box
      as="section"
      bg="surface.inverted"
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 8 }}
      py={{ base: 16 }}
    >
      {/* Radial violet glow at top-center, soft and contained */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        opacity={0.35}
        bgImage="radial-gradient(ellipse 60% 50% at 50% 0%, var(--chakra-colors-accent-primary) 0%, transparent 65%)"
      />

      <Stack
        position="relative"
        zIndex={1}
        maxW="900px"
        mx="auto"
        spacing={{ base: 4, md: 8 }}
        align="center"
        textAlign="center"
      >
        <Heading
          as="h2"
          color="surface.card"
          fontSize={{ base: '3xl', md: '5xl' }}
          lineHeight="shorter"
          letterSpacing="tight"
        >
          {headline}
        </Heading>
        <Text
          color="text.faint"
          fontSize={{ base: 'md', md: 'lg' }}
          lineHeight="tall"
          maxW="640px"
        >
          {subhead + ' ' + microTrust}
        </Text>
        <Button
          as={RouterLink}
          to={cta.href}
          variant="accent"
          size="lg"
        >
          {cta.label}
        </Button>
      </Stack>
    </Box>
  );
}
