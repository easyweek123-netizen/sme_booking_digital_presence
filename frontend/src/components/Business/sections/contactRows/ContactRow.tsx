import { Box, HStack, Link, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export interface ContactRowProps {
  icon: ReactNode;
  kicker: string;
  primary: string;
  secondary?: string;
  cta?: { label: string; href: string };
}

export function ContactRow({ icon, kicker, primary, secondary, cta }: ContactRowProps) {
  return (
    <HStack
      align="flex-start"
      spacing={3}
      bg="surface.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="14px"
      p={4}
    >
      <Box
        w="40px"
        h="40px"
        borderRadius="10px"
        bg="var(--brand-accent-wash)"
        color="var(--brand-accent)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        {icon}
      </Box>
      <VStack align="stretch" spacing={0.5} flex="1" minW={0}>
        <Text fontSize="11px" fontWeight={700} letterSpacing="0.05em" color="text.muted">
          {kicker}
        </Text>
        <Text fontSize="15px" fontWeight={600} color="text.heading">
          {primary}
        </Text>
        {secondary && (
          <Text fontSize="13px" color="text.muted">
            {secondary}
          </Text>
        )}
        {cta && (
          <Link href={cta.href} isExternal color="var(--brand-accent)" fontWeight={600} fontSize="sm" mt={1}>
            {cta.label} →
          </Link>
        )}
      </VStack>
    </HStack>
  );
}
