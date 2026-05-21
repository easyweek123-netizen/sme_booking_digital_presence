import { Box, Button, HStack, VStack } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  RecurringHoursEditor,
  DateSpecificHoursEditor,
} from '../../Availability';
import type { AvailabilityInput, ServiceTypeValue } from '../../../types';

export interface AvailabilityUpdatePayload {
  target:
    | { kind: 'business'; businessId: number }
    | {
        kind: 'service';
        serviceId: number;
        serviceType: ServiceTypeValue;
      };
  proposedRows: AvailabilityInput[];
}

export interface AvailabilityUpdateProposalProps {
  payload: AvailabilityUpdatePayload;
  onSubmit: (rows: AvailabilityInput[]) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormShape {
  availabilities: AvailabilityInput[];
}

export function AvailabilityUpdateProposal({
  payload,
  onSubmit,
  onCancel,
  isLoading = false,
}: AvailabilityUpdateProposalProps) {
  const methods = useForm<FormShape>({
    defaultValues: { availabilities: payload.proposedRows },
  });

  const submit = methods.handleSubmit(async (data) => {
    await onSubmit(data.availabilities);
  });

  const useApptEditors =
    payload.target.kind === 'business' ||
    (payload.target.kind === 'service' && payload.target.serviceType === 'APPOINTMENT');

  return (
    <FormProvider {...methods}>
      <VStack align="stretch" spacing={6}>
        {useApptEditors ? (
          <>
            <RecurringHoursEditor
              name="availabilities"
              title="Weekly hours"
              description="Set when you are typically available for bookings."
              layout="day-grouped"
              showCopyToDays
            />
            <Box borderTopWidth={1} pt={6}>
              <DateSpecificHoursEditor
                name="availabilities"
                title="Date-specific hours"
                description="Adjust hours for specific dates (closures or one-off changes)."
                addLabel="Hours"
                allowClosedToggle
              />
            </Box>
          </>
        ) : (
          <>
             <RecurringHoursEditor
              name="availabilities"
              title="Weekly hours"
              description="Set when you are typically available for bookings."
              layout="day-grouped"
              showCopyToDays
            />
            <Box borderTopWidth={1} pt={6}>
              <DateSpecificHoursEditor
                name="availabilities"
                title="One-off occurrences"
                description="One-time sessions on a specific date."
                addLabel="Add occurrence"
                allowClosedToggle={false}
                defaultStartTime="14:00"
                defaultEndTime="17:00"
              />
            </Box>
          </>
        )}
        <HStack justify="flex-end" spacing={2}>
          <Button variant="outline" size="sm" onClick={onCancel} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button colorScheme="brand" size="sm" onClick={submit} isLoading={isLoading}>
            Apply changes
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
}
