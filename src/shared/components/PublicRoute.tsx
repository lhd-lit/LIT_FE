import { Navigate } from 'react-router-dom';
import { hasToken } from '../../lib/token';

interface PublicRouteProps {
  children: React.ReactElement;
}

/**
 * 인증되지 않은 사용자만 접근 가능한 라우트 컴포넌트
 * 토큰이 있으면 홈 페이지로 리다이렉트
 */
export function PublicRoute({ children }: PublicRouteProps) {
  if (hasToken()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

