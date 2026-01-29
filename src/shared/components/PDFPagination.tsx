import previousArrowIcon from "../assets/previousArrowIcon.svg";
import nextArrowIcon from "../assets/nextArrowIcon.svg";
import previousDoubleArrowIcon from "../assets/previousDoubleArrowIcon.svg";
import nextDoubleArrowIcon from "../assets/nextDoubleArrowIcon.svg";

type PDFPaginationProps = {
  pageNumber: number;
  numPages: number | null;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
};

export function PDFPagination({
  pageNumber,
  numPages,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
}: PDFPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      <button
        onClick={onFirstPage}
        disabled={pageNumber <= 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-background-light hover:bg-background-card transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="First page"
      >
        <img src={previousDoubleArrowIcon} alt="" className="w-4 h-4" aria-hidden="true" />
      </button>
      <button
        onClick={onPrevPage}
        disabled={pageNumber <= 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-background-light hover:bg-background-card transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <img src={previousArrowIcon} alt="" className="w-4 h-4" aria-hidden="true" />
      </button>
      <span className="font-inter text-text-primary">
        {pageNumber} / {numPages || "..."}
      </span>
      <button
        onClick={onNextPage}
        disabled={!numPages || pageNumber >= numPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-background-light hover:bg-background-card transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <img src={nextArrowIcon} alt="" className="w-4 h-4" aria-hidden="true" />
      </button>
      <button
        onClick={onLastPage}
        disabled={!numPages || pageNumber >= numPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-background-light hover:bg-background-card transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Last page"
      >
        <img src={nextDoubleArrowIcon} alt="" className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}


