import apiClient from "../../../api/client";
import { getToken } from "../../../lib/token";

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

// Bookmark 생성 응답 타입
export type CreateBookmarkResponse = {
  bookmarkId: number;
  selfStudyId: number;
};

/**
 * SelfStudy를 즐겨찾기에 추가
 * POST /api/bookmark/selfStudy/{selfStudyId}
 */
export async function addBookmark(selfStudyId: number): Promise<CreateBookmarkResponse> {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  const res = await apiClient.post<GlobalResponse<CreateBookmarkResponse>>(
    `/api/bookmark/selfStudy/${selfStudyId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-USER-ID": userId.toString(),
      },
    }
  );

  return res.data.result;
}

