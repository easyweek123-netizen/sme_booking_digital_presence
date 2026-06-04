import { useCallback, useEffect, useRef, useState } from 'react';

export interface OAuthPopupResult { status: 'success' | 'error'; reason?: string; }

interface UseOAuthPopupOptions {
  expectedMessageType: string;
  width?: number;
  height?: number;
  windowName?: string;
}

interface OpenArgs {
  url: string;
  onResult: (r: OAuthPopupResult) => void;
  onBlocked?: () => void;
}

export function useOAuthPopup({
  expectedMessageType, width = 520, height = 640, windowName = 'oauth-popup',
}: UseOAuthPopupOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  const open = useCallback(({ url, onResult, onBlocked }: OpenArgs) => {
    cleanupRef.current?.();

    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(url, windowName, `width=${width},height=${height},left=${left},top=${top},popup=yes`);
    if (!popup) { onBlocked?.(); return; }

    setIsOpen(true);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; status?: string; reason?: string } | null;
      if (!data || data.type !== expectedMessageType) return;
      finish({ status: data.status === 'success' ? 'success' : 'error', reason: data.reason });
    };
    const pollId = window.setInterval(() => {
      if (popup.closed) finish({ status: 'error', reason: 'cancelled' });
    }, 500);

    function finish(r: OAuthPopupResult) { cleanup(); onResult(r); }
    function cleanup() {
      window.removeEventListener('message', onMessage);
      window.clearInterval(pollId);
      cleanupRef.current = null;
      setIsOpen(false);
    }

    window.addEventListener('message', onMessage);
    cleanupRef.current = cleanup;
  }, [expectedMessageType, width, height, windowName]);

  return { open, isOpen };
}
