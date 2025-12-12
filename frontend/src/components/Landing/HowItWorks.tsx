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
import { SECTION_PADDING } from '../../constants';

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
    title: 'Add Business Info',
    description: 'Enter your name, hours, and location',
    color: '#8B5CF6', // Purple
  },
  {
    id: 2,
    title: 'Add Services',
    description: 'Set your services, prices, and durations',
    color: '#14B8A6', // Teal
  },
  {
    id: 3,
    title: 'Create Account',
    description: 'Sign up with Google to save your page',
    color: '#F97316', // Orange
  },
  {
    id: 4,
    title: 'Share & Grow',
    description: 'Get your link and start accepting bookings',
    color: '#3B82F6', // Blue
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
            bg={`${step.color}15`}
            position="relative"
          >
            <Circle
              size={{ base: '60px', md: '72px' }}
              bg={step.color}
              color="white"
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              boxShadow={`0 8px 24px ${step.color}40`}
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
            color="gray.900"
          >
            {step.title}
          </Heading>
          <Text
            color="gray.500"
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

function ConnectorLine() {
  return (
    <Box
      display={{ base: 'none', md: 'block' }}
      flex="0 0 auto"
      w="60px"
      h="2px"
      bg="gray.200"
      borderRadius="full"
      position="relative"
      top="-20px"
      sx={{
        backgroundImage: 'linear-gradient(90deg, transparent 50%, gray.200 50%)',
        backgroundSize: '8px 2px',
      }}
    />
  );
}

function MobileConnector() {
  return (
    <Box
      display={{ base: 'flex', md: 'none' }}
      w="2px"
      h="40px"
      bg="gray.200"
      mx="auto"
      borderRadius="full"
    />
  );
}

export function HowItWorks() {
  return (
    <Box id="how-it-works" py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }} bg="white">
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
                color="gray.900"
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
              <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>
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
                      <ConnectorLine />
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

