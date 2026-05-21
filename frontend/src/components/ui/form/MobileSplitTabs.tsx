import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

export interface MobileSplitTabsProps {
  leftLabel: string;
  rightLabel: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  rightBadge?: ReactNode;
  left: ReactNode;
  right: ReactNode;
}

export function MobileSplitTabs({
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  rightBadge,
  left,
  right,
}: MobileSplitTabsProps) {
  return (
    <Flex direction="column" h="100%" w="100%">
      <Tabs variant="enclosed" isFitted flex={1} minH={0} display="flex" flexDirection="column">
        <TabPanels flex={1} minH={0} overflow="hidden" h="100%">
          <TabPanel p={0} h="100%" overflow="auto">
            {left}
          </TabPanel>
          <TabPanel p={0} h="100%" overflow="auto">
            {right}
          </TabPanel>
        </TabPanels>
        <TabList
          bg="surface.card"
          borderTop="1px"
          borderColor="border.subtle"
          flexShrink={0}
          pb="env(safe-area-inset-bottom)"
        >
          <Tab py={3} _selected={{ color: 'accent.primary', borderTopColor: 'brand.500' }}>
            <Flex align="center" gap={2}>
              {leftIcon}
              {leftLabel}
            </Flex>
          </Tab>
          <Tab py={3} _selected={{ color: 'accent.primary', borderTopColor: 'brand.500' }}>
            <Flex align="center" gap={2}>
              {rightIcon}
              {rightLabel}
              {rightBadge}
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
}
