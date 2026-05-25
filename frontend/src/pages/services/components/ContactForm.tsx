import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, TextAreaField, SelectField, SubmitButton } from '../../../components/ui/form';
import { Section } from '../../../components/ui/Section';
import { useSubmitInquiryMutation } from '../../../store/api/inquiriesApi';
import { BUDGET_OPTIONS } from '../content';

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Please enter your name')
    .max(120, 'Too long'),
  email: z.string().email('Please enter a valid email'),
  company: z
    .string()
    .max(255, 'Too long')
    .optional()
    .or(z.literal('')),
  budget: z.enum(['under_5k', '5_15k', '15_50k', '50k_plus', 'not_sure'], {
    errorMap: () => ({ message: 'Please pick a budget range' }),
  }),
  message: z
    .string()
    .min(20, 'Please share at least a sentence about your project (20+ characters)')
    .max(5000, 'Too long'),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const toast = useToast();
  const [submitInquiry, { isLoading, isSuccess }] = useSubmitInquiryMutation();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      company: '',
      budget: 'not_sure',
      message: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitInquiry({
        name: values.name,
        email: values.email,
        company: values.company || undefined,
        budget: values.budget,
        message: values.message,
      }).unwrap();

      methods.reset();
      toast({
        title: 'Thanks — we got your message.',
        description: "We'll reply within 1 business day.",
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;
      const description =
        status === 429
          ? 'Too many requests — please try again in an hour.'
          : 'Something went wrong sending your inquiry. Please try again or email easyweek123@gmail.com directly.';
      toast({
        title: 'Could not send your message',
        description,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    }
  };

  return (
    <Section id="contact" spacing="lg">
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 16 }}>
        <VStack align="flex-start" spacing={5}>
          <Text
            fontSize="sm"
            fontWeight="600"
            color="accent.primary"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Get in touch
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            color="text.strong"
            fontWeight="700"
            lineHeight="1.2"
          >
            Tell us what you're building.
          </Heading>
          <Text fontSize="md" color="text.secondary" lineHeight="1.7">
            We reply within 1 business day. Share what you're working on, the
            outcome you need, and a rough budget. We'll come back with a solution.
          </Text>
          <Text fontSize="sm" color="text.muted">
            Or email us directly at{' '}
            <Box
              as="a"
              href="mailto:easyweek123@gmail.com"
              color="accent.primary"
              fontWeight="600"
              _hover={{ textDecoration: 'underline' }}
            >
              easyweek123@gmail.com
            </Box>
            .
          </Text>
        </VStack>

        <Box
          bg="surface.card"
          borderRadius="2xl"
          border="1px"
          borderColor="border.subtle"
          p={{ base: 6, md: 8 }}
          boxShadow="card"
        >
          <FormProvider {...methods}>
            <Box as="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <VStack spacing={4} align="stretch">
                <TextField<FormValues>
                  name="name"
                  label="Your name"
                  placeholder="Jane Smith"
                  isRequired
                  autoComplete="name"
                />
                <TextField<FormValues>
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="jane@company.com"
                  isRequired
                  autoComplete="email"
                />
                <TextField<FormValues>
                  name="company"
                  label="Company (optional)"
                  placeholder="Acme Inc."
                  autoComplete="organization"
                />
                <SelectField<FormValues>
                  name="budget"
                  label="Budget"
                  isRequired
                  options={BUDGET_OPTIONS.map((b) => ({
                    value: b.value,
                    label: b.label,
                  }))}
                />
                <TextAreaField<FormValues>
                  name="message"
                  label="What do you want to build?"
                  placeholder="A few sentences about the project, the outcome, and any constraints we should know about."
                  isRequired
                  rows={6}
                />

                <SubmitButton
                  isLoading={isLoading}
                  isDisabled={isSuccess && !methods.formState.isDirty}
                  loadingText="Sending..."
                  size="lg"
                  mt={2}
                >
                  Send inquiry
                </SubmitButton>

                <Text fontSize="xs" color="text.muted" pt={1}>
                  By submitting, you agree to be contacted about your inquiry.
                  We don't share your details with anyone.
                </Text>
              </VStack>
            </Box>
          </FormProvider>
        </Box>
      </SimpleGrid>
    </Section>
  );
}
