import type { StudyGroup } from '../types';
import type { StudyGroupResponse } from '../api/groups.dto';

/**
 * StudyGroupResponse를 StudyGroup 타입으로 변환
 */
export const convertGroupResponseToGroup = (response: StudyGroupResponse | null | undefined): StudyGroup | null => {
  if (!response || response.studyGroupId == null) {
    return null;
  }

  // lastViewedAt을 "updatedAgo" 형식으로 변환 (간단히 처리)
  const updatedAgo = response.lastViewedAt 
    ? new Date(response.lastViewedAt).toLocaleDateString()
    : 'Recently';

  return {
    id: response.studyGroupId.toString(),
    title: response.name || '',
    description: response.description || '',
    members: response.memberCount || 0,
    works: 0, // API 응답에 works 정보가 없으므로 기본값
    updatedAgo,
    owner: response.ownerName || '',
    participants: [], // API 응답에 participants 정보가 없으므로 빈 배열
  };
};

/**
 * StudyGroupResponse 목록을 StudyGroup 목록으로 변환
 */
export const convertGroupListToGroups = (responses: StudyGroupResponse[]): StudyGroup[] => {
  if (!Array.isArray(responses)) {
    return [];
  }
  
  return responses
    .map(convertGroupResponseToGroup)
    .filter((group): group is StudyGroup => group !== null);
};



