"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/utils/services/api";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string; // Tambahkan prop untuk custom redirect
}

export default function AuthGuard({
  children,
  fallback,
  redirectTo = "/auth/sign-in",
}: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Cek token dari cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          setIsAuthenticated(false);
          // Hanya redirect jika bukan di halaman yang diizinkan
          if (pathname !== "/auth/sign-in" && pathname !== "/auth/sign-up") {
            router.push(redirectTo);
          }
          return;
        }

        // Validasi token dengan API
        const response = await api.get("/auth/verify-token");

        console.log("✅ Token valid");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Token invalid:", error);

        localStorage.removeItem("token");
        setIsAuthenticated(false);

        if (pathname !== "/auth/sign-in" && pathname !== "/auth/sign-up") {
          router.push(redirectTo);
        }
      }
    };

    checkAuth();
  }, [router, pathname, redirectTo]);

  // Loading state
  if (isAuthenticated === null) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return fallback || null;
  }

  // Authenticated
  return <>{children}</>;
}

// HOC untuk wrap pages
export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options?: { redirectTo?: string }
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <AuthGuard redirectTo={options?.redirectTo}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };
}

// Hook untuk cek status auth dan redirect setelah login
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await fetch(
          "http://localhost:4000/api/auth/verify-token",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const redirectToAdmin = () => {
    router.push("/admin");
  };

  return { isAuthenticated, redirectToAdmin };
}
