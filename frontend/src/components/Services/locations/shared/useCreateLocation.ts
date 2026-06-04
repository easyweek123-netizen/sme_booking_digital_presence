import { useCallback } from 'react';
import { useCreateLocationMutation } from '../../../../store/api/locationsApi';
import { useGetCalendarStatusQuery } from '../../../../store/api/calendarApi';
import { isValidPhoneNumber } from 'react-phone-number-input';
import type { CreatingLocation, CreateLocationDto } from '@bookeasy/shared';

export class InvalidCreatingLocationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(message);
    this.field = field;
  }
}

export function useCreateLocation() {
  const [createLocationApi, state] = useCreateLocationMutation();
  const { data: calendarStatus } = useGetCalendarStatusQuery();

  const createLocation = useCallback(
    async (creating: CreatingLocation): Promise<number> => {
      let dto: CreateLocationDto;
      switch (creating.type) {
        case 'ADDRESS':
          dto = { type: 'ADDRESS', data: creating.data };
          break;
        case 'PHONE':
          if (!isValidPhoneNumber(creating.data.phoneNumber)) {
            throw new InvalidCreatingLocationError('location', 'Phone is required for this service.');
          }
          dto = { type: 'PHONE', data: creating.data };
          break;
        case 'ONLINE':
          if (!calendarStatus?.connected || !calendarStatus.calendarId) {
            throw new InvalidCreatingLocationError(
              'location',
              'Connect Google Calendar before saving an online service.',
            );
          }
          dto = { type: 'ONLINE', data: { calendarId: calendarStatus.calendarId } };
          break;
      }
      const created = await createLocationApi(dto).unwrap();
      return created.id;
    },
    [createLocationApi, calendarStatus],
  );

  return { createLocation, isCreating: state.isLoading };
}
