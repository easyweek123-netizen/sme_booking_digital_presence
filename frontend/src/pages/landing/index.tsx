import { Box } from '@chakra-ui/react';
import { Footer } from '../../components/Layout';
import { Hero, HowItWorks, Testimonials, FAQ, CTASection } from '../../components/Landing';

export function LandingPage() {
  return (
    <Box bg="surface.page">
      <Hero />
      <Testimonials />
      <HowItWorks />
      <CTASection />
      <FAQ />
      <Footer />
    </Box>
  );
}
