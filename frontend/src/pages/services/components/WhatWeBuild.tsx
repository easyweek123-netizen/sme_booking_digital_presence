import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  List,
  ListItem,
} from '@chakra-ui/react';
import type { ReactElement } from 'react';
import {
  SparkleIcon,
  LayersIcon,
  ActivityIcon,
  CheckIcon,
} from '../../../components/icons';
import { Section } from '../../../components/ui/Section';
import { SERVICE_CATEGORIES, type ServiceCategoryId } from '../content';

const ICON_MAP: Record<ServiceCategoryId, () => ReactElement> = {
  ai_apps_agents: () => <SparkleIcon size={28} />,
  saas_products: () => <LayersIcon size={28} />,
  performance_modernization: () => <ActivityIcon size={28} />,
};

export function WhatWeBuild() {
  return (
    <Section id="what-we-build" spacing="lg">
      <VStack align="flex-start" spacing={4}>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="accent.primary"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          What we build
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
          Things we do well.
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.id];
          return (
            <Box
              key={cat.id}
              bg="surface.card"
              borderRadius="2xl"
              border="1px"
              borderColor="border.subtle"
              p={8}
              transition="all 0.2s ease"
              _hover={{
                borderColor: 'accent.primary',
                transform: 'translateY(-4px)',
                boxShadow: 'card',
              }}
            >
              <VStack align="flex-start" spacing={5}>
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="xl"
                  bg="brand.50"
                  color="accent.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon />
                </Box>

                <Heading
                  as="h3"
                  fontSize="xl"
                  color="text.strong"
                  fontWeight="600"
                >
                  {cat.title}
                </Heading>

                <Text fontSize="md" color="text.secondary" lineHeight="1.6">
                  {cat.tagline}
                </Text>

                <List spacing={3} w="full" pt={2}>
                  {cat.bullets.map((bullet, idx) => (
                    <ListItem key={idx}>
                      <HStack align="flex-start" spacing={3}>
                        <Box color="accent.primary" mt="2px" flexShrink={0}>
                          <CheckIcon size={18} />
                        </Box>
                        <Text fontSize="sm" color="text.secondary" lineHeight="1.55">
                          {bullet}
                        </Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Section>
  );
}
