import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { Section } from '../../../components/ui/Section';
import { PROCESS_STEPS } from '../content';

export function Process() {
  return (
    <Section id="process" bg="surface.alt" spacing="lg" py={{ base: 16, md: 24 }}>
      <VStack align="flex-start" spacing={4}>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="accent.primary"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          How we work
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
          From idea to launch, a process that holds up.
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {PROCESS_STEPS.map((step) => (
          <Box
            key={step.number}
            bg="surface.card"
            borderRadius="xl"
            border="1px"
            borderColor="border.subtle"
            p={6}
            position="relative"
          >
            <VStack align="flex-start" spacing={3}>
              <Text
                fontSize="3xl"
                fontWeight="700"
                color="accent.primary"
                lineHeight="1"
                fontFamily="mono"
              >
                {step.number}
              </Text>
              <Heading
                as="h3"
                fontSize="lg"
                color="text.strong"
                fontWeight="600"
              >
                {step.title}
              </Heading>
              <Text fontSize="xs" color="text.muted" fontWeight="500" textTransform="uppercase" letterSpacing="wider">
                {step.duration}
              </Text>
              <Text fontSize="sm" color="text.secondary" lineHeight="1.6">
                {step.description}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Section>
  );
}
