import { Box, HStack, VStack, Text, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '../../icons';
import type { WizardStep } from '@shared';

interface WizardHeaderProps {
  openStep?: WizardStep;
  pageIndex: number;
  doneCount: number;
  totalSteps: number;
  workflowLabel: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
}

export function WizardHeader({
  openStep,
  pageIndex,
  doneCount,
  totalSteps,
  workflowLabel,
  collapsed,
  onToggleCollapse,
  onClose,
}: WizardHeaderProps) {
  const isComplete = doneCount === totalSteps;
  const counter = openStep
    ? `${pageIndex + 1}/${openStep.fields.length}`
    : ``;

  const title = openStep
    ? openStep.label
    : isComplete
      ? 'Setup complete'
      : workflowLabel;

  const subtitle = openStep
    ? openStep.hint
    : isComplete
      ? 'Everything needed to go live is set.'
      : 'Complete these steps to finish your booking page setup.';

  return (
    <HStack
      px={3}
      py={2.5}
      spacing={2}
      bg="surface.card"
      borderBottom="1px"
      borderColor="border.subtle"
    >
      {counter && <Box
        px={2}
        py={1}
        borderRadius="md"
        bg="accent.soft"
        color="accent.primary"
        fontFamily="mono"
        fontSize="xs"
        fontWeight="600"
        flexShrink={0}
      >
        {counter}
      </Box>}

      <VStack flex={1} minW={0} align="stretch" spacing={0}>
        <Text fontSize="sm" fontWeight="600" color="text.heading" noOfLines={1}>
          {title}
        </Text>
        <Text fontSize="xs" color="text.secondary" noOfLines={1}>
          {subtitle}
        </Text>
      </VStack>

      <HStack spacing={1} flexShrink={0}>
        <IconButton
          aria-label={collapsed ? 'Expand setup wizard' : 'Collapse setup wizard'}
          icon={collapsed ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          variant="ghost"
          size="sm"
          color="text.muted"
          _hover={{ bg: 'surface.alt', color: 'text.secondary' }}
          onClick={onToggleCollapse}
        />
        <IconButton
          aria-label="Close setup wizard"
          icon={<CloseIcon size={16} />}
          variant="ghost"
          size="sm"
          color="text.muted"
          _hover={{ bg: 'surface.alt', color: 'text.secondary' }}
          onClick={onClose}
        />
      </HStack>
    </HStack>
  );
}