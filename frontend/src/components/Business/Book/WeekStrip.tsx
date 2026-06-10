import { Box, Flex, Grid, HStack, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { DAY_SHORT, MONTH_SHORT, sameDay } from '../utils';

interface WeekStripProps {
  weekStart: Date;
  days: Date[];
  selectedDate: Date;
  onSelect: (d: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function WeekStrip({
  weekStart,
  days,
  selectedDate,
  onSelect,
  onPrev,
  onNext,
}: WeekStripProps) {
  return (
    <Box>
      <Flex align="center" justify="space-between" mb={3}>
        <Text fontSize="sm" fontWeight={600} color="text.strong">
          {MONTH_SHORT[weekStart.getMonth()]} {weekStart.getFullYear()}
        </Text>
        <HStack spacing={2}>
          <IconButton
            aria-label="Previous week"
            onClick={onPrev}
            icon={<ChevronLeftIcon size={16} />}
            size="sm"
            borderRadius="full"
            bg="surface.muted"
            color="text.strong"
            _hover={{ bg: 'border.subtle' }}
            _active={{ bg: 'border.subtle' }}
            boxShadow="sm"
          />
          <IconButton
            aria-label="Next week"
            onClick={onNext}
            icon={<ChevronRightIcon size={16} />}
            size="sm"
            borderRadius="full"
            bg="surface.muted"
            color="text.strong"
            _hover={{ bg: 'border.subtle' }}
            _active={{ bg: 'border.subtle' }}
            boxShadow="sm"
          />
        </HStack>
      </Flex>

      <Grid templateColumns={`repeat(${days.length}, 1fr)`} gap={2} mb={7}>
        {days.map((d) => {
          const active = sameDay(d, selectedDate);
          return (
            <Flex
              key={d.toISOString()}
              as="button"
              onClick={() => onSelect(d)}
              direction="column"
              align="center"
              gap={0.5}
              py={3}
              borderRadius="12px"
              bg={active ? 'var(--brand-accent)' : 'surface.card'}
              color={active ? 'var(--brand-on-accent)' : 'text.heading'}
              border="1px solid"
              borderColor={active ? 'var(--brand-accent)' : 'border.subtle'}
              transition="all .15s"
            >
              <Text fontSize="12px" fontWeight={500} opacity={active ? 0.85 : 0.7}>
                {DAY_SHORT[d.getDay()]}
              </Text>
              <Text fontSize="22px" fontWeight={700} letterSpacing="-0.02em">
                {d.getDate()}
              </Text>
              <Text fontSize="11px" fontWeight={500} opacity={active ? 0.85 : 0.7}>
                {MONTH_SHORT[d.getMonth()]}
              </Text>
            </Flex>
          );
        })}
      </Grid>
    </Box>
  );
}
