"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout"); // Call logout API
      toast.success("Logged out successfully!");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      toast.error("Logout failed!");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
}
