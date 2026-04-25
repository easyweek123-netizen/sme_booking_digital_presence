import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { SECTION_PADDING } from '../../constants';

const MotionBox = motion.create(Box);

export function DemoPreview() {
  return (
    <Box
      id="demo"
      py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }}
      bg="surface.alt"
    >
      <Container maxW="container.lg">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={{ base: 8, md: 12 }}>
            {/* Section Header */}
            <VStack spacing={4} textAlign="center">
              <Heading
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="800"
                color="text.heading"
                letterSpacing="-0.02em"
              >
                See What Your Customers See
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="text.muted"
                maxW="520px"
              >
                A clean, professional booking page — ready to share in minutes
              </Text>
            </VStack>

            {/* Browser Frame Mockup */}
            <Box
              w="100%"
              maxW="800px"
              mx="auto"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="modal"
              border="1px solid"
              borderColor="border.subtle"
            >
              {/* Browser Chrome */}
              <HStack
                bg="surface.page"
                px={4}
                py={3}
                borderBottom="1px solid"
                borderColor="border.subtle"
                spacing={3}
              >
                {/* Traffic lights */}
                <HStack spacing={2}>
                  <Box w="12px" h="12px" borderRadius="full" bg="gray.300" />
                  <Box w="12px" h="12px" borderRadius="full" bg="gray.300" />
                  <Box w="12px" h="12px" borderRadius="full" bg="gray.300" />
                </HStack>
                {/* Address bar */}
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

              {/* Screenshot */}
              <Image
                src="/demo-booking-page.png"
                alt="Example BookEasy booking page showing services, availability and booking flow"
                w="100%"
                display="block"
                fallback={
                  <Box
                    bg="surface.card"
                    py={20}
                    textAlign="center"
                  >
                    <Text color="text.faint" fontSize="sm">
                      Booking page preview
                    </Text>
                  </Box>
                }
              />
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
