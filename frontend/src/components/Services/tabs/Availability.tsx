import { Box, VStack } from '@chakra-ui/react';
import {
  RecurringHoursEditor,
  DateSpecificHoursEditor,
} from '../../Availability';
import type { ServiceTypeValue } from '../../../types';

interface AvailabilityProps {
  type: ServiceTypeValue;
}

export function Availability({ type }: AvailabilityProps) {
  if (type === 'APPOINTMENT') {
    return (
      <VStack align="stretch" spacing={6}>
        <RecurringHoursEditor
          name="availability"
          title="Weekly hours"
          description="Set when you are typically available for bookings."
          layout="day-grouped"
          showCopyToDays
        />
        <Box>
          <DateSpecificHoursEditor
            name="availability"
            title="Date-specific hours"
            description="Adjust hours for specific dates (closures or one-off changes)."
            addLabel="Hours"
            allowClosedToggle
          />
        </Box>
      </VStack>
    );
  }

  return (
    // <VStack align="stretch" spacing={6}>
    //   <RecurringHoursEditor
    //     name="availability"
    //     title="Class times"
    //     description="Recurring sessions that repeat weekly."
    //     layout="row-list"
    //     addLabel="Add class time"
    //     newRowDefaults={{ startTime: '18:00', endTime: '19:30', dayOfWeek: 3 }}
    //     showCopyToDays={false}
    //   />
      <Box>
        <DateSpecificHoursEditor
          name="availability"
          title="One off occurrences"
          description="One-time sessions on a specific date."
          addLabel="Add occurrence"
          allowClosedToggle={false}
          defaultStartTime="14:00"
          defaultEndTime="17:00"
        />
      </Box>
    // </VStack>
  );
}
