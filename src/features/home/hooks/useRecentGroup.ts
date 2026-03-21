import { useState, useEffect } from 'react';
import { getRecentGroup } from '../api/home.api';
import { convertRecentGroupToCard } from '../utils/home.utils';
import type { BrainStormingCard } from '../types';

/**
 * 최근 Group을 조회하는 hook
 */
export const useRecentGroup = () => {
  const [card, setCard] = useState<BrainStormingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecentGroup = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRecentGroup();
        
        if (response) {
          const convertedCard = convertRecentGroupToCard(response);
          setCard(convertedCard);
        } else {
          setCard(null);
        }
      } catch (err) {
        console.error('Fetch recent group error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch recent group'));
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentGroup();
  }, []);

  return { card, loading, error };
};



