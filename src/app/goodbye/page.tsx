import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Goodbye | Mrowka.pl",
};

export default function page() {
  return (
    <div className="m-auto flex flex-col gap-6 text-center">
      <p className="font-serif text-6xl font-semibold">Goodbye, Mrówka!</p>
      <p className="text-4xl">Refresh the page</p>
    </div>
  );
}
