import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import demoBookingPage from '@/assets/images/hero/hero-demo-booking-page.png';
import demoBookingPageTime from '@/assets/images/hero/hero-demo-booking-page-time.png';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/hooks';
import { HeroCarousel } from './HeroCarousel';

const MotionBox = motion.create(Box);

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="modal"
      border="1px solid"
      borderColor="border.subtle"
    >
      <HStack
        bg="surface.page"
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor="border.subtle"
        spacing={3}
      >
        <HStack spacing={2}>
          <Box w="12px" h="12px" borderRadius="full" bg="gray.300" />
          <Box w="12px" h="12px" borderRadius="full" bg="gray.300" />
          <Box w="12px" h="12px" borderRadius="full" bg="gray.300" />
        </HStack>
        <Box
          flex={1}
          bg="surface.card"
          borderRadius="md"
          px={3}
          py={1.5}
          fontSize="xs"
          color="text.muted"
          border="1px solid"
          borderColor="border.subtle"
        >
          bookeasy.app/your-business
        </Box>
      </HStack>
      {children}
    </Box>
  );
}

export function TrustBand() {
  return (
    <Box
      bg="surface.card"
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="border.subtle"
      py={6}
    >
      <Container maxW="container.xl">
        <Flex direction="column" align="center" gap={3}>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="text.muted"
            letterSpacing="0.08em"
            textAlign="center"
          >
            TRUSTED BY INDEPENDENT PRACTITIONERS
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

export function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleStartNow = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.ROOT);
    } else {
      navigate(ROUTES.ONBOARDING);
    }
  };

  const handleHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box bg="surface.page" py={{ base: 10, lg: 16 }} overflow="hidden">
      <Container maxW="container.xl">
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 12, md: 16 }}
          alignItems="center"
        >
          {/* Left column — copy + CTAs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Flex direction="column" gap={6}>
              <Text
                fontSize="xs"
                fontWeight="700"
                color="accent.primary"
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                For Service Professionals
              </Text>

              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                color="gray.800"
              >
                A booking page that does the Work
                <Text
                  fontSize={{ base: '6xl', md: '7xl', lg: '7xl' }}
                  color="brand.500"
                >
                  for you.
                </Text>
              </Heading>

              <HStack spacing={3} flexWrap="wrap">
                <Button size="lg" px={8} onClick={handleStartNow}>
                  {isAuthenticated ? 'Go to dashboard' : 'Create your website'}
                </Button>
                <Button size="lg" variant="outline" onClick={handleHowItWorks}>
                  See how it works
                </Button>
              </HStack>
            </Flex>
          </MotionBox>

          {/* Right column — device frame preview */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            maxW={{ base: '400px', md: 'none' }}
            mx={{ base: 'auto', md: 0 }}
            position="relative"
          >
            {/* Brand glow disc */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="80%"
              h="80%"
              borderRadius="full"
              bg="brand.500"
              opacity={0.08}
              filter="blur(48px)"
              zIndex={0}
              pointerEvents="none"
            />
            <Box position="relative" zIndex={1}>
              <BrowserFrame>
                {/* <Image
                  src={demoBookingPage}
                  alt="BookEasy booking page preview showing services, time slots and customer booking flow"
                  w="100%"
                  display="block"
                  fallback={
                    <Box bg="surface.card" py={20} textAlign="center">
                      <Text color="text.muted" fontSize="sm">
                        Booking page preview
                      </Text>
                    </Box>
                  }
                /> */}
                <HeroCarousel slides={[
                  {src: demoBookingPage, alt: 'BookEasy booking page preview'},
                  {src: demoBookingPageTime, alt: 'BookEasy booking page time selection'},
                ]} />
              </BrowserFrame>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
