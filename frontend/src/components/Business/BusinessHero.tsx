import { Box, Image } from '@chakra-ui/react';

interface BusinessHeroProps {
  coverImageUrl: string | null;
  enabled: boolean;
  isDesktop: boolean;
}

export function BusinessHero({ coverImageUrl, enabled, isDesktop }: BusinessHeroProps) {
  if (!enabled || !coverImageUrl) {
    return <Box h={isDesktop ? '80px' : '16px'} />;
  }
  return (
    <Box
      position="relative"
      w="100%"
      maxW="1240px"
      mx="auto"
      h={isDesktop ? '360px' : '220px'}
      overflow="hidden"
      borderRadius={isDesktop ? '0 0 16px 16px' : 0}
    >
      <Image src={coverImageUrl} alt="" w="100%" h="100%" objectFit="cover" display="block" />
    </Box>
  );
}
