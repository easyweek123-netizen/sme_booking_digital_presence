import { Component, type ReactNode } from 'react';
import { Box, VStack, Text, Button, Icon } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  proposalId: string;
  onDismiss: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for individual proposal cards.
 * Catches render errors and displays a friendly fallback UI.
 */
export class ActionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ActionErrorBoundary caught error:', {
      error,
      errorInfo,
      proposalId: this.props.proposalId,
    });
  }

  handleDismiss = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onDismiss();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          p={6}
          bg="red.50"
          borderRadius="lg"
          border="1px"
          borderColor="red.200"
        >
          <VStack spacing={4} align="center">
            <Icon viewBox="0 0 24 24" boxSize={8} color="red.400">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              />
            </Icon>
            <VStack spacing={1}>
              <Text fontWeight="600" color="red.700">
                Something went wrong
              </Text>
              <Text fontSize="sm" color="red.600" textAlign="center">
                This action couldn't be displayed. You can dismiss it and try again.
              </Text>
            </VStack>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={this.handleDismiss}
            >
              Dismiss
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

