import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Circle,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

interface Step {
  id: number;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Signup',
    description: 'Tell us briefly about your business name and create an account',
    color: 'accent.primary',
  },
  {
    id: 2,
    title: 'Setup',
    description: 'Setup your services, pricing and business profile with chat assistant.',
    color: 'accent.primary',
  },
  {
    id: 3,
    title: 'Share',
    description: 'Share your booking website with your customers',
    color: 'accent.primary',
  },
  {
    id: 4,
    title: 'Get Bookings',
    description: 'Chat with AI to learn who is booking and when, and get notified',
    color: 'accent.primary',
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      position="relative"
      flex="1"
      minW={{ base: '100%', md: '220px' }}
    >
      <VStack spacing={4} align="center" textAlign="center">
        {/* Step number circle */}
        <Box position="relative">
          <Circle
            size={{ base: '80px', md: '100px' }}
            bg="brand.50"
            position="relative"
          >
            <Circle
              size={{ base: '60px', md: '72px' }}
              bg="brand.500"
              color="white"
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              boxShadow="card"
            >
              {step.id}
            </Circle>
          </Circle>
        </Box>

        {/* Step content */}
        <VStack spacing={2}>
          <Heading
            as="h3"
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="600"
          >
            {step.title}
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            maxW="200px"
          >
            {step.description}
          </Text>
        </VStack>
      </VStack>
    </MotionBox>
  );
}

function MobileConnector() {
  return (
    <Box
      display={{ base: 'flex', md: 'none' }}
      w="2px"
      h="40px"
      bg="border.subtle"
      mx="auto"
      borderRadius="full"
    />
  );
}

export function HowItWorks() {
  return (
    <Box id="how-it-works" py={{ base: 16, md: 24 }} bg="surface.page">
      <Container maxW="container.xl">
        <VStack spacing={{ base: 12, md: 16 }}>
          {/* Section header */}
          <VStack spacing={4} textAlign="center" maxW="600px">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="700"
              >
                How It Works
              </Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Text fontSize={{ base: 'md', md: 'lg' }}>
                Get your professional booking page up and running in minutes
              </Text>
            </MotionBox>
          </VStack>

          {/* Steps - Desktop: horizontal, Mobile: vertical */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'flex-start' }}
            justify="center"
            gap={{ base: 0, md: 0 }}
            w="full"
            maxW="1000px"
            mx="auto"
          >
            {steps.map((step, index) => (
              <Box key={step.id}>
                <StepCard step={step} index={index} />
                {index < steps.length - 1 && (
                  <>
                    <HStack justify="center" display={{ base: 'none', md: 'flex' }}>
                      {/* <ConnectorLine /> */}
                    </HStack>
                    <MobileConnector />
                  </>
                )}
              </Box>
            ))}
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}

