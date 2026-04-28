import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Tag,
  TagLabel,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ExternalLinkIcon, ArrowRightIcon } from '../../../components/icons';
import { Section } from '../../../components/ui/Section';
import { CASE_STUDIES, type CaseStudy } from '../content';

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  const isExternal = cs.external && cs.href;
  const isInternal = !cs.external && !!cs.href;

  const cardBody = (
    <Box
      bg="surface.card"
      borderRadius="2xl"
      border="1px"
      borderColor="border.subtle"
      p={8}
      h="full"
      transition="all 0.2s ease"
      _hover={{
        borderColor: cs.href ? 'accent.primary' : 'border.subtle',
        transform: cs.href ? 'translateY(-4px)' : 'none',
        boxShadow: cs.href ? 'card' : 'none',
      }}
    >
      <VStack align="flex-start" spacing={4} h="full">
        <Tag size="sm" bg="brand.50" color="accent.primary" borderRadius="full" px={3} py={1}>
          <TagLabel fontSize="xs" fontWeight="600">
            {cs.category}
          </TagLabel>
        </Tag>

        <Heading
          as="h3"
          fontSize="xl"
          color="text.strong"
          fontWeight="600"
          lineHeight="1.3"
        >
          {cs.title}
        </Heading>

        <Text fontSize="sm" color="text.secondary" lineHeight="1.6" flex="1">
          {cs.body}
        </Text>

        {cs.metrics && (
          <HStack spacing={2} flexWrap="wrap" pt={2}>
            {cs.metrics.map((m) => (
              <Tag
                key={m}
                size="sm"
                bg="surface.alt"
                color="text.secondary"
                borderRadius="md"
                px={2}
                py={1}
              >
                <TagLabel fontSize="xs">{m}</TagLabel>
              </Tag>
            ))}
          </HStack>
        )}

        {cs.href && (
          <HStack
            color="accent.primary"
            fontSize="sm"
            fontWeight="600"
            spacing={1}
            pt={2}
          >
            <Text>{isExternal ? 'Visit' : 'Open'}</Text>
            {isExternal ? <ExternalLinkIcon size={14} /> : <ArrowRightIcon size={14} />}
          </HStack>
        )}
      </VStack>
    </Box>
  );

  if (isExternal) {
    return (
      <ChakraLink
        href={cs.href}
        isExternal
        _hover={{ textDecoration: 'none' }}
        h="full"
      >
        {cardBody}
      </ChakraLink>
    );
  }

  if (isInternal) {
    return (
      <ChakraLink as={RouterLink} to={cs.href!} _hover={{ textDecoration: 'none' }} h="full">
        {cardBody}
      </ChakraLink>
    );
  }

  return cardBody;
}

export function RecentWork() {
  return (
    <Section id="recent-work" spacing="lg" py={{ base: 16, md: 24 }}>
      <VStack align="flex-start" spacing={4}>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="accent.primary"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          Recent work
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
          Products and platforms we've shipped.
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} alignItems="stretch">
        {CASE_STUDIES.map((cs) => (
          <CaseStudyCard key={cs.id} cs={cs} />
        ))}
      </SimpleGrid>
    </Section>
  );
}
