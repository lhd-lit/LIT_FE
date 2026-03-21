import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "../../shared/components/NavigationButtons";
import { DocumentHeaderActions } from "../../shared/components/DocumentHeaderActions";
import { SearchBar } from "../../shared/components/SearchBar";
import { PDFViewer } from "../../shared/components/PDFViewer";
import { PDFPagination } from "../../shared/components/PDFPagination";
import { AILearningAssistant } from "../../features/focusing/components/AILearningAssistant";
import { useSelfStudyFile } from "../../features/focusing/hooks/useSelfStudyFile";
import { usePdfViewer } from "../../features/focusing/hooks/usePdfViewer";
import { downloadFile } from "../../shared/utils/file.utils";
import previousArrowIcon from "../../shared/assets/previousArrowIcon.svg";

export default function StudyPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { fileUrl, loading: fileLoading, error: fileError } = useSelfStudyFile(documentId);
  const pdfViewer = usePdfViewer();

  // 파일 URL이 변경되면 PDF 뷰어 리셋
  useEffect(() => {
    if (fileUrl) {
      pdfViewer.reset();
    }
  }, [fileUrl, pdfViewer.reset]);

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    // TODO: Implement AI message handling
  };

  const handleDownload = () => {
    if (fileUrl) {
      downloadFile(fileUrl, "document.pdf");
    }
  };

  const loading = fileLoading && !fileUrl;
  const error = fileError || pdfViewer.error;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className={`flex-1 flex flex-col transition-all ${isAssistantOpen ? "pr-80" : ""}`}>
        <header className="h-16 w-full px-8 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <BackButton to="/focusing" />
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
            {loading ? (
              <div className="flex items-center justify-center h-[calc(100vh-12rem)] min-h-[800px]">
                <p className="text-text-secondary">파일 로딩 중...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[calc(100vh-12rem)] min-h-[800px]">
                <p className="text-red-600">{error}</p>
              </div>
            ) : fileUrl ? (
              <div className="flex flex-col items-center">
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
            ) : null}
          </div>
        </main>
      </div>

      {isAssistantOpen ? (
        <AILearningAssistant
          messages={[]}
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
