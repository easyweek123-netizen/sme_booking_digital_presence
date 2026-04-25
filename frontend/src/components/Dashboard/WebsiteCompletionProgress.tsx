import {
  Box,
  Collapse,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { BusinessWithServices } from '../../types';
import { ROUTES } from '../../config/routes';
import {
  BuildingIcon,
  LayersIcon,
  SparkleIcon,
  ClockIcon,
  HeartIcon,
  CheckIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '../icons';

const MotionBox = motion.create(Box);

const TOTAL_ITEMS = 11;

function filled(v: string | null | undefined): boolean {
  return !!(v && String(v).trim());
}

export interface WebsiteCompletionProgressProps {
  business: BusinessWithServices;
  onScrollToSection: (sectionId: string) => void;
}

type SectionRow = {
  key: string;
  label: string;
  icon: React.ReactNode;
  done: number;
  total: number;
  /** Scroll target on Website page, or 'services' to navigate to Services */
  action: { type: 'scroll'; id: string } | { type: 'services' };
};

export function WebsiteCompletionProgress(
  props: WebsiteCompletionProgressProps,
) {
  const { business, onScrollToSection } = props;
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const activeServices =
    business.services?.filter((s) => s.isActive).length ?? 0;

  const profileChecks = [
    filled(business.name),
    filled(business.description),
    filled(business.phone),
    filled(business.address),
    filled(business.city),
  ];
  const profileDone = profileChecks.filter(Boolean).length;

  const brandingChecks = [
    filled(business.logoUrl),
    filled(business.brandColor),
    filled(business.coverImageUrl),
  ];
  const brandingDone = brandingChecks.filter(Boolean).length;

  const hoursDone = !!business.workingHours;
  const aboutDone = filled(business.aboutContent);
  const servicesDone = activeServices > 0 ? 1 : 0;

  const completed =
    profileDone +
    servicesDone +
    brandingDone +
    (hoursDone ? 1 : 0) +
    (aboutDone ? 1 : 0);

  const progressPercent = (completed / TOTAL_ITEMS) * 100;
  const allComplete = completed === TOTAL_ITEMS;

  const bookingUrl =
    typeof window !== 'undefined' && business.slug
      ? `${window.location.origin}/book/${business.slug}`
      : '';

  const sections: SectionRow[] = [
    {
      key: 'profile',
      label: 'Business profile',
      icon: <BuildingIcon size={20} />,
      done: profileDone,
      total: 5,
      action: { type: 'scroll', id: 'section-business-profile' },
    },
    {
      key: 'services',
      label: 'Services',
      icon: <LayersIcon size={20} />,
      done: servicesDone,
      total: 1,
      action: { type: 'services' },
    },
    {
      key: 'branding',
      label: 'Branding',
      icon: <SparkleIcon size={20} />,
      done: brandingDone,
      total: 3,
      action: { type: 'scroll', id: 'section-branding' },
    },
    {
      key: 'hours',
      label: 'Working hours',
      icon: <ClockIcon size={20} />,
      done: hoursDone ? 1 : 0,
      total: 1,
      action: { type: 'scroll', id: 'section-working-hours' },
    },
    {
      key: 'about',
      label: 'About section',
      icon: <HeartIcon size={20} />,
      done: aboutDone ? 1 : 0,
      total: 1,
      action: { type: 'scroll', id: 'section-about' },
    },
  ];

  const handleRowAction = (row: SectionRow) => {
    if (row.action.type === 'services') {
      navigate(ROUTES.DASHBOARD.SERVICES);
      return;
    }
    onScrollToSection(row.action.id);
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent,
    row: SectionRow,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowAction(row);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        bg="surface.card"
        borderRadius="md"
        border="1px"
        borderColor="border.subtle"
        p={4}
      >
        <Box>
          <Heading size="sm" color="text.heading" mb={1}>
            Completion Progress
          </Heading>
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={2}
          >
            <Text fontSize="sm" color="text.muted">
              {completed} of {TOTAL_ITEMS} complete
            </Text>
            {allComplete && bookingUrl && (
              <Link
                href={bookingUrl}
                isExternal
                fontSize="sm"
                fontWeight="600"
                color="accent.hover"
                display="inline-flex"
                alignItems="center"
                gap={1}
                onClick={(e) => e.stopPropagation()}
              >
                Preview website
                <ExternalLinkIcon size={16} />
              </Link>
            )}
          </Flex>
        </Box>
        <VStack align="stretch" spacing={4}>
          <Flex align="center" gap={2}>
            <Box flex={1} minW={0}>
              <Progress
                value={progressPercent}
                colorScheme="brand"
                borderRadius="full"
                size="sm"
                bg="surface.page"
              />
            </Box>
            <IconButton
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? 'Hide progress breakdown'
                  : 'Show progress breakdown'
              }
              icon={
                expanded ? (
                  <ChevronUpIcon size={20} />
                ) : (
                  <ChevronDownIcon size={20} />
                )
              }
              variant="ghost"
              size="sm"
              flexShrink={0}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
            />
          </Flex>

          {allComplete ? (
            <Box
              bg="brand.50"
              borderRadius="xl"
              border="1px solid"
              borderColor="brand.100"
              px={4}
              py={3}
            >
              <HStack spacing={2}>
                <Box color="accent.hover">
                  <CheckIcon size={18} />
                </Box>
                <Text fontSize="sm" fontWeight="600" color="brand.700">
                  Your website is ready.
                </Text>
              </HStack>
            </Box>
          ) : null}

          <Collapse in={expanded} animateOpacity>
            <VStack align="stretch" spacing={2}>
              {sections.map((row) => {
                const complete = row.done === row.total;
                return (
                  <HStack
                    key={row.key}
                    spacing={3}
                    py={3}
                    px={3}
                    borderRadius="xl"
                    bg={complete ? 'brand.50' : 'gray.50'}
                    border="1px solid"
                    borderColor={complete ? 'brand.100' : 'border.subtle'}
                    cursor="pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleRowAction(row)}
                    onKeyDown={(e) => handleRowKeyDown(e, row)}
                    _hover={{
                      borderColor: complete ? 'brand.200' : 'border.subtle',
                    }}
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'brand.500',
                      outlineOffset: '2px',
                    }}
                  >
                    <Flex
                      w="32px"
                      h="32px"
                      align="center"
                      justify="center"
                      borderRadius="lg"
                      bg={complete ? 'brand.100' : 'white'}
                      color={complete ? 'brand.600' : 'gray.500'}
                      flexShrink={0}
                    >
                      {row.icon}
                    </Flex>
                    <Box flex={1} minW={0}>
                      <Text fontSize="sm" fontWeight="600" color="text.primary">
                        {row.label}
                      </Text>
                      <Text fontSize="xs" color="text.muted">
                        {complete ? 'Complete' : `${row.done}/${row.total}`}
                      </Text>
                    </Box>
                    {complete && (
                      <Box color="accent.hover" flexShrink={0}>
                        <CheckIcon size={18} />
                      </Box>
                    )}
                  </HStack>
                );
              })}
            </VStack>
          </Collapse>
        </VStack>
      </MotionBox>
    </VStack>
  );
}
