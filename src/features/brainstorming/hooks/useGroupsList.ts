import { useState, useEffect, useCallback } from 'react';
import { getMyGroups } from '../api/groups.api';
import { convertGroupListToGroups } from '../utils/groups.utils';
import type { StudyGroup } from '../types';

interface UseGroupsListReturn {
  groups: StudyGroup[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGroupsList = (): UseGroupsListReturn => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0);

  const refetch = useCallback(() => {
    setTriggerRefetch((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyGroups(0, 100);

        if (!response || !Array.isArray(response.content)) {
          setError('목록 데이터 형식이 올바르지 않습니다.');
          setGroups([]);
          return;
        }

        // null이나 undefined 항목 필터링
        const validContent = response.content.filter(
          (item) => item != null && item.studyGroupId != null
        );

        const convertedGroups = convertGroupListToGroups(validContent);
        setGroups(convertedGroups);
      } catch (err: any) {
        const errorData = err?.response?.data;
        const message =
          errorData?.message || err?.message || '그룹 목록을 불러오는데 실패했습니다.';
        setError(message);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [triggerRefetch]);

  return { groups, loading, error, refetch };
};



