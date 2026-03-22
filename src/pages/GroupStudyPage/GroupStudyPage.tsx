import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "../../shared/components/NavigationButtons";
import { DocumentHeaderActions } from "../../shared/components/DocumentHeaderActions";
import { SearchBar } from "../../shared/components/SearchBar";
import { PDFViewer } from "../../shared/components/PDFViewer";
import { PDFPagination } from "../../shared/components/PDFPagination";
import { ParticipantsList } from "../../features/brainstorming/components/ParticipantsList";
import { GroupChatSidebar } from "../../features/brainstorming/components/GroupChatSidebar";
import { useStudyGroup } from "../../features/brainstorming/hooks/useStudyGroup";
import { useGroupDocumentFile } from "../../features/brainstorming/hooks/useGroupDocumentFile";
import { useDocumentComments } from "../../features/brainstorming/hooks/useDocumentComments";
import { usePdfViewer } from "../../features/focusing/hooks/usePdfViewer";
import { downloadFile } from "../../shared/utils/file.utils";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import previousArrowIcon from "../../shared/assets/previousArrowIcon.svg";

export default function GroupStudyPage() {
  const { groupId, workId } = useParams<{ groupId: string; workId: string }>();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { group, works, loading: groupLoading, error: groupError } = useStudyGroup(groupId);
  const { fileUrl, loading: fileLoading, error: fileError } = useGroupDocumentFile(groupId, workId);
  const pdfViewer = usePdfViewer();
  
  const work = works.find((w) => w && w.id === workId);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    sending: commentsSending,
    sendRootComment,
    sendReply,
  } = useDocumentComments(groupId, workId);

  // 파일 URL이 변경되면 PDF 뷰어 리셋
  useEffect(() => {
    if (fileUrl) {
      pdfViewer.reset();
    }
  }, [fileUrl, pdfViewer.reset]);

  if (groupLoading) {
    return (
      <div className="p-8">
        <p className="text-center text-text-secondary">로딩 중...</p>
      </div>
    );
  }

  if (groupError || !group || !work || !work.id) {
    return (
      <div className="p-8">
        <p className="text-center text-red-600">{groupError || "그룹 또는 문서를 찾을 수 없습니다."}</p>
      </div>
    );
  }

  const handleDownload = () => {
    if (fileUrl && work.title) {
      downloadFile(fileUrl, `${work.title}.pdf`);
    }
  };

  const loading = fileLoading && !fileUrl;
  const error = fileError || pdfViewer.error;

  const handleSendComment = async (content: string) => {
    try {
      await sendRootComment(content);
    } catch (e) {
      alert(getApiErrorMessage(e, "댓글을 등록하지 못했습니다."));
      throw e;
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    try {
      await sendReply(commentId, content);
    } catch (e) {
      alert(getApiErrorMessage(e, "답글을 등록하지 못했습니다."));
      throw e;
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className={`flex-1 flex flex-col transition-all ${isChatOpen ? "pr-80" : ""}`}>
        <header className="h-16 w-full px-8 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <BackButton to={`/brainstorming/group/${groupId}`} />
            <div className="flex flex-col">
              <h1 className="heading-primary text-sm">{work?.title || '문서'}</h1>
              <h2 className="heading-primary text-lg">{work?.author || '작성자 없음'}</h2>
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
              {/* TODO: API 연동으로 참가자 목록 가져오기 */}
              <ParticipantsList participants={[]} activeCount={0} />
            </section>

            {loading ? (
              <div className="flex items-center justify-center h-[600px] text-text-secondary">
                <p>파일 로딩 중...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[600px] text-red-600">
                <p>{error}</p>
              </div>
            ) : fileUrl ? (
              <div className={`bg-white rounded-2xl shadow-sm p-6 mx-auto border border-border ${isChatOpen ? "max-w-5xl" : "max-w-6xl"}`}>
                <div className="flex flex-col items-center w-full">
                  <PDFViewer
                    file={fileUrl}
                    pageNumber={pdfViewer.pageNumber}
                    onDocumentLoadSuccess={pdfViewer.onDocumentLoadSuccess}
                    onDocumentLoadError={pdfViewer.onDocumentLoadError}
                  />

                  <div className="mt-6">
                    <PDFPagination
                      pageNumber={pdfViewer.pageNumber}
                      numPages={pdfViewer.numPages}
                      onFirstPage={pdfViewer.goToFirstPage}
                      onPrevPage={pdfViewer.goToPrevPage}
                      onNextPage={pdfViewer.goToNextPage}
                      onLastPage={pdfViewer.goToLastPage}
                    />
                  </div>
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
          sending={commentsSending}
          commentsLoading={commentsLoading}
          commentsError={commentsError}
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

