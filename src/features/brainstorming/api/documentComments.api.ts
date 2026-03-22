import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type {
  CreateReplyRequest,
  CreateRootCommentRequest,
  DocumentCommentResponse,
} from './documentComments.dto';

export type {
  CreateReplyRequest,
  CreateRootCommentRequest,
  DocumentCommentResponse,
} from './documentComments.dto';

/**
 * GET /api/groups/{groupId}/documents/{groupDocumentId}/comments
 */
export async function getDocumentComments(
  groupId: string | number,
  groupDocumentId: string | number
): Promise<DocumentCommentResponse[]> {
  const response = await apiClient.get<GlobalResponse<DocumentCommentResponse[]>>(
    `/api/groups/${groupId}/documents/${groupDocumentId}/comments`
  );
  const result = response.data.result;
  return Array.isArray(result) ? result : [];
}

/**
 * POST /api/groups/{groupId}/documents/comments — 루트 댓글(하이라이트 기반)
 */
export async function createDocumentRootComment(
  groupId: string | number,
  body: CreateRootCommentRequest
): Promise<DocumentCommentResponse> {
  const response = await apiClient.post<GlobalResponse<DocumentCommentResponse>>(
    `/api/groups/${groupId}/documents/comments`,
    body
  );
  return response.data.result;
}

/**
 * POST /api/groups/{groupId}/documents/comments/reply
 */
export async function createDocumentReply(
  groupId: string | number,
  body: CreateReplyRequest
): Promise<DocumentCommentResponse> {
  const response = await apiClient.post<GlobalResponse<DocumentCommentResponse>>(
    `/api/groups/${groupId}/documents/comments/reply`,
    body
  );
  return response.data.result;
}
