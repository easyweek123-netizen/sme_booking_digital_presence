import { Box, VStack, Text, Flex, Divider, Badge, Tooltip, IconButton } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import {
  // MessageSquareIcon,
  SparkleIcon,
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  LayersIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from '../icons';
import { ROUTES } from '../../config/routes';
import { useAppDispatch } from '../../store/hooks';
import { resetStore } from '../../store/actions';
import { useGetMyBusinessQuery } from '../../store/api/businessApi';
import { useGetPendingCountQuery } from '../../store/api/bookingsApi';
import { useSidebarCollapsed } from '../../hooks';

// Sidebar width constants
const SIDEBAR_EXPANDED_WIDTH = '240px';
const SIDEBAR_COLLAPSED_WIDTH = '68px';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badgeKey?: 'pending';
  tourId?: string;
}

const navItems: NavItem[] = [
  // { label: 'AI Chat', icon: <MessageSquareIcon size={20} />, path: ROUTES.DASHBOARD.CHAT },
  { label: 'AI Canvas', icon: <SparkleIcon size={20} />, path: ROUTES.DASHBOARD.CANVAS },
  { label: 'Overview', icon: <HomeIcon size={20} />, path: ROUTES.DASHBOARD.ROOT },
  { label: 'Bookings', icon: <CalendarIcon size={20} />, path: `${ROUTES.DASHBOARD.ROOT}/bookings`, badgeKey: 'pending', tourId: 'tour-bookings-nav' },
  { label: 'Clients', icon: <UsersIcon size={20} />, path: `${ROUTES.DASHBOARD.ROOT}/clients` },
  { label: 'Services', icon: <LayersIcon size={20} />, path: `${ROUTES.DASHBOARD.ROOT}/services`, tourId: 'tour-services-nav' },
  { label: 'Settings', icon: <SettingsIcon size={20} />, path: `${ROUTES.DASHBOARD.ROOT}/settings`, tourId: 'tour-settings-nav' },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isCollapsed, toggle } = useSidebarCollapsed();

  // Get pending count for badge
  const { data: business } = useGetMyBusinessQuery();
  const { data: pendingData } = useGetPendingCountQuery(business?.id || 0, {
    skip: !business?.id,
  });
  const pendingCount = pendingData?.count || 0;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    dispatch(resetStore());
    navigate(ROUTES.HOME);
    onClose?.();
  };

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD.ROOT) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getBadgeCount = (key?: string): number => {
    if (key === 'pending') return pendingCount;
    return 0;
  };

  return (
    <Flex
      direction="column"
      h="full"
      bg="white"
      borderRight="1px"
      borderColor="gray.100"
      w={isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH}
      transition="width 200ms ease"
      overflow="hidden"
    >
      {/* Header: Logo + Toggle */}
      <Flex
        p={isCollapsed ? 3 : 4}
        align="center"
        justify={isCollapsed ? 'center' : 'space-between'}
        minH="64px"
      >
        {isCollapsed ? (
          // Collapsed: Toggle button only (with logo styling)
          <Tooltip
            label="Expand sidebar"
            placement="right"
            hasArrow
            bg="gray.800"
            color="white"
            fontSize="sm"
            borderRadius="md"
            px={3}
            py={2}
          >
            <IconButton
              aria-label="Expand sidebar"
              icon={<ChevronsRightIcon size={18} />}
              onClick={toggle}
              variant="ghost"
              size="md"
              w="40px"
              h="40px"
              borderRadius="lg"
              color="gray.500"
              bg="gray.50"
              _hover={{ bg: 'brand.50', color: 'brand.600' }}
              transition="all 200ms ease"
            />
          </Tooltip>
        ) : (
          // Expanded: Logo + Brand name + Toggle button
          <>
            <Flex
              align="center"
              cursor="pointer"
              onClick={() => handleNavigate(ROUTES.HOME)}
              _hover={{ opacity: 0.8 }}
              transition="opacity 200ms ease"
            >
              <Logo size="md" iconOnly />
              <Text
                ml={3}
                fontWeight="700"
                fontSize="md"
                color="gray.900"
                whiteSpace="nowrap"
              >
                BookEasy
              </Text>
            </Flex>
            <IconButton
              aria-label="Collapse sidebar"
              icon={<ChevronsLeftIcon size={16} />}
              onClick={toggle}
              variant="ghost"
              size="sm"
              borderRadius="md"
              color="gray.400"
              _hover={{ bg: 'gray.100', color: 'gray.600' }}
              transition="all 200ms ease"
            />
          </>
        )}
      </Flex>

      <Divider borderColor="gray.100" />

      {/* Navigation */}
      <VStack spacing={1} align="stretch" flex={1} p={isCollapsed ? 2 : 4}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const badgeCount = getBadgeCount(item.badgeKey);

          const navButton = (
            <Box
              key={item.path}
              data-tour-id={item.tourId}
              as="button"
              display="flex"
              alignItems="center"
              justifyContent={isCollapsed ? 'center' : 'space-between'}
              w="full"
              py={3}
              px={3}
              borderRadius="xl"
              bg={active ? 'brand.50' : 'transparent'}
              color={active ? 'brand.600' : 'gray.600'}
              fontWeight={active ? '600' : '500'}
              fontSize="sm"
              transition="all 0.2s"
              _hover={{
                bg: active ? 'brand.50' : 'gray.50',
                color: active ? 'brand.600' : 'gray.900',
              }}
              onClick={() => handleNavigate(item.path)}
              position="relative"
            >
              {isCollapsed ? (
                // Collapsed: Icon only with badge overlay
                <Box position="relative">
                  <Box opacity={active ? 1 : 0.7}>{item.icon}</Box>
                  {badgeCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-6px"
                      right="-8px"
                      colorScheme="red"
                      borderRadius="full"
                      fontSize="2xs"
                      minW="16px"
                      h="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {badgeCount}
                    </Badge>
                  )}
                </Box>
              ) : (
                // Expanded: Icon + label + badge
                <>
                  <Flex align="center" gap={3}>
                    <Box opacity={active ? 1 : 0.7}>{item.icon}</Box>
                    <Text whiteSpace="nowrap">{item.label}</Text>
                  </Flex>
                  {badgeCount > 0 && (
                    <Badge
                      colorScheme="red"
                      borderRadius="full"
                      fontSize="xs"
                      minW="20px"
                      textAlign="center"
                    >
                      {badgeCount}
                    </Badge>
                  )}
                </>
              )}
            </Box>
          );

          // Wrap in Tooltip when collapsed
          return isCollapsed ? (
            <Tooltip
              key={item.path}
              label={item.label}
              placement="right"
              hasArrow
              bg="gray.800"
              color="white"
              fontSize="sm"
              borderRadius="md"
              px={3}
              py={2}
            >
              {navButton}
            </Tooltip>
          ) : (
            navButton
          );
        })}
      </VStack>

      {/* Logout */}
      <Box p={isCollapsed ? 2 : 4} borderTop="1px" borderColor="gray.100">
        <Tooltip
          label="Log out"
          placement="right"
          hasArrow
          isDisabled={!isCollapsed}
          bg="gray.800"
          color="white"
          fontSize="sm"
          borderRadius="md"
          px={3}
          py={2}
        >
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
            gap={3}
            w="full"
            py={3}
            px={3}
            borderRadius="xl"
            color="gray.500"
            fontWeight="500"
            fontSize="sm"
            transition="all 0.2s"
            _hover={{ bg: 'red.50', color: 'red.500' }}
            onClick={handleLogout}
          >
            <LogOutIcon size={20} />
            {!isCollapsed && <Text whiteSpace="nowrap">Log out</Text>}
          </Box>
        </Tooltip>
      </Box>
    </Flex>
  );
}

export { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH };
