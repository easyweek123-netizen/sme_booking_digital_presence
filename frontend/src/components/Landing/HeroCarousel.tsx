import { Box, Text, HStack, Image } from '@chakra-ui/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

const MotionBox = motion.create(Box);

export interface HeroSlide {
  src: string;
  alt: string;
}

interface Props {
  slides: HeroSlide[];
  intervalMs?: number;
}

export function HeroCarousel({ slides, intervalMs = 3000 }: Props) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || reduceMotion || slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [isPaused, reduceMotion, slides.length, intervalMs]);

  if (slides.length === 0) return null;
  const active = slides[index];

  return (
    <Box
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <Box position="relative" overflow="hidden" aria-live="polite" aria-atomic="true">
        {/* Reserve aspect ratio via the first image to avoid layout shift */}
        <Image
          src={slides[0].src}
          alt=""
          w="100%"
          display="block"
          visibility="hidden"
          aria-hidden
        />
        <AnimatePresence mode="sync">
          <MotionBox
            key={active.src}
            position="absolute"
            inset={0}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              w="100%"
              h="100%"
              objectFit="cover"
              display="block"
              loading={index === 0 ? 'eager' : 'lazy'}
              fallback={
                <Box bg="surface.card" py={20} textAlign="center">
                  <Text color="text.muted" fontSize="sm">
                    Booking page preview
                  </Text>
                </Box>
              }
            />
          </MotionBox>
        </AnimatePresence>
      </Box>

      {slides.length > 1 && (
        <HStack justify="center" spacing={2} mt={4}>
          {slides.map((s, i) => {
            const isActive = i === index;
            return (
              <Box
                as="button"
                key={s.src}
                aria-label={`Show slide ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => goTo(i)}
                w={isActive ? '24px' : '8px'}
                h="8px"
                borderRadius="full"
                bg={isActive ? 'brand.500' : 'border.subtle'}
                transition="all 0.25s ease"
                _hover={{ bg: isActive ? 'brand.600' : 'border.strong' }}
                cursor="pointer"
                flexShrink={0}
              />
            );
          })}
        </HStack>
      )}
    </Box>
  );
}