"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { verifyToken } from "@/lib/utils/services/auth";

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = async () => {
      const valid = await verifyToken();

      // console.log("Token valid:", valid); // Tambahkan log untuk pastikan ini berjalan

      if (
        !valid &&
        pathname !== "/auth/sign-in" &&
        pathname !== "/auth/sign-up"
      ) {
        localStorage.removeItem("token");
        router.push("/auth/sign-in?message=session_expired");
      }
    };

    check();
  }, [pathname, router]);

  return <>{children}</>;
}
