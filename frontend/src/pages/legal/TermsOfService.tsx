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

export function TermsOfService() {
  const lastUpdated = 'December 2024';

  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="container.md" py={{ base: 12, md: 20 }}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="start">
            <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="700">
              Terms of Service
            </Heading>
            <Text color="gray.500">Last updated: {lastUpdated}</Text>
          </VStack>

          <Divider />

          <VStack spacing={6} align="stretch">
            <Section title="Acceptance of Terms">
              <Text>
                By accessing or using BookEasy, you agree to be bound by these Terms of 
                Service. If you do not agree to these terms, please do not use our service.
              </Text>
            </Section>

            <Section title="Description of Service">
              <Text>
                BookEasy is a free online booking platform that allows businesses to create 
                professional booking pages, manage services, and accept appointments from 
                customers. We provide tools for scheduling, notifications, and customer 
                management.
              </Text>
            </Section>

            <Section title="User Accounts">
              <Text mb={3}>When you create an account, you agree to:</Text>
              <UnorderedList spacing={2} pl={4}>
                <ListItem>Provide accurate and complete information</ListItem>
                <ListItem>Maintain the security of your account credentials</ListItem>
                <ListItem>Notify us immediately of any unauthorized access</ListItem>
                <ListItem>Be responsible for all activities under your account</ListItem>
              </UnorderedList>
            </Section>

            <Section title="Acceptable Use">
              <Text mb={3}>You agree not to:</Text>
              <UnorderedList spacing={2} pl={4}>
                <ListItem>Use the service for any illegal purposes</ListItem>
                <ListItem>Upload harmful, offensive, or misleading content</ListItem>
                <ListItem>Attempt to gain unauthorized access to our systems</ListItem>
                <ListItem>Interfere with other users' use of the service</ListItem>
                <ListItem>Send spam or unsolicited communications</ListItem>
                <ListItem>Impersonate others or misrepresent your affiliation</ListItem>
              </UnorderedList>
            </Section>

            <Section title="Free Service">
              <Text>
                BookEasy is currently offered free of charge. We reserve the right to 
                introduce paid features or subscription plans in the future. Any changes 
                to pricing will be communicated in advance, and existing free features 
                will remain available.
              </Text>
            </Section>

            <Section title="Content Ownership">
              <Text>
                You retain ownership of all content you upload to BookEasy (business 
                information, images, service descriptions). By using our service, you 
                grant us a license to display and process this content to provide the 
                booking service.
              </Text>
            </Section>

            <Section title="Service Availability">
              <Text>
                We strive to maintain high availability but do not guarantee uninterrupted 
                access to BookEasy. We may perform maintenance, updates, or experience 
                technical issues that temporarily affect service availability.
              </Text>
            </Section>

            <Section title="Limitation of Liability">
              <Text>
                BookEasy is provided "as is" without warranties of any kind. We are not 
                liable for any indirect, incidental, or consequential damages arising 
                from your use of the service. This includes, but is not limited to, 
                missed appointments, lost revenue, or data loss.
              </Text>
            </Section>

            <Section title="Termination">
              <Text>
                We reserve the right to suspend or terminate accounts that violate these 
                terms. You may also delete your account at any time through the dashboard 
                settings or by contacting us.
              </Text>
            </Section>

            <Section title="Changes to Terms">
              <Text>
                We may update these Terms of Service from time to time. Continued use of 
                BookEasy after changes constitutes acceptance of the new terms. We will 
                notify users of significant changes via email or in-app notification.
              </Text>
            </Section>

            <Section title="Governing Law">
              <Text>
                These terms are governed by applicable laws. Any disputes arising from 
                these terms or your use of BookEasy will be resolved through appropriate 
                legal channels.
              </Text>
            </Section>

            <Section title="Contact Us">
              <Text>
                If you have any questions about these Terms of Service, please contact us at:{' '}
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

