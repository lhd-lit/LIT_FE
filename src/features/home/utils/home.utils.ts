import type { Card, BrainStormingCard } from '../types';
import type { BookmarkListItem } from '../../focusing/api/bookmark.dto';
import type { SelfStudyResponse } from '../../focusing/types';
import type { StudyGroupResponse } from '../../brainstorming/api/groups.dto';
import defaultThumbnail from '../../../mock/book1.jpg';

/**
 * GET /api/bookmark 항목(GetBookmarkListResponse) → Focusing 카드
 */
export const selfStudyBookmarkToCard = (item: BookmarkListItem | null | undefined): Card | null => {
  if (!item || item.selfStudyId == null) {
    return null;
  }

  return {
    id: item.selfStudyId.toString(),
    title: item.selfStudyTitle || '',
    author: '',
    thumbnail: defaultThumbnail,
  };
};

/**
 * SelfStudy 즐겨찾기 목록을 Card 목록으로 변환
 */
export const convertBookmarksToCards = (
  items: BookmarkListItem[]
): Card[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map(selfStudyBookmarkToCard)
    .filter((card): card is Card => card !== null);
};

/**
 * 최근 SelfStudy 응답을 Card 타입으로 변환
 */
export const convertRecentSelfStudyToCard = (
  selfStudy: SelfStudyResponse | null | undefined
): Card | null => {
  if (!selfStudy || selfStudy.selfStudyId == null) {
    return null;
  }

  // originalFileName은 URL이 아니므로 썸네일에는 기본 이미지 사용
  return {
    id: selfStudy.selfStudyId.toString(),
    title: selfStudy.title || '',
    author: selfStudy.writerName || '',
    thumbnail: defaultThumbnail,
    lastViewedAt: selfStudy.lastViewedAt ?? null,
  };
};

/**
 * 최근 Group 응답을 Card 타입으로 변환
 */
export const convertRecentGroupToCard = (
  group: StudyGroupResponse | null | undefined
): BrainStormingCard | null => {
  if (!group || group.studyGroupId == null) {
    return null;
  }

  return {
    id: group.studyGroupId.toString(),
    title: group.name || '',
    author: group.ownerName || '',
    thumbnail: defaultThumbnail,
    members: group.memberCount || 0,
    comments: 0, // 최근 그룹 응답에 comments 정보가 없으므로 기본값
  } as BrainStormingCard;
};



