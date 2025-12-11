import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Container,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubmitFeedbackMutation } from '../../store/api/feedbackApi';
import { TOAST_DURATION } from '../../constants';

const MotionBox = motion.create(Box);

export function FeedbackForm() {
  const toast = useToast();
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.message) {
      toast({
        title: 'Please fill in all fields',
        status: 'warning',
        duration: TOAST_DURATION.MEDIUM,
      });
      return;
    }

    try {
      await submitFeedback({
        email: formData.email,
        message: formData.message,
        source: 'pricing_page',
      }).unwrap();

      setIsSubmitted(true);
      setFormData({ email: '', message: '' });

      toast({
        title: 'Thank you for your feedback!',
        description: "We'll review your suggestions carefully.",
        status: 'success',
        duration: TOAST_DURATION.LONG,
      });
    } catch {
      toast({
        title: 'Error submitting feedback',
        description: 'Please try again later.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  return (
    <Box
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="purple.100"
        opacity={0.3}
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="-100px"
        left="-100px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="brand.100"
        opacity={0.3}
        filter="blur(60px)"
      />

      <Container maxW="container.md" position="relative">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8} textAlign="center" mb={10}>
            <Box>
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="700"
                color="gray.900"
                mb={3}
              >
                Help Us Build Premium
              </Heading>
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} maxW="500px" mx="auto">
                What features matter most to you? Share your feedback and help shape
                the future of BookEasy.
              </Text>
            </Box>
          </VStack>

          {isSubmitted ? (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="xl"
              py={10}
              bg="white"
              border="1px"
              borderColor="green.200"
            >
              <AlertIcon boxSize="40px" mr={0} mb={4} />
              <Heading size="md" mb={2}>
                Thank you for your feedback!
              </Heading>
              <Text color="gray.600">
                We appreciate you taking the time to share your thoughts.
              </Text>
              <Button
                mt={6}
                variant="outline"
                colorScheme="brand"
                onClick={() => setIsSubmitted(false)}
              >
                Submit Another
              </Button>
            </Alert>
          ) : (
            <Box
              as="form"
              onSubmit={handleSubmit}
              bg="white"
              borderRadius="2xl"
              border="1px"
              borderColor="gray.200"
              p={{ base: 6, md: 8 }}
              boxShadow="0 4px 20px rgba(0,0,0,0.05)"
            >
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    size="lg"
                    borderRadius="xl"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                    Your Feedback
                  </FormLabel>
                  <Textarea
                    placeholder="Tell us what features you'd love to see, any suggestions to improve BookEasy, or feedback on your experience..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    size="lg"
                    borderRadius="xl"
                    rows={5}
                    resize="vertical"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Submitting..."
                  fontWeight="600"
                  py={6}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 14px rgba(46, 182, 125, 0.3)',
                  }}
                >
                  Submit Feedback
                </Button>
              </VStack>
            </Box>
          )}
        </MotionBox>
      </Container>
    </Box>
  );
}

