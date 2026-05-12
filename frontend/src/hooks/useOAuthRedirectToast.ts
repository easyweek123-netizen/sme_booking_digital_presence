import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { TOAST_DURATION } from '../constants';

interface Options {
  successTitle: string;
  errorTitle: string;
  /** Called once when status === 'success'. Use to refetch a query. */
  onSuccess?: () => void;
  /** Override the URL param names if needed. */
  paramName?: string;
  reasonParam?: string;
}

/**
 * Reads ?status=success|error from the URL after an OAuth redirect, fires a toast,
 * then strips the params. Idempotent — only fires once per landing.
 */
export function useOAuthRedirectToast({
  successTitle,
  errorTitle,
  onSuccess,
  paramName = 'status',
  reasonParam = 'reason',
}: Options): void {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get(paramName);
  const reason = searchParams.get(reasonParam);
  const toast = useToast();

  useEffect(() => {
    if (status !== 'success' && status !== 'error') return;

    if (status === 'success') {
      toast({
        title: successTitle,
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
        position: 'top',
      });
      onSuccess?.();
    } else {
      toast({
        title: errorTitle,
        description: reason ?? undefined,
        status: 'error',
        duration: TOAST_DURATION.LONG,
        position: 'top',
      });
    }

    const next = new URLSearchParams(searchParams);
    next.delete(paramName);
    next.delete(reasonParam);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
}
