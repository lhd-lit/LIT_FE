import AlertIcon from "@/layouts/assets/alertIcon.svg"

export function NotificationButton(){

    const count = 2; // 일단 하드 코딩

    return(

        <button className="
            relative
            rounded-full
            
            transition  
        "
        aria-label="Notifications">
            {/* transition: 모든 속성 변화에 애니메이션 적용 */}
        
        <div className="relative">
            {/* relative: 상대 위치 지정 (자식 absolute 요소의 기준점) */}
            <img src={AlertIcon} className="w-5 h-5"/>
            
            <span className="
                absolute
                top-[-10px]
                right-[-10px]
        
                min-w-[18px]
                h-[18px]
                px-1

                flex
                items-center
                justify-center

                rounded-full
                bg-[#6B3E2E]
                text-white
                text-[11px]
                font-medium
            "
            >
                {/* absolute: 절대 위치 지정 */}
                {/* top-[-10px]: 상단에서 -10px 위치 (부모 요소 밖으로) */}
                {/* right-[-10px]: 우측에서 -10px 위치 (부모 요소 밖으로) */}

                {count}
            </span>
        </div>

        </button>
    
    )
}