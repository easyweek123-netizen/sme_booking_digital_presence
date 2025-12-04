import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UsersIcon } from '../icons';
import { SECTION_PADDING, CONTENT_MAX_WIDTH, SPACING } from '../../constants';

const MotionBox = motion.create(Box);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

function FeatureCard({ icon, title, description, color, delay }: FeatureCardProps) {
  return (
    <MotionBox
      bg="white"
      p={8}
      borderRadius="2xl"
      border="1px"
      borderColor="gray.100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      _hover={{
        borderColor: 'gray.200',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}
    >
      <VStack align="start" spacing={4}>
        <Box
          w="56px"
          h="56px"
          borderRadius="xl"
          bg={`${color}15`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={color}
        >
          {icon}
        </Box>
        <Heading as="h3" fontSize="xl" fontWeight="600" color="gray.900">
          {title}
        </Heading>
        <Text color="gray.500" lineHeight="1.7">
          {description}
        </Text>
      </VStack>
    </MotionBox>
  );
}

const features = [
  {
    icon: <CalendarIcon size={32} />,
    title: 'Easy Booking',
    description:
      'Your customers can book appointments 24/7 from any device. Simple, fast, and hassle-free.',
    color: '#EC4899',
  },
  {
    icon: <ClockIcon size={32} />,
    title: 'Save Time',
    description:
      'Spend less time on the phone and more time with your clients. Automate your scheduling.',
    color: '#14B8A6',
  },
  {
    icon: <UsersIcon size={32} />,
    title: 'Grow Your Business',
    description:
      'Reach more customers with your professional online presence and booking system.',
    color: '#22C55E',
  },
];

export function Features() {
  return (
    <Box py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }} bg="white">
      <Container maxW="container.xl">
        <VStack spacing={{ base: SPACING.section.base, md: SPACING.section.md }}>
          <VStack spacing={4} textAlign="center" maxW={CONTENT_MAX_WIDTH.section}>
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="700"
              color="gray.900"
            >
              Everything You Need to Grow
            </Heading>
            <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>
              Simple tools that help you manage appointments and grow your
              business.
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: SPACING.card.base, md: SPACING.card.md }}
            w="full"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 0.1}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
