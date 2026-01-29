import uploadIcon from "../assets/uploadIcon.svg";

type UploadButtonProps = {
    onClick?: () => void;
}

export function UploadButton({ onClick }: UploadButtonProps) {
    return (
        <button 
            onClick={onClick}
            className="
                flex
                items-center
                gap-2
                px-4
                h-10
                rounded-lg
                bg-primary
                text-white
                text-sm
                font-inter
                hover:bg-primary/90
                transition
            ">
            <img src={uploadIcon} alt="upload" />
            Upload Study
        </button>
    )
}