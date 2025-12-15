import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header, Footer } from '../../components/Layout';
import { PricingCard, FeedbackForm } from '../../components/Pricing';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/hooks';

const MotionVStack = motion.create(VStack);

const FREE_FEATURES = [
  'Professional booking page',
  'Unlimited services',
  'Unlimited bookings',
  'Email notifications & reminders',
  'QR code for sharing',
  'Logo & brand color customization',
  'Cover image upload',
  'About section with HTML support',
  'Service categories',
  'Verified bookings (Google/Email)',
  'Working hours display',
  'Contact info & social links',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Multi-page website builder',
  'Custom domain (yourname.com)',
  'Visitor analytics dashboard',
  'SEO optimization tools',
  'Remove BookEasy branding',
  'Priority email support',
  'Advanced customization options',
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

  const handleGetNotified = () => {
    // Scroll to feedback form
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) {
      feedbackSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box minH="100vh" bg="white">
      {/* Hero Section */}
      <Box
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient */}
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
              color="gray.900"
              lineHeight="1.1"
              letterSpacing="-0.02em"
            >
              Simple, Transparent{' '}
              <Text as="span" color="brand.500">
                Pricing
              </Text>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="gray.600"
              maxW="560px"
              lineHeight="1.7"
            >
              Everything you need to grow your business. Start free today,
              upgrade when you're ready.
            </Text>
          </MotionVStack>

          {/* Pricing Cards */}
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 6, md: 8 }}
            maxW="900px"
            mx="auto"
            alignItems="stretch"
          >
            <PricingCard
              title="Free Forever"
              price="$0"
              priceSubtext="/month"
              features={FREE_FEATURES}
              buttonText={isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              onButtonClick={handleGetStarted}
              badge="Current Plan"
              delay={0}
            />
            <PricingCard
              title="Premium"
              price="Soon"
              features={PREMIUM_FEATURES}
              buttonText="Get Notified"
              onButtonClick={handleGetNotified}
              isPremium
              badge="Coming Soon"
              delay={0.1}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Feedback Section */}
      <Box id="feedback-section">
        <FeedbackForm />
      </Box>

      <Footer />
    </Box>
  );
}

