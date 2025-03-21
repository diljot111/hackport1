"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Bell, ChevronDown } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // 🔹 Toggle dropdown
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);


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
        const res = await axios.get("/api/auth/user");
        setProfilePic(res.data.profilePic);
        setUser({ username: res.data.firstname }); // ✅ Store firstname in state
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

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen); // 🔹 Toggle dropdown
  };

  // 🔹 Upload Image Function
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"); // ✅ Use .env variable
  
    try {
      // 🔹 Upload image to Cloudinary
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
  
      console.log("Cloudinary Upload Response:", uploadRes.data); // ✅ Log response from Cloudinary
      const imageUrl = uploadRes.data.secure_url; // ✅ Get the uploaded image URL
  
      // 🔹 Send PUT request to backend
      const apiResponse = await axios.put("/api/auth/user", { profilePic: imageUrl }, {
        headers: { "Content-Type": "application/json" }
      });
  
      console.log("API Response:", apiResponse.data); // ✅ Log API response
  
      // 🔹 Update state with new profile picture
      setProfilePic(imageUrl);
      toast.success("Profile picture updated!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Upload failed:", error.response?.data || error.message); // ✅ Log error details
      } else {
        console.error("Upload failed:", (error as Error).message); // ✅ Log error details
      }
      toast.error("Image upload failed.");
    }
  };
  
  
  return (
    <nav className={clsx(
      "fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 transition-all duration-300 border-b z-[80]",
      scrolled ? "bg-white shadow-md border-gray-300" : "bg-transparent border-gray-800 shadow-2xl"
    )}>
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
        <a href="#" className="hover:text-blue-500 transition-colors duration-200">Home</a>
        <a href="#" className="hover:text-blue-500 transition-colors duration-200">Blog</a>
      </div>

      <div>hello {user ? user.username : "Guest"}</div>

      {/* Icons */}
      <div className="flex items-center space-x-4 ml-30">
        <Bell className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-200" />

        {/* Profile Picture with Dropdown */}
        <div className="relative z-[80]"> {/* 🔹 Increased z-index */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleProfileClick}>
            <img
              src={profilePic || "/userimage.webp"}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-gray-300 object-cover"
            />
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 
                          rounded-md shadow-lg overflow-hidden animate-fadeIn z-[80]">
              <button
                onClick={() => fileInputRef.current?.click()} // Open file input
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Upload Profile Picture
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </nav>
  );
}
