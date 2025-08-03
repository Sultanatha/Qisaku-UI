import React from "react"; // tambahkan ini
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import AuthChecker from "@/components/layout/AuthChecker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qisaku Dashboard",
  description: "Next.js Stock App Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthChecker>{children}</AuthChecker>
      </body>
    </html>
  );
}
