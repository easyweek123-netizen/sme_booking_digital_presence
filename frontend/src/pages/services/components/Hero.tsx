import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Container,
} from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon } from '../../../components/icons';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { HERO } from '../content';

const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionHStack = motion.create(HStack);

function scrollTo(targetId: string) {
  const el = document.querySelector(targetId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="surface.page"
      py={{ base: 16, md: 24 }}
    >
      {/* Subtle gradient backdrop */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-br, brand.50, surface.page 60%, surface.page)"
        pointerEvents="none"
        aria-hidden="true"
      />

      <Container maxW="container.xl" position="relative">
        <VStack spacing={6} align="flex-start" maxW="800px">
          <MotionBox
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Text
              fontSize="sm"
              fontWeight="600"
              color="accent.primary"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {HERO.eyebrow}
            </Text>
          </MotionBox>

          <MotionHeading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="700"
            lineHeight="1.1"
            letterSpacing="tight"
            color="text.strong"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          >
            {HERO.title}
          </MotionHeading>

          <MotionText
            fontSize={{ base: 'lg', md: 'xl' }}
            color="text.secondary"
            lineHeight="1.6"
            maxW="640px"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            {HERO.subtitle}
          </MotionText>

          <MotionHStack
            spacing={4}
            pt={4}
            flexWrap="wrap"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <PrimaryButton
              size="lg"
              rightIcon={<ArrowRightIcon size={18} />}
              onClick={() => scrollTo(HERO.primaryCta.target)}
            >
              {HERO.primaryCta.label}
            </PrimaryButton>
            <Button
              size="lg"
              variant="ghost"
              color="text.strong"
              fontWeight="500"
              onClick={() => scrollTo(HERO.secondaryCta.target)}
              _hover={{ bg: 'surface.alt' }}
            >
              {HERO.secondaryCta.label}
            </Button>
          </MotionHStack>
        </VStack>
      </Container>
    </Box>
  );
}
