import { HStack, Link, Text } from '@chakra-ui/react';

interface PreviewSetupBannerProps {
  onDismiss: () => void;
}

export function PreviewSetupBanner({ onDismiss }: PreviewSetupBannerProps) {
  return (
    <HStack spacing={3} align="center" px={4} py={3} borderRadius="lg" bg="success.soft" fontSize="xs">
      <Text fontSize="sm" lineHeight={1.5} color="text.strong" flex={1}>
        Lets fill the sections below and your page comes to life.
      </Text>
      <Link onClick={onDismiss} color="text.muted">Dismiss</Link>
    </HStack>
  );
}
