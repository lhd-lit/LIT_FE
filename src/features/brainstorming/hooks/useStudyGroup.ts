import { useState, useEffect, useCallback } from 'react';
import { getGroupDocuments } from '../api/groups.api';
import { getMyGroups } from '../api/groups.api';
import { convertGroupResponseToGroup } from '../utils/groups.utils';
import { convertDocumentsToWorks } from '../utils/documents.utils';
import type { StudyGroup } from '../types';
import type { GroupWork } from '../types';

interface UseStudyGroupReturn {
  group: StudyGroup | null;
  works: GroupWork[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudyGroup = (groupId: string | undefined): UseStudyGroupReturn => {
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [works, setWorks] = useState<GroupWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0);

  const refetch = useCallback(() => {
    setTriggerRefetch((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    const fetchGroupData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 그룹 목록에서 해당 그룹 찾기 (GET /api/groups/{groupId}가 주석 처리되어 있음)
        const groupsResponse = await getMyGroups(0, 100);
        const foundGroup = groupsResponse.content.find(
          (g) => g.studyGroupId.toString() === groupId
        );

        if (!foundGroup) {
          setError('그룹을 찾을 수 없습니다.');
          setGroup(null);
          setWorks([]);
          setLoading(false);
          return;
        }

        const convertedGroup = convertGroupResponseToGroup(foundGroup);

        // 문서 목록 가져오기
        const documentsResponse = await getGroupDocuments(groupId, 0, 100);
        
        // null이나 undefined 항목 필터링
        const validDocuments = (documentsResponse.content || []).filter(
          (doc) => doc != null && doc.groupDocumentId != null
        );
        
        const convertedWorks = convertDocumentsToWorks(validDocuments);

        if (!convertedGroup) {
          setError('그룹 정보를 변환할 수 없습니다.');
          setGroup(null);
          setWorks([]);
          setLoading(false);
          return;
        }

        setGroup(convertedGroup);
        setWorks(convertedWorks);
      } catch (err: any) {
        const errorData = err?.response?.data;
        const message =
          errorData?.message || err?.message || '그룹 정보를 불러오는데 실패했습니다.';
        setError(message);
        setGroup(null);
        setWorks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, triggerRefetch]);

  return { group, works, loading, error, refetch };
};
