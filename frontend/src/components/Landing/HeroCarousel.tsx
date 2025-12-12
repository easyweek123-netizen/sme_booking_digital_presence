import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/hooks';
import { CheckCircleIcon } from '../icons';

const MotionBox = motion.create(Box);

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  color: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Your Professional Booking Page',
    subtitle: 'Free forever. Ready in 2 minutes.',
    color: '#8B5CF6', // Purple
  },
  {
    id: 2,
    title: 'Accept Bookings 24/7',
    subtitle: 'Customers book anytime, from any device.',
    color: '#14B8A6', // Teal
  },
  {
    id: 3,
    title: 'Focus on Clients, Not Admin',
    subtitle: 'Automated notifications. Zero hassle.',
    color: '#F97316', // Orange
  },
  {
    id: 4,
    title: 'Share Your Page Anywhere',
    subtitle: 'QR code, link, or embed on your website.',
    color: '#3B82F6', // Blue
  },
];

const trustBadges = [
  'No credit card',
  'Free forever',
  '2 min setup',
];

const SLIDE_DURATION = 5000; // 5 seconds

export function HeroCarousel() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleStartNow = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.ROOT);
    } else {
      navigate(ROUTES.ONBOARDING);
    }
  };

  const currentColor = slides[currentSlide].color;

  return (
    <MotionBox
      position="relative"
      minH={{ base: '85vh', md: '90vh' }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      animate={{ backgroundColor: currentColor }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="50%"
        h="70%"
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="40%"
        h="50%"
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(40px)"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack
          spacing={{ base: 8, md: 10 }}
          textAlign="center"
          maxW="800px"
          mx="auto"
          py={{ base: 16, md: 20 }}
        >
          {/* Slide content */}
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <VStack spacing={4}>
                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                  fontWeight="800"
                  color="white"
                  lineHeight="1.1"
                  letterSpacing="-0.02em"
                >
                  {slides[currentSlide].title}
                </Heading>
                <Text
                  fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                  color="whiteAlpha.900"
                  maxW="600px"
                  lineHeight="1.5"
                >
                  {slides[currentSlide].subtitle}
                </Text>
              </VStack>
            </MotionBox>
          </AnimatePresence>

          {/* CTA Button */}
          <PrimaryButton
            size="lg"
            px={{ base: 8, md: 10 }}
            py={{ base: 6, md: 7 }}
            fontSize={{ base: 'md', md: 'lg' }}
            bg="white"
            color={currentColor}
            _hover={{
              bg: 'whiteAlpha.900',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
            onClick={handleStartNow}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
          </PrimaryButton>

          {/* Trust badges */}
          <HStack
            spacing={{ base: 4, md: 6 }}
            flexWrap="wrap"
            justify="center"
          >
            {trustBadges.map((badge) => (
              <Flex
                key={badge}
                align="center"
                gap={2}
                color="whiteAlpha.800"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <CheckCircleIcon size={16} />
                <Text>{badge}</Text>
              </Flex>
            ))}
          </HStack>

          {/* Slide indicators */}
          <HStack spacing={2} pt={4}>
            {slides.map((slide, index) => (
              <Box
                key={slide.id}
                w={currentSlide === index ? '24px' : '8px'}
                h="8px"
                borderRadius="full"
                bg={currentSlide === index ? 'white' : 'whiteAlpha.400'}
                cursor="pointer"
                transition="all 0.3s ease"
                onClick={() => setCurrentSlide(index)}
                _hover={{ bg: 'whiteAlpha.700' }}
              />
            ))}
          </HStack>
        </VStack>
      </Container>
    </MotionBox>
  );
}

