import RegisterForm from "@/components/Auth/RegisterForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
