import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PDFViewerProps = {
  file: string;
  pageNumber: number;
  onPageLoad?: (page: any) => void;
  onDocumentLoadSuccess?: (info: { numPages: number }) => void;
  onDocumentLoadError?: (error: Error) => void;
  className?: string;
};

export function PDFViewer({
  file,
  pageNumber,
  onPageLoad,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  className = "",
}: PDFViewerProps) {
  const pageWrapRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(900);

  useEffect(() => {
    const el = pageWrapRef.current;
    if (!el) return;

    const update = () => {
      const containerWidth = el.getBoundingClientRect().width;
      const containerHeight = window.innerHeight - 200; // 헤더와 여백 고려
      const maxWidth = Math.max(320, Math.floor(containerWidth));
      const maxHeight = Math.max(400, Math.floor(containerHeight));
      
      // 가로로 긴 PDF의 경우 높이를 기준으로 너비 계산
      // 세로로 긴 PDF의 경우 너비를 기준으로 사용
      // 일단 너비를 기준으로 하고, 페이지 로드 후 높이를 확인하여 조정
      setPageWidth(maxWidth);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const handlePageLoad = (page: any) => {
    const el = pageWrapRef.current;
    if (!el) return;

    try {
      const viewport = page.getViewport({ scale: 1 });
      const containerWidth = el.getBoundingClientRect().width;
      const containerHeight = window.innerHeight - 200; // 헤더와 여백 고려
      
      // 가로로 긴 PDF (landscape) - 높이를 기준으로 조정
      if (viewport.width > viewport.height) {
        const scaleByHeight = containerHeight / viewport.height;
        const calculatedWidth = viewport.width * scaleByHeight;
        
        // 컨테이너 너비를 초과하지 않도록 조정
        if (calculatedWidth > containerWidth) {
          const scaleByWidth = containerWidth / viewport.width;
          setPageWidth(Math.floor(viewport.width * scaleByWidth));
        } else {
          setPageWidth(Math.floor(calculatedWidth));
        }
      } else {
        // 세로로 긴 PDF (portrait) - 너비를 기준으로 조정
        const maxWidth = Math.max(320, Math.floor(containerWidth));
        setPageWidth(maxWidth);
      }
    } catch {
      // ignore
    }
    
    onPageLoad?.(page);
  };

  return (
    <div ref={pageWrapRef} className={`w-full flex justify-center ${className}`}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex items-center justify-center h-[600px] text-text-secondary">
            <p>PDF 로딩 중...</p>
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          width={pageWidth}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="shadow-sm"
          onLoadSuccess={handlePageLoad}
        />
      </Document>
    </div>
  );
}

