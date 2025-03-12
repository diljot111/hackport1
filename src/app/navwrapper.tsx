"use client";

import Navbar from "@/component/navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return !hideNavbar ? <Navbar /> : null; // Show Navbar only on certain pages
}
