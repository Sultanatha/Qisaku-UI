import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/layout/Menu";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/guard/AuthGuard";
import AuthChecker from "@/components/layout/AuthChecker";

export const metadata: Metadata = {
  title: "Qisaku Dashboard",
  description: "Next.js Stock App Management System",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthChecker>
      <AuthGuard>
        <div className="h-screen flex">
          {/* LEFT */}
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[16%]">
            <Link
              href="/"
              className="flex items-center justify-center lg:justify-start gap-1"
            >
              <Image
                src="/main-light.svg"
                alt="logo"
                width={35}
                height={35}
                className="mx-2 mt-2"
              ></Image>
              <span className="hidden lg:block font-bold">Tech</span>
            </Link>
            <Menu />
          </div>
          {/* RIGHT */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[84%] bg-[#F7F8FA] overflow-scroll">
            <Navbar />
            {children}
          </div>
        </div>
      </AuthGuard>
    </AuthChecker>
  );
}
