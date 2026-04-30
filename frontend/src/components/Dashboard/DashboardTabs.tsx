import { Box, Button, ButtonGroup, HStack, Tooltip } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export type DashboardTabSpec<K extends string = string> = {
  key: K;
  label: string;
  /** Trailing content rendered next to the label (badge, count chip, progress pill). */
  badge?: ReactNode;
  /** Disable selection; renders muted and uncloickable. */
  disabled?: boolean;
  /** Tooltip shown on hover when disabled (e.g. "Coming soon"). */
  disabledHint?: string;
};

interface DashboardTabsProps<K extends string> {
  tabs: ReadonlyArray<DashboardTabSpec<K>>;
  activeKey: K;
  onChange: (key: K) => void;
}

/**
 * Shared dashboard tab strip. Segmented-pill design, sticky-header friendly.
 * Used by Website, Bookings, and Settings via `DashboardContentShell`.
 */
export function DashboardTabs<K extends string>({
  tabs,
  activeKey,
  onChange,
}: DashboardTabsProps<K>) {
  return (
    <Box
      overflowX="auto"
      pb={2}
      css={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <ButtonGroup
        isAttached
        size="sm"
        bg="surface.muted"
        borderRadius="lg"
        p="2px"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          const button = (
            <Button
              key={tab.key}
              onClick={() => !tab.disabled && onChange(tab.key)}
              isDisabled={tab.disabled}
              bg={isActive ? 'surface.card' : 'transparent'}
              color={isActive ? 'text.primary' : 'text.secondary'}
              fontWeight={isActive ? '600' : '500'}
              fontSize={{ base: 'xs', md: 'sm' }}
              px={{ base: 3, md: 4 }}
              py={2}
              borderRadius="md"
              boxShadow={isActive ? 'sm' : 'none'}
              _hover={{
                bg: isActive ? 'surface.card' : 'surface.muted',
                color: 'text.primary',
              }}
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
                _hover: { bg: 'transparent', color: 'text.secondary' },
              }}
              transition="all 0.2s"
              flexShrink={0}
            >
              <HStack spacing={1.5}>
                <Box as="span">{tab.label}</Box>
                {tab.badge}
              </HStack>
            </Button>
          );

          if (tab.disabled && tab.disabledHint) {
            return (
              <Tooltip
                key={tab.key}
                label={tab.disabledHint}
                placement="bottom"
                hasArrow
                bg="surface.inverted"
                color="text.inverted"
              >
                {button}
              </Tooltip>
            );
          }
          return button;
        })}
      </ButtonGroup>
    </Box>
  );
}
