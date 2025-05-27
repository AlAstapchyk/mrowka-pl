import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Authentication | Mrowka.pl",
};

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default layout;
