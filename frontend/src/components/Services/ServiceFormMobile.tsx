import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { EditIcon, LayersIcon } from '../icons';
import { ServiceFormTabs } from './ServiceFormTabs';
import { LivePreviewPane } from './LivePreviewPane';
import type { ServiceTabKey } from './serviceTabs';

export function ServiceFormMobile({
  activeTab,
  isEdit,
}: {
  activeTab: ServiceTabKey;
  isEdit: boolean;
}) {
  return (
    <Flex direction="column" h="100%" w="100%">
      <Tabs
        variant="enclosed"
        isFitted
        flex={1}
        minH={0}
        display="flex"
        flexDirection="column"
      >
        <TabPanels flex={1} minH={0} overflow="hidden">
          <TabPanel p={0} h="100%" overflow="auto">
            <ServiceFormTabs activeTab={activeTab} />
          </TabPanel>
          <TabPanel p={0} h="100%" overflow="auto">
            <Box
              bg="surface.card"
              p={6}
              borderRadius="lg"
              borderWidth={1}
              borderColor="border.subtle"
            >
              <LivePreviewPane />
            </Box>
          </TabPanel>
        </TabPanels>

        <TabList
          bg="surface.card"
          borderTop="1px"
          borderColor="border.subtle"
          flexShrink={0}
          mx={-4}
          mb={-4}
          pb="env(safe-area-inset-bottom)"
        >
          <Tab
            py={3}
            _selected={{ color: 'accent.primary', borderTopColor: 'brand.500' }}
          >
            <Flex align="center" gap={2}>
              <EditIcon size={18} />
              {isEdit ? 'Edit' : 'Create'}
            </Flex>
          </Tab>
          <Tab
            py={3}
            _selected={{ color: 'accent.primary', borderTopColor: 'brand.500' }}
          >
            <Flex align="center" gap={2}>
              <LayersIcon size={18} />
              Preview
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
}
