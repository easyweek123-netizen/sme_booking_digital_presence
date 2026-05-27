import { HStack, Input, Text } from '@chakra-ui/react';

export interface TimeRangeFieldProps {
  startTime: string | null | undefined;
  endTime: string | null | undefined;
  onChange: (next: { startTime: string; endTime: string }) => void;
  size?: 'sm' | 'md';
  maxW?: string;
}

export function TimeRangeField({
  startTime,
  endTime,
  onChange,
  size = 'sm',
  maxW = '110px',
}: TimeRangeFieldProps) {
  return (
    <HStack spacing={2} align="center">
      <Input
        type="time"
        size={size}
        maxW={maxW}
        value={startTime ?? ''}
        onChange={(e) =>
          onChange({ startTime: e.target.value, endTime: endTime ?? '' })
        }
      />
      <Text color="text.muted">–</Text>
      <Input
        type="time"
        size={size}
        maxW={maxW}
        value={endTime ?? ''}
        onChange={(e) =>
          onChange({ startTime: startTime ?? '', endTime: e.target.value })
        }
      />
    </HStack>
  );
}
