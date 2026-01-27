import { SidebarItem } from "./SidebarItem.tsx"
import HomeIcon from "../../shared/assets/homeIcon.svg"
import FocusingIcon from "../../shared/assets/focusingIcon.svg"
import BrainStormingIcon from "../../shared/assets/brainstormingIcon.svg"
import SettingsIcon from "../../shared/assets/settingsIcon.svg"
import { NavLink } from "react-router-dom"


export function Sidebar(){

    return(

        <aside className="
            flex
            flex-col    
            items-start
            w-64
            min-h-screen
            border-r
            border-[#5A4A3A26]
            px-4
            py-6
            bg-[#F5F0E8]
        ">
            {/* flex: flexbox 레이아웃 사용 */}
            {/* flex-col: 세로 방향(flex-direction: column) */}
            {/* justify-center: 주축(main-axis) 중앙 정렬 */}
            {/* items-start: 교차축(cross-axis) 시작점 정렬 */}
            {/* w-64: 너비 16rem(256px) */}
            {/* h-full: 높이 100% (부모 요소의 높이에 맞춤) */}
            {/* border-r: 우측 테두리 1px */}
            {/* border-[#5A4A3A26]: 테두리 색상 커스텀 색상 #5A4A3A 26% 투명도 */}
            {/* px-4: 좌우 패딩 1rem(16px) */}
            {/* py-6: 상하 패딩 1.5rem(24px) */}
            {/* bg-[#F5F0E8]: 배경색 커스텀 색상 #F5F0E8 */}

            <nav className="flex flex-col gap-2 w-full">
                {/* flex: flexbox 레이아웃 사용 */}
                {/* flex-col: 세로 방향(flex-direction: column) */}
                {/* gap-2: 자식 요소 간 간격 0.5rem(8px) */}
                {/* w-full: 너비 100% (부모 요소의 전체 너비) */}    

                <NavLink to="/home">
                    {({ isActive }) => (
                        <SidebarItem iconSrc={HomeIcon} label="Home" active={isActive} />
                    )}
                </NavLink>

                <NavLink to="/focusing">
                    {({ isActive}) => (
                        <SidebarItem iconSrc={FocusingIcon} label="Focusing" active={isActive} />
                    )}
                </NavLink>
                
                <NavLink to="/brainstorming">
                    {({ isActive }) => (
                        <SidebarItem iconSrc={BrainStormingIcon} label="Brain Storming" active={isActive} />
                    )}
                </NavLink>

                <NavLink to="/settings">
                    {({ isActive }) => (
                        <SidebarItem iconSrc={SettingsIcon} label="Settings" active={isActive} />
                    )}
                </NavLink>
            </nav>
        
        </aside>
    )

}
