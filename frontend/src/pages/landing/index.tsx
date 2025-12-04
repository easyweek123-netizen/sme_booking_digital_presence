import { Box } from '@chakra-ui/react';
import { Header, Footer } from '../../components/Layout';
import { Hero, Features, CTASection } from '../../components/Landing';
import { BusinessCategories } from '../../components/BusinessCategories';

export function LandingPage() {
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Hero />
      <BusinessCategories />
      <Features />
      <CTASection />
      <Footer />
    </Box>
  );
}
