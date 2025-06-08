"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { User } from "@/db/schema";

export default function UserDropdown() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    if (!user) return;

    axios.get(`/api/users/${user.id}`).then((res) => setUserData(res.data));
  }, [user]);

  if (authLoading) {
    return <LoadingSpinner className="mr-10" size="h-4 w-4" />;
  }

  if (!user) {
    return (
      <>
        <Button
          className="w-20 cursor-pointer px-6 py-1 text-white"
          onClick={() => router.push("/register")}
        >
          Register
        </Button>
        <Button
          className="w-20 cursor-pointer px-6 py-1 text-white"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="border-box max-w-48 cursor-pointer px-2"
      >
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-0 pr-2 pl-1"
        >
          {userData?.avatarUrl ? (
            <Image
              src={`${userData.avatarUrl}?v=${Date.now()}`}
              width={30}
              height={30}
              alt="Avatar"
              className="aspect-square rounded-sm object-cover"
              loading="eager"
            />
          ) : (
            <UserIcon className="h-4 w-4" strokeWidth={2} />
          )}

          <span className="text-md truncate font-semibold">
            {(user as any).user_metadata.full_name || "Account"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          My Profile
        </DropdownMenuItem>
        {userData?.role === "job_seeker" ? (<>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/saved-jobs")}
          >
            Saved Jobs
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/applied-jobs")}
          >
            Applied Jobs
          </DropdownMenuItem>
        </>) : <></>}

        {userData?.role === "recruiter" ? (<>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/companies")}
          >
            Companies
          </DropdownMenuItem>
        </>) : <></>}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
