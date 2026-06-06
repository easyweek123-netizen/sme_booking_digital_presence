import { useCallback } from 'react';
import {
  useCreateLocationMutation,
  usePatchLocationMutation,
} from '../../../store/api/locationsApi';
import { useGetCalendarStatusQuery } from '../../../store/api/calendarApi';
import type { CreateLocationDto, LocationDraft } from '@bookeasy/shared';

function toDto(draft: LocationDraft, calendarId: number | null): CreateLocationDto {
  if (draft.type === 'ONLINE') return { type: 'ONLINE', data: { calendarId: calendarId ?? 0 } };
  return { type: draft.type, data: draft.data! } as CreateLocationDto;
}

export type LocationDirtyMask =
  | Array<Partial<Record<string, boolean>> | boolean | undefined>
  | undefined;

export function useSaveBusinessLocations() {
  const [createLocation, createState] = useCreateLocationMutation();
  const [patchLocation, patchState] = usePatchLocationMutation();
  const { data: calendarStatus } = useGetCalendarStatusQuery();
  const calendarId = calendarStatus?.connected ? (calendarStatus.calendarId ?? null) : null;

  const save = useCallback(
    async (drafts: LocationDraft[], dirtyMask: LocationDirtyMask) => {
      for (let i = 0; i < drafts.length; i++) {
        const draft = drafts[i];
        if (draft.locationId == null) {
          await createLocation(toDto(draft, calendarId)).unwrap();
        } else if (dirtyMask?.[i]) {
          await patchLocation({ id: draft.locationId, body: toDto(draft, calendarId) }).unwrap();
        }
      }
    },
    [calendarId, createLocation, patchLocation],
  );

  return {
    save,
    isSaving: createState.isLoading || patchState.isLoading,
  };
}
