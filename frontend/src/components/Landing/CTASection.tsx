import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { SECTION_PADDING } from '../../constants';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <Box bg="gray.900" py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md + 4 }}>
      <Container maxW="container.md">
        <VStack spacing={6} textAlign="center">
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="700"
            color="white"
          >
            Ready to get started?
          </Heading>
          <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }}>
            Join thousands of businesses already using BookEasy.
          </Text>
          <Button
            size="lg"
            bg="white"
            color="gray.900"
            px={8}
            py={6}
            fontWeight="600"
            _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
            _active={{ bg: 'gray.200', transform: 'translateY(0)' }}
            transition="all 0.2s"
            onClick={() => navigate(ROUTES.ONBOARDING)}
          >
            Create Your Booking Page
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
