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
import { SECTION_PADDING } from '../../constants';

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
      bg={isOpen ? 'brand.500' : 'gray.100'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      transition="all 0.2s ease"
    >
      <Box position="relative" w="12px" h="12px">
        {/* Horizontal line */}
        <Box
          position="absolute"
          top="50%"
          left="0"
          w="12px"
          h="2px"
          bg={isOpen ? 'white' : 'gray.500'}
          borderRadius="full"
          transform="translateY(-50%)"
        />
        {/* Vertical line (hidden when open) */}
        <Box
          position="absolute"
          top="0"
          left="50%"
          w="2px"
          h="12px"
          bg={isOpen ? 'white' : 'gray.500'}
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
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      w="full"
    >
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow={isOpen ? '0 8px 30px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.04)'}
        overflow="hidden"
        transition="all 0.2s ease"
        w="full"
        _hover={{
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
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
          _focus={{ outline: 'none' }}
        >
          <Text
            fontWeight="600"
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.900"
            pr={4}
            lineHeight="1.4"
          >
            {item.question}
          </Text>
          <PlusMinusIcon isOpen={isOpen} />
        </Flex>
        
        <Collapse in={isOpen} animateOpacity>
          <Box px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }}>
            <Divider mb={4} borderColor="gray.100" />
            <Text
              color="gray.600"
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
    <Box id="faq" py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }} bg="gray.50">
      <Container maxW="container.md">
        <VStack spacing={{ base: 10, md: 14 }}>
          {/* Section header */}
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
                color="gray.900"
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
              <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>
                Everything you need to know about BookEasy
              </Text>
            </MotionBox>
          </VStack>

          {/* FAQ cards */}
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
