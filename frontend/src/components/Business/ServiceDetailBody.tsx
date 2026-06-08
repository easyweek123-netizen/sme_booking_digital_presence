import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { Service, Slot } from '../../types';
import type { AddressLocation } from '../../types/location';
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  CloseIcon,
  MapPinIcon,
  PhoneIcon,
  VideoIcon,
} from '../icons';
import { ServiceCoverImage } from '../Services/atoms/ServiceCoverImage';
import { ServicePriceLabel } from '../Services/atoms/ServicePriceLabel';
import {
  getDaysLabel,
  getLocationLabel,
  getLocationType,
  LocationType,
} from '../Services/helpers';
import { addDays, formatDuration } from './utils';
import { toLocalYmd } from '../../utils/format';
import { AddressMap } from '../Locations/address/AddressMap';
import { ServiceDescriptionContainer } from '../Services/atoms/ServiceDescriptionContainer';
import { DescriptionItem, ServiceDescription } from '../Services/atoms/ServiceDescription';
import { ServiceCapacityBadge } from '../Services/atoms/ServiceCapacityBadge';
import { ServiceLocationIcon } from '../Services/atoms/ServiceLocationIcon';

export interface NextAvailableData {
  slots: Slot[];
  isLoading: boolean;
}

function getSlotChipLabel(dateStr: string, timeStr: string): string {
  const today = toLocalYmd(new Date());
  const tomorrow = toLocalYmd(addDays(new Date(), 1));
  const dayLabel =
    dateStr === today
      ? 'Today'
      : dateStr === tomorrow
        ? 'Tomorrow'
        : (() => {
            const d = new Date(`${dateStr}T00:00:00`);
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
          })();
  const [h, m] = timeStr.split(':').map(Number);
  return `${dayLabel} · ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text fontSize="10px" fontWeight={700} letterSpacing="wider" color="gray.500">
      {children}
    </Text>
  );
}

function IconTile({
  children,
  size = 40,
  radius = '10px',
  bg = 'var(--brand-accent-wash)',
}: {
  children: ReactNode;
  size?: number;
  radius?: string;
  bg?: string;
}) {
  return (
    <Flex
      w={`${size}px`}
      h={`${size}px`}
      borderRadius={radius}
      bg={bg}
      color="var(--brand-accent)"
      align="center"
      justify="center"
      flexShrink={0}
    >
      {children}
    </Flex>
  );
}

function NextAvailableChips({ data }: { data?: NextAvailableData }) {
  if (!data) {
    return (
      <Text fontSize="xs" color="gray.400">
        —
      </Text>
    );
  }

  if (data.isLoading) {
    return (
      <HStack spacing={2} flexWrap="wrap">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} h="28px" w="110px" borderRadius="full" />
        ))}
      </HStack>
    );
  }

  const shown = data.slots.slice(0, 3);

  if (shown.length === 0) {
    return (
      <Text fontSize="xs" color="gray.400">
        No upcoming slots
      </Text>
    );
  }

  return (
    <VStack align="stretch" spacing={2}>
      <HStack spacing={2} flexWrap="wrap">
        {shown.map((slot, i) => {
          const isFirst = i === 0;
          return (
            <Box
              key={`${slot.date}-${slot.startTime}`}
              px={3}
              py={1}
              borderRadius="full"
              borderWidth="1px"
              borderColor={isFirst ? 'var(--brand-accent)' : 'gray.200'}
              bg={isFirst ? 'var(--brand-accent-wash)' : 'white'}
              color={isFirst ? 'var(--brand-accent)' : 'gray.700'}
              fontSize="xs"
              fontWeight={600}
              whiteSpace="nowrap"
            >
              {getSlotChipLabel(slot.date, slot.startTime)}
            </Box>
          );
        })}
      </HStack>
    </VStack>
  );
}

function ServiceDetailHero({
  service,
  locationType,
  onClose,
}: {
  service: Service;
  locationType: ReturnType<typeof getLocationType>;
  onClose?: () => void;
}) {
  const days = getDaysLabel(service.schedule);
  const spots = service.type === 'GROUP' ? service.capacity.toString() : null;

  return (
    <Box 
      role="group"
      cursor="pointer"
      transition="transform .2s"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      <ServiceCoverImage service={service} locationType={locationType} borderRadius={0}>
        <Flex justify="flex-end" p={{ base: 3, md: 4 }}>
          {onClose && (
            <IconButton
              aria-label="Close"
              icon={<CloseIcon size={16} />}
              onClick={onClose}
              size="sm"
              position="absolute"
              top={3}
              right={3}
              zIndex={2}
              borderRadius="full"
              bg="blackAlpha.500"
              color="white"
              backdropFilter="blur(4px)"
              _hover={{ bg: 'blackAlpha.600' }}
            />
          )}
        </Flex>
        <ServiceDescriptionContainer>
          <VStack align="stretch" spacing={2} flex={1} minW={0}>
            <Text color="inherit" fontWeight={700} fontSize={{ base: 'md', md: 'lg' }} noOfLines={1}>
              {service.name}
            </Text>

            <ServiceDescription size={{ base: 'xs', md: 'sm' }}>
              <ServiceCapacityBadge type={service.type} />
              <DescriptionItem
                icon={<ClockIcon size={14} />}
                label={formatDuration(service.durationMinutes)}
              />
              <DescriptionItem
                icon={<ServiceLocationIcon locationType={locationType} />}
                label={getLocationLabel(locationType)}
              />
              {spots && <DescriptionItem label={spots} />}
            </ServiceDescription>

            {days && (
              <ServiceDescription size="xs">
                <DescriptionItem icon={<CalendarIcon size={12} />} label={days} />
              </ServiceDescription>
            )}
          </VStack>
        </ServiceDescriptionContainer>
      </ServiceCoverImage>
    </Box>
  );
}

function ServiceDetailFacts({
  service,
  nextAvailable,
}: {
  service: Service;
  nextAvailable?: NextAvailableData;
}) {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={3} align="stretch">
      {/* DURATION — icon top-left, content vertically centered */}
      <VStack
      align="stretch"
      spacing={3}
      p={4}
      borderRadius="14px"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      flex={{ base: '1', md: '0 0 220px' }}
      >
        <HStack spacing={2} align="center">
          <IconTile size={28} radius="8px">
            <ClockIcon size={14} />
          </IconTile>
          <SectionLabel>DURATION</SectionLabel>
        </HStack>
        <Text fontSize="2xl" fontWeight={700} color="gray.900" lineHeight={1}>
          {formatDuration(service.durationMinutes)}
        </Text>
      </VStack>

      {/* NEXT AVAILABLE — header row, then chips, then "More" */}
      <VStack
        align="stretch"
        spacing={3}
        p={4}
        borderRadius="14px"
        borderWidth="1px"
        borderColor="gray.200"
        bg="white"
        flex="1"
      >
        <HStack spacing={2} align="center">
          <IconTile size={28} radius="8px">
            <CalendarIcon size={14} />
          </IconTile>
          <SectionLabel>NEXT AVAILABLE</SectionLabel>
        </HStack>
        <NextAvailableChips data={nextAvailable} />
      </VStack>
    </Stack>
  );
}

function InPersonBlock({ location }: { location: AddressLocation | null | undefined }) {
  const hasCoords = location?.latitude != null && location?.longitude != null;
  const addressLine = location
    ? [location.line1, location.line2, location.city, location.postalCode]
        .filter(Boolean)
        .join(', ')
    : null;
  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${location!.latitude},${location!.longitude}`
    : addressLine
      ? `https://maps.google.com/?q=${encodeURIComponent(addressLine)}`
      : null;

  return (
    <VStack align="stretch" spacing={3}>
      <SectionLabel>WHERE YOU'LL MEET</SectionLabel>

      <Box borderRadius="10px" overflow="hidden" h="140px" bg="gray.100" flexShrink={0}>
        {hasCoords ? (
          <AddressMap
            latitude={location!.latitude}
            longitude={location!.longitude}
            label={location?.label ?? addressLine ?? undefined}
            height="100%"
          />
        ) : (
          <Flex h="100%" align="center" justify="center" color="gray.300">
            <MapPinIcon size={36} />
          </Flex>
        )}
      </Box>

      {addressLine && (
        <HStack spacing={2} align="flex-start">
          <Box color="var(--brand-accent)" mt={0.5} flexShrink={0}>
            <MapPinIcon size={14} />
          </Box>
          <VStack align="stretch" spacing={0.5}>
            <Text fontSize="sm" fontWeight={600} color="gray.900">
              {location?.label ?? addressLine}
            </Text>
            {location?.label && (
              <Text fontSize="xs" color="gray.500">
                {addressLine}
              </Text>
            )}
            {directionsUrl && (
              <HStack
                as="a"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                spacing={1}
                color="var(--brand-accent)"
                _hover={{ textDecoration: 'underline' }}
              >
                <Text fontSize="xs" fontWeight={600}>
                  Get directions
                </Text>
                <ArrowRightIcon size={11} />
              </HStack>
            )}
          </VStack>
        </HStack>
      )}
    </VStack>
  );
}

