import { Box, type BoxProps } from '@chakra-ui/react';
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

const DeviceModeContext = createContext<boolean | null>(null);

type DeviceModeProviderProps = { children: ReactNode } & (
  | { isDesktop: boolean; desktopMinWidth?: never; boxProps?: never }
  | { desktopMinWidth: number; isDesktop?: never; boxProps?: BoxProps }
);

/**
 * Provides "is this subtree rendering at desktop scale?" to descendants
 * (notably ServiceCard's modal-vs-drawer choice). Use one of:
 *
 *   <DeviceModeProvider isDesktop={value}>           // caller-told
 *   <DeviceModeProvider desktopMinWidth={992}>       // observes its own wrapper
 *
 * Descendants read with useDeviceMode(). They must NOT call useBreakpointValue
 * below this provider — the surface size is not the viewport size.
 */
export function DeviceModeProvider(props: DeviceModeProviderProps) {
  if ('desktopMinWidth' in props && props.desktopMinWidth != null) {
    return (
      <MeasuredProvider threshold={props.desktopMinWidth} boxProps={props.boxProps}>
        {props.children}
      </MeasuredProvider>
    );
  }
  return (
    <DeviceModeContext.Provider value={props.isDesktop}>
      {props.children}
    </DeviceModeContext.Provider>
  );
}

function MeasuredProvider({
  threshold, boxProps, children,
}: { threshold: number; boxProps?: BoxProps; children: ReactNode }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const isDesktop = useIsWiderThan(el, threshold);
  return (
    <Box ref={setEl} h="100%" w="100%" {...boxProps}>
      <DeviceModeContext.Provider value={isDesktop}>
        {children}
      </DeviceModeContext.Provider>
    </Box>
  );
}

/**
 * Subscribes to the element's size via ResizeObserver through
 * useSyncExternalStore. No effects, no setState in the observer, no debounce —
 * the browser already batches ResizeObserver callbacks per animation frame.
 */
function useIsWiderThan(el: Element | null, threshold: number): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!el) return () => {};
      const obs = new ResizeObserver(notify);
      obs.observe(el);
      return () => obs.disconnect();
    },
    [el],
  );
  const getSnapshot = useCallback(
    () => (el ? el.getBoundingClientRect().width >= threshold : false),
    [el, threshold],
  );
  // SSR snapshot: no DOM, assume mobile.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useDeviceMode(): boolean {
  const ctx = useContext(DeviceModeContext);
  if (ctx === null) throw new Error('useDeviceMode must be used within <DeviceModeProvider>.');
  return ctx;
}
