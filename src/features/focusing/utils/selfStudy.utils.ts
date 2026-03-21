import type { Card } from '../../../features/home/types';
import type { CardMetadata } from '../../../shared/components/StudyCard';
import type { SelfStudyResponse } from '../types';
import defaultThumbnail from '../../../mock/book1.jpg';

/**
 * SelfStudy 응답을 Card 타입으로 변환
 */
export const convertSelfStudyToCard = (
  item: SelfStudyResponse | null | undefined
): { card: Card; metadata?: CardMetadata } | null => {
  if (!item || item.selfStudyId == null) {
    return null;
  }

  // originalFileName이 이미지인지 확인
  const isImageFile = item.originalFileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.originalFileName);
  const thumbnail = isImageFile ? item.originalFileName : defaultThumbnail;

  return {
    card: {
      id: item.selfStudyId.toString(),
      title: item.title || '',
      author: item.writerName || '',
      thumbnail: thumbnail || "",
    },
    metadata: {},
  };
};

/**
 * SelfStudy 목록을 Card 목록으로 변환
 */
export const convertSelfStudyListToCards = (
  items: SelfStudyResponse[]
): Array<{ card: Card; metadata?: CardMetadata }> => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map(convertSelfStudyToCard)
    .filter((card): card is { card: Card; metadata?: CardMetadata } => card !== null);
};

