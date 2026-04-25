import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
  Collapse,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
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

function PlusMinusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <Box
      w="28px"
      h="28px"
      borderRadius="full"
      bg={isOpen ? 'brand.500' : 'surface.muted'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      transition="all 0.2s ease"
    >
      <Box position="relative" w="12px" h="12px">
        <Box
          position="absolute"
          top="50%"
          left="0"
          w="12px"
          h="2px"
          bg={isOpen ? 'white' : 'text.secondary'}
          borderRadius="full"
          transform="translateY(-50%)"
        />
        <Box
          position="absolute"
          top="0"
          left="50%"
          w="2px"
          h="12px"
          bg={isOpen ? 'white' : 'text.secondary'}
          borderRadius="full"
          transform={`translateX(-50%) scaleY(${isOpen ? 0 : 1})`}
          transition="transform 0.2s ease"
        />
      </Box>
    </Box>
  );
}

function FAQCard({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const panelId = `faq-panel-${index}`;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      w="full"
    >
      <Box
        bg="surface.card"
        borderRadius="2xl"
        boxShadow={isOpen ? 'cardHover' : 'card'}
        overflow="hidden"
        transition="all 0.2s ease"
        w="full"
        _hover={{
          boxShadow: 'cardHover',
          transform: 'translateY(-2px)',
        }}
      >
        <Flex
          as="button"
          w="full"
          p={{ base: 5, md: 6 }}
          align="center"
          justify="space-between"
          textAlign="left"
          cursor="pointer"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          _focus={{ outline: 'none' }}
          _focusVisible={{ boxShadow: 'outline' }}
        >
          <Text
            fontWeight="600"
            fontSize={{ base: 'md', md: 'lg' }}
            pr={4}
            lineHeight="1.4"
          >
            {item.question}
          </Text>
          <PlusMinusIcon isOpen={isOpen} />
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <Box id={panelId} px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }}>
            <Divider mb={4} borderColor="border.subtle" />
            <Text
              lineHeight="1.7"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              {item.answer}
            </Text>
          </Box>
        </Collapse>
      </Box>
    </MotionBox>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box id="faq" py={{ base: 16, md: 24 }} bg="surface.muted">
      <Container maxW="container.md">
        <VStack spacing={{ base: 10, md: 14 }}>
          <VStack spacing={4} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="700"
              >
                Frequently Asked Questions
              </Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Text fontSize={{ base: 'md', md: 'lg' }}>
                Everything you need to know about BookEasy
              </Text>
            </MotionBox>
          </VStack>

          <VStack spacing={4} w="full">
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
              />
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
