import type { DocumentCommentResponse } from '../api/documentComments.dto';
import type { GroupChatComment } from '../types';

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0]?.[0] || '?').toUpperCase();
}

function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function buildRootContent(row: DocumentCommentResponse): string {
  const hl = row.highlightedText?.trim() || '';
  const body = (row.content || '').trim();
  if (!hl) return body;
  if (hl === body) return body;
  if (body.startsWith(hl)) {
    const after = body.slice(hl.length).trim();
    if (!after) return body;
    return `「${hl}」\n${after}`;
  }
  return `「${hl}」\n${body}`;
}

export function mapReplyToGroupChat(row: DocumentCommentResponse): GroupChatComment {
  return {
    id: String(row.commentId),
    author: row.authorName || 'Unknown',
    authorInitials: toInitials(row.authorName || ''),
    content: row.content || '',
    timestamp: formatTimestamp(row.createdAt),
  };
}

export function mapRootToGroupChat(row: DocumentCommentResponse): GroupChatComment {
  return {
    id: String(row.commentId),
    author: row.authorName || 'Unknown',
    authorInitials: toInitials(row.authorName || ''),
    content: buildRootContent(row),
    timestamp: formatTimestamp(row.createdAt),
    replies: (row.replies || []).map(mapReplyToGroupChat),
  };
}

/**
 * PDF에서 선택 없이 일반 댓글만 쓸 때 백엔드 검증을 통과하기 위한 기본 하이라이트.
 * 이후 PDF Selection 연동 시 실제 값으로 대체하면 됩니다.
 */
export function buildSyntheticHighlightForQuickComment(content: string): {
  highlightedText: string;
  anchorOffset: number;
  focusOffset: number;
} {
  const trimmed = content.trim();
  const highlightedText =
    trimmed.length > 0 ? trimmed.slice(0, Math.min(trimmed.length, 200)) : '(comment)';
  const len = highlightedText.length;
  return {
    highlightedText,
    anchorOffset: 0,
    focusOffset: Math.max(len, 1),
  };
}
