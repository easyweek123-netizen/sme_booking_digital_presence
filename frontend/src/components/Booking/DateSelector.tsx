import { Box, HStack, VStack, Text, Button } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import type { WorkingHours } from '../../types';
import { toLocalYmd } from '../../utils/format';

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
      <Text
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.08em"
        color="gray.400"
        mb={4}
        textTransform="uppercase"
      >
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
        <HStack spacing={2.5} pb={2}>
          {dates.map((date) => {
            const isSelected = date.dateStr === selectedDate;
            const isClosed = isDateClosed(date.dateStr);
            const isToday = date.isToday;

            return (
              <Button
                key={date.dateStr}
                data-selected={isSelected}
                onClick={() => !isClosed && onDateChange(date.dateStr)}
                minW="74px"
                h="auto"
                py={4}
                px={3}
                flexShrink={0}
                variant="unstyled"
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="2xl"
                border="1px solid"
                borderColor={isSelected ? 'var(--brand-color, #6B46C1)' : '#ECECEC'}
                bg={isSelected ? 'var(--brand-color, #6B46C1)' : 'white'}
                boxShadow={isSelected ? '0 4px 12px rgba(107, 70, 193, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.01)'}
                opacity={isClosed ? 0.4 : 1}
                cursor={isClosed ? 'not-allowed' : 'pointer'}
                _hover={{
                  bg: isClosed ? 'white' : isSelected ? 'var(--brand-color-dark, #53369B)' : 'gray.50',
                  borderColor: isSelected ? 'var(--brand-color, #6B46C1)' : 'gray.300',
                  transform: isClosed ? 'none' : 'translateY(-1px)',
                }}
                _active={{
                  transform: isClosed ? 'none' : 'scale(0.96)',
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <VStack spacing={1}>
                  <Text
                    fontSize="10px"
                    fontWeight="700"
                    color={isSelected ? 'white' : 'gray.400'}
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                  >
                    {date.dayShort}
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="800"
                    color={isSelected ? 'white' : 'black'}
                    lineHeight="none"
                  >
                    {date.day}
                  </Text>
                  {isToday && (
                    <Text
                      fontSize="9px"
                      fontWeight="700"
                      color={isSelected ? 'white' : 'brand.500'}
                      textTransform="uppercase"
                      letterSpacing="0.05em"
                      pt={0.5}
                    >
                      Today
                    </Text>
                  )}
                  {isClosed && !isToday && (
                    <Text
                      fontSize="9px"
                      fontWeight="600"
                      color={isSelected ? 'white' : 'gray.400'}
                      textTransform="uppercase"
                      pt={0.5}
                    >
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
      dateStr: toLocalYmd(date),
      dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    });
  }

  return dates;
}
