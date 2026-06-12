import { Stack, Heading, Text, Flex, Button, Box, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { SectionShell } from './shared/SectionShell';
import { HeroGridBackdrop } from './shared/HeroGridBackdrop';
import { EyebrowLabel } from './shared/EyebrowLabel';
import { BrowserFrame } from './shared/BrowserFrame';
import { landingV2Content } from '@/pages/landing-v2/content';
import { SmartImage } from '../ui/SmartImage';

export function Hero() {
  const { eyebrow, headline, subhead, primaryCta, secondaryCta, microTrust, mockupImage } =
    landingV2Content.hero;

  return (
    <SectionShell variant="page" backdrop={<HeroGridBackdrop />}>
      <Stack spacing={{ base: 4 }} align="center">
        <Stack textAlign="center" align="center" maxW="820px">
          <EyebrowLabel>{eyebrow}</EyebrowLabel>
          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            lineHeight="shorter"
            letterSpacing="tight"
          >
            {headline.map((part, i) =>
              part.accent
                ? <Text as="span" key={i} color="accent.primary">{part.text}</Text>
                : <Text as="span" key={i} color="text.heading">{part.text}</Text>,
            )}
          </Heading>
        </Stack>
        <Stack align="center" textAlign="center" maxW="820px" spacing={{ base: 4, md: 8 }}>
          <Text color="text.secondary" fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
            {subhead}
          </Text>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="center"
            gap={4}
            w="full"
            maxW={{ base: 'sm', sm: 'none' }}
            mx="auto"
          >
            <Button as={RouterLink} to={primaryCta.href} variant="solid" size="lg">
              {primaryCta.label}
            </Button>
            <Button as="a" href={secondaryCta.anchor} variant="outline" size="lg">
              ▶ {secondaryCta.label}
            </Button>
          </Flex>
          <Text color="text.primary" fontSize="sm">{microTrust}</Text>
        </Stack>
        <Box w="full" maxW="960px" position="relative">
          <BrowserFrame url="bookeasy.app/dashboard/canvas">
            <SmartImage
              src={mockupImage}
              alt="BookEasy AI canvas preview"
              ratio={16 / 10}        
              objectFit="contain"    
              borderRadius={0}       
              eager                  
            />
          </BrowserFrame>
        </Box>
      </Stack>
    </SectionShell>
  );
}
