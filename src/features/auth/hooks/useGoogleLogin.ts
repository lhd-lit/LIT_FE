import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initiateGoogleLogin } from "../api/auth.api";

export function useGoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // 로그인 성공 페이지로 이동하면 로딩 해제
  useEffect(() => {
    if (location.pathname === '/login-success' || location.hash.includes('login-success')) {
      setIsLoading(false);
    }
  }, [location]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await initiateGoogleLogin();
      // 성공적으로 외부 브라우저가 열렸다면, 일정 시간 후 자동으로 로딩 해제
      // 로그인 실패 시 버튼이 다시 활성화되도록
      setTimeout(() => {
        setIsLoading(false);
      }, 30000); // 30초 후 자동 해제
    } catch (error) {
      setIsLoading(false);
      alert("Google 로그인 시작 중 오류가 발생했습니다.");
    }
  };

  return { isLoading, handleLogin };
}

