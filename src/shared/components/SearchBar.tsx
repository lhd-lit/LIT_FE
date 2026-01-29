import searchIcon from "../assets/searchIcon.svg";

type SearchBarProps = {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export function SearchBar({ 
    placeholder,
    value,
    onChange 
}: SearchBarProps) {
    return (
        <div className="
            flex
            items-center
            gap-2
            px-4
            h-10
            w-full
            max-w-md
            rounded-lg
            border-2
            border-border
            bg-white
        ">
            <img src={searchIcon} alt="search"/>
            <input 
                type="text" 
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="
                    flex-1
                    font-inter
                    text-sm
                    text-text-tertiary
                    placeholder-text-tertiary
                    outline-none
                    bg-transparent
                "
            />
        </div>
    )
}

