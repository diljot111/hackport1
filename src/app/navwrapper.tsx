"use client";

import Navbar from "@/component/topnav";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/" ||
    // pathname === "" ||
    pathname.startsWith("/verify-otp");
    // pathname.startsWith("/main/[hackathonName]");
    // ✅ Hide Navbar on OTP page

  return !hideNavbar ? <Navbar /> : null;
}
