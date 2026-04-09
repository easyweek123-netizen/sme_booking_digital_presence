import { Box } from '@chakra-ui/react';
import { useState, useEffect, isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react';
import { BREAKPOINTS } from '../../utils/breakpoints';

interface CanvasPreviewProps {
  children: ReactNode;
}

/**
 * Generic preview container for canvas.
 * Measures container width and passes `isDesktop` prop to children.
 * Uses debounced ResizeObserver for performance.
 */
export function CanvasPreview({ children }: CanvasPreviewProps) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!containerRef) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const DEBOUNCE_MS = 150;

    const observer = new ResizeObserver((entries) => {
      // Debounce: only update after resize stops
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = entries[0].contentRect.width;
        const newIsDesktop = width >= BREAKPOINTS.md;

        // Only update if breakpoint changed
        setIsDesktop((prev) => (prev !== newIsDesktop ? newIsDesktop : prev));
      }, DEBOUNCE_MS);
    });

    observer.observe(containerRef);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [containerRef]);

  // Clone child element and inject isDesktop prop
  const childWithProps = isValidElement(children)
    ? cloneElement(children as ReactElement<{ isDesktop?: boolean }>, { isDesktop })
    : children;

  return (
    <Box
      ref={setContainerRef}
      h="full"
      overflow="auto"
      bg="gray.50"
      p={4}
    >
      {childWithProps}
    </Box>
  );
}
