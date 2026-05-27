import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  GlobeIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  UsersIcon,
} from '../../components/icons';

// ---------------------------------------------------------------------------
// Mock fixture
// ---------------------------------------------------------------------------

type PriceType = 'FIXED' | 'FROM' | 'FREE' | 'ON_REQUEST';
type LocationType = 'AT_BUSINESS' | 'ONLINE' | 'PHONE';
type ServiceType = 'APPOINTMENT' | 'GROUP';

type MockService = {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  priceType: PriceType;
  locationType: LocationType;
  type: ServiceType;
  capacity: number;
  categoryId: number;
  displayOrder: number;
  photoUrl?: string;
};

type MockCategory = { id: number; name: string; displayOrder: number };
type MockHours = { dayOfWeek: number; isClosed: boolean; startTime?: string; endTime?: string };

const mockBusiness = {
  name: 'Aurora Studio',
  slug: 'aurora-studio',
  businessType: { name: 'Hair Salon' },
  description: 'Modern hair, color, and care in the heart of Schöneberg.',
  aboutContent:
    'Aurora Studio is a boutique salon founded in 2021. We specialise in lived-in color, sharp cuts, and quiet, unhurried appointments. Every visit starts with a proper consultation — no upsells, no rush. Located on a quiet street in Schöneberg, with easy access to U-Bahn and plenty of cafés around the corner.',
  address: 'Goltzstraße 32',
  city: 'Berlin',
  phone: '+49 30 1234 5678',
  website: 'https://aurora.studio',
  instagram: 'aurora.studio',
  brandColor: '#7C3AED',
  timezone: 'Europe/Berlin',
  coverImageUrl:
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=900&fit=crop',
  logoUrl:
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop',
  categories: [
    { id: 1, name: 'Haircuts', displayOrder: 0 },
    { id: 2, name: 'Color', displayOrder: 1 },
    { id: 3, name: 'Workshops', displayOrder: 2 },
    { id: 4, name: 'Consultations', displayOrder: 3 },
  ] as MockCategory[],
  services: [
    { id: 1, name: 'Signature Cut', description: 'A full-service consultation, deep-cleansing shampoo, and a precision cut tailored to your face shape and hair texture. Finishes with a blow-dry and styling.',
      durationMinutes: 60, price: 75, priceType: 'FIXED', locationType: 'AT_BUSINESS',
      type: 'APPOINTMENT', capacity: 1, categoryId: 1, displayOrder: 0,
      photoUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&h=600&fit=crop' },
    { id: 2, name: 'Kids Cut (under 12)', description: 'Quick, friendly cuts for the under-12s — no fuss, lots of patience.',
      durationMinutes: 30, price: 35, priceType: 'FIXED', locationType: 'AT_BUSINESS',
      type: 'APPOINTMENT', capacity: 1, categoryId: 1, displayOrder: 1 },
    { id: 3, name: 'Full Color', description: 'Single-process color across the full head, with a gloss treatment to seal and a blow-dry finish. Includes a free patch test 48 hours before your appointment.',
      durationMinutes: 120, price: 140, priceType: 'FROM', locationType: 'AT_BUSINESS',
      type: 'APPOINTMENT', capacity: 1, categoryId: 2, displayOrder: 0,
      photoUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop' },
    { id: 4, name: 'Balayage', description: 'Hand-painted highlights for a lived-in, sun-kissed look. Includes toning and a deep-conditioning treatment.',
      durationMinutes: 180, price: 220, priceType: 'FROM', locationType: 'AT_BUSINESS',
      type: 'APPOINTMENT', capacity: 1, categoryId: 2, displayOrder: 1 },
    { id: 5, name: 'Curly Hair Workshop', description: 'A small-group workshop where you\'ll learn how to wash, define, and style your curls at home. Includes product samples and a take-home guide.',
      durationMinutes: 90, price: 45, priceType: 'FIXED', locationType: 'AT_BUSINESS',
      type: 'GROUP', capacity: 8, categoryId: 3, displayOrder: 0,
      photoUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=600&fit=crop' },
    { id: 6, name: 'Hair Health Check-in', description: 'Free 15-minute online check-in — bring your questions about hair health, product routine, or upcoming appointments.',
      durationMinutes: 15, price: 0, priceType: 'FREE', locationType: 'ONLINE',
      type: 'APPOINTMENT', capacity: 1, categoryId: 4, displayOrder: 0 },
    { id: 7, name: 'Bridal & Editorial', description: 'Custom packages for weddings, photo shoots, and events. Includes a trial session and on-location styling.',
      durationMinutes: 120, price: 0, priceType: 'ON_REQUEST', locationType: 'AT_BUSINESS',
      type: 'APPOINTMENT', capacity: 1, categoryId: 4, displayOrder: 1 },
    { id: 8, name: 'Phone Consultation', description: 'Talk through color ideas, transformations, or hair concerns over the phone before you book in.',
      durationMinutes: 20, price: 15, priceType: 'FIXED', locationType: 'PHONE',
      type: 'APPOINTMENT', capacity: 1, categoryId: 4, displayOrder: 2 },
  ] as MockService[],
  hours: [
    { dayOfWeek: 1, isClosed: false, startTime: '10:00', endTime: '19:00' },
    { dayOfWeek: 2, isClosed: false, startTime: '10:00', endTime: '19:00' },
    { dayOfWeek: 3, isClosed: false, startTime: '10:00', endTime: '20:00' },
    { dayOfWeek: 4, isClosed: false, startTime: '10:00', endTime: '20:00' },
    { dayOfWeek: 5, isClosed: false, startTime: '09:00', endTime: '18:00' },
    { dayOfWeek: 6, isClosed: false, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 0, isClosed: true },
  ] as MockHours[],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatPrice(s: MockService): string {
  if (s.priceType === 'FREE') return 'Free';
  if (s.priceType === 'ON_REQUEST') return 'On request';
  if (s.priceType === 'FROM') return `from €${s.price}`;
  return `€${s.price}`;
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} mins`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return h === 1 ? '1 hour' : `${h} hours`;
  return `${h} hour${h > 1 ? 's' : ''} ${m} mins`;
}

function locationLabel(loc: LocationType): { label: string; Icon: React.FC<{ size?: number }> } {
  if (loc === 'ONLINE') return { label: 'Online', Icon: GlobeIcon };
  if (loc === 'PHONE') return { label: 'By phone', Icon: PhoneIcon };
  return { label: 'In-store', Icon: MapPinIcon };
}

function openStatus(hours: MockHours[]): { open: boolean; line: string } {
  const now = new Date();
  const today = hours.find((h) => h.dayOfWeek === now.getDay());
  if (today && !today.isClosed) {
    const [eh, em] = (today.endTime ?? '00:00').split(':').map(Number);
    const [sh, sm] = (today.startTime ?? '00:00').split(':').map(Number);
    const cur = now.getHours() * 60 + now.getMinutes();
    if (cur >= sh * 60 + sm && cur < eh * 60 + em) {
      return { open: true, line: `Open · closes at ${today.endTime}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = (now.getDay() + i) % 7;
    const day = hours.find((h) => h.dayOfWeek === d);
    if (day && !day.isClosed) {
      const dayLabel = i === 1 ? 'tomorrow' : DAY_LONG[d];
      return { open: false, line: `Closed — opens ${dayLabel} at ${day.startTime}` };
    }
  }
  return { open: false, line: 'Closed' };
}

function mapDirectionsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${mockBusiness.address}, ${mockBusiness.city}`,
  )}`;
}

function parseSlot(slot: string): { h: number; m: number } {
  const [hm, ampm] = slot.split(' ');
  const [hStr, mStr] = hm.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (ampm === 'pm' && h !== 12) h += 12;
  if (ampm === 'am' && h === 12) h = 0;
  return { h, m };
}

function formatHMtoSlot(h: number, m: number): string {
  const ampm = h < 12 ? 'am' : 'pm';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${String(m).padStart(2, '0')} ${ampm}`;
}

function addMinutes(slot: string, mins: number): string {
  const { h, m } = parseSlot(slot);
  let total = h * 60 + m + mins;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return formatHMtoSlot(Math.floor(total / 60), total % 60);
}

// ---------------------------------------------------------------------------
// Booking state context
// ---------------------------------------------------------------------------

type BookingState = {
  selectedServiceId: number | null;
  selectedDateIdx: number;
  selectedSlot: string | null;
  attendees: number;
  setSelectedServiceId: (id: number | null) => void;
  setSelectedDateIdx: (i: number) => void;
  setSelectedSlot: (s: string | null) => void;
  setAttendees: (n: number) => void;
  reset: () => void;
};

const BookingCtx = createContext<BookingState | null>(null);
const useBooking = () => {
  const v = useContext(BookingCtx);
  if (!v) throw new Error('useBooking outside provider');
  return v;
};

const PREVIEW_BASE = '/book/preview';

// Fresha-like neutral surface color for section backgrounds & subtle chips.
const SURFACE = '#F4F4F5';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export function BookingPreview() {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [attendees, setAttendees] = useState(1);

  const ctxValue = useMemo<BookingState>(
    () => ({
      selectedServiceId, selectedDateIdx, selectedSlot, attendees,
      setSelectedServiceId, setSelectedDateIdx, setSelectedSlot, setAttendees,
      reset: () => {
        setSelectedServiceId(null);
        setSelectedDateIdx(0);
        setSelectedSlot(null);
        setAttendees(1);
      },
    }),
    [selectedServiceId, selectedDateIdx, selectedSlot, attendees],
  );

  return (
    <BookingCtx.Provider value={ctxValue}>
      <Box minH="100vh" bg="white">
        <Routes>
          <Route index element={<ProfileRoute />} />
          <Route path="booking" element={<BookingRoute />} />
          <Route path="*" element={<Navigate to={PREVIEW_BASE} replace />} />
        </Routes>
      </Box>
    </BookingCtx.Provider>
  );
}

export default BookingPreview;

// ---------------------------------------------------------------------------
// Profile route
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'location', label: 'Location' },
  { id: 'hours', label: 'Opening Hours' },
] as const;

function ProfileRoute() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('services');
  const [scrolled, setScrolled] = useState(false);
  const [detailServiceId, setDetailServiceId] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 240);
      let current = activeTab;
      for (const t of TABS) {
        const el = document.getElementById(`section-${t.id}`);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top < 140 && r.bottom > 140) current = t.id;
        }
      }
      if (current !== activeTab) setActiveTab(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const detailService = detailServiceId != null
    ? mockBusiness.services.find((s) => s.id === detailServiceId) ?? null
    : null;

  return (
    <Box pb={{ base: '88px', md: 6 }}>
      {/* Sticky top bar — only appears after scroll */}
      {scrolled && (
        <TopNavBar activeTab={activeTab} onSelectTab={scrollToSection} />
      )}

      {/* Initial mobile-only floating heart over cover */}
      {!scrolled && (
        <Box
          display={{ base: 'block', md: 'none' }}
          position="absolute"
          top={4}
          right={4}
          zIndex={5}
        >
          <IconButton
            aria-label="Save"
            icon={<HeartIcon size={20} />}
            bg="whiteAlpha.900"
            borderRadius="full"
            boxShadow="md"
            backdropFilter="blur(8px)"
          />
        </Box>
      )}

      {/* Hero cover */}
      <Box position="relative">
        <Image
          src={mockBusiness.coverImageUrl}
          alt={mockBusiness.name}
          w="100%"
          h={{ base: '200px', md: '320px' }}
          objectFit="cover"
        />
      </Box>

      {/* Facebook-style header block, overlaps cover */}
      <Container maxW="6xl" px={{ base: 4, md: 8, lg: 12 }}>
        <HeaderBlock />

        <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 320px' }} gap={{ base: 0, lg: 10 }} mt={{ base: 4, lg: 8 }}>
          <GridItem minW={0}>
            <Box id="section-services" />
            <ServicesSection
              onBook={(id) =>
                navigate(`${PREVIEW_BASE}/booking${id != null ? `?preselect=${id}` : ''}`)
              }
              onOpenDetail={(id) => setDetailServiceId(id)}
            />

            <Box id="section-about" />
            <AboutSection />

            <Box id="section-location" />
            <LocationSection />

            <Box id="section-hours" />
            <HoursSection />
          </GridItem>

          <GridItem display={{ base: 'none', lg: 'block' }}>
            <DesktopBookingCard onBookNow={() => navigate(`${PREVIEW_BASE}/booking`)} />
          </GridItem>
        </Grid>
      </Container>

      {/* Mobile sticky bottom CTA */}
      <Box
        display={{ base: 'block', lg: 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTopWidth="1px"
        borderColor="gray.200"
        px={{ base: 4, md: 8 }}
        py={3}
        zIndex={20}
      >
        <Flex align="center" justify="space-between" gap={4}>
          <Text fontSize="sm" color="gray.500">
            {mockBusiness.services.length} services available
          </Text>
          <Button
            bg="black"
            color="white"
            borderRadius="full"
            px={6}
            _hover={{ bg: 'gray.800' }}
            onClick={() => navigate(`${PREVIEW_BASE}/booking`)}
          >
            Book now
          </Button>
        </Flex>
      </Box>

      {detailService && (
        <ServiceDetailSheet
          service={detailService}
          onClose={() => setDetailServiceId(null)}
          cta={{
            label: detailService.priceType === 'ON_REQUEST' ? 'Request' : 'Book',
            onClick: () => {
              const id = detailService.id;
              setDetailServiceId(null);
              navigate(`${PREVIEW_BASE}/booking?preselect=${id}`);
            },
          }}
        />
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Facebook-style header block
// ---------------------------------------------------------------------------

function HeaderBlock() {
  const status = openStatus(mockBusiness.hours);
  return (
    <Box>
      <Flex
        mt={{ base: '-48px', md: '-56px' }}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        gap={{ base: 3, md: 6 }}
        position="relative"
        zIndex={2}
      >
        <Image
          src={mockBusiness.logoUrl}
          alt={mockBusiness.name}
          boxSize={{ base: '96px', md: '120px' }}
          borderRadius="full"
          borderWidth="4px"
          borderColor="white"
          bg="white"
          objectFit="cover"
          flexShrink={0}
          boxShadow="md"
        />
        <Box flex="1" minW={0} pt={{ base: 0, md: 6 }}>
          <Heading size={{ base: 'lg', md: 'xl' } as never} noOfLines={1} mb={2}>
            {mockBusiness.name}
          </Heading>
          <HStack spacing={3} flexWrap="wrap">
            <Tag bg={SURFACE} color="gray.700" borderRadius="full" fontSize="xs" fontWeight="600" px={3} py={1}>
              {mockBusiness.businessType.name}
            </Tag>
            <Text color="gray.300" fontSize="sm" display={{ base: 'none', md: 'inline' }}>·</Text>
            <HStack spacing={1} color={status.open ? 'green.600' : 'orange.500'}>
              <ClockIcon size={14} />
              <Text fontWeight="500" fontSize="sm">{status.line}</Text>
            </HStack>
            <Text color="gray.300" fontSize="sm" display={{ base: 'none', md: 'inline' }}>·</Text>
            <Link
              href={mapDirectionsUrl()}
              isExternal
              fontSize="sm"
              color="purple.600"
              fontWeight="600"
            >
              Get directions
            </Link>
          </HStack>
          <HStack spacing={1} mt={2} color="gray.600">
            <MapPinIcon size={14} />
            <Text fontSize="sm" noOfLines={1}>
              {mockBusiness.address}, {mockBusiness.city}
            </Text>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Desktop sticky booking card
// ---------------------------------------------------------------------------

function DesktopBookingCard({ onBookNow }: { onBookNow: () => void }) {
  const status = openStatus(mockBusiness.hours);
  return (
    <Box position="sticky" top="88px">
      <Box bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={6}>
        <Button
          bg="black"
          color="white"
          borderRadius="full"
          w="full"
          size="lg"
          _hover={{ bg: 'gray.800' }}
          onClick={onBookNow}
        >
          Book now
        </Button>

        <Divider my={5} />

        <Stack spacing={4}>
          <HStack spacing={3} color={status.open ? 'green.600' : 'orange.500'} align="center">
            <ClockIcon size={16} />
            <Text fontSize="sm" fontWeight="500">{status.line}</Text>
          </HStack>

          <HStack spacing={3} align="flex-start">
            <Box mt="2px" color="gray.500"><MapPinIcon size={16} /></Box>
            <Box>
              <Text fontSize="sm" color="gray.700">
                {mockBusiness.address}, {mockBusiness.city}
              </Text>
              <Link href={mapDirectionsUrl()} isExternal fontSize="sm" color="purple.600" fontWeight="600">
                Get directions
              </Link>
            </Box>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Top nav (only rendered when scrolled)
// ---------------------------------------------------------------------------

function TopNavBar({
  activeTab,
  onSelectTab,
}: {
  activeTab: string;
  onSelectTab: (id: string) => void;
}) {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      zIndex={30}
    >
      <Container maxW="6xl" px={{ base: 4, md: 8, lg: 12 }}>
        <Flex align="center" justify="space-between" gap={6}>
          <HStack
            spacing={{ base: 4, md: 8 }}
            overflowX="auto"
            flex="1"
            sx={{ '::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
          >
            {TABS.map((t) => {
              const isActive = t.id === activeTab;
              return (
                <Box
                  key={t.id}
                  py={5}
                  cursor="pointer"
                  onClick={() => onSelectTab(t.id)}
                  position="relative"
                  fontWeight={isActive ? '700' : '500'}
                  color={isActive ? 'black' : 'gray.500'}
                  whiteSpace="nowrap"
                  fontSize="sm"
                >
                  {t.label}
                  {isActive && (
                    <Box position="absolute" bottom={0} left={0} right={0} h="3px" bg="black" borderRadius="full" />
                  )}
                </Box>
              );
            })}
          </HStack>
          <IconButton
            aria-label="Save"
            icon={<HeartIcon size={20} />}
            variant="ghost"
            borderRadius="full"
          />
        </Flex>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function ServicesSection({
  onBook,
  onOpenDetail,
}: {
  onBook: (id?: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  const sortedCategories = useMemo(
    () => [...mockBusiness.categories].sort((a, b) => a.displayOrder - b.displayOrder),
    [],
  );
  const [activeCategory, setActiveCategory] = useState<number>(sortedCategories[0]?.id ?? 0);
  const [showAll, setShowAll] = useState(false);

  const services = useMemo(
    () =>
      mockBusiness.services
        .filter((s) => s.categoryId === activeCategory)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [activeCategory],
  );

  const visible = showAll ? services : services.slice(0, 3);

  return (
    <Box bg={SURFACE} mx={{ base: -4, md: -8, lg: -12 }} px={{ base: 4, md: 8, lg: 12 }} py={6} mt={6} borderRadius={{ base: 0, lg: 'xl' }}>
      <Heading size="lg" mb={4}>Services</Heading>

      <Box mb={4} overflowX="auto" sx={{ '::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
        <HStack spacing={2} pb={1}>
          {sortedCategories.map((c) => {
            const isActive = c.id === activeCategory;
            return (
              <Box
                key={c.id}
                px={4}
                py={2}
                borderRadius="full"
                bg={isActive ? 'black' : 'white'}
                color={isActive ? 'white' : 'gray.700'}
                borderWidth="1px"
                borderColor={isActive ? 'black' : 'gray.200'}
                fontWeight="500"
                fontSize="sm"
                cursor="pointer"
                onClick={() => { setActiveCategory(c.id); setShowAll(false); }}
                whiteSpace="nowrap"
              >
                {c.name}
              </Box>
            );
          })}
        </HStack>
      </Box>

      <Stack spacing={3}>
        {visible.map((svc) => (
          <ProfileServiceCard
            key={svc.id}
            service={svc}
            onBook={() => onBook(svc.id)}
            onOpenDetail={() => onOpenDetail(svc.id)}
          />
        ))}
      </Stack>

      {services.length > 3 && (
        <Button
          mt={4}
          w="full"
          variant="outline"
          borderRadius="full"
          borderColor="gray.300"
          bg="white"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? 'Show less' : `See all (${services.length})`}
        </Button>
      )}
    </Box>
  );
}

function ProfileServiceCard({
  service,
  onBook,
  onOpenDetail,
}: {
  service: MockService;
  onBook: () => void;
  onOpenDetail: () => void;
}) {
  const loc = locationLabel(service.locationType);
  const LocIcon = loc.Icon;
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={4}
      cursor="pointer"
      onClick={onOpenDetail}
      transition="all 0.15s"
      _hover={{ boxShadow: 'sm' }}
    >
      <Flex justify="space-between" align="center" gap={4}>
        <Box flex="1" minW={0}>
          <Heading size="sm" mb={1} noOfLines={1}>{service.name}</Heading>
          <Text fontSize="sm" color="gray.500" mb={2}>
            {formatDuration(service.durationMinutes)}
          </Text>
          <HStack spacing={3}>
            <Text fontWeight="700">{formatPrice(service)}</Text>
            {service.type === 'GROUP' && (
              <HStack spacing={1} fontSize="xs" color="gray.500">
                <UsersIcon size={12} />
                <Text>Up to {service.capacity}</Text>
              </HStack>
            )}
            <HStack spacing={1} fontSize="xs" color="gray.500">
              <LocIcon size={12} />
              <Text>{loc.label}</Text>
            </HStack>
          </HStack>
        </Box>
        <Button
          variant="outline"
          borderRadius="full"
          borderColor="gray.300"
          onClick={(e) => { e.stopPropagation(); onBook(); }}
          fontWeight="500"
        >
          {service.priceType === 'ON_REQUEST' ? 'Request' : 'Book'}
        </Button>
      </Flex>
    </Box>
  );
}

function AboutSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box py={6}>
      <Heading size="lg" mb={3}>About</Heading>
      <Text noOfLines={expanded ? undefined : 4} lineHeight="tall" color="gray.700">
        {mockBusiness.aboutContent}
      </Text>
      {mockBusiness.aboutContent.length > 200 && (
        <Text
          mt={2}
          color="purple.600"
          fontWeight="600"
          cursor="pointer"
          display="inline-block"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Read less' : 'Read more'}
        </Text>
      )}
    </Box>
  );
}

function LocationSection() {
  const q = encodeURIComponent(`${mockBusiness.address}, ${mockBusiness.city}`);
  return (
    <Box bg={SURFACE} mx={{ base: -4, md: -8 }} px={{ base: 4, md: 8 }} py={6} borderRadius={{ base: 0, lg: 'xl' }}>
      <Heading size="lg" mb={3}>Location</Heading>
      <Flex justify="space-between" align="center" mb={3}>
        <HStack spacing={2} color="gray.700">
          <MapPinIcon size={16} />
          <Text fontSize="sm">{mockBusiness.address}, {mockBusiness.city}</Text>
        </HStack>
        <Link href={mapDirectionsUrl()} isExternal color="purple.600" fontWeight="600" fontSize="sm">
          Get directions
        </Link>
      </Flex>
      <Box h="220px" borderRadius="lg" overflow="hidden">
        <iframe
          title="map"
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          style={{ border: 0 }}
        />
      </Box>
    </Box>
  );
}

function HoursSection() {
  const today = new Date().getDay();
  const ordered = useMemo(() => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    return order
      .map((d) => mockBusiness.hours.find((h) => h.dayOfWeek === d))
      .filter((h): h is MockHours => Boolean(h));
  }, []);
  return (
    <Box py={6}>
      <Heading size="lg" mb={3}>Opening Hours</Heading>
      <Stack spacing={0} divider={<Divider />}>
        {ordered.map((h) => {
          const isToday = h.dayOfWeek === today;
          return (
            <Flex key={h.dayOfWeek} py={3} justify="space-between" fontWeight={isToday ? '700' : '500'}>
              <Text>
                {DAY_LONG[h.dayOfWeek]}
                {isToday && <Text as="span" color="gray.500" ml={2} fontWeight="500">(today)</Text>}
              </Text>
              <Text color={h.isClosed ? 'gray.500' : 'gray.900'}>
                {h.isClosed ? 'Closed' : `${h.startTime} – ${h.endTime}`}
              </Text>
            </Flex>
          );
        })}
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Service detail sheet (bottom sheet mobile / centered modal desktop)
// ---------------------------------------------------------------------------

function ServiceDetailSheet({
  service,
  onClose,
  cta,
}: {
  service: MockService;
  onClose: () => void;
  cta: { label: string; onClick: () => void; variant?: 'primary' | 'outline' };
}) {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? true;
  const loc = locationLabel(service.locationType);
  const LocIcon = loc.Icon;

  return (
    <Modal
      isOpen
      onClose={onClose}
      motionPreset={isMobile ? 'slideInBottom' : 'scale'}
      isCentered={!isMobile}
      size={isMobile ? 'full' : '2xl'}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        bg={SURFACE}
        borderRadius={isMobile ? '24px 24px 0 0' : '2xl'}
        m={0}
        mt={isMobile ? 'auto' : undefined}
        maxH={isMobile ? '92vh' : '85vh'}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Flex justify="flex-end" px={4} pt={3} bg={SURFACE}>
          <IconButton aria-label="Close" icon={<CloseIcon />} variant="ghost" onClick={onClose} />
        </Flex>

        <ModalBody px={{ base: 6, md: 8 }} pb={4} flex="1" overflowY="auto">
          <Heading size="xl" mb={4}>{service.name}</Heading>

          <Text color="gray.700" lineHeight="tall" mb={5}>
            {service.description}
          </Text>

          {service.photoUrl && (
            <Image
              src={service.photoUrl}
              alt={service.name}
              w={{ base: '120px', md: '160px' }}
              h={{ base: '120px', md: '160px' }}
              objectFit="cover"
              borderRadius="xl"
              mb={6}
            />
          )}

          <HStack spacing={4} fontSize="sm" color="gray.600" flexWrap="wrap" mb={2}>
            <HStack spacing={1}>
              <ClockIcon size={14} />
              <Text>{formatDuration(service.durationMinutes)}</Text>
            </HStack>
            <HStack spacing={1}>
              <LocIcon size={14} />
              <Text>{loc.label}</Text>
            </HStack>
            {service.type === 'GROUP' && (
              <HStack spacing={1}>
                <UsersIcon size={14} />
                <Text>Group · up to {service.capacity}</Text>
              </HStack>
            )}
          </HStack>
        </ModalBody>

        <Box
          bg="white"
          borderTopWidth="1px"
          borderColor="gray.200"
          px={{ base: 6, md: 8 }}
          py={4}
        >
          <Flex align="center" justify="space-between" gap={4}>
            <Box>
              <Text fontWeight="700" fontSize="lg">{formatPrice(service)}</Text>
              <Text fontSize="xs" color="gray.500">
                {formatDuration(service.durationMinutes)}
              </Text>
            </Box>
            <Button
              {...(cta.variant === 'outline'
                ? { variant: 'outline', borderRadius: 'full', borderColor: 'gray.300' }
                : { bg: 'black', color: 'white', borderRadius: 'full', _hover: { bg: 'gray.800' } })}
              px={6}
              size="lg"
              onClick={cta.onClick}
            >
              {cta.label}
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
}

