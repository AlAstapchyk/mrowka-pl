import RegisterForm from "@/components/Auth/RegisterForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Registration | Mrowka.pl",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
