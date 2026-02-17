import { useLoginSuccess } from '../../features/auth/hooks/useLoginSuccess';

export default function LoginSuccessPage() {
  const { error, isLoading } = useLoginSuccess();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-lg text-red-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500">로그인 페이지로 이동합니다...</p>
          </>
        ) : (
          <>
            <p className="text-lg">로그인 처리 중...</p>
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

