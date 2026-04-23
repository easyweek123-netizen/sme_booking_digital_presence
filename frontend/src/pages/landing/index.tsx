import { Box } from '@chakra-ui/react';
import { Footer } from '../../components/Layout';
import { Hero, HowItWorks, Testimonials, FAQ, CTASection } from '../../components/Landing';
import { TrustBand } from '../../components/Landing/Hero';

export function LandingPage() {
  return (
    <Box bg="surface.page">
      <Hero />
      <TrustBand />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </Box>
  );
}
