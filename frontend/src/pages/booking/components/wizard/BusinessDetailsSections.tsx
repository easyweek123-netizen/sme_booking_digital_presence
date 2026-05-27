import { Box, Flex, Text, VStack, Heading, HStack, Avatar, SimpleGrid, Button } from '@chakra-ui/react';
import type { BusinessWithServices } from '../../../../types';

interface Props {
  business: BusinessWithServices;
}

// Star rating component
function StarIcon({ fill = true }: { fill?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={fill ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function BusinessDetailsSections(_props: Props) {
  // Beautiful mock team members
  const team = [
    {
      name: 'Marta H.',
      role: 'Estheticist',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sylvia R.',
      role: 'Stylist',
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Delia G.',
      role: 'Manager',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&auto=format&fit=crop&q=80',
    },
  ];

  // Beautiful mock reviews
  const reviews = [
    {
      name: 'Elena P.',
      date: 'Nov 19, 2026',
      text: 'La atención de Marta fue excelente, muy profesional y dedicada.',
      rating: 5,
    },
    {
      name: 'Lorena T.',
      date: 'Nov 12, 2026',
      text: 'Servicio impecable y el ambiente super relajante. Volveré sin duda!',
      rating: 5,
    },
    {
      name: 'Miriam V.',
      date: 'Nov 08, 2026',
      text: 'Encantada con mi nuevo corte. Grandes profesionales.',
      rating: 5,
    },
    {
      name: 'Patricia L.',
      date: 'Nov 02, 2026',
      text: 'Muy buena experiencia, puntualidad y trato exquisito.',
      rating: 4,
    },
  ];

  return (
    <VStack spacing={12} align="stretch" color="black" w="100%">
      
      {/* 1. TEAM SECTION */}
      <Box borderTop="1px solid" borderColor="#ECECEC" pt={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading fontSize="xl" fontWeight="700" letterSpacing="-0.015em">
            Team
          </Heading>
          <Button variant="unstyled" fontSize="xs" fontWeight="700" color="var(--brand-color, #6B46C1)" _hover={{ textDecoration: 'underline' }}>
            See all
          </Button>
        </Flex>
        <HStack spacing={6} overflowX="auto" pb={2}>
          {team.map((member) => (
            <VStack key={member.name} align="center" spacing={2.5} minW="100px">
              <Box position="relative">
                <Avatar src={member.image} name={member.name} size="lg" border="2px solid white" boxShadow="0 2px 8px rgba(0,0,0,0.06)" />
                <Box
                  position="absolute"
                  bottom="-4px"
                  left="50%"
                  transform="translateX(-50%)"
                  bg="white"
                  boxShadow="0 2px 6px rgba(0,0,0,0.08)"
                  borderRadius="full"
                  px={1.5}
                  py={0.5}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <StarIcon />
                  <Text fontSize="10px" fontWeight="800" color="black">
                    {member.rating}
                  </Text>
                </Box>
              </Box>
              <VStack spacing={0.5} pt={1}>
                <Text fontSize="xs" fontWeight="700" color="black">
                  {member.name}
                </Text>
                <Text fontSize="10px" fontWeight="600" color="gray.400">
                  {member.role}
                </Text>
              </VStack>
            </VStack>
          ))}
        </HStack>
      </Box>

      {/* 2. REVIEWS SECTION */}
      <Box borderTop="1px solid" borderColor="#ECECEC" pt={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading fontSize="xl" fontWeight="700" letterSpacing="-0.015em">
            Reviews
          </Heading>
        </Flex>
        
        {/* Aggregated Rating */}
        <HStack spacing={2} align="center" mb={6}>
          <HStack spacing={0.5}>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
          </HStack>
          <Text fontSize="sm" fontWeight="700" color="black">
            4.9
          </Text>
          <Text fontSize="xs" fontWeight="600" color="gray.400">
            (219 reviews)
          </Text>
        </HStack>

        {/* Reviews Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {reviews.map((r, idx) => (
            <VStack key={idx} align="flex-start" spacing={2} p={4} bg="gray.25" borderRadius="xl" border="1px solid" borderColor="#F1F1F4">
              <HStack justify="space-between" w="100%">
                <Text fontSize="xs" fontWeight="700" color="black">
                  {r.name}
                </Text>
                <Text fontSize="10px" fontWeight="600" color="gray.400">
                  {r.date}
                </Text>
              </HStack>
              <HStack spacing={0.5}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} fill={i < r.rating} />
                ))}
              </HStack>
              <Text fontSize="xs" color="gray.600" lineHeight="relaxed">
                {r.text}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>

        <Button variant="outline" borderColor="#ECECEC" color="black" borderRadius="full" px={6} h="38px" fontSize="xs" fontWeight="700" mt={6} _hover={{ bg: 'gray.50' }}>
          See all
        </Button>
      </Box>

    </VStack>
  );
}
