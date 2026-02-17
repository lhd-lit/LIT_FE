import GoogleLogo from "../assets/googleLogo.png"
import { useGoogleLogin } from "../hooks/useGoogleLogin"
import { GoogleLoginButtonLoadingSpinner } from "./GoogleLoginButtonLoadingSpinner"

/**
 * 구글 로그인 버튼 컴포넌트
 * 로그인 진행 중 로딩 상태를 표시합니다.
 */
export function GoogleLoginButton() {
    const { isLoading, handleLogin } = useGoogleLogin();

    return (
        <div className="google-login-button">
            {/* Google 로그인 버튼 */}
            <button 
                onClick={handleLogin}
                disabled={isLoading}
                className="
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

                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:bg-white
                disabled:hover:shadow-none
                disabled:active:scale-100
            "
            >
                {isLoading ? (
                    <GoogleLoginButtonLoadingSpinner />
                ) : (
                    <img src={GoogleLogo} alt="google-logo" className="w-5 h-5" />
                )}

                <span className="
                    font-inter
                    text-sm 
                    text-text-primary
                ">
                    {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
                </span>
            </button>
        </div>
    )
}