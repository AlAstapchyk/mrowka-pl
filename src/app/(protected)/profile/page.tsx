import ProfileFormProvider from "@/components/Profile/ProfileFormProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileFormProvider />
    </Suspense>
  );
}
