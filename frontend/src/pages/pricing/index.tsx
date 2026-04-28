import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Footer } from '../../components/Layout';
import { PricingCard, FeedbackForm } from '../../components/Pricing';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/hooks';

const MotionVStack = motion.create(VStack);

const FREE_FEATURES = [
  'Professional booking page',
  '3 service',
  '30 bookings per month',
  'AI chat with unpersistent memory.',
  'Email confirmations to you and your client',
  'Logo, brand color & cover image',
  'Service categories',
  'Verified bookings (Google or email)',
  'QR code for in-person sharing',
  'Working hours',
  '"Powered by BookEasy" footer on your booking page',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited services',
  'Unlimited bookings',
  'Persistent AI memory. Your assistant remembers every past conversation',
  'Analytics, revenue, conversion, top services & page views',
  'Automatic 24-hour email reminders to clients',
  'Calendar sync — Google, Apple & Outlook via ICS',
  'Remove BookEasy branding from your booking page',
  'Custom domain — e.g. book.yoursalon.com',
  'Priority support',
];

const GROWTH_FEATURES = [
  'Everything in Pro',
  'Staff management with per-staff hours (unlimited team)',
  'AI receptionist on WhatsApp — books appointments autonomously',
  'AI receptionist on Instagram DM',
  'AI receptionist on Facebook Messenger',
  'Unified inbox — every channel in one thread view',
  'Auto-booking from chat — 70%+ of messages handled without you',
  'Owner takeover — when you reply, AI pauses for that thread',
  'Smart escalation — AI flags messages it isn\'t sure about',
];

export function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.ROOT);
    } else {
      navigate(ROUTES.ONBOARDING);
    }
  };

  const scrollToNotify = () => {
    document.getElementById('get-notified')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box minH="100vh" bg="surface.card">
      {/* Hero Section */}
      <Box
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-b, gray.50, white)"
          zIndex={0}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <MotionVStack
            spacing={6}
            textAlign="center"
            maxW="700px"
            mx="auto"
            mb={{ base: 12, md: 16 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="800"
              color="text.heading"
              lineHeight="1.1"
              letterSpacing="-0.02em"
            >
              Simple, transparent{' '}
              <Text as="span" color="accent.primary">
                pricing
              </Text>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="text.secondary"
              maxW="560px"
              lineHeight="1.7"
            >
              Start free. Upgrade when you need a smarter assistant.
            </Text>
          </MotionVStack>

          {/* Pricing Cards */}
          <SimpleGrid
            columns={{ base: 1, lg: 3 }}
            spacing={{ base: 6, md: 8 }}
            maxW="1200px"
            mx="auto"
            alignItems="stretch"
          >
            <PricingCard
              title="Free"
              price="€0"
              priceSubtext="forever"
              features={FREE_FEATURES}
              buttonText={isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              onButtonClick={handleGetStarted}
              badge={isAuthenticated ? 'Current Plan' : undefined}
              delay={0}
            />
            <PricingCard
              title="Pro"
              price="€19"
              priceSubtext="/ month"
              features={PRO_FEATURES}
              buttonText="Get Notified"
              onButtonClick={scrollToNotify}
              badge="Coming Soon"
              isPremium
              delay={0.1}
            />
            <PricingCard
              title="Growth"
              price="€49"
              priceSubtext="/ month"
              features={GROWTH_FEATURES}
              buttonText="Get Notified"
              onButtonClick={scrollToNotify}
              isPremium
              badge="Coming Soon"
              delay={0.2}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Notify-me form */}
      <Box id="get-notified">
        <FeedbackForm />
      </Box>

      {/* Cross-sell strip */}
      <Box
        py={6}
        bg="surface.alt"
        borderTop="1px"
        borderColor="border.subtle"
        textAlign="center"
      >
        <HStack justify="center" spacing={2} flexWrap="wrap">
          <Text fontSize="sm" color="text.secondary">
            Building something custom?
          </Text>
          <RouterLink
            to={ROUTES.SERVICES}
            style={{ fontSize: 'inherit' }}
          >
            <Text
              as="span"
              fontSize="sm"
              fontWeight="600"
              color="accent.primary"
              _hover={{ color: 'accent.hover', textDecoration: 'underline' }}
            >
              We do that too → Custom Software
            </Text>
          </RouterLink>
        </HStack>
      </Box>

      <Footer />
    </Box>
  );
}
