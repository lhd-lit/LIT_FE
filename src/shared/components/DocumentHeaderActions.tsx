import downloadIcon from "../assets/downloadIcon.svg";

type DocumentHeaderActionsProps = {
  onDownload?: () => void;
};

export function DocumentHeaderActions({ onDownload }: DocumentHeaderActionsProps) {
  return (
    <button
      onClick={onDownload}
      className="p-2 rounded-lg bg-background-light text-text-secondary hover:bg-background-hover hover:text-primary transition flex items-center justify-center gap-2 w-full"
      aria-label="Download PDF"
    >
      <img
        src={downloadIcon}
        alt="download icon"
        className="w-5 h-5"
        aria-hidden="true"
      />
      Download PDF
    </button>
  );
}

