import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { Header, Footer } from '../../components/Layout';

export function Impressum() {
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="container.md" py={{ base: 12, md: 20 }}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="start">
            <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="700">
              Impressum
            </Heading>
            <Text color="gray.500">
              Angaben gemäß ECG §5 / Information according to ECG §5
            </Text>
          </VStack>

          <Divider />

          <VStack spacing={6} align="stretch">
            <Section title="Diensteanbieter / Service Provider">
              <Text>Hassan Abdur Rehman</Text>
              <Text>Linz, Austria</Text>
            </Section>

            <Section title="Kontakt / Contact">
              <Text>
                <Text as="span" color="brand.500" fontWeight="500">
                  easyweek123@gmail.com
                </Text>
              </Text>
            </Section>

            <Section title="Tätigkeitsbereich / Nature of Activity">
              <Text>
                Online booking platform for small businesses (BookEasy). Software development services.
              </Text>
            </Section>

            <Section title="Haftungsausschluss / Disclaimer">
              <Text>
                The contents of this site have been created with care. However, we accept no
                liability for the accuracy, completeness, or timeliness of the information
                provided. We are not responsible for the content of external links; the
                operators of linked pages are solely responsible for their content. All content
                published on this site is subject to Austrian copyright law. Any reproduction,
                distribution, or use of content without prior written consent is prohibited.
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
