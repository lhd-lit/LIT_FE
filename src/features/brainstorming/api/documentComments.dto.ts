/** DocumentCommentController 계약 */

export interface DocumentCommentResponse {
  commentId: number;
  groupDocumentId: number;
  authorId: number;
  authorName: string;
  highlightedText: string | null;
  anchorOffset: number | null;
  focusOffset: number | null;
  content: string;
  parentCommentId: number | null;
  replies: DocumentCommentResponse[];
  createdAt: string;
}

export interface CreateRootCommentRequest {
  groupDocumentId: number;
  highlightedText: string;
  anchorOffset: number;
  focusOffset: number;
  content: string;
}

export interface CreateReplyRequest {
  groupDocumentId: number;
  parentCommentId: number;
  content: string;
}
