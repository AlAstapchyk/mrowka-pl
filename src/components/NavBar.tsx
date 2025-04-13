"use server";

import React from "react";
import Image from "next/image";
import UserDropdown from "./UserDropdown";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="container flex h-12 items-center px-4 py-2">
      <Link href="/" className="flex cursor-pointer gap-2 border-0 bg-none">
        <Image
          width={36}
          height={36}
          alt="Logo"
          src="/mrowka-pl-logo.png"
          loading="eager"
        />
        <span className="font-serif text-2xl font-bold">Mrówka.pl</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <div className="ml-auto flex min-h-6 min-w-6 items-center gap-2">
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
