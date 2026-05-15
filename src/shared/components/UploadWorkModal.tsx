import { useRef, useState, type DragEvent, type FormEvent } from "react";
import UploadIcon from "../assets/uploadIcon.svg"

type UploadWorkModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    title: string;
    description: string;
    file: File | null;
  }) => void;
  heading?: string;
  subheading?: string;
  uploadLabel?: string;
  accept?: string;
  maxSizeText?: string;
};

export function UploadWorkModal({
  open,
  onClose,
  onSubmit,
  heading = "Upload Study",
  subheading = "Add a new document, PDF, or article to this study group",
  uploadLabel = "Upload Work",
  accept = "application/pdf,.doc,.docx",
  maxSizeText = "PDF, DOC, DOCX up to 50MB",
}: UploadWorkModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError('제목을 입력해주세요.');
      return;
    }
    const file = fileInputRef.current?.files?.[0] ?? null;
    if (!file) {
      setFormError('파일을 선택해주세요.');
      return;
    }
    onSubmit?.({ title: trimmedTitle, description, file });
    onClose();
  };

  const handleFileChange = (file: File | null) => {
    setFileName(file?.name ?? null);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) {
      handleFileChange(file);
      if (fileInputRef.current) {
        // Keep input in sync so consumers can read it on submit if needed.
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div
        className="
          relative
          w-[600px]
          max-w-[92vw]
          rounded-2xl
          bg-background-light
          shadow-2xl
          border
          border-border-light
          px-6
          py-5
          space-y-5
        "
        onClick={(e) => {
          // 모달 내부 클릭 시 이벤트 전파 방지 (모달이 닫히지 않도록)
          e.stopPropagation();
        }}
      >
        <header className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-playfair text-text-primary">
                {heading}
              </h2>
            </div>
            <p className="text-sm text-text-secondary font-inter">
              {subheading}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-text-secondary hover:text-text-primary"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label
            className={`
              flex
              flex-col
              items-center
              justify-center
              gap-2
              rounded-xl
              border-2
              border-dashed
              px-6
              py-10
              text-center
              transition
              cursor-pointer
              ${dragActive ? "border-primary bg-background-hover" : "border-border bg-white"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-background-hover text-3xl text-primary">
              <img src= {UploadIcon} alt = "upload icon" className = "w-8 h-8"/>
            </div>
            <div className="space-y-1">
              <p className="text-base font-inter text-text-primary">
                {fileName ? fileName : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-text-tertiary font-inter">
                {maxSizeText}
              </p>
            </div>
          </label>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-text-primary">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., To the Lighthouse"
              className="
                w-full
                h-10
                rounded-lg
                border-2
                border-border
                px-3
                text-sm
                text-text-primary
                font-inter
                placeholder-text-tertiary
                focus:outline-none
                focus:ring-2
                focus:ring-primary
                bg-white
              "
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-text-primary">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any context or notes..."
              rows={3}
              className="
                w-full
                rounded-lg
                border-2
                border-border
                px-3
                py-2
                text-sm
                text-text-primary
                font-inter
                placeholder-text-tertiary
                focus:outline-none
                focus:ring-2
                focus:ring-primary
                bg-white
                resize-none
              "
            />
          </div>

          {formError && (
            <p className="text-sm text-red-600 font-inter" role="alert">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-5
                py-2.5
                rounded-lg
                text-sm
                font-inter
                text-text-primary
                bg-background-hover
                hover:bg-background-card
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                px-5
                py-2.5
                rounded-lg
                text-sm
                font-inter
                text-white
                bg-primary
                hover:bg-primary/90
                transition
              "
            >
              {uploadLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
