import { Box, HStack, Image } from '@chakra-ui/react';
import { ArrowLeftIcon } from '../icons';
import { RoundIconButton } from './atoms';

interface BusinessHeroProps {
  coverImageUrl: string | null;
  enabled: boolean;
  isDesktop: boolean;
  onBack?: () => void;
}

export function BusinessHero({ coverImageUrl, enabled, isDesktop, onBack }: BusinessHeroProps) {
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
      {!isDesktop && (
        <HStack position="absolute" top={3} left={3} right={3} justify="space-between">
          <RoundIconButton aria-label="Back" icon={<ArrowLeftIcon size={18} />} onClick={onBack} size="sm" />
          {/* <HStack spacing={2}>
            <RoundIconButton aria-label="Share" icon={<ShareIcon size={18} />} size="sm" />
            <RoundIconButton aria-label="Save" icon={<HeartIcon size={18} />} size="sm" />
          </HStack> */}
        </HStack>
      )}
    </Box>
  );
}
