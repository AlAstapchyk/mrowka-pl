"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

const NavBar = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <div className="container flex items-center px-4 py-2">
      <button
        className="flex cursor-pointer gap-2 border-0 bg-none"
        onClick={() => router.push("/")}
      >
        <Image
          width={36}
          height={36}
          alt="Logo"
          src="/mrowka-pl-logo.png"
          loading="eager"
        />
        <span className="font-serif text-2xl font-bold">Mrówka.pl</span>
      </button>

      {!loading && (
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <div className="h-6 w-6 rounded-full bg-red-500" />
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-20 px-6 py-1 text-white"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
              <Button
                className="w-20 px-6 py-1 text-white"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
