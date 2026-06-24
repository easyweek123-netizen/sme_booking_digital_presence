import { Box, useBreakpointValue } from '@chakra-ui/react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { CanvasPanel } from '../../components/canvas/CanvasPanel';
import { MobileChatTabs } from '../../components/chat/MobileChatTabs';
import { useAppSelector } from '../../store/hooks';
import { useReducedMotion } from 'framer-motion';
import { MotionBox } from '../../components/ui/MotionBox';

const CHAT_PANEL_ID = 'chat-panel';
const CANVAS_PANEL_ID = 'canvas-panel';
const DEFAULT_CANVAS_SIZE = '55%'; // initial split when the canvas opens

export function CanvasChat() {
  const isDesktop = useBreakpointValue({ base: false, md: true }, { ssr: false });
  const isCanvasOpen = useAppSelector((s) => s.preview.isCanvasOpen);
  const prefersReducedMotion = useReducedMotion();

  if (!isDesktop) {
    return (
      <Box h="100%" w="100%" bg="surface.card">
        <MobileChatTabs />
      </Box>
    );
  }

  return (
    <Box position="absolute" inset={0} overflow="hidden" bg="surface.alt">
      <Group
        id="canvas-chat-layout"
        orientation="horizontal"
        style={{ height: '100%', width: '100%' }}
      >
        <Panel
          id={CHAT_PANEL_ID}
          minSize={30}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Box h="full" bg="surface.card" overflow="hidden">
            <ChatPanel />
          </Box>
        </Panel>

        {isCanvasOpen && (
          <>
            <Separator id="resize-handle">
              <Box
                w="8px"
                h="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="col-resize"
                bg="transparent"
                _hover={{ bg: 'surface.page' }}
                transition="background 0.15s"
              >
                <Box
                  w="4px"
                  h="40px"
                  bg="border.subtle"
                  borderRadius="full"
                  transition="all 0.15s"
                  sx={{
                    '[data-separator]:hover &': { bg: 'accent.primary', h: '60px' },
                    '[data-separator]:active &': { bg: 'accent.primary', h: '80px' },
                  }}
                />
              </Box>
            </Separator>

            <Panel
              id={CANVAS_PANEL_ID}
              defaultSize={DEFAULT_CANVAS_SIZE}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <MotionBox
                h="full"
                overflow="hidden"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeIn' }}
              >
                <CanvasPanel />
              </MotionBox>
            </Panel>
          </>
        )}
      </Group>
    </Box>
  );
}