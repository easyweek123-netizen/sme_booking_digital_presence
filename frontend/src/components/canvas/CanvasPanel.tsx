import {
  Box,
  Button,
  ButtonGroup,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setActiveTab } from '../../store/slices/canvasSlice';
import { useGetMyBusinessQuery } from '../../store/api';
import { CanvasPreview } from './CanvasPreview';
import { ActionsRenderer } from './ActionsRenderer';
import { BookingPage } from '../../pages/booking';
import { DashboardServices } from '../../pages/dashboard/DashboardServices';
import { DashboardBookings } from '../../pages/dashboard/DashboardBookings';
import { DashboardClients } from '../../pages/dashboard/DashboardClients';
import type { PreviewContext } from '../../types/chat.types';

/**
 * Canvas panel with Preview and Actions tabs.
 * Preview shows content based on previewContext (booking page, services, etc.).
 * Actions shows AI-triggered action components.
 */
export function CanvasPanel() {
  const dispatch = useAppDispatch();
  const { activeTab, actions, previewContext } = useAppSelector((state) => state.canvas);
  const { data: business } = useGetMyBusinessQuery();

  /**
   * Render preview content based on previewContext
   */
  const renderPreviewContent = () => {
    const previewMap: Record<PreviewContext, React.ReactNode> = {
      booking_page: <BookingPage business={business} isPreview />,
      services: <DashboardServices />,
      bookings: <DashboardBookings />,
      clients: <DashboardClients />,
    };

    return previewMap[previewContext] || previewMap.booking_page;
  };

  const isPreview = activeTab === 'preview';
  const isActions = activeTab === 'actions';

  return (
    <Flex direction="column" h="full" overflow="hidden">
      {/* Segmented Control Header */}
      <Flex
        px={4}
        py={3}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        flexShrink={0}
        alignItems="center"
        justifyContent="center"
      >
        <ButtonGroup
          isAttached
          size="sm"
          bg="gray.100"
          borderRadius="lg"
          p="2px"
        >
          <Button
            onClick={() => dispatch(setActiveTab('preview'))}
            bg={isPreview ? 'white' : 'transparent'}
            color={isPreview ? 'gray.900' : 'gray.500'}
            fontWeight={isPreview ? '600' : '500'}
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="md"
            boxShadow={isPreview ? 'sm' : 'none'}
            _hover={{
              bg: isPreview ? 'white' : 'gray.50',
              color: 'gray.900',
            }}
            transition="all 0.2s"
          >
            Preview
          </Button>
          <Button
            onClick={() => dispatch(setActiveTab('actions'))}
            bg={isActions ? 'white' : 'transparent'}
            color={isActions ? 'gray.900' : 'gray.500'}
            fontWeight={isActions ? '600' : '500'}
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="md"
            boxShadow={isActions ? 'sm' : 'none'}
            _hover={{
              bg: isActions ? 'white' : 'gray.50',
              color: 'gray.900',
            }}
            transition="all 0.2s"
            position="relative"
          >
            Actions
            {actions.length > 0 && (
              <Badge
                colorScheme="brand"
                borderRadius="full"
                ml={1.5}
                fontSize="2xs"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {actions.length}
              </Badge>
            )}
          </Button>
        </ButtonGroup>
      </Flex>

      {/* Content Area */}
      <Box flex={1} overflow="auto">
        {isPreview ? (
          <CanvasPreview>
            {renderPreviewContent()}
          </CanvasPreview>
        ) : (
          <Box h="full" p={4}>
            <ActionsRenderer actions={actions} />
          </Box>
        )}
      </Box>
    </Flex>
  );
}
