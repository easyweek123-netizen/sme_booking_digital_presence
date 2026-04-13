import { HStack, Button, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
}

interface FloatingNavProps {
  items: NavItem[];
}

export function FloatingNav({ items }: FloatingNavProps) {
  const [activeSection, setActiveSection] = useState(items[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show nav after scrolling past the hero (300px)
      setIsVisible(window.scrollY > 300);

      // Determine which section is in view
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(items[i].id);
            break;
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={100}
      opacity={isVisible ? 1 : 0}
      transition="opacity 0.3s"
    >
      <HStack
        spacing={1}
        bg="white"
        borderRadius="full"
        boxShadow="lg"
        border="1px"
        borderColor="gray.100"
        px={2}
        py={1.5}
      >
        {items.map((item) => (
          <Button
            key={item.id}
            size="xs"
            variant="ghost"
            borderRadius="full"
            fontSize="xs"
            fontWeight={activeSection === item.id ? '600' : '400'}
            color={activeSection === item.id ? 'brand.600' : 'gray.500'}
            bg={activeSection === item.id ? 'brand.50' : 'transparent'}
            _hover={{ bg: 'gray.50' }}
            onClick={() => scrollTo(item.id)}
            px={3}
          >
            {item.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
}
