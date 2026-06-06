import { Box, Collapse, HStack, Switch, Text, VStack } from '@chakra-ui/react';
import { MapPinIcon, PhoneIcon, VideoIcon } from '../../icons';
import type { LocationType } from '../../../types/location';
import type { ReactNode } from 'react';

interface Meta {
  icon: ReactNode;
  title: string;
  helper: string;
}

const META: Record<LocationType, Meta> = {
  ADDRESS: {
    icon: <MapPinIcon size={20} />,
    title: 'In person',
    helper: 'Customers visit a physical address — shown with a map on your page.',
  },
  PHONE: {
    icon: <PhoneIcon size={20} />,
    title: 'By phone',
    helper: 'Customers see a tap-to-call number. We can hide it from public view.',
  },
  ONLINE: {
    icon: <VideoIcon size={20} />,
    title: 'Online',
    helper: 'Customers join via Google Meet — link auto-generated from your calendar.',
  },
};

interface Props {
  type: LocationType;
  expanded: boolean;
  onToggle: (next: boolean) => void;
  children: ReactNode;
}

export function BusinessLocationSection({ type, expanded, onToggle, children }: Props) {
  const meta = META[type];
  return (
    <Box
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      overflow="hidden"
      bg="surface.card"
    >
      <HStack align="flex-start" spacing={3} p={4} bg="brand.50">
        <Box
          w={10}
          h={10}
          borderRadius="md"
          bg="surface.card"
          color="brand.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {meta.icon}
        </Box>
        <VStack align="stretch" spacing={1} flex={1} minW={0}>
          <Text fontWeight="700" color="text.heading">
            {meta.title}
          </Text>
          <Text fontSize="sm" color="text.muted" lineHeight="1.4">
            {meta.helper}
          </Text>
        </VStack>
        <Switch
          isChecked={expanded}
          onChange={(e) => onToggle(e.target.checked)}
          colorScheme="brand"
          size="md"
        />
      </HStack>
      <Collapse in={expanded} animateOpacity>
        <Box p={4}>{children}</Box>
      </Collapse>
    </Box>
  );
}
