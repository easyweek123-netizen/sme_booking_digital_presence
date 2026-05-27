import { Select } from '@chakra-ui/react';

const DAY_OPTS = [
  { dow: 0, label: 'Sunday' },
  { dow: 1, label: 'Monday' },
  { dow: 2, label: 'Tuesday' },
  { dow: 3, label: 'Wednesday' },
  { dow: 4, label: 'Thursday' },
  { dow: 5, label: 'Friday' },
  { dow: 6, label: 'Saturday' },
];

export interface DayOfWeekSelectProps {
  value: number | null;
  onChange: (dow: number) => void;
  size?: 'sm' | 'md';
  maxW?: string;
}

export function DayOfWeekSelect({
  value,
  onChange,
  size = 'sm',
  maxW = '140px',
}: DayOfWeekSelectProps) {
  return (
    <Select
      size={size}
      maxW={maxW}
      value={String(value ?? 1)}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {DAY_OPTS.map((d) => (
        <option key={d.dow} value={String(d.dow)}>
          {d.label}
        </option>
      ))}
    </Select>
  );
}
