import { useFormContext, useWatch } from 'react-hook-form';
import type { AvailabilityInput } from '../../types';

/**
 * Requires a parent `FormProvider`. Reads + writes a single array field (`name`) holding
 * `AvailabilityInput[]`. Splits into recurring vs one-off views purely for UI.
 */
export interface AvailabilityArrayApi {
  all: AvailabilityInput[];
  recurring: AvailabilityInput[];
  oneOffs: AvailabilityInput[];
  setRecurring: (next: AvailabilityInput[]) => void;
  setOneOffs: (next: AvailabilityInput[]) => void;
  updateRow: (
    bucket: 'recurring' | 'oneOffs',
    idx: number,
    patch: Partial<AvailabilityInput>,
  ) => void;
  removeRow: (bucket: 'recurring' | 'oneOffs', idx: number) => void;
  addRecurring: (entry: AvailabilityInput) => void;
  addOneOff: (entry: AvailabilityInput) => void;
}

export function useAvailabilityArray(name: string): AvailabilityArrayApi {
  const { control, setValue } = useFormContext();
  const all = (useWatch({ control, name }) as AvailabilityInput[]) ?? [];

  const recurring = all.filter((a) => a.isRecurring);
  const oneOffs = all.filter((a) => !a.isRecurring);

  const write = (nextRecurring: AvailabilityInput[], nextOneOffs: AvailabilityInput[]) => {
    setValue(name, [...nextRecurring, ...nextOneOffs], { shouldDirty: true });
  };

  return {
    all,
    recurring,
    oneOffs,
    setRecurring: (next) => write(next, oneOffs),
    setOneOffs: (next) => write(recurring, next),
    updateRow: (bucket, idx, patch) => {
      if (bucket === 'recurring') {
        write(
          recurring.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
          oneOffs,
        );
      } else {
        write(
          recurring,
          oneOffs.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
        );
      }
    },
    removeRow: (bucket, idx) => {
      if (bucket === 'recurring') {
        write(
          recurring.filter((_, i) => i !== idx),
          oneOffs,
        );
      } else {
        write(
          recurring,
          oneOffs.filter((_, i) => i !== idx),
        );
      }
    },
    addRecurring: (entry) => write([...recurring, entry], oneOffs),
    addOneOff: (entry) => write(recurring, [...oneOffs, entry]),
  };
}
