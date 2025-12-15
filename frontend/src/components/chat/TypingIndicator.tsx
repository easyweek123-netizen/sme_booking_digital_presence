import { Box, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionDot = motion.create(Box);

// Bot avatar icon (same as ChatMessage)
function BotIcon() {
  return (
    <Icon viewBox="0 0 24 24" boxSize={4} fill="currentColor">
      <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" />
    </Icon>
  );
}

export function TypingIndicator() {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      alignSelf="flex-start"
      maxW="85%"
    >
      <HStack spacing={2} align="flex-start">
        <Box
          flexShrink={0}
          w={7}
          h={7}
          borderRadius="lg"
          bg="brand.50"
          color="brand.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={0.5}
        >
          <BotIcon />
        </Box>
        
        <Box
          bg="white"
          px={4}
          py={3}
          borderRadius="2xl"
          borderTopLeftRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack spacing={1.5}>
            {[0, 1, 2].map((i) => (
              <MotionDot
                key={i}
                w="6px"
                h="6px"
                borderRadius="full"
                bg="gray.300"
                animate={{ 
                  y: [0, -4, 0],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </HStack>
        </Box>
      </HStack>
    </MotionBox>
  );
}
