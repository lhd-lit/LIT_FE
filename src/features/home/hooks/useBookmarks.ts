import { useState, useEffect } from 'react';
import { getBookmarks } from '../api/home.api';
import { convertBookmarksToCards } from '../utils/home.utils';
import type { Card, BrainStormingCard } from '../types';

/**
 * 북마크 목록을 조회하는 hook
 */
export const useBookmarks = () => {
  const [cards, setCards] = useState<Array<Card | BrainStormingCard>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBookmarks();
        
        if (response && Array.isArray(response.content)) {
          const convertedCards = convertBookmarksToCards(response.content);
          setCards(convertedCards);
        } else {
          setCards([]);
        }
      } catch (err) {
        console.error('Fetch bookmarks error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch bookmarks'));
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return { cards, loading, error };
};

/**
 * Focusing용 북마크만 조회하는 hook
 */
export const useFocusingBookmarks = () => {
  const { cards, loading, error } = useBookmarks();
  const focusingBookmarks = cards.filter(
    (card): card is Card => card && 'members' in card === false
  ) as Card[];
  
  return { cards: focusingBookmarks, loading, error };
};

/**
 * BrainStorming용 북마크만 조회하는 hook
 */
export const useBrainstormingBookmarks = () => {
  const { cards, loading, error } = useBookmarks();
  const brainstormingBookmarks = cards.filter(
    (card): card is BrainStormingCard => card && 'members' in card === true
  ) as BrainStormingCard[];
  
  return { cards: brainstormingBookmarks, loading, error };
};

