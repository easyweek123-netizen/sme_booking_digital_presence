import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react';
import { DAYS_OF_WEEK, DAY_LABELS, formatTime } from '../../../constants';
import type { BusinessWithServices } from '../../../types';

interface OpeningHoursSectionProps {
  business: BusinessWithServices;
}

export function OpeningHoursSection({ business }: OpeningHoursSectionProps) {
  const hasWorkingHours = !!business.workingHours;

  if (!hasWorkingHours) return null;

  return (
    <Box as="section" bg="surface.alt" py={{ base: 8, md: 12 }} id="hours">
      <Container maxW="container.xl" px={{ base: 4 }}>
        <VStack align="stretch" spacing={6}>
          <Heading size="lg" color="text.heading" letterSpacing="-0.02em">
            Opening times
          </Heading>

          <Box
            position="sticky"
            top={{ base: 4, md: 6 }}
            zIndex={10}
          >
            <VStack spacing={2} align="stretch">
              {DAYS_OF_WEEK.map((day) => {
                const schedule = business.workingHours![day];
                const isOpen = schedule?.isOpen;

                return (
                  <HStack key={day} spacing={4} align="center">
                    <Box
                      w={3}
                      h={3}
                      borderRadius="full"
                      bg={isOpen ? 'green.400' : 'gray.300'}
                      flexShrink={0}
                    />
                    <Text
                      color={isOpen ? 'text.heading' : 'gray.400'}
                      fontWeight={isOpen ? '500' : '400'}
                      minW="90px"
                      flex={1}
                    >
                      {DAY_LABELS[day]}
                    </Text>
                    <Text
                      color={isOpen ? 'text.secondary' : 'gray.400'}
                      fontSize="sm"
                      fontWeight="500"
                      textAlign="right"
                    >
                      {isOpen
                        ? `${formatTime(schedule.openTime)} – ${formatTime(schedule.closeTime)}`
                        : 'Closed'}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
