import type { LocationDraft } from '@bookeasy/shared';

export function isDraftReady(draft: LocationDraft): boolean {
  switch (draft.type) {
    case 'ADDRESS': return !!(draft.data?.line1 && draft.data?.city && draft.data?.countryCode);
    case 'PHONE':   return !!draft.data?.phoneNumber;
    case 'ONLINE':  return !!draft.data?.calendarId;
  }
}
