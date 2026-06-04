/**
 * @bookeasy/shared
 *
 * Shared types and Zod schemas for BookEasy frontend and backend.
 */

export * from './tools';
export * from './schemas/types';
export * from './schemas/availability.schema';
export * from './schemas/location.schema';
export * from './schemas/booking.schema';
export * from './schemas/inquiry.schema';
export * from './schemas/schedule.schema';
export {
  ServiceCreateSchema,
  ServicePatchSchema,
  ServiceFormFieldsSchema,
  ServiceFormSchema,
  ServiceFieldsObject,
  SERVICE_FORM_FIELD_KEYS,
} from './schemas/service.schema';
export type {
  ServiceCreateInput,
  ServicePatchInput,
  ServiceFormFieldsInput,
  ServiceFormInput,
} from './schemas/service.schema';
