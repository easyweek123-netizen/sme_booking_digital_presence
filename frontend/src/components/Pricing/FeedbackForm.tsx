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
import { TextField, TextAreaField, SubmitButton } from '../ui/form';

const MotionBox = motion.create(Box);

export function FeedbackForm() {
  const toast = useToast();
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const methods = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await submitFeedback({
        email: data.email,
        message: data.message,
        source: 'pricing_page',
      }).unwrap();

      setIsSubmitted(true);
      reset({ email: '', message: '' });

      toast({
        title: "You're on the list!",
        description: "We'll reach out when paid plans launch.",
        status: 'success',
        duration: TOAST_DURATION.LONG,
      });
    } catch {
      toast({
        title: 'Something went wrong',
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
      {/* Decorative blobs */}
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
                Be first when paid plans launch
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="text.secondary" maxW="500px" mx="auto">
                Drop your email — we'll let you know when Pro and Growth go live,
                and use your input to shape what ships.
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
                You're on the list!
              </Heading>
              <Text color="text.secondary">
                We'll be in touch when paid plans launch.
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
                      label="What feature would matter most to you?"
                      placeholder="Persistent AI memory? WhatsApp inbox? Custom domain? Tell us what would tip you over."
                      rows={4}
                      size="lg"
                    />

                    <SubmitButton
                      isLoading={isLoading}
                      loadingText="Submitting..."
                      w="full"
                    >
                      Notify me
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
