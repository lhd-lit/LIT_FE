import LogoutIcon from "../assets/logoutIcon.svg"

export function LogoutButton(){

    return(

        <button className="
            inline-flex
            items-center
            gap-2

            text-sm
            text-gray-600
            hover:text-gray-900
            font-inter
            "
        >
            {/* hover:text-gray-900: 호버 시 텍스트 색상 회색(900톤) */}
            {/* font-inter: 커스텀 폰트 "Inter" 적용 */}
            <img src={LogoutIcon} className="logout-icon" alt="logout-icon"/>
            Logout
        </button>

    )
}