"use client";

import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 bg-blue-950 px-2 py-24">
      <span className="mx-auto text-3xl text-white">Searching for a job?</span>
      <span className="mx-auto text-2xl text-white">Find with us!</span>

      <div className="mx-auto mt-4 flex h-10 w-full max-w-[640px] items-center rounded-full bg-white">
        <svg className="zoom ml-2 h-6 w-6 bg-black align-middle"></svg>
        <input
          className="ml-2 flex-1"
          type="text"
          placeholder="Job title or employer"
        />
        <div className="flex justify-end">
          <div className="h-6 w-[2px] rounded-full bg-gray-700"></div>
          <input
            className="pl-2 placeholder-black"
            placeholder="Lublin"
          ></input>
          <svg className="zoom mr-2 h-6 w-6 bg-black align-middle"></svg>
        </div>
      </div>

      <button
        className="m-auto flex cursor-pointer items-center rounded-full bg-red-700 px-6 py-1 text-white"
        onClick={() => router.push("/search")}
      >
        Search
      </button>
    </div>
  );
};

export default Header;
