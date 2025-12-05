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
import { StatsCard } from '../../components/Dashboard';
import {
  CalendarIcon,
  LayersIcon,
  UsersIcon,
  CopyIcon,
} from '../../components/icons';
import { useGetMyBusinessQuery } from '../../store/api/businessApi';
import { useGetBookingStatsQuery } from '../../store/api/bookingsApi';
import { useCopyBookingLink } from '../../hooks';
import { ROUTES } from '../../config/routes';

export function DashboardOverview() {
  const navigate = useNavigate();
  const { data: business } = useGetMyBusinessQuery();
  const { data: stats } = useGetBookingStatsQuery(business?.id || 0, {
    skip: !business?.id,
  });
  const { copyLink } = useCopyBookingLink(business?.slug);

  if (!business) return null;

  const servicesCount = business.services?.filter(s => s.isActive).length || 0;

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Box>
          <Heading size="lg" color="gray.900" mb={1}>
            Welcome back!
          </Heading>
          <Text color="gray.500">{business.name}</Text>
        </Box>

        {/* Public booking link */}
        <Flex
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="xl"
          p={3}
          align="center"
          gap={3}
        >
          <Box flex={1} minW={0}>
            <Text fontSize="xs" color="gray.500" mb={0.5}>
              Your booking page
            </Text>
            <Text
              as="a"
              href={`/book/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              fontWeight="500"
              color="brand.600"
              _hover={{ color: 'brand.700', textDecoration: 'underline' }}
              display="block"
              isTruncated
            >
              /book/{business.slug}
            </Text>
          </Box>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="brand"
            onClick={copyLink}
            leftIcon={<CopyIcon size={16} />}
            flexShrink={0}
          >
            Copy
          </Button>
        </Flex>
      </Flex>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <StatsCard
          label="Total Bookings"
          value={stats?.total || 0}
          icon={<CalendarIcon size={24} />}
          color="brand.500"
          index={0}
          to={ROUTES.DASHBOARD.BOOKINGS}
        />
        <StatsCard
          label="Today's Bookings"
          value={stats?.today || 0}
          icon={<UsersIcon size={24} />}
          color="blue.500"
          index={1}
          to={ROUTES.DASHBOARD.BOOKINGS}
        />
        <StatsCard
          label="Active Services"
          value={servicesCount}
          icon={<LayersIcon size={24} />}
          color="purple.500"
          index={2}
          to={ROUTES.DASHBOARD.SERVICES}
        />
      </SimpleGrid>

      {/* Today's Schedule */}
      <Box bg="white" borderRadius="2xl" border="1px" borderColor="gray.100" p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="md" color="gray.900" mb={1}>
              Today's Schedule
            </Heading>
            <Text fontSize="sm" color="gray.500">
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

        {/* Empty state */}
        {(stats?.today || 0) === 0 ? (
          <Box
            py={12}
            textAlign="center"
            bg="gray.50"
            borderRadius="xl"
            border="1px dashed"
            borderColor="gray.200"
          >
            <Box color="gray.300" display="inline-block">
              <CalendarIcon size={40} />
            </Box>
            <Text color="gray.500" mt={3} fontSize="sm">
              No appointments scheduled for today
            </Text>
            <Text color="gray.400" fontSize="xs" mt={1}>
              Share your booking link to start receiving appointments
            </Text>
          </Box>
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

      {/* Quick Actions */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px"
          borderColor="gray.100"
          p={6}
          _hover={{ borderColor: 'brand.200', cursor: 'pointer' }}
          transition="all 0.2s"
          onClick={() => navigate(ROUTES.DASHBOARD.SERVICES)}
        >
          <HStack spacing={3} mb={2}>
            <Box color="brand.500">
              <LayersIcon size={24} />
            </Box>
            <Heading size="sm" color="gray.900">
              Manage Services
            </Heading>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            Add, edit, or remove services from your catalog
          </Text>
        </Box>

        <Box
          bg="white"
          borderRadius="2xl"
          border="1px"
          borderColor="gray.100"
          p={6}
          _hover={{ borderColor: 'brand.200', cursor: 'pointer' }}
          transition="all 0.2s"
          onClick={() => navigate(ROUTES.DASHBOARD.SETTINGS)}
        >
          <HStack spacing={3} mb={2}>
            <Box color="brand.500">
              <CalendarIcon size={24} />
            </Box>
            <Heading size="sm" color="gray.900">
              Business Settings
            </Heading>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            Update your working hours, contact info, and more
          </Text>
        </Box>
      </SimpleGrid>
    </VStack>
  );
}

