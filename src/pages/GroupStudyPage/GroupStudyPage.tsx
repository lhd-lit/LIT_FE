import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "../../shared/components/NavigationButtons";
import { DocumentHeaderActions } from "../../shared/components/DocumentHeaderActions";
import { SearchBar } from "../../shared/components/SearchBar";
import { PDFViewer } from "../../shared/components/PDFViewer";
import { PDFPagination } from "../../shared/components/PDFPagination";
import { ParticipantsList } from "../../features/brainstorming/components/ParticipantsList";
import { GroupChatSidebar } from "../../features/brainstorming/components/GroupChatSidebar";
import { MOCK_STUDY_GROUPS } from "../../mock/brainstorming/mockData";
import { MOCK_GROUP_WORKS } from "../../mock/brainstorming/groupWorksMockData";
import {
  MOCK_GROUP_PARTICIPANTS,
  MOCK_GROUP_COMMENTS,
  type Comment,
} from "../../mock/brainstorming/groupChatMockData";
import previousArrowIcon from "../../shared/assets/previousArrowIcon.svg";

export default function GroupStudyPage() {
  const { groupId, workId } = useParams<{ groupId: string; workId: string }>();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(MOCK_GROUP_COMMENTS);

  const group = MOCK_STUDY_GROUPS.find((g) => g.id === groupId);
  const works = groupId ? MOCK_GROUP_WORKS[groupId] || [] : [];
  const work = works.find((w) => w.id === workId);

  if (!group || !work) {
    return (
      <div className="p-8">
        <p>Group or work not found</p>
      </div>
    );
  }

  useEffect(() => {
    setPageNumber(1);
    setNumPages(null);
    setLoading(true);
    setError(null);
  }, [workId]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(error.message);
    setLoading(false);
  };


  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => (numPages ? Math.min(numPages, prev + 1) : prev));
  };

  const goToFirstPage = () => {
    setPageNumber(1);
  };

  const goToLastPage = () => {
    if (!numPages) return;
    setPageNumber(numPages);
  };

  const handleDownload = () => {
    if (!work.pdfPath) return;
    const a = window.document.createElement("a");
    a.href = work.pdfPath;
    a.download = `${work.title}.pdf`;
    a.rel = "noreferrer";
    a.click();
  };

  const handleSendComment = (content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: "You",
      authorInitials: "YO",
      content,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    setComments([...comments, newComment]);
  };

  const handleReply = (commentId: string, content: string) => {
    const newReply: Comment = {
      id: `r${Date.now()}`,
      author: "You",
      authorInitials: "YO",
      content,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    );
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className={`flex-1 flex flex-col transition-all ${isChatOpen ? "pr-80" : ""}`}>
        <header className="h-16 w-full px-8 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <BackButton to={`/brainstorming/group/${groupId}`} />
            <div className="flex flex-col">
              <h1 className="heading-primary text-sm">{work.title}</h1>
              <h2 className="heading-primary text-lg">{work.author}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar placeholder="학습내용 검색..." value={searchQuery} onChange={setSearchQuery} />
            <DocumentHeaderActions onDownload={handleDownload} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background px-8 py-6">
          <div className="w-full space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-border-light px-6 py-5">
              <h2 className="heading-primary text-lg mb-2">Collaborative Study Room</h2>
              <p className="text-sm font-inter text-text-secondary mb-4">
                Upload documents, annotate texts, and discuss with your study group in real-time.
              </p>
              <ParticipantsList participants={MOCK_GROUP_PARTICIPANTS} activeCount={3} />
            </section>

            {work.pdfPath ? (
              <div className={`bg-white rounded-2xl shadow-sm p-6 mx-auto border border-border ${isChatOpen ? "max-w-5xl" : "max-w-6xl"}`}>
                <div className="flex flex-col items-center w-full">
                  <PDFViewer
                    file={work.pdfPath}
                    pageNumber={pageNumber}
                    onDocumentLoadSuccess={onDocumentLoadSuccess}
                    onDocumentLoadError={onDocumentLoadError}
                  />

                  {error && (
                    <div className="mt-4 text-sm text-red-600">
                      <p>PDF 로딩 오류: {error}</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <PDFPagination
                      pageNumber={pageNumber}
                      numPages={numPages}
                      onFirstPage={goToFirstPage}
                      onPrevPage={goToPrevPage}
                      onNextPage={goToNextPage}
                      onLastPage={goToLastPage}
                    />
                  </div>

                  {loading && (
                    <div className="mt-3 text-xs text-text-secondary">
                      <p>PDF 로딩 중...</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-text-secondary">
                <p>PDF 파일이 없습니다.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isChatOpen ? (
        <GroupChatSidebar
          comments={comments}
          onSendComment={handleSendComment}
          onReply={handleReply}
          onClose={() => setIsChatOpen(false)}
        />
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          className="absolute top-1/2 -translate-y-1/2 z-50 h-20 w-5 px-0.5 rounded-r-none rounded-l-sm border border-r-0 border-border bg-white/95 hover:bg-background-light shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center"
          style={{ right: "0" }}
          title="Expand sidebar"
          aria-label="Open Chat"
        >
          <img src={previousArrowIcon} alt="" className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

