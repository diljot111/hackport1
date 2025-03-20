"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { Bell } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null); // Store profile picture
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("/api/auth/user"); // 🔹 Replace with your actual API endpoint
        setProfilePic(res.data.profilePic); // 🔹 Set the profile picture from the database
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 transition-all duration-300 border-b z-50",
        scrolled ? "bg-white shadow-md border-gray-300" : "bg-transparent border-gray-800 shadow-2xl"
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
        
        {/* Profile Picture */}
        <img
          src={profilePic || "/default-avatar.png"} // 🔹 Use saved profile picture or default avatar
          alt="Profile"
          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
        />
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={clsx(
          scrolled ? "text-white bg-black font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition" 
                  : "bg-white text-black font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition",
          "text-lg font-semibold transition-colors duration-200"
        )}
      >
        Logout
      </button>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </nav>
  );
}
