import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: 실제 인증 체크 로직 구현
  // 현재는 항상 children을 렌더링
  return <>{children}</>;
}

