import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getApiErrorMessage } from '../../../shared/utils/apiError';
import {
  createStudyGroupBookmark,
  deleteStudyGroupBookmark,
  getGroupBookmarkList,
} from '../api/groupBookmark.api';

type UseGroupBookmarksResult = {
  bookmarkedGroupIds: Set<string>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggle: (groupId: string) => Promise<void>;
  isToggling: (groupId: string) => boolean;
};

export function useGroupBookmarks(): UseGroupBookmarksResult {
  const [bookmarkedGroupIds, setBookmarkedGroupIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await getGroupBookmarkList(0, 100);
      const ids = new Set<string>();
      for (const item of page.content || []) {
        if (item?.studyGroupId != null) ids.add(String(item.studyGroupId));
      }
      if (!mountedRef.current) return;
      setBookmarkedGroupIds(ids);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(getApiErrorMessage(e, 'Failed to load group favorites.'));
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const isToggling = useCallback((groupId: string) => togglingIds.has(groupId), [togglingIds]);

  const toggle = useCallback(
    async (groupId: string) => {
      if (!groupId) return;
      if (togglingIds.has(groupId)) return;

      const numericId = Number(groupId);
      if (!Number.isFinite(numericId)) return;

      setError(null);
      setTogglingIds((prev) => new Set(prev).add(groupId));

      const wasBookmarked = bookmarkedGroupIds.has(groupId);
      // optimistic
      setBookmarkedGroupIds((prev) => {
        const next = new Set(prev);
        if (next.has(groupId)) next.delete(groupId);
        else next.add(groupId);
        return next;
      });

      try {
        if (wasBookmarked) await deleteStudyGroupBookmark(numericId);
        else await createStudyGroupBookmark(numericId);
      } catch (e) {
        // rollback
        setBookmarkedGroupIds((prev) => {
          const next = new Set(prev);
          if (wasBookmarked) next.add(groupId);
          else next.delete(groupId);
          return next;
        });
        setError(getApiErrorMessage(e, 'Failed to update group favorite.'));
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(groupId);
          return next;
        });
      }
    },
    [bookmarkedGroupIds, togglingIds]
  );

  return useMemo(
    () => ({
      bookmarkedGroupIds,
      loading,
      error,
      refetch,
      toggle,
      isToggling,
    }),
    [bookmarkedGroupIds, loading, error, refetch, toggle, isToggling]
  );
}

