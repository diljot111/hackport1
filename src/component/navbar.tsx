"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; // Import signOut for logout functionality

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuItems] = useState([
    { name: "Work", path: "/work" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ]);

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Log out user
    router.push("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-black text-white px-6 py-3 flex justify-between items-center rounded-full max-w-5xl mx-auto">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-white p-1 rounded-md">
          <span className="text-black font-bold text-lg">H</span>
        </div>
        <span className="text-lg font-semibold">HACKPORT</span>
      </div>

      {/* Menu */}
      <ul className="flex space-x-6">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`px-4 py-2 rounded-full transition ${
                pathname === item.path
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-black font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition"
      >
        Logout
      </button>
    </nav>
    
  );
}
