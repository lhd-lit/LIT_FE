import { useState, useEffect } from 'react';
import { getMySelfStudyList } from '../api/selfStudy.api';
import { convertSelfStudyListToCards } from '../utils/selfStudy.utils';
import type { Card } from '../../../features/home/types';
import type { CardMetadata } from '../../../shared/components/StudyCard';

interface UseSelfStudyListReturn {
  cards: Array<{ card: Card; metadata?: CardMetadata }>;
  loading: boolean;
  error: string | null;
}

export const useSelfStudyList = (): UseSelfStudyListReturn => {
  const [cards, setCards] = useState<Array<{ card: Card; metadata?: CardMetadata }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSelfStudyList = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMySelfStudyList(0, 100);

        if (!response || !Array.isArray(response.content)) {
          setError('목록 데이터 형식이 올바르지 않습니다.');
          setCards([]);
          return;
        }

        // null이나 undefined 항목 필터링
        const validContent = response.content.filter(
          (item) => item != null && item.selfStudyId != null
        );

        const convertedCards = convertSelfStudyListToCards(validContent);
        setCards(convertedCards);
      } catch (err: any) {
        const errorData = err?.response?.data;
        const message =
          errorData?.message || err?.message || '작품 목록을 불러오는데 실패했습니다.';
        setError(message);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSelfStudyList();
  }, []);

  return { cards, loading, error };
};

