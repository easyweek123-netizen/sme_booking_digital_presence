import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { EditIcon, LayersIcon } from '../../icons';
import { WebsiteFormTabs } from './WebsiteFormTabs';
import { WebsitePreview } from './preview/WebsitePreview';
import type { WebsiteTabKey } from './websiteTabs';
import type { BusinessWithServices } from '../../../types';

interface Props {
  activeTab: WebsiteTabKey;
  business: BusinessWithServices;
}

export function WebsiteFormMobile({ activeTab, business }: Props) {
  return (
    <Flex direction="column" h="100%" w="100%">
      <Tabs variant="enclosed" isFitted flex={1} minH={0} display="flex" flexDirection="column">
        <TabPanels flex={1} minH={0} overflow="hidden">
          <TabPanel p={0} h="100%" overflow="auto">
            <WebsiteFormTabs activeTab={activeTab} />
          </TabPanel>
          <TabPanel p={0} h="100%" overflow="auto">
            <WebsitePreview business={business} />
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
          <Tab py={3} _selected={{ color: 'accent.primary', borderTopColor: 'brand.500' }}>
            <Flex align="center" gap={2}>
              <EditIcon size={18} />
              Edit
            </Flex>
          </Tab>
          <Tab py={3} _selected={{ color: 'accent.primary', borderTopColor: 'brand.500' }}>
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
