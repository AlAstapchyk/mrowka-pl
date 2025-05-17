import RegisterForm from "@/components/Auth/RegisterForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
