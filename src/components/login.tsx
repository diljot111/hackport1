"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
        const res = await axios.post("/api/auth/login", userData);
        const data = res.data; // Axios automatically parses JSON
      
        if (res.status === 200) {
          toast.success("Login Successful!");
          console.log("User logged in:", data);
          // Redirect user after login (Example: Dashboard)
          router.push("/main");
        } else {
          toast.error(data.error || "Invalid credentials");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Login failed");
        console.error("Login error:", error);
      }
        setLoading(false);      
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black shadow-2xl">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Login to HACKPORT
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <Label className="mb-2 block" htmlFor="email">Email Address</Label>
        <Input id="email" name="email" placeholder="hackport@fc.com" type="email" className="mb-4" required />

        <Label className="mb-2 block" htmlFor="password">Password</Label>
        <Input id="password" name="password" placeholder="••••••••" type="password" className="mb-6" required />

        <button
          className="bg-gradient-to-br from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-md transition-all hover:opacity-90"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        <div className="text-xs text-gray-600 text-center mt-2">
          Don't have an account?
          <Link href="/signup" className="text-blue-600 underline">
            Sign Up
            </Link>

        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-zinc-900 w-full h-10 rounded-md shadow-md transition-all hover:opacity-90">
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">Login with GitHub</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-zinc-900 w-full h-10 rounded-md shadow-md transition-all hover:opacity-90">
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">Login with Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}