type HowItWorksKind = 'phone' | 'online';

const HOW_IT_WORKS: Record<
  HowItWorksKind,
  { icon: ReactNode; title: string; description: string; steps: [string, string, string] }
> = {
  phone: {
    icon: <PhoneIcon size={28} />,
    title: "We'll call you when it's time",
    description:
      "Add your phone number at checkout. We'll call at the start of your session — keep your phone nearby.",
    steps: ['Book', 'We call you', 'Talk'],
  },
  online: {
    icon: <VideoIcon size={28} />,
    title: 'Online meeting — link sent on booking',
    description:
      'A meeting link is included in your confirmation and reminder emails. Opens in any modern browser, no install needed.',
    steps: ['Book', 'Get link', 'Join from anywhere'],
  },
};

function HowItWorksStepper({ steps }: { steps: [string, string, string] }) {
  return (
    <Flex wrap="wrap" align="center" mt={1}>
      {steps.map((label, i) => (
        <Flex key={label} align="center" gap={1}>
          {i > 0 && (
            <Box color="gray.400">
              <ArrowRightIcon size={11} />
            </Box>
          )}
          <HStack spacing={1}>
            <Flex
              w="20px"
              h="20px"
              borderRadius="full"
              bg="var(--brand-accent)"
              color="var(--brand-on-accent)"
              align="center"
              justify="center"
              fontSize="xs"
              fontWeight={700}
            >
              {i + 1}
            </Flex>
            <Text fontSize="xs" color="gray.700">
              {label}
            </Text>
          </HStack>
        </Flex>
      ))}
    </Flex>
  );
}

