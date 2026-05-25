import { z } from 'zod';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

export const AvailabilitySchema = z
  .object({
    isRecurring: z.boolean(),
    dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
    date: z.string().regex(YMD).nullable().optional(),
    startTime: z.string().regex(HHMM).nullable().optional(),
    endTime: z.string().regex(HHMM).nullable().optional(),
    isClosed: z.boolean(),
  })
  .superRefine((v, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

    if (v.isRecurring) {
      if (v.dayOfWeek == null) issue('dayOfWeek', 'required when isRecurring=true');
      if (v.date != null) issue('date', 'forbidden when isRecurring=true');
      if (!v.startTime) issue('startTime', 'required when isRecurring=true');
      if (!v.endTime) issue('endTime', 'required when isRecurring=true');
      if (v.isClosed) issue('isClosed', 'must be false when isRecurring=true');
      if (v.startTime && v.endTime && v.startTime >= v.endTime) {
        issue('endTime', 'startTime must be < endTime');
      }
    } else {
      if (!v.date) issue('date', 'required when isRecurring=false');
      if (v.dayOfWeek != null) issue('dayOfWeek', 'forbidden when isRecurring=false');
      if (v.isClosed) {
        if (v.startTime != null) issue('startTime', 'must be null when isClosed=true');
        if (v.endTime != null) issue('endTime', 'must be null when isClosed=true');
      } else {
        if (!v.startTime) issue('startTime', 'required');
        if (!v.endTime) issue('endTime', 'required');
        if (v.startTime && v.endTime && v.startTime >= v.endTime) {
          issue('endTime', 'startTime must be < endTime');
        }
      }
    }
  });

export type AvailabilityInput = z.infer<typeof AvailabilitySchema>;

export const AvailabilityListSchema = z.array(AvailabilitySchema);
export type AvailabilityList = z.infer<typeof AvailabilityListSchema>;
