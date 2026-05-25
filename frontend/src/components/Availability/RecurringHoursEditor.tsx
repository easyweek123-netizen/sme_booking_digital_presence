import {
  Box,
  Button,
  Checkbox,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CloseIcon, CopyIcon, PlusIcon } from '../icons';
import { DayOfWeekSelect, TimeRangeField } from '../ui/form';
import type { AvailabilityInput } from '../../types';
import { useAvailabilityArray } from './useAvailabilityArray';

const DAYS_GROUPED: { dow: number; label: string; full: string }[] = [
  { dow: 1, label: 'M', full: 'Monday' },
  { dow: 2, label: 'T', full: 'Tuesday' },
  { dow: 3, label: 'W', full: 'Wednesday' },
  { dow: 4, label: 'T', full: 'Thursday' },
  { dow: 5, label: 'F', full: 'Friday' },
  { dow: 6, label: 'S', full: 'Saturday' },
  { dow: 0, label: 'S', full: 'Sunday' },
];

/**
 * Renders + edits the recurring half of an availability list held in RHF under `name`.
 * Use inside a `FormProvider`.
 */
export interface RecurringHoursEditorProps {
  name?: string;
  title: string;
  description?: string;
  addLabel?: string;
  layout?: 'day-grouped' | 'row-list';
  /** Defaults for a newly added row. */
  newRowDefaults?: { startTime?: string; endTime?: string; dayOfWeek?: number };
  showCopyToDays?: boolean;
}

export function RecurringHoursEditor({
  name = 'availability',
  title,
  description,
  addLabel = 'Add hours',
  layout = 'day-grouped',
  newRowDefaults,
  showCopyToDays = true,
}: RecurringHoursEditorProps) {
  const defaultStartTime = newRowDefaults?.startTime ?? '09:00';
  const defaultEndTime = newRowDefaults?.endTime ?? '17:00';
  const defaultDayOfWeek = newRowDefaults?.dayOfWeek ?? 3;

  const api = useAvailabilityArray(name);

  const addShift = (dow: number) =>
    api.addRecurring({
      isRecurring: true,
      dayOfWeek: dow,
      date: null,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      isClosed: false,
    });

  const copyToDays = (sourceDow: number, targetDows: number[]) => {
    const sourceShifts = api.recurring.filter((a) => a.dayOfWeek === sourceDow);
    const keep = api.recurring.filter(
      (a) => a.dayOfWeek == null || !targetDows.includes(a.dayOfWeek),
    );
    const additions: AvailabilityInput[] = [];
    for (const dow of targetDows) {
      for (const src of sourceShifts) additions.push({ ...src, dayOfWeek: dow });
    }
    api.setRecurring([...keep, ...additions]);
  };

  if (layout === 'row-list') {
    return (
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="600" fontSize="sm" color="text.heading">
            {title}
          </Text>
          <Button
            size="xs"
            variant="outline"
            leftIcon={<PlusIcon size={12} />}
            onClick={() =>
              api.addRecurring({
                isRecurring: true,
                dayOfWeek: defaultDayOfWeek,
                date: null,
                startTime: defaultStartTime,
                endTime: defaultEndTime,
                isClosed: false,
              })
            }
          >
            {addLabel}
          </Button>
        </HStack>
        {description && (
          <Text fontSize="xs" color="text.muted" mb={3}>
            {description}
          </Text>
        )}
        {api.recurring.length === 0 ? (
          <Text fontSize="sm" color="text.muted">
            No {title.toLowerCase()} yet.
          </Text>
        ) : (
          <VStack align="stretch" spacing={2}>
            {api.recurring.map((r, idx) => (
              <HStack key={idx} spacing={3} align="center" wrap="wrap">
                <DayOfWeekSelect
                  value={r.dayOfWeek ?? 1}
                  onChange={(dow) => api.updateRow('recurring', idx, { dayOfWeek: dow })}
                />
                <TimeRangeField
                  startTime={r.startTime}
                  endTime={r.endTime}
                  onChange={(next) => api.updateRow('recurring', idx, next)}
                />
                <IconButton
                  aria-label="Remove row"
                  icon={<CloseIcon size={12} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => api.removeRow('recurring', idx)}
                />
              </HStack>
            ))}
          </VStack>
        )}
      </Box>
    );
  }

  return (
    <Box minW={0}>
      <Text fontWeight="600" fontSize="sm" color="text.heading" mb={1}>
        {title}
      </Text>
      {description && (
        <Text fontSize="xs" color="text.muted" mb={4}>
          {description}
        </Text>
      )}
      <VStack align="stretch" spacing={3}>
        {DAYS_GROUPED.map((d) => {
          const dayShifts = api.recurring
            .map((shift, idxInRecurring) => ({ shift, idxInRecurring }))
            .filter(({ shift }) => shift.dayOfWeek === d.dow);

          if (dayShifts.length === 0) {
            return (
              <HStack key={d.dow} spacing={3} align="center">
                <DayBadge label={d.label} />
                <Text fontSize="sm" color="text.muted" flex={1}>
                  Unavailable
                </Text>
                <IconButton
                  aria-label={`Add hours for ${d.full}`}
                  icon={<PlusIcon size={14} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => addShift(d.dow)}
                />
              </HStack>
            );
          }

          return (
            <VStack key={d.dow} align="stretch" spacing={2}>
              {dayShifts.map(({ shift: s, idxInRecurring }, localIdx) => {
                const isFirst = localIdx === 0;
                return (
                  <HStack key={idxInRecurring} spacing={3} align="center" wrap="wrap" rowGap={2}>
                    {isFirst ? <DayBadge label={d.label} /> : <Box w={8} flexShrink={0} />}
                    <TimeRangeField
                      startTime={s.startTime}
                      endTime={s.endTime}
                      maxW="120px"
                      onChange={(next) => api.updateRow('recurring', idxInRecurring, next)}
                    />
                    <IconButton
                      aria-label="Remove shift"
                      icon={<CloseIcon size={12} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => api.removeRow('recurring', idxInRecurring)}
                    />
                    {isFirst && (
                      <>
                        <IconButton
                          aria-label="Add another shift"
                          icon={<PlusIcon size={14} />}
                          size="sm"
                          variant="ghost"
                          onClick={() => addShift(d.dow)}
                        />
                        {showCopyToDays && (
                          <CopyToDaysButton
                            sourceDow={d.dow}
                            allDows={DAYS_GROUPED.map((x) => ({ dow: x.dow, full: x.full }))}
                            onApply={(targets) => copyToDays(d.dow, targets)}
                          />
                        )}
                      </>
                    )}
                  </HStack>
                );
              })}
            </VStack>
          );
        })}
      </VStack>
    </Box>
  );
}

