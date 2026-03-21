import type { Card, BrainStormingCard } from '../types';
import type { BookmarkResponse } from '../api/home.api';
import type { SelfStudyResponse } from '../../focusing/types';
import type { StudyGroupResponse } from '../../brainstorming/api/groups.api';
import defaultThumbnail from '../../../mock/book1.jpg';

/**
 * 북마크 응답을 Card 타입으로 변환
 */
export const convertBookmarkToCard = (
  bookmark: BookmarkResponse | null | undefined
): Card | BrainStormingCard | null => {
  if (!bookmark) {
    return null;
  }

  if (bookmark.type === 'SELF_STUDY' && bookmark.selfStudyId != null) {
    // SelfStudy 북마크
    const isImageFile = bookmark.originalFileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(bookmark.originalFileName);
    const thumbnail = isImageFile ? bookmark.originalFileName : defaultThumbnail;

    return {
      id: bookmark.selfStudyId.toString(),
      title: bookmark.title || '',
      author: bookmark.writerName || '',
      thumbnail: thumbnail || '',
    };
  } else if (bookmark.type === 'GROUP' && bookmark.studyGroupId != null) {
    // Group 북마크
    return {
      id: bookmark.studyGroupId.toString(),
      title: bookmark.title || '',
      author: bookmark.ownerName || '',
      thumbnail: defaultThumbnail,
      members: bookmark.memberCount || 0,
      comments: 0, // 북마크 응답에 comments 정보가 없으므로 기본값
    } as BrainStormingCard;
  }

  return null;
};

/**
 * 북마크 목록을 Card 목록으로 변환
 */
export const convertBookmarksToCards = (
  bookmarks: BookmarkResponse[]
): Array<Card | BrainStormingCard> => {
  if (!Array.isArray(bookmarks)) {
    return [];
  }

  return bookmarks
    .map(convertBookmarkToCard)
    .filter((card): card is Card | BrainStormingCard => card !== null);
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



