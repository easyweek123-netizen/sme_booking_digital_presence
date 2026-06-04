import { useEffect } from 'react';

export function useOAuthPopupResponder(expectedMessageType: string): void {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (!status) return;
    if (!window.opener || window.opener === window) return;

    window.opener.postMessage(
      { type: expectedMessageType, status, reason: params.get('reason') ?? undefined },
      window.location.origin,
    );
    window.close();
  }, [expectedMessageType]);
}
