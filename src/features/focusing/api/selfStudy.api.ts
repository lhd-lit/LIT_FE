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

// SelfStudy 생성 응답 타입
export type CreateSelfStudyResponse = {
  id: number;
  title: string;
  description: string;
};

// SelfStudy 목록 조회 응답 타입
export type GetSelfStudyListResponse = {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  original_file_name: string;
  writerName: string;
};

// Spring Data Page 구조
export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

/**
 * SelfStudy 생성 API 호출
 * 백엔드 스펙에 맞춰 MultipartFile과 JSON을 함께 전송
 * POST /api/selfStudy
 * Content-Type: multipart/form-data
 * - request: CreateSelfStudyRequest (JSON)
 * - file: MultipartFile
 */
export async function createSelfStudy(
  title: string,
  description: string | undefined,
  file: File
): Promise<CreateSelfStudyResponse> {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  // FormData 생성
  const formData = new FormData();
  
  // request 파트: JSON 문자열로 변환
  const requestData = {
    title,
    description: description || "",
  };
  formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
  
  // file 파트: 실제 파일
  formData.append("file", file);

  // FormData를 사용하는 경우, apiClient의 interceptor가 자동으로 Content-Type을 제거하여
  // axios가 multipart/form-data를 자동으로 설정하도록 함
  const res = await apiClient.post<GlobalResponse<CreateSelfStudyResponse>>(
    "/api/selfStudy",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-USER-ID": userId.toString(),
        // Content-Type은 interceptor에서 자동으로 처리됨
      },
    }
  );

  return res.data.result;
}

/**
 * 내 SelfStudy 목록 조회 API 호출
 * GET /api/selfStudy/me
 * @param page 페이지 번호 (0부터 시작, 기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 */
export async function getMySelfStudyList(
  page: number = 0,
  size: number = 10
): Promise<PageResponse<GetSelfStudyListResponse>> {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  const res = await apiClient.get<GlobalResponse<PageResponse<GetSelfStudyListResponse>>>(
    "/api/selfStudy/me",
    {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "X-USER-ID": userId.toString(),
      },
    }
  );

  return res.data.result;
}

/**
 * SelfStudy 삭제 API 호출
 * DELETE /api/selfStudy/{selfStudyId}
 */
export async function deleteSelfStudy(selfStudyId: number): Promise<void> {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  await apiClient.delete<GlobalResponse<void>>(
    `/api/selfStudy/${selfStudyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-USER-ID": userId.toString(),
      },
    }
  );
}

