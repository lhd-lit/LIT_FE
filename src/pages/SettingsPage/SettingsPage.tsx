import { useUserProfile } from '../../features/settings/hooks/useUserProfile';
import { useStorageUsage } from '../../features/settings/hooks/useStorageUsage';
import { ProfileCard } from '../../features/settings/components/ProfileCard';
// import { TokenUsageCard } from '../../features/settings/components/TokenUsageCard';
import { StorageUsageCard } from '../../features/settings/components/StorageUsageCard';
import { DeleteAccountCard } from '../../features/settings/components/DeleteAccountCard';

/**
 * Settings 페이지 메인 컴포넌트
 * 사용자 프로필 및 설정을 관리하는 페이지
 */
export default function SettingsPage() {
  const { user, loading, error } = useUserProfile();
  const {
    stats: storageStats,
    loading: storageLoading,
    error: storageError,
  } = useStorageUsage();

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-4 pb-10">
        <header className="text-center mt-8 mb-2">
          <h1 className="text-2xl font-playfair text-text-primary">Settings</h1>
          <p className="text-sm text-text-secondary font-inter mt-4">
            Manage your profile and usage
          </p>
        </header>
        <div className="text-center py-12 text-text-secondary">
          <p className="text-sm font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user || !user.email) {
    return (
      <div className="flex flex-col gap-6 px-4 pb-10">
        <header className="text-center mt-8 mb-2">
          <h1 className="text-2xl font-playfair text-text-primary">Settings</h1>
          <p className="text-sm text-text-secondary font-inter mt-4">
            Manage your profile and usage
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-sm font-inter text-red-600 mb-2">
            {error || '사용자 정보를 불러올 수 없습니다.'}
          </p>
          <p className="text-xs font-inter text-text-secondary">
            로그인 상태를 확인하거나 페이지를 새로고침해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-10">
      <header className="text-center mt-8 mb-2">
        <h1 className="text-2xl font-playfair text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary font-inter mt-4">
          Manage your profile and usage
        </p>
      </header>

      <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
        <ProfileCard user={user} />
        {/* {tokenStats && <TokenUsageCard stats={tokenStats} />} */}
        {storageLoading && (
          <div className="rounded-2xl border border-border bg-white p-6 text-center text-sm text-text-secondary font-inter">
            Loading storage usage…
          </div>
        )}
        {!storageLoading && storageError && (
          <div className="rounded-2xl border border-border border-red-200 bg-red-50/50 p-6 text-center text-sm text-red-700 font-inter">
            {storageError}
          </div>
        )}
        {!storageLoading && storageStats && <StorageUsageCard stats={storageStats} />}
        <DeleteAccountCard email={user.email} />
      </div>
    </div>
  );
}
