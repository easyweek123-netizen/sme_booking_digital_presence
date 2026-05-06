import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import {
  ChevronDownIcon,
  CloseIcon,
  PlusIcon,
  SparkleIcon,
  TrashIcon,
} from '../icons';
import { useAppDispatch } from '../../store/hooks';
import {
  closeTab,
  openTab,
  removeConversation,
  setActiveTab,
} from '../../store/slices/chatSlice';
import {
  useCreateConversationMutation,
  useDeleteConversationMutation,
} from '../../store/api/chatApi';
import type { Conversation } from '../../types/chat.types';

function tabTitle(id: number, conversations?: Conversation[]): string {
  return conversations?.find((c) => c.id === id)?.title ?? 'New chat';
}

export function ChatTabStrip({
  conversations,
  activeTabId,
  openTabIds,
  isLoadingConversations,
}: {
  conversations: Conversation[];
  activeTabId: number | null;
  openTabIds: number[];
  isLoadingConversations?: boolean;
}) {
  const dispatch = useAppDispatch();

  const [createConversation, { isLoading: isCreatingConversation }] =
    useCreateConversationMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  const historyConversations = useMemo(() => {
    if (!conversations) return [];
    const open = new Set(openTabIds);
    return conversations.filter((c) => !open.has(c.id));
  }, [conversations, openTabIds]);

  const handleNewChat = async () => {
    try {
      const created = await createConversation().unwrap();
      dispatch(openTab(created.id));
    } catch {
      /* 402 handled globally */
    }
  };

  return (
    <Flex flex={1} align="center" justify="space-between" gap={2} minW={0}>
      <HStack spacing={1} flex={1} minW={0} overflow="hidden">
        {openTabIds.map((id) => {
          const isActive = id === activeTabId;
          return (
            <HStack
              key={id}
              spacing={1}
              px={2}
              py={1}
              borderRadius="sm"
              borderWidth="1px"
              borderTopWidth={isActive ? '2px' : '1px'}
              borderTopColor={isActive ? 'brand.500' : 'border.subtle'}
              borderColor="border.subtle"
              bg={isActive ? 'surface.card' : 'surface.alt'}
              color={isActive ? 'accent.primary' : 'text.muted'}
              cursor="pointer"
              onClick={() => dispatch(setActiveTab(id))}
              minW={0}
              maxW="180px"
              transition="all 0.15s"
              _hover={{ bg: isActive ? 'surface.card' : 'surface.page' }}
            >
              {isActive && <SparkleIcon size={14} />}
              <Text fontSize="xs" fontWeight="600" noOfLines={1} flex={1} minW={0}>
                {tabTitle(id, conversations)}
              </Text>
              <IconButton
                aria-label="Close tab"
                icon={<CloseIcon size={12} />}
                size="xs"
                variant="ghost"
                minW={4}
                h={4}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(closeTab(id));
                }}
              />
            </HStack>
          );
        })}
      </HStack>

      <HStack spacing={1} flexShrink={0}>
      <Tooltip label="Start a new chat" hasArrow placement="bottom">
        <IconButton
          aria-label="New chat"
          icon={isCreatingConversation ? <Spinner size="xs" /> : <PlusIcon size={14} />}
          size="xs"
          variant="ghost"
          color="text.muted"
          _hover={{ color: 'accent.primary', bg: 'surface.alt' }}
          onClick={handleNewChat}
        />
      </Tooltip>

        <Menu placement="bottom-end" isLazy>
          <MenuButton
            as={Button}
            size="xs"
            variant="ghost"
            color="text.muted"
            rightIcon={<ChevronDownIcon size={12} />}
          >
            History
          </MenuButton>
          <MenuList maxH="320px" overflowY="auto" minW="260px">
            {isLoadingConversations && (
              <Box p={3}>
                <Spinner size="sm" />
              </Box>
            )}
            {!isLoadingConversations && historyConversations.length === 0 && (
              <Box px={3} py={4}>
                <Text fontSize="xs" color="text.faint">
                  No older chats yet.
                </Text>
              </Box>
            )}
            {historyConversations.map((c) => (
              <HistoryRow
                key={c.id}
                title={c.title}
                onOpen={() => dispatch(openTab(c.id))}
                onDelete={async () => {
                  await deleteConversation(c.id).unwrap();
                  dispatch(removeConversation(c.id));
                }}
              />
            ))}
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}

function HistoryRow({
  title,
  onOpen,
  onDelete,
}: {
  title: string;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const { isOpen, onOpen: openConfirm, onClose } = useDisclosure();
  return (
    <MenuItem as="div" px={2} py={2} _hover={{ bg: 'surface.alt' }} closeOnSelect={false}>
      <Flex w="100%" align="center" gap={2}>
        <Box flex={1} minW={0} cursor="pointer" onClick={onOpen}>
          <Text fontSize="sm" fontWeight="500" noOfLines={1}>
            {title}
          </Text>
        </Box>
        <Popover isOpen={isOpen} onClose={onClose} placement="left" isLazy>
          <PopoverTrigger>
            <IconButton
              aria-label="Delete chat"
              icon={<TrashIcon size={12} />}
              size="xs"
              variant="ghost"
              color="text.faint"
              _hover={{ color: 'red.500', bg: 'red.50' }}
              onClick={(e) => {
                e.stopPropagation();
                openConfirm();
              }}
            />
          </PopoverTrigger>
          <PopoverContent w="220px">
            <PopoverArrow />
            <PopoverHeader fontSize="sm" fontWeight="600">Delete this chat?</PopoverHeader>
            <PopoverBody fontSize="xs" color="text.muted">
              This permanently removes the conversation and its messages.
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end" gap={2}>
              <Button size="xs" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => {
                  onClose();
                  onDelete();
                }}
              >
                Delete
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Flex>
    </MenuItem>
  );
}
