"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function HeroSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative h-[400px] w-full">
      <Image
        src="/home-bg.png"
        alt="Background"
        fill
        className={`object-cover transition-opacity duration-1000 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        priority
        onLoad={() => setImageLoaded(true)}
      />

      <div className="absolute inset-0 flex flex-col bg-black/75 px-2 py-24">
        {children}
      </div>
    </div>
  );
}
