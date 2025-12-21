import { useToast } from '@chakra-ui/react';
import { useAppDispatch } from '../store/hooks';
import { addMessage } from '../store/slices/chatSlice';
import { removeProposal } from '../store/slices/canvasSlice';
import { useSendActionResultMutation } from '../store/api';
import { useActionRegistry } from '../config/actionRegistry';
import type { ChatAction } from '@shared';

/**
 * Unified hook for executing and cancelling proposals.
 *
 * Uses useActionRegistry - mutations are encapsulated in entity-specific action files.
 * Adding new entities requires NO changes to this file.
 */
export function useProposalExecution() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [sendActionResult] = useSendActionResultMutation();
  const registry = useActionRegistry();

  /**
   * Execute a proposal with the given form data
   */
  const execute = async (proposal: ChatAction, formData?: Record<string, unknown>) => {
    try {
      // Get config from registry
      const config = registry[proposal.type];

      // Execute mutation if defined
      if (config?.execute && formData) {
        await config.execute(proposal, formData);
      }

      // Send confirmation to backend and get AI follow-up
      const response = await sendActionResult({
        proposalId: proposal.proposalId,
        status: 'confirmed',
      }).unwrap();

      // Update UI
      dispatch(addMessage(response));
      dispatch(removeProposal(proposal.proposalId));

      toast({ title: 'Success', status: 'success', duration: 2000 });
    } catch (error) {
      console.error('Proposal execution failed:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  /**
   * Cancel a proposal
   */
  const cancel = async (proposal: ChatAction) => {
    try {
      const response = await sendActionResult({
        proposalId: proposal.proposalId,
        status: 'cancelled',
      }).unwrap();

      dispatch(addMessage(response));
      dispatch(removeProposal(proposal.proposalId));
    } catch {
      // Silently remove even if backend fails
      dispatch(removeProposal(proposal.proposalId));
    }
  };

  return { execute, cancel, registry };
}
