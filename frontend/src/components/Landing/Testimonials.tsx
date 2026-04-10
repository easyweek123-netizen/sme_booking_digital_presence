import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { SECTION_PADDING } from '../../constants';

const MotionBox = motion.create(Box);

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  gradient: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Lisa M.',
    role: 'Massage Therapist, Linz',
    quote:
      'I used to manage bookings through WhatsApp messages. Now clients book themselves and I get email confirmations instantly. Setup took me 3 minutes.',
    initials: 'LM',
    gradient: 'linear(to-br, purple.400, pink.400)',
  },
  {
    name: 'Markus W.',
    role: 'Barber, Vienna',
    quote:
      'My clients love the booking page — it looks professional and works perfectly on their phones. I just share the QR code in my shop.',
    initials: 'MW',
    gradient: 'linear(to-br, blue.400, teal.400)',
  },
  {
    name: 'Sarah K.',
    role: 'Yoga Instructor, Graz',
    quote:
      "I was paying for another booking tool that was way too complicated. BookEasy does exactly what I need — simple, clean, and it's free.",
    initials: 'SK',
    gradient: 'linear(to-br, orange.400, red.400)',
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.100"
        p={{ base: 6, md: 8 }}
        h="100%"
        _hover={{
          borderColor: 'gray.200',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}
        transition="all 0.2s"
      >
        <VStack align="start" spacing={4} h="100%">
          {/* Quote */}
          <Text
            color="gray.600"
            fontSize={{ base: 'sm', md: 'md' }}
            lineHeight="1.7"
            flex={1}
          >
            &ldquo;{testimonial.quote}&rdquo;
          </Text>

          {/* Author */}
          <Flex align="center" gap={3} pt={2}>
            <Flex
              w="40px"
              h="40px"
              borderRadius="full"
              bgGradient={testimonial.gradient}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Text
                color="white"
                fontSize="xs"
                fontWeight="700"
                letterSpacing="0.05em"
              >
                {testimonial.initials}
              </Text>
            </Flex>
            <Box>
              <Text
                fontWeight="600"
                fontSize="sm"
                color="gray.900"
                lineHeight="1.3"
              >
                {testimonial.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {testimonial.role}
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Box>
    </MotionBox>
  );
}

export function Testimonials() {
  return (
    <Box
      id="testimonials"
      py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }}
      bg="white"
    >
      <Container maxW="container.lg">
        <VStack spacing={{ base: 8, md: 12 }}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="800"
              color="gray.900"
              letterSpacing="-0.02em"
            >
              Trusted by Practitioners
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.500"
              maxW="480px"
            >
              Join wellness professionals who simplified their booking process
            </Text>
          </VStack>

          {/* Testimonial Cards */}
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 6, md: 8 }}
            w="100%"
          >
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={i}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
