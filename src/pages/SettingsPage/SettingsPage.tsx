import { ProfileCard } from "../../features/settings/components/ProfileCard";
import { TokenUsageCard } from "../../features/settings/components/TokenUsageCard";
import { StorageUsageCard } from "../../features/settings/components/StorageUsageCard";
import { DeleteAccountCard } from "../../features/settings/components/DeleteAccountCard";
import {
  MOCK_USER,
  MOCK_TOKEN_USAGE,
  MOCK_STORAGE_USAGE,
} from "../../mock/settings/mockData";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6 px-4 pb-10">
            <header className="text-center mt-8 mb-2">
                <h1 className="text-2xl font-playfair text-[#2A2418]">Settings</h1>
                <p className="text-sm text-[#6B5D4F] font-inter mt-4">Manage your profile and usage</p>
            </header>

            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                <ProfileCard user={MOCK_USER} />
                <TokenUsageCard stats={MOCK_TOKEN_USAGE} />
                <StorageUsageCard stats={MOCK_STORAGE_USAGE} />
                <DeleteAccountCard />
            </div>
        </div>
    )
}
