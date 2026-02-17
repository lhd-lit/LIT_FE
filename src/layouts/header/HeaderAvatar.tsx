import DefaultAvatar from "../assets/defaultAvatar.png"

export function HeaderAvatar(){

    return(

        <button className="
            relative
            rounded-full
            overflow-hidden
            w-9 h-9

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-gray-300
        "
        aria-label="User profile"
        >
            {/* relative: 상대 위치 지정 */}
            {/* overflow-hidden: 넘치는 내용 숨김 */}
            {/* focus:outline-none: 포커스 시 기본 아웃라인 제거 */}
            {/* focus-visible:ring-2: 포커스 시 링 2px 표시 */}
            {/* focus-visible:ring-gray-300: 포커스 링 색상 회색(300톤) */}
            <img
                src={DefaultAvatar}
                alt="User avatar"
                className="w-full h-full object-cover"
            />
            {/* object-cover: 이미지 비율 유지하며 영역 채움 */}

        </button>
        
    );
}