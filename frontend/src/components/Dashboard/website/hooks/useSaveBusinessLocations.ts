import { useCallback } from 'react';
import {
  useCreateLocationMutation,
  useDeleteLocationMutation,
} from '../../../../store/api/locationsApi';
import { deepEqual } from '../../../../lib/deepEqual';
import { locationToDraft } from '../../../Locations';
import {
  CreateLocationSchema,
  type CreateLocationDto,
  type LocationDraft,
} from '@bookeasy/shared';
import type { Location } from '../../../../types/location';

export interface DesiredLocations {
  ADDRESS: LocationDraft[];
  PHONE: LocationDraft[];
  ONLINE: LocationDraft | null;
}

/**
 * Build a CreateLocationDto from a draft and validate it against the shared
 * schema. Returns null if the draft isn't filled in enough to save — the
 * saver skips those rows silently.
 */
function toDto(draft: LocationDraft): CreateLocationDto | null {
  const candidate =
    draft.type === 'ONLINE'
      ? draft.data?.calendarId
        ? { type: 'ONLINE', data: { calendarId: draft.data.calendarId } }
        : null
      : draft.data
        ? { type: draft.type, data: draft.data }
        : null;
  if (!candidate) return null;
  const parsed = CreateLocationSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

function flatten(d: DesiredLocations): LocationDraft[] {
  return [...d.ADDRESS, ...d.PHONE, ...(d.ONLINE ? [d.ONLINE] : [])];
}

export function useSaveBusinessLocations() {
  const [createLocation, createState] = useCreateLocationMutation();
  const [deleteLocation, deleteState] = useDeleteLocationMutation();

  const save = useCallback(
    async (desired: DesiredLocations, current: Location[]) => {
      const drafts = flatten(desired);
      const keptIds = new Set<number>(
        drafts.map((d) => d.locationId).filter((id): id is number => id != null),
      );

      const toDelete: number[] = [];
      for (const loc of current) {
        if (!keptIds.has(loc.id)) toDelete.push(loc.id);
      }

      const toCreate: CreateLocationDto[] = [];
      for (const draft of drafts) {
        const dto = toDto(draft);
        if (!dto) continue;
        if (draft.locationId == null) {
          toCreate.push(dto);
          continue;
        }
        const orig = current.find((c) => c.id === draft.locationId);
        const origDraft = orig ? locationToDraft(orig) : null;
        if (origDraft && !deepEqual(draft, origDraft)) {
          toDelete.push(draft.locationId);
          toCreate.push(dto);
        }
      }

      const errors: unknown[] = [];

      for (const id of toDelete) {
        try {
          await deleteLocation(id).unwrap();
        } catch (err) {
          errors.push(err);
        }
      }
      for (const dto of toCreate) {
        try {
          await createLocation(dto).unwrap();
        } catch (err) {
          errors.push(err);
        }
      }

      if (errors.length === 0) return;
      const conflict = errors.find(
        (e) => (e as { data?: { code?: string } })?.data?.code === 'LOCATION_IN_USE',
      );
      throw conflict ?? errors[0];
    },
    [createLocation, deleteLocation],
  );

  return {
    save,
    isSaving: createState.isLoading || deleteState.isLoading,
  };
}
