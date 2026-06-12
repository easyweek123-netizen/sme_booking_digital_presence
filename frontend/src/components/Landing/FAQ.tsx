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

export type FAQItem = { question: string; answer: string };

type Props = {
  items: readonly FAQItem[];
  headline: string;
  subhead?: string;
  /** Section background. Default: `surface.muted`. */
  bg?: string;
  /** Initially open item index. Default: 0 (first item open). Pass `null` for all closed. */
  defaultOpen?: number | null;
  /** id used for in-page anchor links (e.g. header nav). Default: 'faq'. */
  id?: string;
};

function PlusMinusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <Box
      w="28px"
      h="28px"
      borderRadius="full"
      bg={isOpen ? 'accent.primary' : 'surface.muted'}
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
          bg={isOpen ? 'surface.card' : 'text.secondary'}
          borderRadius="full"
          transform="translateY(-50%)"
        />
        <Box
          position="absolute"
          top="0"
          left="50%"
          w="2px"
          h="12px"
          bg={isOpen ? 'surface.card' : 'text.secondary'}
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
            color="text.heading"
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
              color="text.secondary"
            >
              {item.answer}
            </Text>
          </Box>
        </Collapse>
      </Box>
    </MotionBox>
  );
}

export function FAQ({
  items,
  headline,
  subhead,
  bg = 'surface.muted',
  defaultOpen = 0,
  id = 'faq',
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  const handleToggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <Box id={id} py={{ base: 16, md: 24 }} bg={bg}>
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
                color="text.heading"
              >
                {headline}
              </Heading>
            </MotionBox>
            {subhead && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Text fontSize={{ base: 'md', md: 'lg' }} color="text.secondary">
                  {subhead}
                </Text>
              </MotionBox>
            )}
          </VStack>

          <VStack spacing={4} w="full">
            {items.map((item, index) => (
              <FAQCard
                key={index}
                item={item}
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
