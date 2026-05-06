import { useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addProposals,
  removeProposal,
  setPreviewContext,
} from '../store/slices/canvasSlice';
import { useSendActionResultMutation } from '../store/api';
import { useActionRegistry } from '../config/actionRegistry';
import type { ChatAction } from '@shared';
import { useState } from 'react';

/**
 * Unified hook for executing and cancelling proposals.
 *
 * Uses useActionRegistry - mutations are encapsulated in entity-specific action files.
 * Adding new entities requires NO changes to this file.
 */
export function useProposalExecution() {
  const dispatch = useAppDispatch();
  const activeTabId = useAppSelector((s) => s.chat.activeTabId);
  const toast = useToast();
  const [sendActionResult] = useSendActionResultMutation();
  const registry = useActionRegistry();
  const [loadingProposalId, setLoadingProposalId] = useState<string | null>(null);

  /**
   * Execute a proposal with the given form data
   */
  const execute = async (
    proposal: ChatAction,
    formData?: Record<string, unknown>,
  ) => {
    if (activeTabId === null) return;
    try {
      setLoadingProposalId(proposal.proposalId);
      const config = registry[proposal.type];

      if (config?.execute) {
        await config.execute(proposal, formData);
      }

      const reply = await sendActionResult({
        conversationId: activeTabId,
        proposalId: proposal.proposalId,
        status: 'confirmed',
        result: {},
      }).unwrap();

      dispatch(removeProposal(proposal.proposalId));
      if (reply.proposals?.length) dispatch(addProposals(reply.proposals));
      if (reply.previewContext) dispatch(setPreviewContext(reply.previewContext));
      toast({ title: 'Success', status: 'success', duration: 2000 });
    } catch (error) {
      console.error('Proposal execution failed:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
      });
      throw error;
    } finally {
      setLoadingProposalId(null);
    }
  };

  /**
   * Cancel a proposal
   */
  const cancel = async (proposal: ChatAction) => {
    if (activeTabId === null) return;
    try {
      await sendActionResult({
        conversationId: activeTabId,
        proposalId: proposal.proposalId,
        status: 'cancelled',
      }).unwrap();
    } finally {
      dispatch(removeProposal(proposal.proposalId));
    }
  };

  return { execute, cancel, registry, loadingProposalId };
}
