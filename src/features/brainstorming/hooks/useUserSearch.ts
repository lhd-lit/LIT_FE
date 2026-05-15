import { useState, useEffect, useMemo } from 'react';
import { searchUsers } from '../api/users.api';
import type { UserSearchResponse } from '../api/users.api';

interface UseUserSearchReturn {
  users: UserSearchResponse[];
  loading: boolean;
  error: string | null;
}

/** 매 렌더 새 배열 참조가 들어와도 내용이 같으면 같은 키 → effect 무한 재실행 방지 */
function useStableExcludeIdsKey(excludeUserIds?: number[]): string {
  return useMemo(() => {
    if (!excludeUserIds?.length) return '';
    return [...excludeUserIds].sort((a, b) => a - b).join(',');
  }, [excludeUserIds]);
}

export const useUserSearch = (
  searchQuery: string,
  excludeUserIds?: number[]
): UseUserSearchReturn => {
  const [users, setUsers] = useState<UserSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const excludeIdsKey = useStableExcludeIdsKey(excludeUserIds);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const excludeForApi =
        excludeIdsKey === '' ? undefined : excludeIdsKey.split(',').map((s) => parseInt(s, 10));

      try {
        setLoading(true);
        setError(null);
        const list = await searchUsers(searchQuery);
        const excludeSet = new Set(
          excludeForApi?.filter((id) => !Number.isNaN(id)) ?? []
        );
        const filtered = list.filter(
          (u) => !u.alreadySelected && !excludeSet.has(u.userId)
        );
        setUsers(filtered);
      } catch {
        setUsers([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, excludeIdsKey]);

  return { users, loading, error };
};



