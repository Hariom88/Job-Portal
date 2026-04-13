import { useState, useCallback } from 'react';

/**
 * Simple toast hook. Returns an array of toasts and helpers.
 * Usage:  const { toasts, showToast } = useToast();
 *         showToast('Saved!', 'success');
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return { toasts, showToast };
}

/**
 * Async-request helper hook.
 * Returns { loading, error, run }.
 * Usage:  const { loading, run } = useAsync();
 *         await run(() => jobService.post(data));
 */
export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const run = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const msg = err?.response?.data || err?.message || 'Something went wrong';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, run };
}
