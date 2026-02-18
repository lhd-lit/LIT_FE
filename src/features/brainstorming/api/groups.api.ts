import apiClient from "../../../api/client";
import { getToken } from "../../../lib/token";

export type CreateGroupRequest = {
  name: string;
  description?: string;
};

export type CreateGroupResponse = {
  id: number;
  name: string;
  description: string;
  ownerName: string;
};

// JWT 토큰에서 userId 추출
const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    // JWT의 sub 필드가 userId (백엔드에서 String.valueOf(userId)로 저장)
    const userId = payload.sub ? parseInt(payload.sub, 10) : null;
    return userId;
  } catch (error) {
    return null;
  }
};

// GlobalResponse 타입 정의
type GlobalResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export async function createGroup(body: CreateGroupRequest): Promise<CreateGroupResponse> {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  const res = await apiClient.post<GlobalResponse<CreateGroupResponse>>("/api/groups", body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-USER-ID": userId.toString(),
    },
  });

  // GlobalResponse로 감싸진 응답에서 result 필드 추출
  return res.data.result;
}


