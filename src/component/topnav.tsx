"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { Bell } from "lucide-react";
import axios from "axios"; // ✅ Import axios
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout"); // ✅ Call logout API
      toast.success("Logged out successfully!");

      setTimeout(() => {
        router.push("/login"); // ✅ Redirect to login page
      }, 1500);
    } catch (error) {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 transition-all duration-300 border-b z-50",
        scrolled ? "bg-white shadow-md border-gray-300" : "bg-transparent border-gray-800 shadow-2xl z-50"
      )}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-white p-1 rounded-md">
          <span className="text-black font-bold text-lg">H</span>
        </div>
        <span className={clsx(
          scrolled ? "text-black" : "text-white",
          "text-lg font-semibold transition-colors duration-200"
        )}>
          HACKPORT
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-gray-600">
        <a href="#" className="hover:text-blue-500 transition-colors duration-200">
          Home
        </a>
        <a href="#" className="hover:text-blue-500 transition-colors duration-200">
          Blog
        </a>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <Bell className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-200" />
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-black font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition"
      >
        Logout
      </button>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </nav>
  );
}
