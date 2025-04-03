"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const NavBar = () => {
  const router = useRouter();

  return (
    <div className="top-0 container flex h-12 items-center bg-amber-300 px-4">
      <span
        className="cursor-pointer font-serif text-2xl font-bold text-red-700"
        onClick={() => router.push("/")}
      >
        Mrówka.pl
      </span>
      <div className="flex gap-6 px-6">
        <Link href="">Job offers</Link>
        <Link href="">My offers</Link>
        <Link href="">My applications</Link>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <div className="h-6 w-6 rounded-full bg-red-500" />
        <button className="rounded-full bg-red-700 px-6 py-1 text-white">
          Sign up / Sign in
        </button>
      </div>
    </div>
  );
};

export default NavBar;
