import { Text, Center, VStack, Box, Badge, HStack, useToast } from '@chakra-ui/react';
import { useAppDispatch } from '../../store/hooks';
import { setActiveTab, clearProposals, removeProposal } from '../../store/slices/canvasSlice';
import { addMessage } from '../../store/slices/chatSlice';
import { useGetMyBusinessQuery, useSendActionResultMutation } from '../../store/api';
import { useActionMutations } from '../../hooks';
import { actionRegistry } from '../../config/actionRegistry';
import { CanvasActionsContainer } from './CanvasActionsContainer';
import type { ChatAction, ActionType } from '@shared';

// ─── Props ───

interface ActionsRendererProps {
  proposals: ChatAction[];
}

// ─── Single Proposal Card ───

interface ProposalCardProps {
  proposal: ChatAction;
  index: number;
  total: number;
  onComplete: (index: number, proposalId: string) => void;
  onCancel: (index: number, proposalId: string) => void;
}

function ProposalCard({ proposal, index, total, onComplete, onCancel }: ProposalCardProps) {
  const toast = useToast();
  const { data: business } = useGetMyBusinessQuery();
  const mutations = useActionMutations();

  const config = actionRegistry[proposal.type as ActionType];
  if (!config) {
    return (
      <Center p={4} color="gray.400">
        <Text>Unknown action: {proposal.type}</Text>
      </Center>
    );
  }

  // Build props from proposal data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentProps = (config.getProps as any)(proposal, { business: business ?? undefined });

  // Get mutation function if proposal has one
  const onSubmit = config.getMutation
    ? async (data: unknown) => {
        try {
          // Execute the REST mutation
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (config.getMutation as any)(mutations, proposal)(data);
          toast({ title: 'Success', status: 'success', duration: 2000 });
          // Notify completion with proposalId
          onComplete(index, proposal.proposalId);
        } catch {
          toast({ title: 'Error', status: 'error', duration: 3000 });
        }
      }
    : undefined;

  const handleCancel = () => onCancel(index, proposal.proposalId);

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
        <Component {...componentProps} onSubmit={onSubmit} onCancel={handleCancel} />
      </CanvasActionsContainer>
    </Box>
  );
}

// ─── Main Component ───

/**
 * Renders proposals in the canvas panel.
 * 
 * Supports multiple proposals:
 * - Shows first proposal prominently
 * - Queue indicator if multiple proposals pending
 * - Completing/canceling a proposal moves to the next
 * - Sends action result to backend for AI follow-up
 */
export function ActionsRenderer({ proposals }: ActionsRendererProps) {
  const dispatch = useAppDispatch();
  const [sendActionResult] = useSendActionResultMutation();

  const handleComplete = async (index: number, proposalId: string) => {
    dispatch(removeProposal(index));
    
    // Send action result to backend and get AI follow-up
    try {
      const response = await sendActionResult({
        proposalId,
        status: 'confirmed',
      }).unwrap();
      
      // Add AI follow-up message to chat
      dispatch(addMessage(response));
    } catch {
      console.error('Error sending action result:');
    }
    
    // If no more proposals, switch to preview
    if (proposals.length <= 1) {
      dispatch(setActiveTab('preview'));
    }
  };

  const handleCancel = async (index: number, proposalId: string) => {
    dispatch(removeProposal(index));
    
    // Send cancellation to backend for AI awareness
    try {
      const response = await sendActionResult({
        proposalId,
        status: 'cancelled',
      }).unwrap();
      
      // Add AI follow-up message to chat
      dispatch(addMessage(response));
    } catch {
      // Silently fail
    }
    
    // If no more proposals, switch to preview
    if (proposals.length <= 1) {
      dispatch(setActiveTab('preview'));
    }
  };

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

  // For now, render first proposal (can extend to show queue later)
  const currentProposal = proposals[0];

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
      
      <ProposalCard
        proposal={currentProposal}
        index={0}
        total={proposals.length}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </VStack>
  );
}
