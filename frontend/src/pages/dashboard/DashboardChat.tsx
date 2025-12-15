import { Box, VStack, Heading, Text } from '@chakra-ui/react';


export function DashboardChat() {

  return (
    <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color="gray.900" mb={1}>
            Chat
          </Heading>
          <Text color="gray.500">Coming Soon...</Text>
        </Box>

    </VStack>
  );
}

