import { useState, useEffect } from 'react';
import { getRecentSelfStudy } from '../api/home.api';
import { convertRecentSelfStudyToCard } from '../utils/home.utils';
import type { Card } from '../types';

/**
 * 최근 SelfStudy를 조회하는 hook
 */
export const useRecentSelfStudy = () => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecentSelfStudy = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRecentSelfStudy();
        
        if (response) {
          const convertedCard = convertRecentSelfStudyToCard(response);
          setCard(convertedCard);
        } else {
          setCard(null);
        }
      } catch (err) {
        console.error('Fetch recent self study error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch recent self study'));
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSelfStudy();
  }, []);

  return { card, loading, error };
};



