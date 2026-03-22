import type { GroupWork } from '../types';
import type { GroupDocumentResponse } from '../api/groups.dto';

/**
 * GroupDocumentResponse를 GroupWork 타입으로 변환
 */
export const convertDocumentToWork = (document: GroupDocumentResponse | null | undefined): GroupWork | null => {
  if (!document || document.groupDocumentId == null) {
    return null;
  }

  return {
    id: document.groupDocumentId.toString(),
    title: document.title || '',
    author: document.uploaderName || '',
    description: document.description || '',
    members: 0, // 기본값 (API 응답에 없음)
    comments: 0, // 기본값 (API 응답에 없음)
    isPinned: false, // 기본값 (API 응답에 없음)
  };
};

/**
 * GroupDocumentResponse 목록을 GroupWork 목록으로 변환
 */
export const convertDocumentsToWorks = (documents: GroupDocumentResponse[]): GroupWork[] => {
  if (!Array.isArray(documents)) {
    return [];
  }

  return documents
    .map(convertDocumentToWork)
    .filter((work): work is GroupWork => work !== null);
};

