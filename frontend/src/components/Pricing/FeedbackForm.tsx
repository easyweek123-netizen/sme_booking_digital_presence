import { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Container,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { feedbackFormSchema, type FeedbackFormValues } from './feedbackFormSchema';
import { useSubmitFeedbackMutation } from '../../store/api/feedbackApi';
import { TOAST_DURATION } from '../../constants';
import { SelectField, TextField, TextAreaField, SubmitButton } from '../ui/form';

const MotionBox = motion.create(Box);

const TOPIC_OPTIONS = [
  { value: 'Product Feedback', label: 'Product Feedback' },
  { value: 'IT Services Inquiry', label: 'IT Services Inquiry' },
];

interface FeedbackFormProps {
  initialTopic?: 'Product Feedback' | 'IT Services Inquiry';
}

export function FeedbackForm({ initialTopic = 'Product Feedback' }: FeedbackFormProps) {
  const toast = useToast();
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const methods = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      topic: initialTopic,
      email: '',
      message: '',
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const topic = watch('topic');

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await submitFeedback({
        email: data.email,
        message: data.message,
        source: 'pricing_page',
        topic: data.topic,
      }).unwrap();

      setIsSubmitted(true);
      reset({ topic: 'Product Feedback', email: '', message: '' });

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
      bg="surface.page"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background blobs */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="brand.50"
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
                mb={3}
              >
                Help Us Build Premium
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} maxW="500px" mx="auto">
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
              bg="surface.card"
              border="1px"
              borderColor="brand.200"
            >
              <AlertIcon boxSize="40px" mr={0} mb={4} />
              <Heading size="md" mb={2}>
                Thank you for your feedback!
              </Heading>
              <Text>
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
              bg="surface.card"
              borderRadius="2xl"
              border="1px"
              borderColor="border.subtle"
              p={{ base: 6, md: 8 }}
              boxShadow="card"
            >
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={5}>
                    <SelectField<FeedbackFormValues>
                      name="topic"
                      label="Topic"
                      options={TOPIC_OPTIONS}
                      size="lg"
                    />

                    <TextField<FeedbackFormValues>
                      name="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      isRequired
                      size="lg"
                    />

                    <TextAreaField<FeedbackFormValues>
                      name="message"
                      label="Your Feedback"
                      placeholder={
                        topic === 'IT Services Inquiry'
                          ? 'Tell us about your project — what are you looking to build?'
                          : "Tell us what features you'd love to see, any suggestions to improve BookEasy, or feedback on your experience..."
                      }
                      isRequired
                      rows={5}
                      size="lg"
                    />

                    <SubmitButton
                      isLoading={isLoading}
                      loadingText="Submitting..."
                      w="full"
                    >
                      Submit Feedback
                    </SubmitButton>
                  </VStack>
                </form>
              </FormProvider>
            </Box>
          )}
        </MotionBox>
      </Container>
    </Box>
  );
}
