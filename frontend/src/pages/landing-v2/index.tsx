import { Box } from '@chakra-ui/react';
import {
  Hero, VideoShowcase, AudienceStrip, ProductWalkthrough,
  Testimonials, HowItWorks, StartBanner,
} from '@/components/LandingV2';
import { FAQ } from '@/components/Landing/FAQ';
import { Footer } from '@/components/Layout/Footer';
import { landingV2Content } from './content';

export default function LandingV2Page() {
  return (
    <Box>
      <Hero />
      <VideoShowcase />
      <AudienceStrip />
      <ProductWalkthrough />
      <Testimonials />
      <HowItWorks />
      <FAQ
        items={landingV2Content.faq.items}
        headline={landingV2Content.faq.headline}
        subhead={landingV2Content.faq.subhead}
        bg="surface.page"
      />
      <StartBanner />
      <Footer />
    </Box>
  );
}
