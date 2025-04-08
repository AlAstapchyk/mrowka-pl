import LoadingSpinner from "@/components/LoadingSpinner";
import { lazy, Suspense } from "react";

export default function RegisterPage() {
  const RegisterForm = lazy(() => import("@/components/Auth/RegisterForm"));
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
