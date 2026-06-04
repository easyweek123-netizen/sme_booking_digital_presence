import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useDelayedNavigate(to: string | null, delayMs: number): void {
  const navigate = useNavigate();
  useEffect(() => {
    if (!to) return;
    const id = window.setTimeout(() => navigate(to, { replace: true }), delayMs);
    return () => window.clearTimeout(id);
  }, [to, delayMs, navigate]);
}
