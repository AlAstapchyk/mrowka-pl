import LoginForm from "@/components/Login/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading login form...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
