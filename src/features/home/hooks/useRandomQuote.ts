import { useState, useEffect } from 'react';
import { getRandomQuote } from '../api/quotes.api';
import type { QuoteResponse } from '../api/quotes.dto';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export function useRandomQuote() {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const q = await getRandomQuote();
        if (!cancelled) setQuote(q);
      } catch (e) {
        if (!cancelled) {
          setError(getApiErrorMessage(e, '명언을 불러오지 못했습니다.'));
          setQuote(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { quote, loading, error };
}
