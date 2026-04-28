import { Box } from '@chakra-ui/react';
import { Footer } from '../../components/Layout';
import { Hero } from './components/Hero';
import { WhatWeBuild } from './components/WhatWeBuild';
import { Process } from './components/Process';
import { RecentWork } from './components/RecentWork';
import { WhyUs } from './components/WhyUs';
import { ContactForm } from './components/ContactForm';
import { FooterCTA } from './components/FooterCTA';

export function ServicesPage() {
  return (
    <Box>
      <Hero />
      <WhatWeBuild />
      <Process />
      <RecentWork />
      <WhyUs />
      <ContactForm />
      <FooterCTA />
      <Footer />
    </Box>
  );
}
