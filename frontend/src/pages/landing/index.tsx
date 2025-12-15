import { Box } from '@chakra-ui/react';
import { Footer } from '../../components/Layout';
import { HeroCarousel, HowItWorks, FAQ, CTASection } from '../../components/Landing';
// import { BusinessCategories } from '../../components/BusinessCategories';

export function LandingPage() {
  return (
    <Box bg="white">
      <HeroCarousel />
      <HowItWorks />
      {/* <BusinessCategories /> */}
      <FAQ />
      <CTASection />
      <Footer />
    </Box>
  );
}
