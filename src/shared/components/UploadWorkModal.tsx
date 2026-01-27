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

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0] ?? null;
    onSubmit?.({ title, description, file });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#1F1A1400]/60 backdrop-blur-sm" />

      <div
        className="
          relative
          w-[600px]
          max-w-[92vw]
          rounded-2xl
          bg-[#F4EEE2]
          shadow-2xl
          border
          border-[#E6DFD2]
          px-6
          py-5
          space-y-5
        "
      >
        <header className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-playfair text-[#2A2418]">
                {heading}
              </h2>
            </div>
            <p className="text-sm text-[#6B5D4F] font-inter">
              {subheading}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-[#6B5D4F] hover:text-[#2A2418]"
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
              ${dragActive ? "border-[#5A4A3A] bg-[#EFE6D8]" : "border-[#D0C4B5] bg-[#FDFBF7]"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#EFE6D8] text-3xl text-[#5A4A3A]">
              <img src= {UploadIcon} alt = "upload icon" className = "w-8 h-8"/>
            </div>
            <div className="space-y-1">
              <p className="text-base font-inter text-[#2A2418]">
                {fileName ? fileName : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-[#8B7355] font-inter">
                {maxSizeText}
              </p>
            </div>
          </label>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-[#2A2418]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., To the Lighthouse"
              className="
                w-full
                h-10
                rounded-lg
                border-2
                border-[#8B7355]
                px-3
                text-sm
                text-[#2A2418]
                font-inter
                placeholder-[#9A8C7A]
                focus:outline-none
                focus:ring-2
                focus:ring-[#5A4A3A]
                bg-white
              "
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-inter text-[#2A2418]">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any context or notes..."
              rows={3}
              className="
                w-full
                rounded-lg
                border-2
                border-[#8B7355]
                px-3
                py-2
                text-sm
                text-[#2A2418]
                font-inter
                placeholder-[#9A8C7A]
                focus:outline-none
                focus:ring-2
                focus:ring-[#5A4A3A]
                bg-white
                resize-none
              "
            />
          </div>

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
                text-[#2A2418]
                bg-[#EFE6D8]
                hover:bg-[#E5DAC9]
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
                bg-[#5A4A3A]
                hover:bg-[#4A3A2A]
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
