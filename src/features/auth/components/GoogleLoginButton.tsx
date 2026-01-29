import GoogleLogo from "@/features/auth/assets/googleLogo.png"

export function GoogleLoginButton() {

    return(

        <div className="google-login-button">
            {/* Google 로그인 버튼 */}
            <button className="
                mt-10 
                inline-flex 
                items-center 
                justify-center 
                gap-5
                       
                h-12 
                px-8

                text-gray-700
                rounded-lg 
                border-2
                border-gray-300 
                bg-white 

                hover:bg-gray-50
                hover:shadow-md
                
                transition-all 
                duration-200

                focus-visible:outline-none

                active:shadow-inner
                active:scale-[0.98]
                active:bg-gray-100
                active:ring-gray-300
            "
            >

            {/* rounded-lg: 테두리 반경 0.5rem(8px)로 둥근 모서리 */}
            {/* shadow-[0_0_0_1px_rgba(209,213,220,0.8)]: 커스텀 그림자 효과 (1px 테두리 효과) */}
            {/* hover:shadow-[0_0_0_1px_rgba(184,189,199,0.9)]: 호버 시 그림자 색상 변경 */}
            {/* transition-all: 모든 속성 변화에 애니메이션 적용 */}
            {/* active:scale-[0.985]: 클릭 시 98.5% 크기로 축소 효과 */}
            {/* duration-200: 애니메이션 지속 시간 200ms */}

                <img src={GoogleLogo} alt="google-logo" className="w-5 h-5" />

                    <span className="
                        font-inter
                        text-sm 
                        text-text-primary">
                        Continue with Google
                    </span>
                        {/* text-sm: 폰트 크기 0.875rem(14px) */}
                        
            </button>
        </div>
    )
}