import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, type ToolResult, type WizardCard } from '@bookeasy/shared';
import type { ToolContext } from '../../common';

const OpenWizardArgsSchema = z.object({
  submitAction: z.string().describe(
    "Actions-registry key the wizard dispatches on Apply, e.g. 'business:update' or 'service:create'.",
  ),
  preset: z.string().optional().describe(
    "Onboarding preset id: 'branding' | 'location' | 'service'. Omit for an ad-hoc single-step edit.",
  ),
  suggestions: z.record(z.string()).optional().describe(
    'AI-suggested field values shown as one-tap chips (keys = field names, ' +
    'e.g. {"name":"Studio Lacquer","tagline":"…"}). Only for fields the user implied; never invent data.',
  ),
});
type OpenWizardArgs = z.infer<typeof OpenWizardArgsSchema>;

@ToolHandler({
  name: 'open_wizard',
  description:
    'Open an inline multi-step form (wizard) in the chat. On Apply it saves via submitAction and the ' +
    'app advances; on Skip it is cancelled. Use preset="branding"|"location"|"service" for first-time setup. ' +
    'The form prefills current values automatically — pass `suggestions` only for empty fields.',
})
@Injectable()
export class OpenWizardTool extends BaseToolHandler<OpenWizardArgs> {
  readonly schema = OpenWizardArgsSchema;

  async execute(args: OpenWizardArgs, _ctx: ToolContext): Promise<ToolResult> {
    const proposalId = randomUUID();
    const card: WizardCard = {
      kind: 'wizard',
      proposalId,
      submitAction: args.submitAction,
      preset: args.preset,
      suggestions: args.suggestions,
    };
    const trace =
      `WIZARD opened: ${args.preset ?? args.submitAction} | proposalId: ${proposalId} | ` +
      'Wait for the user. On [Action confirmed] call show_summary then show_progress; ' +
      'on [Action cancelled] call show_progress.';
    return ToolResultHelpers.withCards(card, trace);
  }
}