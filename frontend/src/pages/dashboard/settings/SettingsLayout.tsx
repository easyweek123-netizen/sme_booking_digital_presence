import {
  Box,
  Button,
  Flex,
  HStack,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { ROUTES } from '../../../config/routes';

type SettingsTabKey = 'billing' | 'profile' | 'team' | 'notifications';

const SETTINGS_TABS: Array<{
  key: SettingsTabKey;
  label: string;
  path?: string;
  enabled: boolean;
}> = [
  { key: 'billing', label: 'Billing', path: ROUTES.DASHBOARD.SETTINGS_BILLING, enabled: true },
  { key: 'profile', label: 'Profile', enabled: false },
  { key: 'team', label: 'Team', enabled: false },
  { key: 'notifications', label: 'Notifications', enabled: false },
];

export function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname;
  const activeIndex = Math.max(
    0,
    SETTINGS_TABS.findIndex((t) => t.enabled && t.path && activePath.startsWith(t.path)),
  );

  const handleNavigate = (path?: string) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <Flex direction="column" h="100%" minH={0}>
      <Box
        flexShrink={0}
        position="sticky"
        top={0}
        zIndex={5}
        bg="surface.page"
        borderBottom="1px solid"
        borderColor="border.subtle"
        px={{ base: 4, md: 6, lg: 8 }}
        pt={{ base: 4 }}
      >
        <PageHeader
          title="Settings"
          description="Manage your billing and account preferences."
        />

        {/* Mobile tab strip */}
        <Box display={{ base: 'block', md: 'none' }} pb={2}>
          <Tabs
            index={activeIndex}
            onChange={(idx) => handleNavigate(SETTINGS_TABS[idx]?.path)}
            variant="solid-rounded"
            colorScheme="brand"
          >
            <TabList overflowX="auto" py={1}>
              {SETTINGS_TABS.map((t) => (
                <Tab
                  key={t.key}
                  isDisabled={!t.enabled}
                  flexShrink={0}
                  fontSize="sm"
                  px={4}
                >
                  {t.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>
      </Box>

      <Flex
        flex={1}
        minH={0}
        overflow="hidden"
        px={{ base: 4, md: 6, lg: 8 }}
        py={4}
        gap={6}
      >
        {/* Desktop side-nav */}
        <Box
          display={{ base: 'none', md: 'block' }}
          w="240px"
          flexShrink={0}
          borderRight="1px solid"
          borderColor="border.subtle"
          pr={4}
        >
          <VStack align="stretch" spacing={1}>
            {SETTINGS_TABS.map((t) => {
              const isActive = !!t.path && activePath.startsWith(t.path);
              const button = (
                <Button
                  key={t.key}
                  variant="ghost"
                  justifyContent="flex-start"
                  isDisabled={!t.enabled}
                  bg={isActive ? 'brand.50' : 'transparent'}
                  color={isActive ? 'brand.600' : 'text.secondary'}
                  _hover={{
                    bg: isActive ? 'brand.50' : 'surface.muted',
                    color: isActive ? 'brand.600' : 'text.primary',
                  }}
                  onClick={() => handleNavigate(t.path)}
                >
                  <HStack w="full" justify="space-between">
                    <Text fontWeight={isActive ? '600' : '500'}>{t.label}</Text>
                    {!t.enabled && <Text fontSize="xs" color="text.muted">Soon</Text>}
                  </HStack>
                </Button>
              );

              return t.enabled ? (
                button
              ) : (
                <Tooltip
                  key={t.key}
                  label="Coming soon"
                  placement="right"
                  hasArrow
                  bg="surface.inverted"
                  color="text.inverted"
                >
                  {button}
                </Tooltip>
              );
            })}
          </VStack>
        </Box>

        {/* Right pane */}
        <Box flex={1} minH={0} overflow="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}

