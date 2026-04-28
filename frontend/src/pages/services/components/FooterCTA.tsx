import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
} from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon } from '../../../components/icons';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { FOOTER_CTA } from '../content';

const MotionBox = motion.create(Box);

function scrollTo(targetId: string) {
  const el = document.querySelector(targetId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function FooterCTA() {
  const reduce = useReducedMotion();

  return (
    <Box as="section" bg="surface.alt" py={{ base: 16, md: 24 }}>
      <Container maxW="container.lg">
        <MotionBox
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <VStack
            spacing={6}
            textAlign="center"
            bg="surface.card"
            borderRadius="3xl"
            border="1px"
            borderColor="border.subtle"
            p={{ base: 10, md: 16 }}
            boxShadow="card"
          >
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              color="text.strong"
              fontWeight="700"
              lineHeight="1.2"
              maxW="640px"
            >
              {FOOTER_CTA.title}
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="text.secondary"
              maxW="540px"
            >
              {FOOTER_CTA.body}
            </Text>
            <PrimaryButton
              size="lg"
              rightIcon={<ArrowRightIcon size={18} />}
              onClick={() => scrollTo(FOOTER_CTA.cta.target)}
            >
              {FOOTER_CTA.cta.label}
            </PrimaryButton>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
