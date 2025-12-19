import { z } from 'zod';
import {
  ServiceCreateActionSchema,
  ServiceUpdateActionSchema,
  ServiceDeleteActionSchema,
  ServiceGetActionSchema,
} from './service';

/**
 * Union of all possible chat actions.
 * Add new action schemas here as you create them.
 * 
 * Pattern for adding new actions:
 * 1. Create domain-specific file (e.g., booking.ts)
 * 2. Define action schemas with 'type' literal
 * 3. Import and add to this union
 */
export const ChatActionSchema = z.discriminatedUnion('type', [
  // Service actions
  ServiceCreateActionSchema,
  ServiceUpdateActionSchema,
  ServiceDeleteActionSchema,
  ServiceGetActionSchema,
  
  // Future: Add more action types here
  // BookingCreateActionSchema,
  // ClientNoteActionSchema,
  // etc.
]);

// Re-export all action schemas
export * from './service';

