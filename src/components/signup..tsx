"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

const LabelInputContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const password = formData.get("password") as string;
    const retypepassword = formData.get("retypepassword") as string;

    if (!password || !retypepassword) {
      toast.error("Please enter both password fields");
      setLoading(false);
      return;
    }

    if (password !== retypepassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/signup", userData);
      if (res.status === 200) {
        toast.success("Account Created Successfully!");
        setTimeout(() => router.push("/main"), 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black shadow-2xl">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">Welcome to HACKPORT</h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" name="firstname" placeholder="Tyler" type="text" required />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" name="lastname" placeholder="Durden" type="text" required />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" placeholder="hackport@fc.com" type="email" required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="retypepassword">Retype your password</Label>
          <Input id="retypepassword" name="retypepassword" placeholder="••••••••" type="password" required />
        </LabelInputContainer>

        <button
          className={`relative w-full h-10 font-medium rounded-md shadow-input transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-br from-black to-neutral-600 text-white"
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up →"}
        </button>

        <div className="text-xs text-gray-600 text-center mt-2">
          Already have an account?{" "}
          <Link href="/login">
            <u>
              <span className="text-blue-600">Sign In</span>
            </u>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="relative flex items-center space-x-2 px-4 w-full h-10 font-medium rounded-md shadow-input bg-gray-50 dark:bg-zinc-900"
            type="button"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">GitHub</span>
          </button>

          <button
            className="relative flex items-center space-x-2 px-4 w-full h-10 font-medium rounded-md shadow-input bg-gray-50 dark:bg-zinc-900"
            type="button"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
          </button>
        </div>
      </form>

      {/* ✅ ToastContainer for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
