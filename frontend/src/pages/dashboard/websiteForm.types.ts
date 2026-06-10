import type { WebsiteFormInput } from '@bookeasy/shared';

/**
 * The Website form's value shape. Sourced from `WebsiteFormSchema` in
 * `@bookeasy/shared/schemas/website.schema.ts` — Zod is the single source
 * of truth. Aliased to `WebsiteFormValues` for backwards compatibility
 * with existing imports in the website folder.
 */
export type WebsiteFormValues = WebsiteFormInput;
