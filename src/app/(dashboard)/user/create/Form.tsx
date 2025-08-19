import React, { use, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PasswordInput from "@/components/layout/PasswordInput";
import { api, ApiResponse } from "@/lib/utils/services/api";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function FormUser() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  interface ApiMessageResponse {
    success: boolean;
    message: string;
    data?: any;
  }

  const isBlankForm = async () => {
    setName("");
    setEmail("");
    setPassword("");
    setAddress("");
    // setTimeout(() => {
    router.push("/user");
    // }, 1000);
  };
  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // console.log("name:", name, "email:", email, "password:", password);
      const res: ApiMessageResponse = await api.post<ApiMessageResponse>(
        "/users",
        {
          user_name: name,
          user_email: email,
          user_password: password,
          user_address: address,
        }
      );
      if (res.success) {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
        });
        // Save data to localStorage
        const cached = localStorage.getItem("user_cache");
        const parsed = cached ? JSON.parse(cached) : [];
        const updated = [...parsed, res.data];
        localStorage.setItem("user_cache", JSON.stringify(updated));

        setTimeout(() => {
          isBlankForm();
        }, 1000);
      } else {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Error pada inputan", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className=" border-b border-white-200 bg-white-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Create User
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleRegistration}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
          >
            {/* Name Field */}
            <div className="md:col-span-3">
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
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
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Create a strong password"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your address"
              />
            </div>
            {/* Submit Button */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
