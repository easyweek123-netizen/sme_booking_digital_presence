import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';
const TOGGLE_EVENT = 'sidebar-toggle';

/**
 * Hook for managing sidebar collapsed state with localStorage persistence.
 * Syncs state across components via custom events (same tab) and storage events (cross-tab).
 */
export function useSidebarCollapsed() {
  const [isCollapsed, setIsCollapsed] = useState(() => 
    localStorage.getItem(STORAGE_KEY) === 'true'
  );

  useEffect(() => {
    // Handle cross-tab sync via storage event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setIsCollapsed(e.newValue === 'true');
      }
    };

    // Handle same-tab sync via custom event
    const handleToggleEvent = () => {
      setIsCollapsed(localStorage.getItem(STORAGE_KEY) === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(TOGGLE_EVENT, handleToggleEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(TOGGLE_EVENT, handleToggleEvent);
    };
  }, []);

  const toggle = () => {
    const newValue = !isCollapsed;
    localStorage.setItem(STORAGE_KEY, String(newValue));
    setIsCollapsed(newValue);
    // Dispatch custom event for same-tab sync with other components
    window.dispatchEvent(new Event(TOGGLE_EVENT));
  };

  return { isCollapsed, toggle };
}

