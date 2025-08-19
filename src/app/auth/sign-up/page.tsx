"use client";

import Image from "next/image";
import PasswordInput from "@/components/layout/PasswordInput";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { api, ApiResponse } from "@/lib/utils/services/api";
import "react-toastify/dist/ReactToastify.css";

const RegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  interface ApiMessageResponse {
    success: boolean;
    message: string;
    data?: any;
  }

  const isFormValid = name && email && isPasswordValid;

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    {
      /* Your registration logic here */
    }
    try {
      // console.log("name:", name, "email:", email, "password:", password);
      const res: ApiMessageResponse = await api.post<ApiMessageResponse>(
        "/users",
        {
          user_name: name,
          user_email: email,
          user_password: password,
        }
      );
      if (res.success) {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
        });
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(res.message, {
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
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Brand/Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#002147] to-[#003366] items-center justify-center p-12">
        <div className="text-center">
          <Image
            src="/main-dark.svg"
            alt="logo"
            width={300}
            height={200}
            className="mx-auto mb-8"
          />
          <h1 className="text-white text-3xl font-light mb-4">
            Welcome to Our Platform
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-md">
            Join thousands of users who trust us with their digital experience.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/main-dark.svg"
              alt="logo"
              width={120}
              height={40}
              className="mx-auto"
            />
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleRegistration} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <PasswordInput
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                enableValidation
                onValidate={(valid) => setIsPasswordValid(valid)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Terms */}
            <p className="text-center text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/sign-in"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RegistrationPage;
