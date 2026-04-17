import type { ToolResult } from '@bookeasy/shared';

/** Prefix for synthetic assistant rows that record tool outcomes on persisted history. */
export const TOOL_TRACE_PREFIX = '[Tool trace]';

export function formatToolTraceLine(
  toolName: string,
  result: ToolResult,
): string {
  if (!result.success) {
    return `${toolName} → error: ${result.error}`;
  }
  if (result.proposals?.length) {
    const ids = result.proposals
      .map((p) => `${p.type}:${p.proposalId}`)
      .join(', ');
    return `${toolName} → proposed [${ids}] pending Confirm in Actions`;
  }
  const hint = result.message?.slice(0, 200) ?? 'ok';
  return `${toolName} → ${hint}`;
}

export function buildToolTraceAssistantContent(lines: string[]): string {
  return `${TOOL_TRACE_PREFIX}\n${lines.join('\n')}`;
}
