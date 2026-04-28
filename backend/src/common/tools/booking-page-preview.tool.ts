import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler } from './tool-handler.decorator';
import { BaseToolHandler } from './base-tool.handler';
import { ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../interfaces/tool.interface';

const BookingPagePreviewArgsSchema = z.object({});

type BookingPagePreviewArgs = z.infer<typeof BookingPagePreviewArgsSchema>;

@ToolHandler({
  name: 'preview_booking_page',
  description:
    'Call this when user wants to see their booking page in preview tab. You can use this tool to show user how their booking page look after updating business profile or services.',
})
@Injectable()
export class BookingPagePreviewTool extends BaseToolHandler<BookingPagePreviewArgs> {
  readonly schema = BookingPagePreviewArgsSchema;

  async execute(
    _args: BookingPagePreviewArgs,
    _ctx: ToolContext,
  ): Promise<ToolResult> {
    return ToolResultHelpers.withPreview(
      `Showing booking page in preview tab.`,
      'booking_page',
    );
  }
}
