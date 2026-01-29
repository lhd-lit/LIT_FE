import { useState } from "react";
import searchIcon from "../../../shared/assets/searchIcon.svg";

type Comment = {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
};

type GroupChatSidebarProps = {
  comments: Comment[];
  onSendComment?: (content: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onClose?: () => void;
};

export function GroupChatSidebar({
  comments,
  onSendComment,
  onReply,
  onClose,
}: GroupChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const filteredComments = comments.filter(
    (comment) =>
      !searchQuery ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onSendComment) {
      onSendComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (replyContent.trim() && onReply) {
      onReply(commentId, replyContent.trim());
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-border flex flex-col h-full absolute right-0 top-0 bottom-0 z-40 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
        <h2 className="heading-primary text-base">Comments</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-text-secondary hover:text-text-primary"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-white">
          <img src={searchIcon} alt="search" className="w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Q Search comments..."
            className="flex-1 font-inter text-sm text-text-tertiary placeholder-text-tertiary outline-none bg-transparent"
          />
        </div>

        <div className="space-y-4">
          {filteredComments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-inter flex items-center justify-center flex-shrink-0">
                {comment.authorInitials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-inter font-medium text-text-primary">{comment.author}</span>
                  <span className="text-xs font-inter text-text-tertiary">{comment.timestamp}</span>
                </div>
                <p className="text-sm font-inter text-text-primary leading-relaxed">{comment.content}</p>
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="mt-2 text-xs font-inter text-text-secondary hover:text-primary transition"
                >
                  ← Reply
                </button>
                {replyingTo === comment.id && (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm font-inter text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary bg-white resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-inter hover:bg-primary/90 transition"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-background-light text-text-secondary text-xs font-inter hover:bg-background-hover transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-11 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/70 text-white text-xs font-inter flex items-center justify-center flex-shrink-0">
                      {reply.authorInitials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-inter font-medium text-text-primary">{reply.author}</span>
                        <span className="text-xs font-inter text-text-tertiary">{reply.timestamp}</span>
                      </div>
                      <p className="text-xs font-inter text-text-primary leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm font-inter text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary bg-white resize-none"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-inter hover:bg-primary/90 transition"
          >
            Send Comment
          </button>
        </form>
      </div>
    </aside>
  );
}

