import {
  Box,
  VStack,
  Text,
  Button,
  Collapse,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { ClockIcon, ChevronRightIcon } from '../../../components/icons';
import { formatTime, DAY_LABELS, DAYS_OF_WEEK } from '../../../constants';
import type { WorkingHours } from '../../../types';

interface WorkingHoursSectionProps {
  workingHours: WorkingHours;
}

export function WorkingHoursSection({ workingHours }: WorkingHoursSectionProps) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ClockIcon size={16} />}
        rightIcon={
          <Box
            transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
            transition="transform 0.2s"
          >
            <ChevronRightIcon size={16} />
          </Box>
        }
        onClick={onToggle}
        color="gray.600"
        px={0}
        _hover={{ bg: 'transparent', color: 'gray.900' }}
      >
        Working Hours
      </Button>
      <Collapse in={isOpen}>
        <VStack
          align="stretch"
          spacing={1}
          mt={2}
          p={4}
          bg="gray.50"
          borderRadius="lg"
          fontSize="sm"
        >
          {DAYS_OF_WEEK.map((day) => {
            const schedule = workingHours[day];
            return (
              <Flex key={day} justify="space-between">
                <Text color="gray.600" fontWeight="500">
                  {DAY_LABELS[day]}
                </Text>
                <Text color={schedule?.isOpen ? 'gray.900' : 'gray.400'}>
                  {schedule?.isOpen
                    ? `${formatTime(schedule.openTime)} - ${formatTime(schedule.closeTime)}`
                    : 'Closed'}
                </Text>
              </Flex>
            );
          })}
        </VStack>
      </Collapse>
    </Box>
  );
}

