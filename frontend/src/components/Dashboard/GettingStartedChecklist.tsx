import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Button,
  Flex,
  useClipboard,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../config/routes';
import { LayersIcon, CalendarIcon } from '../icons';

const MotionBox = motion.create(Box);

interface ChecklistItem {
  label: string;
  done: boolean;
  action: () => void;
  actionLabel: string;
  icon: React.ReactNode;
}

interface GettingStartedChecklistProps {
  servicesCount: number;
  hasCustomization: boolean;
  bookingUrl: string;
  totalBookings: number;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.3 4.3a1 1 0 010 1.4l-6 6a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L6.6 9.6l5.3-5.3a1 1 0 011.4 0z"
        fill="currentColor"
      />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function GettingStartedChecklist({
  servicesCount,
  hasCustomization,
  bookingUrl,
  totalBookings,
}: GettingStartedChecklistProps) {
  const navigate = useNavigate();
  const { onCopy, hasCopied } = useClipboard(bookingUrl);

  const items: ChecklistItem[] = [
    {
      label: 'Add your first service',
      done: servicesCount > 0,
      action: () => navigate(ROUTES.DASHBOARD.SERVICES),
      actionLabel: 'Add Service',
      icon: <LayersIcon size={16} />,
    },
    {
      label: 'Customize your booking page',
      done: hasCustomization,
      action: () => navigate(ROUTES.DASHBOARD.SETTINGS),
      actionLabel: 'Customize',
      icon: <CalendarIcon size={16} />,
    },
    {
      label: 'Share your booking link',
      done: totalBookings > 0,
      action: onCopy,
      actionLabel: hasCopied ? 'Copied!' : 'Copy Link',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6.7 9.3a3.5 3.5 0 004.9 0l2-2a3.5 3.5 0 00-4.9-5l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9.3 6.7a3.5 3.5 0 00-4.9 0l-2 2a3.5 3.5 0 004.9 5l1.1-1.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const completedCount = items.filter((i) => i.done).length;
  const allDone = completedCount === items.length;
  const progressPercent = (completedCount / items.length) * 100;

  if (allDone) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      bg="white"
      borderRadius="2xl"
      border="1px"
      borderColor="gray.100"
      p={6}
    >
      <VStack align="stretch" spacing={5}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="md" color="gray.900" mb={1}>
              Get Started
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {completedCount} of {items.length} complete
            </Text>
          </Box>
        </Flex>

        {/* Progress Bar */}
        <Progress
          value={progressPercent}
          colorScheme="brand"
          borderRadius="full"
          size="sm"
          bg="gray.100"
        />

        {/* Checklist Items */}
        <VStack align="stretch" spacing={3}>
          {items.map((item) => (
            <HStack
              key={item.label}
              spacing={3}
              p={3}
              borderRadius="xl"
              bg={item.done ? 'green.50' : 'gray.50'}
              border="1px solid"
              borderColor={item.done ? 'green.100' : 'gray.100'}
              transition="all 0.2s"
            >
              {/* Check/Circle icon */}
              <Flex
                w="28px"
                h="28px"
                align="center"
                justify="center"
                borderRadius="full"
                bg={item.done ? 'green.100' : 'white'}
                color={item.done ? 'green.600' : 'gray.300'}
                border={item.done ? 'none' : '1px solid'}
                borderColor="gray.200"
                flexShrink={0}
              >
                {item.done ? <CheckIcon /> : <CircleIcon />}
              </Flex>

              {/* Label */}
              <HStack flex={1} spacing={2}>
                <Box color={item.done ? 'green.600' : 'gray.500'}>
                  {item.icon}
                </Box>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color={item.done ? 'green.700' : 'gray.700'}
                  textDecoration={item.done ? 'line-through' : 'none'}
                >
                  {item.label}
                </Text>
              </HStack>

              {/* Action Button */}
              {!item.done && (
                <Button
                  size="xs"
                  colorScheme="brand"
                  variant="ghost"
                  onClick={item.action}
                  flexShrink={0}
                >
                  {item.actionLabel}
                </Button>
              )}
            </HStack>
          ))}
        </VStack>
      </VStack>
    </MotionBox>
  );
}
