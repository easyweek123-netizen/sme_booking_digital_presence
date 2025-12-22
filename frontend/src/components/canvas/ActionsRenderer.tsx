import { Text, Center, VStack, Box, Badge, HStack } from '@chakra-ui/react';
import { useAppDispatch } from '../../store/hooks';
import { setActiveTab, clearProposals, removeProposal } from '../../store/slices/canvasSlice';
import { useGetMyBusinessQuery } from '../../store/api';
import { useProposalExecution } from '../../hooks';
import { CanvasActionsContainer } from './CanvasActionsContainer';
import { ActionErrorBoundary } from './ActionErrorBoundary';
import type { ChatAction } from '@shared';

// ─── Props ───

interface ActionsRendererProps {
  proposals: ChatAction[];
}

// ─── Single Proposal Card ───

interface ProposalCardProps {
  proposal: ChatAction;
  index: number;
  total: number;
}

function ProposalCard({ proposal, index, total }: ProposalCardProps) {
  const { data: business } = useGetMyBusinessQuery();
  const { execute, cancel, registry } = useProposalExecution();

  const config = registry[proposal.type];
  if (!config) {
    return (
      <Center p={4} color="gray.400">
        <Text>Unknown action: {proposal.type}</Text>
      </Center>
    );
  }

  // Build props from proposal data
  const componentProps = config.getProps(proposal, {
    business: business ?? undefined,
  });

  // Handlers using unified execution hook
  const handleSubmit = async (formData: Record<string, unknown>) => {
    await execute(proposal, formData);
  };

  const handleCancel = () => {
    cancel(proposal);
  };

  const Component = config.component;

  return (
    <Box>
      {total > 1 && (
        <HStack mb={2} spacing={2}>
          <Badge colorScheme="brand" fontSize="xs">
            {index + 1} of {total}
          </Badge>
        </HStack>
      )}
      <CanvasActionsContainer title={config.title}>
        <Component {...componentProps} onSubmit={handleSubmit} onCancel={handleCancel} />
      </CanvasActionsContainer>
    </Box>
  );
}

// ─── Main Component ───

/**
 * Renders proposals in the canvas panel.
 *
 * Uses useProposalExecution hook for centralized execution logic.
 * Registry is obtained from the hook (composed from entity-specific actions).
 */
export function ActionsRenderer({ proposals }: ActionsRendererProps) {
  const dispatch = useAppDispatch();

  const handleClearAll = () => {
    dispatch(clearProposals());
    dispatch(setActiveTab('preview'));
  };

  if (proposals.length === 0) {
    return (
      <Center h="full" color="gray.400">
        <VStack spacing={2}>
          <Text fontSize="lg">No active actions</Text>
          <Text fontSize="sm">Ask the AI to help you manage your business</Text>
        </VStack>
      </Center>
    );
  }

  // Render first proposal (queue-style)
  const currentProposal = proposals[0];

  const handleDismissError = () => {
    dispatch(removeProposal(currentProposal.proposalId));
  };

  return (
    <VStack spacing={4} align="stretch" h="full">
      {proposals.length > 1 && (
        <HStack justify="space-between" px={1}>
          <Text fontSize="sm" color="gray.500">
            {proposals.length} actions pending
          </Text>
          <Text
            as="button"
            fontSize="xs"
            color="gray.400"
            cursor="pointer"
            onClick={handleClearAll}
            _hover={{ color: 'gray.600' }}
          >
            Clear all
          </Text>
        </HStack>
      )}

      <ActionErrorBoundary
        key={currentProposal.proposalId}
        proposalId={currentProposal.proposalId}
        onDismiss={handleDismissError}
      >
        <ProposalCard proposal={currentProposal} index={0} total={proposals.length} />
      </ActionErrorBoundary>
    </VStack>
  );
}
