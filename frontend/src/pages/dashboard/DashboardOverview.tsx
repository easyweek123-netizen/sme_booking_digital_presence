import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { StatsCard, DashboardContentShell } from '../../components/Dashboard';
import {
  CalendarIcon,
  LayersIcon,
  UsersIcon,
  HeartIcon,
  GlobeIcon,
} from '../../components/icons';
import { BookingLinkCard } from '../../components/QRCode';
import { useBusiness } from '../../contexts/useBusiness';
import { useGetBookingStatsQuery } from '../../store/api/bookingsApi';
import { ROUTES } from '../../config/routes';
import { EmptyState } from '../../components/ui/states';

export function DashboardOverview() {
  const navigate = useNavigate();

  const business = useBusiness();
  const { data: stats } = useGetBookingStatsQuery(business.id);

  const servicesCount = business.services?.filter((s) => s.isActive).length || 0;
  
  return (
    <DashboardContentShell title="Welcome back" description={business.name}>
      <VStack spacing={8} align="stretch">
      {/* Booking Link Card with QR */}
      <BookingLinkCard slug={business.slug} />

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <StatsCard
          label="Total Bookings"
          value={stats?.total || 0}
          icon={<CalendarIcon size={24} />}
          color="accent.primary"
          index={0}
          to={ROUTES.DASHBOARD.BOOKINGS}
        />
        <StatsCard
          label="Today's Bookings"
          value={stats?.today || 0}
          icon={<UsersIcon size={24} />}
          color="accent.primary"
          index={1}
          to={ROUTES.DASHBOARD.BOOKINGS}
        />
        <StatsCard
          label="Active Services"
          value={servicesCount}
          icon={<LayersIcon size={24} />}
          color="accent.primary"
          index={2}
          to={ROUTES.DASHBOARD.SERVICES}
        />
      </SimpleGrid>

      {/* Today's Schedule */}
      <Box bg="surface.card" borderRadius="sm" border="1px" borderColor="border.subtle" p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="md" mb={1}>
              Today's Schedule
            </Heading>
            <Text fontSize="sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Box>
          <Badge colorScheme="gray" fontSize="sm" px={3} py={1} borderRadius="full">
            {stats?.today || 0} appointments
          </Badge>
        </Flex>

        {(stats?.today || 0) === 0 ? (
          <EmptyState
            icon={<CalendarIcon size={28} />}
            title="No appointments scheduled for today"
            description="Share your booking link to start receiving appointments"
            size="sm"
          />
        ) : (
          <Button
            variant="outline"
            colorScheme="brand"
            onClick={() => navigate(ROUTES.DASHBOARD.BOOKINGS)}
          >
            View Today's Bookings
          </Button>
        )}
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Box
          bg="surface.card"
          borderRadius="sm"
          border="1px"
          borderColor="border.subtle"
          p={6}
          _hover={{ borderColor: 'brand.200', cursor: 'pointer' }}
          transition="all 0.2s"
          onClick={() => navigate(ROUTES.DASHBOARD.SERVICES)}
        >
          <HStack spacing={3} mb={2}>
            <Box color="accent.primary">
              <LayersIcon size={24} />
            </Box>
            <Heading size="sm">
              Manage Services
            </Heading>
          </HStack>
          <Text fontSize="sm">
            Add, edit, or remove services from your catalog
          </Text>
        </Box>

        <Box
          bg="surface.card"
          borderRadius="sm"
          border="1px"
          borderColor="border.subtle"
          p={6}
          _hover={{ borderColor: 'brand.200', cursor: 'pointer' }}
          transition="all 0.2s"
          onClick={() => navigate(ROUTES.DASHBOARD.WEBSITE)}
        >
          <HStack spacing={3} mb={2}>
            <Box color="accent.primary">
              <GlobeIcon size={24} />
            </Box>
            <Heading size="sm">
              Website
            </Heading>
          </HStack>
          <Text fontSize="sm">
            Customize your booking page, branding, hours, and about section
          </Text>
        </Box>
      </SimpleGrid>

      {/* Feedback Card */}
      <Box
        bg="brand.50"
        borderRadius="sm"
        border="1px"
        borderColor="brand.100"
        p={6}
        _hover={{ borderColor: 'brand.200', cursor: 'pointer', transform: 'translateY(-2px)' }}
        transition="all 0.2s"
        onClick={() => navigate(ROUTES.PRICING)}
      >
        <HStack spacing={4}>
          <Box
            w="48px"
            h="48px"
            borderRadius="sm"
            bg="brand.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="accent.hover"
          >
            <HeartIcon size={24} />
          </Box>
          <Box flex={1}>
            <Heading size="sm" mb={1}>
              Help Us Improve
            </Heading>
            <Text fontSize="sm" color="text.secondary">
              Share your feedback and feature requests. We'd love to hear from you!
            </Text>
          </Box>
          <Badge
            colorScheme="brand"
            px={3}
            py={1}
            borderRadius="sm"
            fontSize="xs"
            fontWeight="600"
          >
            Feedback
          </Badge>
        </HStack>
      </Box>
      </VStack>
    </DashboardContentShell>
  );
}
