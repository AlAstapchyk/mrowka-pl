"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  haslo: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      haslo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { email, haslo } = values;

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: haslo,
    });

    setLoading(false);

    if (error) {
      toast.error("Login failed", {
        description: error.message,
      });
    } else {
      toast.success("Logged in successfully.");
      const redirectTo = searchParams.get("redirectedFrom") || "/";
      router.push(redirectTo);
    }
  };

  return (
    <div className="mx-auto w-96 max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-bold">Log in to your account</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="haslo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Form>

      <p className="mb-2 text-center text-sm">
        Don&apos;t have an account?{" "}
        <a className="text-blue-600 underline" href="/register">
          Register
        </a>
      </p>

      <p className="text-center text-sm">
        Forgot your password?{" "}
        <a className="text-blue-600 underline" href="/auth/reset-password">
          Reset it
        </a>
      </p>
    </div>
  );
}
