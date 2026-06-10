import { Box, HStack, Heading, Spinner, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useGetSlotsQuery } from '../../../../store/api/slotsApi';
import { addDays, formatSlotLabel } from '../../utils';
import { WeekStrip } from '../WeekStrip';
import { TimeSlotPicker } from '../TimeSlotPicker';
import { toIsoDate } from '../utils';
import type { BookingStepContext } from '../bookingFlow.types';

export function TimeStep({ flow }: BookingStepContext) {
  const { state, selectDate, selectSlot } = flow;
  const service = state.service!;
  const visibleDays = useBreakpointValue({ base: 5, lg: 7 }) ?? 7;

  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const days = useMemo(
    () => Array.from({ length: visibleDays }, (_, i) => addDays(weekStart, i)),
    [weekStart, visibleDays],
  );

  const dateIso = toIsoDate(state.date);
  const slotsQuery = useGetSlotsQuery(
    { serviceId: service.id, from: dateIso, to: dateIso },
    { skip: !service.id },
  );

  const slots: string[] =
    slotsQuery.data?.slots
      ?.filter((s) => s.date === dateIso)
      .map((s) => {
        const [h, m] = s.startTime.split(':').map(Number);
        return formatSlotLabel(h, m);
      }) ?? [];

  return (
    <VStack align="stretch" spacing={0}>
      <WeekStrip
        weekStart={weekStart}
        days={days}
        selectedDate={state.date}
        onSelect={(d) => selectDate(d)}
        onPrev={() => setWeekStart(addDays(weekStart, -visibleDays))}
        onNext={() => setWeekStart(addDays(weekStart, visibleDays))}
      />

      <Box>
        <Heading as="h3" fontSize="16px" fontWeight={600} m="0 0 12px" color="text.heading">
          Pick a time
        </Heading>
        {slotsQuery.isLoading ? (
          <HStack spacing={2}>
            <Spinner size="sm" />
            <Text color="text.muted">Loading slots…</Text>
          </HStack>
        ) : (
          <TimeSlotPicker slots={slots} selectedSlot={state.slot} onSelect={selectSlot} />
        )}
      </Box>
    </VStack>
  );
}
