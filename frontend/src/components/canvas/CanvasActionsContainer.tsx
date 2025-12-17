import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Button,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface CanvasActionsContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  saveLabel?: string;
}

/**
 * Container wrapper for canvas actions.
 * Provides consistent header, scrollable content area, and optional footer with Save/Cancel buttons.
 * 
 * - If onSave is provided, shows Save/Cancel buttons (form action)
 * - If onSave is undefined, shows content only (display action)
 */
export function CanvasActionsContainer({
  title,
  description,
  children,
  onSave,
  onCancel,
  isLoading = false,
  saveLabel = 'Save',
}: CanvasActionsContainerProps) {
  const showButtons = !!onSave;

  return (
    <Flex
      direction="column"
      h="full"
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      border="1px"
      borderColor="gray.100"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.100" flexShrink={0}>
        <Heading size="sm" color="gray.800">
          {title}
        </Heading>
        {description && (
          <Text fontSize="sm" color="gray.500" mt={1}>
            {description}
          </Text>
        )}
      </Box>

      {/* Scrollable Content */}
      <Box flex={1} overflow="auto" p={4}>
        {children}
      </Box>

      {/* Footer - only for form actions */}
      {showButtons && (
        <HStack
          p={4}
          borderTop="1px"
          borderColor="gray.100"
          bg="gray.50"
          flexShrink={0}
        >
          <Button
            colorScheme="brand"
            onClick={onSave}
            isLoading={isLoading}
            flex={1}
          >
            {saveLabel}
          </Button>
          <Button variant="outline" onClick={onCancel} flex={1}>
            Cancel
          </Button>
        </HStack>
      )}
    </Flex>
  );
}

