import { pdfjs } from "react-pdf";

// PDF.js worker 설정 (이미 PDFViewer에서 설정되어 있지만, 유틸리티에서도 필요할 수 있음)
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
}

/**
 * PDF 파일의 첫 페이지를 썸네일 이미지로 변환
 * @param pdfUrl PDF 파일 URL
 * @param maxWidth 썸네일 최대 너비 (기본값: 400)
 * @param maxHeight 썸네일 최대 높이 (기본값: 600)
 * @returns 썸네일 이미지의 data URL 또는 null (실패 시)
 */
export async function generatePdfThumbnail(
  pdfUrl: string,
  maxWidth: number = 400,
  maxHeight: number = 600
): Promise<string | null> {
  try {
    // PDF 문서 로드
    const loadingTask = pdfjs.getDocument({ url: pdfUrl });
    const pdf = await loadingTask.promise;

    // 첫 페이지 가져오기
    const page = await pdf.getPage(1);

    // 뷰포트 계산 (비율 유지하면서 최대 크기 제한)
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(
      maxWidth / viewport.width,
      maxHeight / viewport.height,
      1 // 원본보다 크게 만들지 않음
    );
    const scaledViewport = page.getViewport({ scale });

    // 캔버스 생성
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) {
      return null;
    }

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // PDF 페이지를 캔버스에 렌더링
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };

    await page.render(renderContext as any).promise;

    // 캔버스를 이미지 데이터 URL로 변환
    return canvas.toDataURL("image/jpeg", 0.8); // JPEG 품질 80%
  } catch (error) {
    console.error("PDF 썸네일 생성 실패:", error);
    return null;
  }
}

