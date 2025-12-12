import { Box } from '@chakra-ui/react';
import { Header, Footer } from '../../components/Layout';
import { HeroCarousel, HowItWorks, FAQ, CTASection } from '../../components/Landing';
// import { BusinessCategories } from '../../components/BusinessCategories';

export function LandingPage() {
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <HeroCarousel />
      <HowItWorks />
      {/* <BusinessCategories /> */}
      <FAQ />
      <CTASection />
      <Footer />
    </Box>
  );
}
