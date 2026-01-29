type SidebarItemProps = {

    iconSrc: string;
    label: string;
    active?: boolean;

}

export function SidebarItem({ iconSrc, label, active = false }: SidebarItemProps){

    return(
    
        <div className={`
            h-12
            flex
            items-center
            gap-3
            px-3
            py-2
            rounded-lg
            bg-transparent

            text-sm
            transition
            ${
                active
                ? "!bg-background-card text-text-primary font-medium"
                : "text-text-secondary hover:!bg-background-card/50"
            }
            `}>
            {/* rounded-lg: 테두리 반경 0.5rem(8px) */}
            {/* bg-transparent: 배경색 투명 */}
            {/* text-sm: 폰트 크기 0.875rem(14px) */}
            {/* transition: 모든 속성 변화에 애니메이션 적용 */}

            <img src={iconSrc} className="flex-shrink-0"/>
            <span className="flex-inline text-base text-text-primary">{label}</span>
        </div>
   
    )
}