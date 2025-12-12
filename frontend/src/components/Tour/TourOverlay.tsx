import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useTour } from '../../contexts/TourContext';
import { MotionBox } from '../ui/MotionBox';
import { TOUR_Z_INDEX, TOUR_DIMENSIONS, TOUR_ANIMATION } from '../../config/tourConstants';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourOverlay() {
  const { isActive, targetElement } = useTour();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  // Update target rectangle when element changes or window resizes
  useEffect(() => {
    if (!targetElement) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const rect = targetElement.getBoundingClientRect();
      setTargetRect({
        top: rect.top - TOUR_DIMENSIONS.padding,
        left: rect.left - TOUR_DIMENSIONS.padding,
        width: rect.width + TOUR_DIMENSIONS.padding * 2,
        height: rect.height + TOUR_DIMENSIONS.padding * 2,
      });
    };

    updateRect();

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [targetElement]);

  // Create clip-path to create "hole" in overlay
  const clipPath = targetRect
    ? `polygon(
        0% 0%,
        0% 100%,
        ${targetRect.left}px 100%,
        ${targetRect.left}px ${targetRect.top}px,
        ${targetRect.left + targetRect.width}px ${targetRect.top}px,
        ${targetRect.left + targetRect.width}px ${targetRect.top + targetRect.height}px,
        ${targetRect.left}px ${targetRect.top + targetRect.height}px,
        ${targetRect.left}px 100%,
        100% 100%,
        100% 0%
      )`
    : 'none';

  // Only show overlay when we have a target to spotlight
  const shouldShow = isActive && targetElement !== null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <>
          {/* Dark overlay with spotlight hole */}
          <MotionBox
            position="fixed"
            inset={0}
            bg="blackAlpha.600"
            zIndex={TOUR_Z_INDEX.overlay}
            pointerEvents="auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TOUR_ANIMATION.duration }}
            style={{
              clipPath,
              transition: `clip-path ${TOUR_ANIMATION.duration}s ${TOUR_ANIMATION.easing}`,
            }}
          />

          {/* Soft glow around target */}
          {targetRect && (
            <Box
              position="fixed"
              top={`${targetRect.top}px`}
              left={`${targetRect.left}px`}
              width={`${targetRect.width}px`}
              height={`${targetRect.height}px`}
              // borderRadius="lg"
              // boxShadow={`0 0 0 2px ${brandColor}66, 0 0 20px ${brandColor}33`}
              zIndex={TOUR_Z_INDEX.highlight}
              pointerEvents="none"
              transition={`all ${TOUR_ANIMATION.duration}s ${TOUR_ANIMATION.easing}`}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
