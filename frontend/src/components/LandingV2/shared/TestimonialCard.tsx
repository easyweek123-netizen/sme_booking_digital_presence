import { Stack, HStack, Flex, Text } from '@chakra-ui/react';

type Props = { quote: string; name: string; role: string; initials: string };

export function TestimonialCard({ quote, name, role, initials }: Props) {
  return (
    <Stack
      spacing={4}
      p={{ base: 4, md: 8 }}
      bg="surface.card"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="xl"
      h="full"
    >
      <Text color="accent.primary" fontSize="3xl" lineHeight="none">&ldquo;</Text>
      <Text color="text.primary" fontSize="sm" lineHeight="tall" flex={1}>{quote}</Text>
      <HStack spacing={2}>
        <Flex
          boxSize={8}
          bg="accent.primary"
          color="white"
          borderRadius="full"
          align="center"
          justify="center"
          fontSize="xs"
          fontWeight="bold"
        >
          {initials}
        </Flex>
        <Stack spacing={0}>
          <Text color="text.heading" fontWeight="bold" fontSize="sm">{name}</Text>
          <Text color="text.muted" fontSize="xs">{role}</Text>
        </Stack>
      </HStack>
    </Stack>
  );
}
