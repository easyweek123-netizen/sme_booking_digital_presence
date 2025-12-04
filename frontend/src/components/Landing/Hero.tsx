import { Box, Container, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ROUTES } from '../../config/routes';
import { SECTION_PADDING, CONTENT_MAX_WIDTH } from '../../constants';
import { useAppSelector } from '../../store/hooks';

const MotionVStack = motion.create(VStack);

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

  return (
    <Box bg="white" py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }} overflow="hidden">
      <Container maxW="container.xl">
        <MotionVStack
          spacing={8}
          textAlign="center"
          maxW={CONTENT_MAX_WIDTH.hero}
          mx="auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={4}>
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="800"
              color="gray.900"
              lineHeight="1.1"
              letterSpacing="-0.02em"
            >
              Get Your Business{' '}
              <Text as="span" color="brand.500">
                Online
              </Text>{' '}
              in Minutes
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="gray.500"
              maxW={CONTENT_MAX_WIDTH.heroText}
              lineHeight="1.6"
            >
              Create a professional booking page and start accepting appointments
              today. No technical skills required.
            </Text>
          </VStack>
          <HStack spacing={4}>
            <PrimaryButton
              size="lg"
              px={8}
              py={6}
              fontSize="md"
              onClick={handleStartNow}
            >
              {isAuthenticated ? 'Dashboard' : 'Start Now — It\'s Free'}
            </PrimaryButton>
          </HStack>
        </MotionVStack>
      </Container>
    </Box>
  );
}
