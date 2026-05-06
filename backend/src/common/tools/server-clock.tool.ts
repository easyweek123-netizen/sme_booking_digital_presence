import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler } from './tool-handler.decorator';
import { BaseToolHandler } from './base-tool.handler';
import { ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../interfaces/tool.interface';
import { getServerClockSnapshot } from '../time/local-date';

const ServerClockArgsSchema = z.object({});

type ServerClockArgs = z.infer<typeof ServerClockArgsSchema>;

@ToolHandler({
  name: 'server_clock',
  description:
    'Returns the real current date and time from the app server. Call this before answering what day or date it is, and before choosing bookings_list from/to when the user says "today", "this week", or similar—never infer the current calendar from training data. Use dateIso (YYYY-MM-DD) for booking date filters.',
})
@Injectable()
export class ServerClockTool extends BaseToolHandler<ServerClockArgs> {
  readonly schema = ServerClockArgsSchema;

  async execute(
    _args: ServerClockArgs,
    _ctx: ToolContext,
  ): Promise<ToolResult> {
    const snap = getServerClockSnapshot();
    return ToolResultHelpers.withData(
      `Server date: ${snap.dateDisplay} (${snap.dateIso}). Use dateIso for YYYY-MM-DD tool fields.`,
      { ...snap },
    );
  }
}
