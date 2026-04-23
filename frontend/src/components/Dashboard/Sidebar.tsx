import { Box, VStack, Text, Flex, Divider, Badge, Tooltip, IconButton, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import {
  // MessageSquareIcon,
  SparkleIcon,
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  LayersIcon,
  GlobeIcon,
  LogOutIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from '../icons';
import { ROUTES } from '../../config/routes';
import { useAppDispatch } from '../../store/hooks';
import { resetStore } from '../../store/actions';
import { useBusinessOptional } from '../../contexts/useBusiness';
import { useGetPendingCountQuery } from '../../store/api/bookingsApi';
import { useSidebarCollapsed } from '../../hooks';
import { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './constants';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badgeKey?: 'pending';
}

const navItems: NavItem[] = [
  // { label: 'AI Chat', icon: <MessageSquareIcon size={20} />, path: ROUTES.DASHBOARD.CHAT },
  { label: 'AI Canvas', icon: <SparkleIcon size={20} />, path: ROUTES.DASHBOARD.CANVAS },
  { label: 'Overview', icon: <HomeIcon size={20} />, path: ROUTES.DASHBOARD.ROOT },
  { label: 'Bookings', icon: <CalendarIcon size={20} />, path: ROUTES.DASHBOARD.BOOKINGS, badgeKey: 'pending' },
  { label: 'Clients', icon: <UsersIcon size={20} />, path: ROUTES.DASHBOARD.CLIENTS },
  { label: 'Services', icon: <LayersIcon size={20} />, path: ROUTES.DASHBOARD.SERVICES },
  { label: 'Website', icon: <GlobeIcon size={20} />, path: ROUTES.DASHBOARD.WEBSITE },
];

interface SidebarProps {
  onClose?: () => void;
  /** When true (MobileNav drawer), use mobile collapse semantics instead of desktop localStorage. */
  isInDrawer?: boolean;
}

export function Sidebar({ onClose, isInDrawer }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { toggle, isCollapsed } = useSidebarCollapsed({
    isMobile: !!isInDrawer,
  });

  const { business } = useBusinessOptional();
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
      borderColor="border.subtle"
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
          <Tooltip
            label="Expand sidebar"
            placement="right"
            hasArrow
            bg="surface.inverted"
            color="text.inverted"
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
              color="text.muted"
              bg="surface.muted"
              _hover={{ bg: 'brand.50', color: 'brand.600' }}
              transition="all 200ms ease"
            />
          </Tooltip>
        ) : (
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
                color="text.primary"
                whiteSpace="nowrap"
              >
                BookEasy
              </Text>
            </Flex>
            <IconButton
              aria-label="Collapse sidebar"
              icon={<ChevronsLeftIcon size={16} />}
              onClick={() => {toggle(); onClose?.();}}
              variant="ghost"
              size="sm"
              borderRadius="md"
              color="text.muted"
              _hover={{ bg: 'surface.muted', color: 'text.secondary' }}
              transition="all 200ms ease"
            />
          </>
        )}
      </Flex>

      <Divider borderColor="border.subtle" />

      {/* Navigation */}
      <VStack spacing={1} align="stretch" flex={1} p={isCollapsed ? 2 : 4}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const badgeCount = getBadgeCount(item.badgeKey);

          const navButton = (
            <Button
              key={item.path}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              variant="ghost"
              w="full"
              h="auto"
              py={3}
              px={3}
              borderRadius="md"
              bg={active ? 'brand.50' : 'transparent'}
              color={active ? 'brand.600' : 'text.secondary'}
              fontWeight={active ? '600' : '500'}
              fontSize="sm"
              transition="all 0.2s"
              _hover={{
                bg: active ? 'brand.50' : 'surface.muted',
                color: active ? 'brand.600' : 'text.primary',
              }}
              onClick={() => handleNavigate(item.path)}
              position="relative"
              justifyContent={isCollapsed ? 'center' : 'space-between'}
            >
              {isCollapsed ? (
                <Box position="relative">
                  <Box opacity={active ? 1 : 0.7}>{item.icon}</Box>
                  {badgeCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-6px"
                      right="-8px"
                      colorScheme="alert"
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
                <>
                  <Flex align="center" gap={3}>
                    <Box opacity={active ? 1 : 0.7}>{item.icon}</Box>
                    <Text whiteSpace="nowrap">{item.label}</Text>
                  </Flex>
                  {badgeCount > 0 && (
                    <Badge
                      colorScheme="alert"
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
            </Button>
          );

          // Wrap in Tooltip when collapsed
          return isCollapsed ? (
            <Tooltip
              key={item.path}
              label={item.label}
              placement="right"
              hasArrow
              bg="surface.inverted"
              color="text.inverted"
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
      <Box p={isCollapsed ? 2 : 4} borderTop="1px" borderColor="border.subtle">
        <Tooltip
          label="Log out"
          placement="right"
          hasArrow
          isDisabled={!isCollapsed}
          bg="surface.inverted"
          color="text.inverted"
          fontSize="sm"
          borderRadius="md"
          px={3}
          py={2}
        >
          <Button
            aria-label="Log out"
            variant="ghost"
            w="full"
            h="auto"
            py={3}
            px={3}
            borderRadius="md"
            color="text.muted"
            fontWeight="500"
            fontSize="sm"
            transition="all 0.2s"
            _hover={{ bg: 'alert.50', color: 'alert.500' }}
            onClick={handleLogout}
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
          >
            <Flex align="center" gap={3}>
              <LogOutIcon size={20} />
              {!isCollapsed && <Text whiteSpace="nowrap">Log out</Text>}
            </Flex>
          </Button>
        </Tooltip>
      </Box>
    </Flex>
  );
}
