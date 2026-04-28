import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { Section } from '../../../components/ui/Section';
import { PROOF_POINTS, ABOUT_TEXT } from '../content';

export function WhyUs() {
  return (
    <Section id="why-us" bg="surface.alt" spacing="lg" py={{ base: 16, md: 24 }}>
      <VStack align="flex-start" spacing={4}>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="accent.primary"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          Why us
        </Text>
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '4xl' }}
          color="text.strong"
          fontWeight="700"
          lineHeight="1.2"
          maxW="720px"
          mb={4}
        >
          What we've shipped.
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={{ base: 10, md: 14 }}>
        {PROOF_POINTS.map((p) => (
          <Box
            key={p.metric}
            bg="surface.card"
            borderRadius="xl"
            border="1px"
            borderColor="border.subtle"
            p={6}
          >
            <VStack align="flex-start" spacing={2}>
              <Heading
                as="h3"
                fontSize="2xl"
                color="accent.primary"
                fontWeight="700"
                lineHeight="1.1"
              >
                {p.metric}
              </Heading>
              <Text fontSize="md" color="text.secondary" lineHeight="1.6">
                {p.description}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Box
        bg="surface.card"
        borderRadius="xl"
        border="1px"
        borderColor="border.subtle"
        p={{ base: 6, md: 8 }}
      >
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="text.strong"
          lineHeight="1.6"
          fontStyle="italic"
        >
          {ABOUT_TEXT}
        </Text>
      </Box>
    </Section>
  );
}
