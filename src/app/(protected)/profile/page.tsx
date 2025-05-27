import ProfileFormProvider from "@/components/Profile/ProfileFormProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My profile | Mrowka.pl",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileFormProvider />
    </Suspense>
  );
}
