/* eslint-disable react-refresh/only-export-components -- context provider and hook live together per phase-1 spec */
import { createContext, useContext, type ReactNode } from 'react';
import { useBreakpointValue } from '@chakra-ui/react';

interface DeviceMode {
  /**
   * True when the surrounding container should render the "desktop" variant
   * (full sidebar, modal-style service detail). When false, components render
   * the mobile variant (sticky CTA, bottom-sheet drawers). This is decoupled
   * from the viewport breakpoint so live previews can force a phone layout
   * regardless of the actual browser size.
   */
  isDesktop: boolean;
}

const DeviceModeContext = createContext<DeviceMode | null>(null);

interface DeviceModeProviderProps {
  isDesktop: boolean;
  children: ReactNode;
}

export function DeviceModeProvider({ isDesktop, children }: DeviceModeProviderProps) {
  return (
    <DeviceModeContext.Provider value={{ isDesktop }}>
      {children}
    </DeviceModeContext.Provider>
  );
}

/**
 * Reads device mode from the nearest DeviceModeProvider. When no provider is
 * present (legacy callers, isolated component tests), falls back to the
 * viewport breakpoint at lg (992px) — preserves prior `ServiceCard` behaviour.
 */
export function useDeviceMode(): boolean {
  const ctx = useContext(DeviceModeContext);
  const fallback = useBreakpointValue({ base: false, lg: true }) ?? false;
  return ctx ? ctx.isDesktop : fallback;
}
