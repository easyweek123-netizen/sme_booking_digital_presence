import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
} from '@chakra-ui/react';
import { useAppSelector } from '../../store/hooks';
import { ChatPanel } from './ChatPanel';
import { CanvasPanel } from '../canvas/CanvasPanel';
import { MessageSquareIcon, SparkleIcon } from '../icons';

/**
 * Mobile layout for CanvasChat.
 * Shows bottom tabs to switch between Chat and AI Actions (Canvas).
 */
export function MobileChatTabs() {
  const { actions } = useAppSelector((state) => state.canvas);

  return (
    <Flex direction="column" h="full" position="absolute" inset={0}>
      <Tabs
        variant="enclosed"
        isFitted
        flex={1}
        display="flex"
        flexDirection="column"
      >
        {/* Tab panels - main content */}
        <TabPanels flex={1} overflow="hidden">
          <TabPanel p={0} h="full">
            <ChatPanel />
          </TabPanel>
          <TabPanel p={0} h="full">
            <CanvasPanel />
          </TabPanel>
        </TabPanels>

        {/* Bottom tab bar */}
        <TabList
          bg="white"
          borderTop="1px"
          borderColor="gray.200"
          flexShrink={0}
        >
          <Tab
            py={3}
            _selected={{ color: 'brand.500', borderTopColor: 'brand.500' }}
          >
            <Flex align="center" gap={2}>
              <MessageSquareIcon size={18} />
              Chat
            </Flex>
          </Tab>
          <Tab
            py={3}
            _selected={{ color: 'brand.500', borderTopColor: 'brand.500' }}
          >
            <Flex align="center" gap={2}>
              <SparkleIcon size={18} />
              AI Actions
              {actions.length > 0 && (
                <Badge colorScheme="brand" borderRadius="full" fontSize="xs">
                  {actions.length}
                </Badge>
              )}
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
}

