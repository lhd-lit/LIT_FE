import { useNavigate } from 'react-router-dom';
import { createSelfStudy } from '../api/selfStudy.api';

interface UploadPayload {
  title: string;
  description: string;
  file: File | null;
}

export const useSelfStudyUpload = () => {
  const navigate = useNavigate();

  const handleUpload = async (payload: UploadPayload) => {
    if (!payload.file) {
      throw new Error('파일을 선택해주세요.');
    }

    if (!payload.title.trim()) {
      throw new Error('제목을 입력해주세요.');
    }

    try {
      const response = await createSelfStudy(
        payload.title.trim(),
        payload.description?.trim() || undefined,
        payload.file
      );
      // 백엔드 CreateSelfStudyResponse는 id를 사용
      navigate(`/focusing/study/${response.id}`);
    } catch (err: any) {
      const errorData = err?.response?.data;
      const message =
        errorData?.message || err?.message || '파일 업로드에 실패했습니다. 다시 시도해주세요.';
      throw new Error(message);
    }
  };

  return { handleUpload };
};

