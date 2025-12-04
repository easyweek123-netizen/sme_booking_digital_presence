import {
  Box,
  Flex,
  Text,
  Switch,
  Select,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkingHours, DaySchedule } from '../../types';
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  DAY_SHORT_LABELS,
  generateTimeOptions,
  type DayOfWeek,
} from '../../constants';

const MotionBox = motion.create(Box);

interface WorkingHoursEditorProps {
  value: WorkingHours;
  onChange: (hours: WorkingHours) => void;
}

export function WorkingHoursEditor({ value, onChange }: WorkingHoursEditorProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const timeOptions = generateTimeOptions();

  const handleToggle = (day: DayOfWeek) => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        isOpen: !value[day].isOpen,
      },
    });
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: 'openTime' | 'closeTime',
    time: string
  ) => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        [field]: time,
      },
    });
  };

  const getDaySchedule = (day: DayOfWeek): DaySchedule => {
    return value[day];
  };

  return (
    <Box w="full">
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(1, 1fr)' }}
        gap={2}
      >
        {DAYS_OF_WEEK.map((day) => {
          const schedule = getDaySchedule(day);
          const label = isMobile ? DAY_SHORT_LABELS[day] : DAY_LABELS[day];

          return (
            <GridItem key={day}>
              <Flex
                align="center"
                justify="space-between"
                p={3}
                bg={schedule.isOpen ? 'white' : 'gray.50'}
                borderRadius="lg"
                border="1px"
                borderColor={schedule.isOpen ? 'gray.200' : 'gray.100'}
                transition="all 0.2s"
                gap={3}
              >
                {/* Day name and toggle */}
                <Flex align="center" gap={3} minW={{ base: '90px', md: '140px' }}>
                  <Switch
                    isChecked={schedule.isOpen}
                    onChange={() => handleToggle(day)}
                    colorScheme="brand"
                    size="md"
                  />
                  <Text
                    fontWeight="500"
                    color={schedule.isOpen ? 'gray.900' : 'gray.400'}
                    fontSize={{ base: 'sm', md: 'md' }}
                    transition="color 0.2s"
                  >
                    {label}
                  </Text>
                </Flex>

                {/* Time selectors */}
                <AnimatePresence mode="wait">
                  {schedule.isOpen ? (
                    <MotionBox
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flex align="center" gap={2}>
                        <Select
                          value={schedule.openTime}
                          onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                          size="sm"
                          w={{ base: '90px', md: '110px' }}
                          borderRadius="md"
                          bg="white"
                          _focus={{
                            borderColor: 'brand.500',
                            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                          }}
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Text color="gray.400" fontSize="sm">
                          to
                        </Text>
                        <Select
                          value={schedule.closeTime}
                          onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                          size="sm"
                          w={{ base: '90px', md: '110px' }}
                          borderRadius="md"
                          bg="white"
                          _focus={{
                            borderColor: 'brand.500',
                            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                          }}
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </Flex>
                    </MotionBox>
                  ) : (
                    <MotionBox
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Text color="gray.400" fontSize="sm" fontStyle="italic">
                        Closed
                      </Text>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Flex>
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
}

