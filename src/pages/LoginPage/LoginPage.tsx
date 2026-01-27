import { GoogleLoginButton } from "../../features/auth/components/GoogleLoginButton";
import { LoginCard } from "../../features/auth/components/LoginCard";
import { BrandHeader } from "../../features/auth/components/BrandHeader";
import { LoginCardFooter } from "../../features/auth/components/LoginCardFooter";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#F5F1E8_0%,#FAF8F3_50%,#F0EBE0_100%)]">
      <LoginCard>
        <BrandHeader />
        <GoogleLoginButton />
        <LoginCardFooter />
      </LoginCard>
    </div>
  );
}