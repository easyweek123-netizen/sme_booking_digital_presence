import { useCallback } from 'react';
import {
  useCreateLocationMutation,
  usePatchLocationMutation,
  useDeleteLocationMutation,
} from '../../../../store/api/locationsApi';
import { useGetCalendarStatusQuery } from '../../../../store/api/calendarApi';
import type { CreateLocationDto, LocationDraft } from '@bookeasy/shared';
import type { Location } from '../../../../types/location';

function toDto(draft: LocationDraft, calendarId: number | null): CreateLocationDto {
  if (draft.type === 'ONLINE') return { type: 'ONLINE', data: { calendarId: calendarId ?? 0 } };
  return { type: draft.type, data: draft.data! } as CreateLocationDto;
}

export type LocationDirtyMaskEntry =
  | boolean
  | undefined
  | Record<string, unknown>;

export type LocationDirtyMask = LocationDirtyMaskEntry[] | undefined;

interface SaveParams {
  current: Location[];
  drafts: LocationDraft[];
  dirtyMask: LocationDirtyMask;
}

export function useSaveBusinessLocations() {
  const [createLocation, createState] = useCreateLocationMutation();
  const [patchLocation, patchState] = usePatchLocationMutation();
  const [deleteLocation, deleteState] = useDeleteLocationMutation();
  const { data: calendarStatus } = useGetCalendarStatusQuery();
  const calendarId = calendarStatus?.connected ? (calendarStatus.calendarId ?? null) : null;

  const save = useCallback(
    async ({ current, drafts, dirtyMask }: SaveParams) => {
      // Deletes: rows present in `current` but missing from `drafts`.
      const keptIds = new Set(drafts.map((d) => d.locationId).filter((id): id is number => id != null));
      for (const loc of current) {
        if (!keptIds.has(loc.id)) {
          await deleteLocation(loc.id).unwrap();
        }
      }
      // Creates + patches
      for (let i = 0; i < drafts.length; i++) {
        const draft = drafts[i];
        if (draft.locationId == null) {
          await createLocation(toDto(draft, calendarId)).unwrap();
        } else if (dirtyMask?.[i]) {
          await patchLocation({ id: draft.locationId, body: toDto(draft, calendarId) }).unwrap();
        }
      }
    },
    [calendarId, createLocation, patchLocation, deleteLocation],
  );

  return {
    save,
    isSaving: createState.isLoading || patchState.isLoading || deleteState.isLoading,
  };
}
