import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Layout/Footer";
import NavBar from "@/components/Layout/NavBar";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mrowka.pl",
  description: "Find your job of dreams!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full min-h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-full min-h-screen flex-col antialiased`}
      >
        <AuthProvider>
          <NavBar />
          {children}
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
