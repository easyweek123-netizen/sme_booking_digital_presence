import { Component, type ReactNode } from 'react';
import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Center minH="100vh" bg="gray.50" p={4}>
          <Box
            bg="white"
            p={8}
            borderRadius="2xl"
            shadow="lg"
            maxW="md"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text fontSize="4xl">😕</Text>
              <Heading size="lg" color="gray.900">
                Something went wrong
              </Heading>
              <Text color="gray.600">
                We're sorry, but something unexpected happened. Please try again.
              </Text>
              <Button
                colorScheme="brand"
                onClick={this.handleRetry}
                size="lg"
              >
                Try Again
              </Button>
              <Button
                variant="ghost"
                colorScheme="gray"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
            </VStack>
          </Box>
        </Center>
      );
    }

    return this.props.children;
  }
}

