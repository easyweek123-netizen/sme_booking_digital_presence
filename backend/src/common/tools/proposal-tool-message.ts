import type { ChatAction } from '@bookeasy/shared';

/**
 * Machine-readable tool result for proposal-creating tools.
 * Keeps proposalIds explicit so the model (and [Tool trace]) can correlate
 * with [Action confirmed: …] / [Action cancelled: …] user lines later.
 */
export function buildProposalToolMessage(
  summaryLine: string,
  proposals: Pick<ChatAction, 'type' | 'proposalId'>[],
): string {
  const ids = proposals.map((p) => `${p.type}:${p.proposalId}`).join(', ');
  return [
    `PROPOSED (not applied): ${summaryLine}`,
    `proposalIds: ${ids} | executionMode: confirm`,
    'User must press Confirm in the Actions panel to apply.',
  ].join('\n');
}
