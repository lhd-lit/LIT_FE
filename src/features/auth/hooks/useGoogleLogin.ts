import { useState } from "react";
import { initiateGoogleLogin } from "../api/auth.api";

export function useGoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await initiateGoogleLogin();
      // 성공적으로 외부 브라우저가 열렸다면, Electron 앱은 대기 상태
      // 로딩 상태는 OAuth 리다이렉트 후 앱이 다시 활성화될 때 해제될 것
    } catch (error) {
      console.error("Google 로그인 시작 실패:", error);
      setIsLoading(false);
      alert("Google 로그인 시작 중 오류가 발생했습니다.");
    }
  };

  return { isLoading, handleLogin };
}