function HowItWorksBlock({ kind }: { kind: HowItWorksKind }) {
  const { icon, title, description, steps } = HOW_IT_WORKS[kind];
  return (
    <Flex
      align="stretch"
      borderRadius="14px"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      overflow="hidden"
    >
      {/* Left rail — brand-wash background with white icon tile */}
      <Flex
        align="center"
        justify="center"
        bg="var(--brand-accent-wash)"
        flexShrink={0}
        w={{ base: '88px', md: '110px' }}
        p={4}
      >
        <Flex
          w={{ base: '56px', md: '68px' }}
          h={{ base: '56px', md: '68px' }}
          borderRadius="14px"
          bg="white"
          color="var(--brand-accent)"
          align="center"
          justify="center"
          boxShadow="0 1px 2px rgba(0,0,0,0.04)"
        >
          {icon}
        </Flex>
      </Flex>

      {/* Right content — white background */}
      <VStack align="stretch" spacing={1.5} flex={1} minW={0} p={4}>
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <Text fontSize="md" fontWeight={700} color="gray.900">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.600" lineHeight={1.6}>
          {description}
        </Text>
        <HowItWorksStepper steps={steps} />
      </VStack>
    </Flex>
  );
}

function ServiceLocationDetail({
  service,
  locationType,
}: {
  service: Service;
  locationType: ReturnType<typeof getLocationType>;
}) {
  if (locationType === LocationType.IN_PERSON) {
    return <InPersonBlock location={service.location as AddressLocation | null} />;
  }
  if (locationType === LocationType.PHONE) return <HowItWorksBlock kind="phone" />;
  if (locationType === LocationType.ONLINE) return <HowItWorksBlock kind="online" />;
  return null;
}

export function ServiceDetailBody({
  service,
  showBook,
  onBook,
  onClose,
  nextAvailable,
}: {
  service: Service;
  showBook: boolean;
  onBook: () => void;
  onClose?: () => void;
  nextAvailable?: NextAvailableData;
}) {
  const locationType = getLocationType(service);

  return (
    <Flex direction="column" h="100%" maxH="92vh">
      <Box flex="1" minH={0} overflowY="auto">
        <ServiceDetailHero service={service} locationType={locationType} onClose={onClose} />

        <Box flex="1" px={5} pt={5} pb={5}>
          <VStack align="stretch" spacing={5}>
            {service.description && (
              <Text color="gray.700" fontSize="sm" lineHeight={1.7} whiteSpace="pre-wrap">
                {service.description}
              </Text>
            )}

            <ServiceDetailFacts service={service} nextAvailable={nextAvailable} />

            {locationType && (
              <ServiceLocationDetail service={service} locationType={locationType} />
            )}
          </VStack>
        </Box>
      </Box>

      <Flex
        align="center"
        justify="space-between"
        gap={4}
        px={5}
        py={4}
        borderTop="1px solid"
        borderColor="gray.100"
        bg="white"
        flexShrink={0}
      >
        <Box>
          <ServicePriceLabel service={service} />
          <Text fontSize="xs" color="gray.500">
            {formatDuration(service.durationMinutes)} session
          </Text>
        </Box>
        {showBook && (
          <Button
            bg="var(--brand-accent)"
            color="var(--brand-on-accent)"
            rightIcon={<ArrowRightIcon size={14} />}
            _hover={{ opacity: 0.9 }}
            onClick={onBook}
            flexShrink={0}
          >
            Book now
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