function DayBadge({ label }: { label: string }) {
  return (
    <Box
      w={8}
      h={8}
      borderRadius="full"
      bg="text.heading"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="600"
      fontSize="sm"
      flexShrink={0}
    >
      {label}
    </Box>
  );
}

function CopyToDaysButton({
  sourceDow,
  allDows,
  onApply,
}: {
  sourceDow: number;
  allDows: { dow: number; full: string }[];
  onApply: (targets: number[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (dow: number) =>
    setSelected((s) => (s.includes(dow) ? s.filter((d) => d !== dow) : [...s, dow]));

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          aria-label="Copy hours to other days"
          icon={<CopyIcon size={14} />}
          size="sm"
          variant="ghost"
        />
      </PopoverTrigger>
      <PopoverContent w="220px">
        <PopoverArrow />
        <PopoverBody>
          <Text fontSize="sm" fontWeight="600" mb={2}>
            Copy to:
          </Text>
          <Stack spacing={1}>
            {allDows
              .filter((d) => d.dow !== sourceDow)
              .map((d) => (
                <Checkbox
                  key={d.dow}
                  size="sm"
                  isChecked={selected.includes(d.dow)}
                  onChange={() => toggle(d.dow)}
                >
                  {d.full}
                </Checkbox>
              ))}
          </Stack>
          <Button
            mt={3}
            size="sm"
            colorScheme="brand"
            isDisabled={selected.length === 0}
            onClick={() => {
              onApply(selected);
              setSelected([]);
            }}
            w="full"
          >
            Apply
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
