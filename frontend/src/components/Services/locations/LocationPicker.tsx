import { AddressPicker } from './address/AddressPicker';
import { PhonePicker } from './phone/PhonePicker';
import { OnlinePicker } from './online/OnlinePicker';
import type { LocationType } from '../../../types/location';

interface Props { type: LocationType; }

export function LocationPicker({ type }: Props) {
  switch (type) {
    case 'ADDRESS': return <AddressPicker />;
    case 'PHONE': return <PhonePicker />;
    case 'ONLINE': return <OnlinePicker />;
    default: {
      const exhaustive: never = type;
      throw new Error(`LocationPicker: type "${String(exhaustive)}" not implemented`);
    }
  }
}
