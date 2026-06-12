import { Box, Stack, Flex, Text } from '@chakra-ui/react';
import { SmartImage } from '@/components/ui/SmartImage';

type Props = { n: number; title: string; body: string; image: string };

export function StepCard({ n, title, body, image }: Props) {
  return (
    <Stack
      spacing={4}
      p={{ base: 4 }}
      bg="surface.card"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="xl"
      h="full"
    >
      <Flex
        boxSize={8}
        bg="accent.primary"
        color="surface.card"
        borderRadius="full"
        align="center"
        justify="center"
        fontSize="sm"
        fontWeight="bold"
        flexShrink={0}
      >
        {n}
      </Flex>
      <Stack spacing={2} flex={1}>
        <Text color="text.heading" fontWeight="bold">{title}</Text>
        <Text color="text.secondary" fontSize="sm" lineHeight="tall">{body}</Text>
      </Stack>
      <Box
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        overflow="hidden"
        bg="surface.alt"
        flexShrink={0}
      >
        <SmartImage
          src={image}
          alt={title}
          ratio={16 / 10}
          objectFit="contain"
          borderRadius="none"
        />
      </Box>
    </Stack>
  );
}