import { useState, useEffect, useCallback } from 'react';
import {
  getDocumentComments,
  createDocumentRootComment,
  createDocumentReply,
} from '../api/documentComments.api';
import {
  mapRootToGroupChat,
  buildSyntheticHighlightForQuickComment,
} from '../utils/documentComments.utils';
import { getApiErrorMessage } from '../../../shared/utils/apiError';
import type { GroupChatComment } from '../types';

export function useDocumentComments(
  groupId: string | undefined,
  groupDocumentId: string | undefined
) {
  const [comments, setComments] = useState<GroupChatComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!groupId || !groupDocumentId) {
      setComments([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await getDocumentComments(groupId, groupDocumentId);
      setComments(rows.map(mapRootToGroupChat));
    } catch (e) {
      setError(getApiErrorMessage(e, '댓글을 불러오지 못했습니다.'));
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [groupId, groupDocumentId]);

  useEffect(() => {
    void load();
  }, [load]);

  const sendRootComment = useCallback(
    async (content: string) => {
      if (!groupId || !groupDocumentId) return;
      const docId = Number(groupDocumentId);
      if (!Number.isFinite(docId)) {
        throw new Error('문서 ID가 올바르지 않습니다.');
      }
      const trimmed = content.trim();
      if (!trimmed) return;
      const { highlightedText, anchorOffset, focusOffset } =
        buildSyntheticHighlightForQuickComment(trimmed);
      setSending(true);
      try {
        await createDocumentRootComment(groupId, {
          groupDocumentId: docId,
          highlightedText,
          anchorOffset,
          focusOffset,
          content: trimmed,
        });
        await load();
      } finally {
        setSending(false);
      }
    },
    [groupId, groupDocumentId, load]
  );

  const sendReply = useCallback(
    async (parentCommentId: string, content: string) => {
      if (!groupId || !groupDocumentId) return;
      const docId = Number(groupDocumentId);
      const parentId = Number(parentCommentId);
      if (!Number.isFinite(docId) || !Number.isFinite(parentId)) {
        throw new Error('댓글 정보가 올바르지 않습니다.');
      }
      const trimmed = content.trim();
      if (!trimmed) return;
      setSending(true);
      try {
        await createDocumentReply(groupId, {
          groupDocumentId: docId,
          parentCommentId: parentId,
          content: trimmed,
        });
        await load();
      } finally {
        setSending(false);
      }
    },
    [groupId, groupDocumentId, load]
  );

  return {
    comments,
    loading,
    error,
    sending,
    refetch: load,
    sendRootComment,
    sendReply,
  };
}
