"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // Ambil token dari cookie
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        console.log("Token from cookie:", token);

        if (token) {
          // Verifikasi token ke backend
          const res = await fetch("http://localhost:4000/api/auth/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (data.success) {
            console.log(
              "User Name:",
              data.user.user_name,
              "User Role:",
              data.user.roles[0]
            );
            setUserName(data.user.user_name);
            setUserRole(data.user.roles[0]);
          } else {
            console.error("API error:", data.message);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Hapus token kalau error
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    };

    checkExistingAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-between p-4">
      {/* Search Bar */}
      {/* <div className="hidden md:flex items-center gap-2 tex-xs rounded-full ring-[1.5px] ring-gray-500 px-2">
        <Image src="/search.png" alt="search" width={14} height={14}></Image>
        <input
          type="text"
          placeholder="Search...."
          className="w-[200px] p-2 bg-transparent outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}
      {/* Icons and User */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="message" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="message" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div> */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{userName}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {userRole}
          </span>
        </div>
        <Image
          src="/avatar.png"
          alt="avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
