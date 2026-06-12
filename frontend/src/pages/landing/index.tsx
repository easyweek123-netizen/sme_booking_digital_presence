import { Box } from '@chakra-ui/react';
import { Footer } from '../../components/Layout';
import { Hero, HowItWorks, Testimonials, FAQ, CTASection } from '../../components/Landing';

const LEGACY_FAQS = [
  {
    question: 'Is BookEasy really free?',
    answer:
      'Yes, completely free! No hidden fees, no credit card required. Create your booking page, add unlimited services, and accept unlimited bookings — all at no cost.',
  },
  {
    question: 'How do customers book appointments?',
    answer:
      'Customers visit your unique booking page, browse your services, select a date and time, and verify their identity with Google or email. You get notified instantly!',
  },
  {
    question: 'Can I customize my booking page?',
    answer:
      'Absolutely! Add your logo, choose a brand color, upload a cover image, write an About section, and organize services into categories. Make it truly yours.',
  },
  {
    question: 'How do I get notified of new bookings?',
    answer:
      'You receive email notifications for every new booking, cancellation, or status change. Your customers also get confirmation emails automatically.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we take security seriously. We use industry-standard encryption, secure authentication via Google, and never share your data with third parties.',
  },
];

export function LandingPage() {
  return (
    <Box bg="surface.page">
      <Hero />
      <Testimonials />
      <HowItWorks />
      <CTASection />
      <FAQ
        items={LEGACY_FAQS}
        headline="Frequently Asked Questions"
        subhead="Everything you need to know about BookEasy"
      />
      <Footer />
    </Box>
  );
}
