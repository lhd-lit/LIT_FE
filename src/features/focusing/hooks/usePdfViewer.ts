import { useState, useCallback } from 'react';

interface UsePdfViewerReturn {
  pageNumber: number;
  numPages: number | null;
  loading: boolean;
  error: string | null;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  onDocumentLoadSuccess: (data: { numPages: number }) => void;
  onDocumentLoadError: (error: Error) => void;
  reset: () => void;
}

export const usePdfViewer = (): UsePdfViewerReturn => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const goToPrevPage = useCallback(() => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((prev) => (numPages ? Math.min(numPages, prev + 1) : prev));
  }, [numPages]);

  const goToFirstPage = useCallback(() => {
    setPageNumber(1);
  }, []);

  const goToLastPage = useCallback(() => {
    if (numPages) setPageNumber(numPages);
  }, [numPages]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setError(error.message);
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setPageNumber(1);
    setNumPages(null);
    setLoading(true);
    setError(null);
  }, []);

  return {
    pageNumber,
    numPages,
    loading,
    error,
    goToPrevPage,
    goToNextPage,
    goToFirstPage,
    goToLastPage,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    reset,
  };
};

