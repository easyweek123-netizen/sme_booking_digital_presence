import { Box } from '@chakra-ui/react';
import { Footer } from '../../components/Layout';
import { HeroCarousel, HowItWorks, DemoPreview, Testimonials, FAQ, CTASection } from '../../components/Landing';

export function LandingPage() {
  return (
    <Box bg="white">
      <HeroCarousel />
      <HowItWorks />
      <DemoPreview />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </Box>
  );
}
