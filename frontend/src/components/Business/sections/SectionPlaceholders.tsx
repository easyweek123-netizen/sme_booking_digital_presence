import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import { SectionHeading } from '../SectionHeading';

/** A single muted skeleton bar. */
function Bar({ w = 'full', h = '12px' }: { w?: string; h?: string }) {
  return <Box w={w} h={h} borderRadius="full" bg="surface.muted" />;
}

function PlaceholderShell({
  id,
  title,
  pt = 8,
  children,
}: {
  id: string;
  title: string;
  pt?: number;
  children: React.ReactNode;
}) {
  return (
    <Box as="section" pt={pt} aria-hidden>
      <SectionHeading id={id}>{title}</SectionHeading>
      {children}
    </Box>
  );
}

export function ServicesPlaceholder() {
  return (
    <PlaceholderShell id="section-services" title="Services" pt={2}>
      <VStack spacing={3} align="stretch">
        {[0, 1, 2].map((i) => (
          <HStack
            key={i}
            spacing={4}
            p={4}
            borderRadius="14px"
            border="1px solid"
            borderColor="border.subtle"
            bg="surface.card"
          >
            <Box boxSize="48px" borderRadius="md" bg="surface.muted" flexShrink={0} />
            <VStack align="stretch" spacing={2} flex={1} minW={0}>
              <Bar w="55%" />
              <Bar w="80%" />
            </VStack>
            <Box w="72px" h="32px" borderRadius="full" bg="success.soft" flexShrink={0} />
          </HStack>
        ))}
      </VStack>
    </PlaceholderShell>
  );
}

export function AboutPlaceholder() {
  return (
    <PlaceholderShell id="section-about" title="About">
      <VStack align="stretch" spacing={2.5}>
        <Bar w="100%" />
        <Bar w="92%" />
        <Bar w="68%" />
      </VStack>
    </PlaceholderShell>
  );
}

export function HoursPlaceholder() {
  return (
    <PlaceholderShell id="section-hours" title="Opening hours">
      <Box
        bg="surface.card"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="14px"
        overflow="hidden"
      >
        {[0, 1, 2, 3].map((i) => (
          <Flex
            key={i}
            justify="space-between"
            align="center"
            px="18px"
            py="14px"
            borderTop={i === 0 ? 0 : '1px solid'}
            borderColor="surface.muted"
          >
            <Bar w="90px" />
            <Bar w="64px" />
          </Flex>
        ))}
      </Box>
    </PlaceholderShell>
  );
}

export function ContactPlaceholder() {
  return (
    <PlaceholderShell id="section-contact" title="How to reach us">
      <VStack align="stretch" spacing={3}>
        {[0, 1].map((i) => (
          <HStack
            key={i}
            spacing={3}
            p={4}
            borderRadius="14px"
            border="1px solid"
            borderColor="border.subtle"
            bg="surface.card"
          >
            <Box
              w="40px"
              h="40px"
              borderRadius="10px"
              bg="surface.muted"
              flexShrink={0}
            />
            <VStack align="stretch" spacing={2} flex={1} minW={0}>
              <Bar w="28%" />
              <Bar w="56%" />
              <Bar w="44%" />
            </VStack>
          </HStack>
        ))}
      </VStack>
    </PlaceholderShell>
  );
}
