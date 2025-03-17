"use client";

import Navbar from "@/component/topnav";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/" ||
    pathname.startsWith("/verify-otp"); // ✅ Hide Navbar on OTP page

  return !hideNavbar ? <Navbar /> : null;
}
