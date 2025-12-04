import { Box, HStack, VStack, Text, Button } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import type { WorkingHours } from '../../types';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  workingHours: WorkingHours | null;
}

export function DateSelector({ selectedDate, onDateChange, workingHours }: DateSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dates = generateDates(14);

  // Scroll selected date into view
  useEffect(() => {
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDate]);

  const isDateClosed = (dateStr: string) => {
    if (!workingHours) return false;
    const date = new Date(dateStr + 'T00:00:00');
    const dayIndex = date.getDay();
    const dayMap: (keyof WorkingHours)[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const day = dayMap[dayIndex];
    return !workingHours[day]?.isOpen;
  };

  return (
    <Box>
      <Text fontSize="sm" fontWeight="500" color="gray.500" mb={3} textTransform="uppercase">
        Select Date
      </Text>
      <Box
        ref={scrollRef}
        overflowX="auto"
        mx={-4}
        px={4}
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <HStack spacing={2} pb={1}>
          {dates.map((date) => {
            const isSelected = date.dateStr === selectedDate;
            const isClosed = isDateClosed(date.dateStr);
            const isToday = date.isToday;

            return (
              <Button
                key={date.dateStr}
                data-selected={isSelected}
                onClick={() => !isClosed && onDateChange(date.dateStr)}
                minW="70px"
                h="auto"
                py={3}
                px={2}
                flexShrink={0}
                variant="unstyled"
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="xl"
                border="2px"
                borderColor={isSelected ? 'brand.500' : 'transparent'}
                bg={isSelected ? 'brand.50' : 'white'}
                opacity={isClosed ? 0.4 : 1}
                cursor={isClosed ? 'not-allowed' : 'pointer'}
                _hover={{
                  bg: isClosed ? 'white' : isSelected ? 'brand.50' : 'gray.100',
                }}
                transition="all 0.15s"
              >
                <VStack spacing={0.5}>
                  <Text
                    fontSize="xs"
                    fontWeight="500"
                    color={isSelected ? 'brand.600' : 'gray.500'}
                    textTransform="uppercase"
                  >
                    {date.dayShort}
                  </Text>
                  <Text
                    fontSize="xl"
                    fontWeight="700"
                    color={isSelected ? 'brand.600' : 'gray.900'}
                  >
                    {date.day}
                  </Text>
                  {isToday && (
                    <Text
                      fontSize="9px"
                      fontWeight="600"
                      color={isSelected ? 'brand.500' : 'gray.400'}
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Today
                    </Text>
                  )}
                  {isClosed && !isToday && (
                    <Text fontSize="9px" color="gray.400" textTransform="uppercase">
                      Closed
                    </Text>
                  )}
                </VStack>
              </Button>
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
}

interface DateInfo {
  dateStr: string;
  dayShort: string;
  day: number;
  month: string;
  isToday: boolean;
}

function generateDates(count: number): DateInfo[] {
  const dates: DateInfo[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    dates.push({
      dateStr: date.toISOString().split('T')[0],
      dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    });
  }

  return dates;
}

