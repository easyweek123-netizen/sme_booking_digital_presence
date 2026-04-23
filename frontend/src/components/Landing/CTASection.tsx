import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/hooks';

const MotionBox = motion.create(Box);

export function CTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.ROOT);
    } else {
      navigate(ROUTES.ONBOARDING);
    }
  };

  return (
    <Box
      bg="surface.inverted"
      py={{ base: 20, md: 32 }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative radial gradient */}
      <Box
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
        w="150%"
        h="100%"
        bgGradient="radial(circle at 50% 0%, brand.600, transparent 60%)"
        opacity={0.25}
        pointerEvents="none"
      />

      <Container maxW="container.md" position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="700"
              color="text.inverted"
              lineHeight="1.2"
            >
              Focus on your clients.
              <br />
              We handle the bookings.
            </Heading>
            <Text
              color="text.inverted"
              opacity={0.8}
              fontSize={{ base: 'md', md: 'lg' }}
              maxW="500px"
            >
              Create your professional booking page in 2 minutes.
              Free forever, no credit card required.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="brand.500"
              colorScheme="whiteAlpha"
              px={{ base: 8, md: 10 }}
              py={6}
              fontWeight="600"
              fontSize={{ base: 'md', md: 'lg' }}
              _hover={{
                bg: 'gray.100',
                transform: 'translateY(-2px)',
              }}
              _active={{ bg: 'gray.200', transform: 'translateY(0)' }}
              transition="all 0.2s"
              onClick={handleClick}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </Button>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
