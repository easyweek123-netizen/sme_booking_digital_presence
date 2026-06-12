import { Box } from '@chakra-ui/react';

export function HeroGridBackdrop() {
  return (
    <Box
      position="absolute"
      inset={0}
      bgImage={`
        repeating-linear-gradient(
          0deg,
          rgba(31, 26, 67, 0.04) 0,
          rgba(31, 26, 67, 0.04) 1px,
          transparent 1px,
          transparent 44px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(31, 26, 67, 0.04) 0,
          rgba(31, 26, 67, 0.04) 1px,
          transparent 1px,
          transparent 44px
        )
      `}
      bgSize="44px 44px"
      sx={{
        maskImage: 'radial-gradient(840px 640px at 50% 18%, #000 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(840px 640px at 50% 18%, #000 30%, transparent 85%)',
      }}
    />
  );
}
