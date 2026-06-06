import { AddressPicker } from '../Services/locations/address/AddressPicker';
import { PhonePicker } from '../Services/locations/phone/PhonePicker';
import { OnlinePicker } from '../Services/locations/online/OnlinePicker';
import type { LocationDraft } from '@bookeasy/shared';
import type { LocationType } from '../../types/location';

interface BusinessLocationPickerProps {
  type: LocationType;
  value: LocationDraft | null;
  onChange: (next: LocationDraft | null) => void;
}

/**
 * Controlled wrapper around the three sub-pickers. Used by:
 *   - Service form `LocationSelect` (via its existing RHF watch/setValue)
 *   - Website Location tab `BusinessLocationsField` (Phase 4)
 *
 * The draft shape (`LocationDraft`) carries `{ type, locationId, data? }` so
 * the same component can drive both "edit a new draft" and "edit a saved
 * location by id" flows. `locationId` stays null for new drafts and is
 * resolved at save time by the calling form.
 */
export function BusinessLocationPicker({ type, value, onChange }: BusinessLocationPickerProps) {
  switch (type) {
    case 'ADDRESS': {
      const data = value?.type === 'ADDRESS' ? value.data : null;
      return (
        <AddressPicker
          value={data}
          onChange={(next) =>
            onChange(next ? { type: 'ADDRESS', locationId: value?.locationId ?? null, data: next } : null)
          }
        />
      );
    }
    case 'PHONE': {
      const data = value?.type === 'PHONE' ? value.data : null;
      return (
        <PhonePicker
          value={data}
          onChange={(next) =>
            onChange(next ? { type: 'PHONE', locationId: value?.locationId ?? null, data: next } : null)
          }
        />
      );
    }
    case 'ONLINE':
      return <OnlinePicker />;
    default: {
      const exhaustive: never = type;
      throw new Error(`BusinessLocationPicker: type "${String(exhaustive)}" not implemented`);
    }
  }
}
