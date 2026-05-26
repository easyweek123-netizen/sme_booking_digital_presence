import { Box, Flex, Text } from '@chakra-ui/react';
import type { WorkingHours } from '../../../types';
import { SectionHeading } from '../SectionHeading';
import { DAY_LONG, orderedWeek } from '../utils';

export function HoursSection({ hours }: { hours: WorkingHours | null }) {
  const today = new Date().getDay();
  const rows = orderedWeek(hours);
  return (
    <Box as="section" pt={8}>
      <SectionHeading id="section-hours">Opening hours</SectionHeading>
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="14px"
        overflow="hidden"
      >
        {rows.map(({ dayOfWeek, day }, idx) => {
          const isToday = dayOfWeek === today;
          const closed = !day || !day.isOpen;
          return (
            <Flex
              key={dayOfWeek}
              justify="space-between"
              align="center"
              px="18px"
              py="14px"
              borderTop={idx === 0 ? 0 : '1px solid'}
              borderColor="gray.100"
              bg={isToday ? 'gray.50' : 'transparent'}
            >
              <Text fontSize="15px" fontWeight={isToday ? 600 : 500} color="gray.900">
                {DAY_LONG[dayOfWeek]}
                {isToday && (
                  <Text as="span" color="var(--brand-accent)" ml={1.5} fontSize="13px" fontWeight={600}>
                    Today
                  </Text>
                )}
              </Text>
              <Text fontSize="15px" color={closed ? 'gray.500' : 'gray.900'}>
                {closed ? 'Closed' : `${day!.openTime} – ${day!.closeTime}`}
              </Text>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
