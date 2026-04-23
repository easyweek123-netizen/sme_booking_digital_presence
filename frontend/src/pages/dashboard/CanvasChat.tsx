import { Box, useBreakpointValue } from '@chakra-ui/react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { CanvasPanel } from '../../components/canvas/CanvasPanel';
import { MobileChatTabs } from '../../components/chat/MobileChatTabs';

/**
 * Canvas Chat page - resizable split layout on desktop, tabbed on mobile.
 *
 * Desktop: Chat panel on left, Canvas panel on right with draggable divider
 * Mobile: Bottom tabs to switch between Chat and Canvas
 *
 * Only one layout mounts at a time (`useBreakpointValue` branch). Keeping the
 * desktop tree off mobile avoids react-resizable-panels + duplicate CanvasPanel
 * previews interfering with Chakra Drawer portals. `MobileNav` stays mounted in
 * `DashboardLayout`, so branching here does not reset drawer state.
 */
export function CanvasChat() {
  const isDesktop = useBreakpointValue({ base: false, md: true }, { ssr: false });

  if (!isDesktop) {
    return (
      <Box
        position="fixed"
        top="60px"
        left={0}
        right={0}
        bottom={0}
        bg="white"
      >
        <MobileChatTabs />
      </Box>
    );
  }

  return (
    <Box position="absolute" inset={0} overflow="hidden" bg="gray.50">
      <Group
        orientation="horizontal"
        id="canvas-chat-layout"
        style={{ height: '100%', width: '100%' }}
      >
        <Panel
          id="chat-panel"
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Box h="full" bg="white" overflow="hidden">
            <ChatPanel />
          </Box>
        </Panel>

        <Separator id="resize-handle">
          <Box
            w="8px"
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="col-resize"
            bg="transparent"
            _hover={{ bg: 'gray.100' }}
            transition="background 0.15s"
          >
            <Box
              w="4px"
              h="40px"
              bg="gray.300"
              borderRadius="full"
              transition="all 0.15s"
              sx={{
                '[data-separator]:hover &': {
                  bg: 'brand.400',
                  h: '60px',
                },
                '[data-separator][data-resize-handle-active] &': {
                  bg: 'brand.500',
                  h: '80px',
                },
              }}
            />
          </Box>
        </Separator>

        <Panel
          id="canvas-panel"
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Box h="full" overflow="hidden">
            <CanvasPanel />
          </Box>
        </Panel>
      </Group>
    </Box>
  );
}
