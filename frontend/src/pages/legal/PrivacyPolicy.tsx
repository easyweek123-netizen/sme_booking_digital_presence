import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
} from '@chakra-ui/react';
import { Header, Footer } from '../../components/Layout';

export function PrivacyPolicy() {
  const lastUpdated = 'December 2024';

  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="container.md" py={{ base: 12, md: 20 }}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="start">
            <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="700">
              Privacy Policy
            </Heading>
            <Text color="gray.500">Last updated: {lastUpdated}</Text>
          </VStack>

          <Divider />

          <VStack spacing={6} align="stretch">
            <Section title="Introduction">
              <Text>
                BookEasy ("we", "our", or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your 
                information when you use our booking platform service.
              </Text>
            </Section>

            <Section title="Information We Collect">
              <Text mb={3}>We collect information that you provide directly to us:</Text>
              <UnorderedList spacing={2} pl={4}>
                <ListItem>Account information (name, email address)</ListItem>
                <ListItem>Business information (business name, type, working hours, contact details)</ListItem>
                <ListItem>Service information (services offered, prices, durations)</ListItem>
                <ListItem>Booking information (appointments, customer details)</ListItem>
                <ListItem>Content you upload (logo, cover image, descriptions)</ListItem>
              </UnorderedList>
            </Section>

            <Section title="How We Use Your Information">
              <Text mb={3}>We use the information we collect to:</Text>
              <UnorderedList spacing={2} pl={4}>
                <ListItem>Provide, maintain, and improve our services</ListItem>
                <ListItem>Create and manage your booking page</ListItem>
                <ListItem>Send booking notifications and confirmations</ListItem>
                <ListItem>Communicate with you about our services</ListItem>
                <ListItem>Protect against fraud and unauthorized access</ListItem>
              </UnorderedList>
            </Section>

            <Section title="Third-Party Services">
              <Text mb={3}>We use trusted third-party services to operate BookEasy:</Text>
              <UnorderedList spacing={2} pl={4}>
                <ListItem>
                  <strong>Google Firebase:</strong> For secure authentication (login with Google)
                </ListItem>
                <ListItem>
                  <strong>Resend:</strong> For sending email notifications
                </ListItem>
                <ListItem>
                  <strong>Cloud hosting:</strong> For storing and serving your data securely
                </ListItem>
              </UnorderedList>
            </Section>

            <Section title="Data Security">
              <Text>
                We implement appropriate security measures to protect your personal 
                information. This includes encryption in transit and at rest, secure 
                authentication, and regular security reviews. However, no method of 
                transmission over the Internet is 100% secure.
              </Text>
            </Section>

            <Section title="Your Rights">
              <Text mb={3}>You have the right to:</Text>
              <UnorderedList spacing={2} pl={4}>
                <ListItem>Access your personal data</ListItem>
                <ListItem>Update or correct your information</ListItem>
                <ListItem>Delete your account and associated data</ListItem>
                <ListItem>Export your data</ListItem>
              </UnorderedList>
              <Text mt={3}>
                To exercise these rights, please contact us at the email below.
              </Text>
            </Section>

            <Section title="Cookies">
              <Text>
                We use essential cookies to maintain your session and remember your 
                preferences. We do not use tracking cookies or share data with advertisers.
              </Text>
            </Section>

            <Section title="Changes to This Policy">
              <Text>
                We may update this Privacy Policy from time to time. We will notify you 
                of any changes by posting the new policy on this page and updating the 
                "Last updated" date.
              </Text>
            </Section>

            <Section title="Contact Us">
              <Text>
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <Text as="span" color="brand.500" fontWeight="500">
                  easyweek123@gmail.com
                </Text>
              </Text>
            </Section>
          </VStack>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack spacing={3} align="stretch">
      <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900">
        {title}
      </Heading>
      <Box color="gray.600" lineHeight="1.7">
        {children}
      </Box>
    </VStack>
  );
}

