import type { ReactNode } from "react";

interface LoginCardProps{
    children: ReactNode;
}

export function LoginCard({ children }: LoginCardProps){
    
    return (
        <div className="
            w-full max-w-[448px] 
            min-h-[455px] 
            rounded-2xl 
            border border-border
            bg-white/80 
            shadow-2xl 
            flex flex-col 
            items-center"
        >
        {/* w-full max-w-[448px]: 너비 100%, 최대 너비 448px로 제한 */}
        {/* min-h-[455px]: 최소 높이 455px */}
        {/* rounded-2xl: 테두리 반경을 매우 크게(1rem) 설정하여 둥근 모서리 */}
        {/* border border-border: 테두리 1px, 테마 border 토큰 사용 */}
        {/* bg-white/80: 배경색 흰색을 80% 불투명도로 설정 */}
        {/* shadow-2xl: 매우 큰 그림자 효과 적용 */}
        {/* flex flex-col: flexbox 레이아웃, 세로 방향(flex-direction: column) */}
        {/* items-center: 교차축(cross-axis) 중앙 정렬 */}
            
            {children}

        </div>
    )
}