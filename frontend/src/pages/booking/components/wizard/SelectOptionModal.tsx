import { Box, Flex, Text, VStack, IconButton, useToast, Heading } from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAppointment: () => void;
  hasSelectedService: boolean;
}

// User Icon SVG
function SingleUserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#09090B' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// Users Icon SVG
function GroupUsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#71717A' }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// Chevron/Back Arrow Icon SVG
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

// Close/X Icon SVG
function CloseXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export function SelectOptionModal({ isOpen, onClose, onSelectAppointment, hasSelectedService }: Props) {
  const toast = useToast();

  if (!isOpen) return null;

  const handleSelect = () => {
    if (!hasSelectedService) {
      toast({
        title: 'Please select a service first',
        description: 'Choose one of our premium services from the list before scheduling.',
        status: 'info',
        duration: 3500,
        isClosable: true,
        position: 'top',
      });
      onClose();
      return;
    }
    onSelectAppointment();
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="#F9F9FB"
      zIndex={9999}
      overflowY="auto"
      px={6}
      py={8}
    >
      {/* Top Header Navigation */}
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto" mb={{ base: 12, md: 24 }}>
        <IconButton
          aria-label="Go back"
          icon={<ArrowLeftIcon />}
          onClick={onClose}
          variant="solid"
          bg="white"
          color="black"
          boxShadow="0 2px 8px rgba(0,0,0,0.04)"
          borderRadius="full"
          w="44px"
          h="44px"
          _hover={{ bg: 'gray.50' }}
          _active={{ transform: 'scale(0.96)' }}
        />
        <IconButton
          aria-label="Close options"
          icon={<CloseXIcon />}
          onClick={onClose}
          variant="solid"
          bg="white"
          color="black"
          boxShadow="0 2px 8px rgba(0,0,0,0.04)"
          borderRadius="full"
          w="44px"
          h="44px"
          _hover={{ bg: 'gray.50' }}
          _active={{ transform: 'scale(0.96)' }}
        />
      </Flex>

      {/* Main Select Content Container */}
      <VStack spacing={8} align="stretch" maxW="600px" mx="auto" justify="center" minH="calc(100vh - 250px)" pb={12}>
        
        <Heading
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="800"
          color="black"
          textAlign="center"
          letterSpacing="-0.02em"
          mb={4}
        >
          Select an option
        </Heading>

        {/* Option cards block */}
        <VStack spacing={4} align="stretch">
          
          {/* OPTION 1: Book an appointment (Active) */}
          <Box
            as="button"
            type="button"
            onClick={handleSelect}
            w="100%"
            textAlign="left"
            bg="white"
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="#ECECEC"
            boxShadow="0 4px 12px rgba(0,0,0,0.01)"
            transition="all 0.2s ease"
            _hover={{
              borderColor: 'black',
              boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
              transform: 'translateY(-1px)',
            }}
            _active={{
              transform: 'scale(0.985)',
            }}
          >
            <Flex justify="space-between" align="center">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="md" fontWeight="700" color="black">
                  Book an appointment
                </Text>
                <Text fontSize="xs" color="gray.450" fontWeight="600">
                  Schedule services for yourself
                </Text>
              </VStack>
              <SingleUserIcon />
            </Flex>
          </Box>

          {/* OPTION 2: Book group appointment (Disabled) */}
          <Box
            w="100%"
            textAlign="left"
            bg="white"
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="#ECECEC"
            opacity={0.5}
            cursor="not-allowed"
          >
            <Flex justify="space-between" align="center">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="md" fontWeight="700" color="black">
                  Book group appointment
                </Text>
                <Text fontSize="xs" color="gray.450" fontWeight="600">
                  For yourself and others
                </Text>
              </VStack>
              <GroupUsersIcon />
            </Flex>
          </Box>

        </VStack>

      </VStack>
    </Box>
  );
}
