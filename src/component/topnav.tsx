"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { Bell } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 transition-all duration-300 border-b mt-25",
        scrolled ? "bg-white shadow-md border-gray-300" : "bg-transparent border-gray-800"
      )}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
        <span className="font-bold text-lg text-gray-800">Devfolio</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-gray-600">
        <a
          href="#"
          className="hover:text-blue-500 transition-colors duration-200"
        >
          Home
        </a>
        <a
          href="#"
          className="hover:text-blue-500 transition-colors duration-200"
        >
          Blog
        </a>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <Bell className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-200" />
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </nav>
  );
}
