import { useState } from 'react';
import { createGroup } from '../api/groups.api';
import { useNavigate } from 'react-router-dom';

interface CreateGroupPayload {
  name: string;
  description?: string;
}

export const useCreateGroup = (onSuccess?: () => void) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGroup = async (payload: CreateGroupPayload) => {
    if (!payload.name.trim()) {
      setError('그룹 이름을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await createGroup(payload.name.trim(), payload.description?.trim());
      
      if (onSuccess) {
        onSuccess();
      }
      
      // 그룹 상세 페이지로 이동
      navigate(`/brainstorming/group/${response.id}`);
    } catch (err: any) {
      const errorData = err?.response?.data;
      const message =
        errorData?.message || err?.message || '그룹 생성에 실패했습니다. 다시 시도해주세요.';
      setError(message);
      throw err; // 호출자가 에러를 처리할 수 있도록 throw
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateGroup, loading, error };
};

