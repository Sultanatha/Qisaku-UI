"use client";

import PasswordInput from "@/components/layout/PasswordInput";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import {
  getTokenFromCookies,
  verifyToken,
  login,
} from "@/lib/utils/services/auth";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message === "logout") {
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      router.push("/auth/sign-in");
    }
  }, [message, router]);

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const token = getTokenFromCookies();

        if (token) {
          const response = await verifyToken(token);

          if (response) {
            router.push("/admin");
          } else {
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(email, password);

      if (res) {
        document.cookie = `token=${res.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`;

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }

        toast.success(res.message, {
          position: "top-right",
          autoClose: 2000,
        });

        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        toast.error(res.message || "Login gagal", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan saat login", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/main-light.svg"
            alt="logo"
            width={120}
            height={30}
            className="block mb-6 mx-auto"
          />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <PasswordInput
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              // disabled={isLoading}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">atau</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-500 text-sm">New to baseec? </span>
              <a
                href="/auth/sign-up"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors"
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
