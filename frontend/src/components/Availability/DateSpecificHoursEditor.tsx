import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CalendarIcon, CloseIcon, PlusIcon } from '../icons';
import { TimeRangeField } from '../ui/form';
import { useAvailabilityArray } from './useAvailabilityArray';

export interface DateSpecificHoursEditorProps {
  name?: string;
  title: string;
  description?: string;
  addLabel?: string;
  allowClosedToggle?: boolean;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

export function DateSpecificHoursEditor({
  name = 'availability',
  title,
  description,
  addLabel = 'Add',
  allowClosedToggle = false,
  defaultStartTime = '09:00',
  defaultEndTime = '17:00',
}: DateSpecificHoursEditorProps) {
  const api = useAvailabilityArray(name);

  const addRow = () => {
    const today = new Date().toISOString().slice(0, 10);
    api.addOneOff({
      isRecurring: false,
      dayOfWeek: null,
      date: today,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      isClosed: false,
    });
  };

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <HStack spacing={2}>
          {allowClosedToggle && <CalendarIcon size={16} />}
          <Text fontWeight="600" fontSize="sm" color="text.heading">
            {title}
          </Text>
        </HStack>
        <Button size="xs" variant="outline" leftIcon={<PlusIcon size={12} />} onClick={addRow}>
          {addLabel}
        </Button>
      </HStack>
      {description && (
        <Text fontSize="xs" color="text.muted" mb={3}>
          {description}
        </Text>
      )}

      {api.oneOffs.length === 0 ? (
        <Text fontSize="sm" color="text.muted">
          No entries yet.
        </Text>
      ) : (
        <VStack align="stretch" spacing={2}>
          {api.oneOffs.map((row, idx) => (
            <HStack key={idx} spacing={3} align="center" wrap="wrap">
              <Input
                type="date"
                size="sm"
                maxW="160px"
                value={row.date ?? ''}
                onChange={(e) => api.updateRow('oneOffs', idx, { date: e.target.value })}
              />
              {allowClosedToggle && (
                <HStack spacing={2}>
                  <Switch
                    size="sm"
                    isChecked={row.isClosed}
                    onChange={(e) =>
                      api.updateRow('oneOffs', idx, {
                        isClosed: e.target.checked,
                        startTime: e.target.checked ? null : defaultStartTime,
                        endTime: e.target.checked ? null : defaultEndTime,
                      })
                    }
                  />
                  <Text fontSize="xs" color="text.muted">
                    Closed
                  </Text>
                </HStack>
              )}
              {!row.isClosed && (
                <TimeRangeField
                  startTime={row.startTime}
                  endTime={row.endTime}
                  onChange={(next) => api.updateRow('oneOffs', idx, next)}
                />
              )}
              <IconButton
                aria-label="Remove entry"
                icon={<CloseIcon size={12} />}
                size="sm"
                variant="ghost"
                onClick={() => api.removeRow('oneOffs', idx)}
              />
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
}
