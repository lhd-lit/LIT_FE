import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "../../shared/components/NavigationButtons";
import { DocumentHeaderActions } from "../../shared/components/DocumentHeaderActions";
import { SearchBar } from "../../shared/components/SearchBar";
import { PDFViewer } from "../../shared/components/PDFViewer";
import { PDFPagination } from "../../shared/components/PDFPagination";
import { AILearningAssistant } from "../../features/focusing/components/AILearningAssistant";
import { MOCK_FOCUSING_CARDS } from "../../mock/focusing/mockData";
import { MOCK_MESSAGES } from "../../mock/focusing/aiAssistantMockData";
import previousArrowIcon from "../../shared/assets/previousArrowIcon.svg";

export default function StudyPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentData = MOCK_FOCUSING_CARDS.find(({ card }) => card.id === documentId);
  const docCard = documentData?.card;
  const pdfPath = documentData?.pdfPath;

  if (!docCard) {
    return (
      <div className="p-8">
        <p>Document not found</p>
      </div>
    );
  }

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    // TODO: Implement AI message handling
  };

  useEffect(() => {
    // 문서가 바뀌면 페이지/상태 초기화
    setPageNumber(1);
    setNumPages(null);
    setLoading(true);
    setError(null);
  }, [pdfPath, documentId]);

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
    if (!pdfPath) return;
    const a = window.document.createElement("a");
    a.href = pdfPath;
    a.download = `${docCard.title}.pdf`;
    a.rel = "noreferrer";
    a.click();
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className={`flex-1 flex flex-col transition-all ${isAssistantOpen ? "pr-80" : ""}`}>
        <header className="h-16 w-full px-8 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <BackButton to="/focusing" />
            <div className="flex flex-col">
              <h1 className="heading-primary text-sm">{docCard.title}</h1>
              <h2 className="heading-primary text-lg">{docCard.author}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar
              placeholder="학습내용 검색..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <DocumentHeaderActions onDownload={handleDownload} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background px-8 py-6">
          <div className="mx-auto bg-white rounded-2xl shadow-sm max-w-4xl p-8 border border-border">
            {pdfPath ? (
              <div className="flex flex-col items-center">
                <PDFViewer
                  file={pdfPath}
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
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-12rem)] min-h-[800px] text-text-secondary">
                <p>PDF 파일이 없습니다.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isAssistantOpen ? (
        <AILearningAssistant
          messages={MOCK_MESSAGES}
          onSendMessage={handleSendMessage}
          onClose={() => setIsAssistantOpen(false)}
        />
      ) : (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="absolute top-1/2 -translate-y-1/2 z-50 h-20 w-5 px-0.5 rounded-r-none rounded-l-sm border border-r-0 border-border bg-white/95 hover:bg-background-light shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center"
          style={{ right: "0" }}
          title="Expand sidebar"
          aria-label="Open AI Assistant"
        >
          <img src={previousArrowIcon} alt="" className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

