"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", data, { withCredentials: true });

      if (res.status === 200) {
        toast.success("Login Successful!");

        const userRole = res.data.role; // Get role from response

        // ✅ Delay for cookie storage before redirection
        setTimeout(() => {
          if (userRole === "admin") {
            router.replace("/admin/dashboard");
          } else if (userRole === "organizer") {
            router.replace("/organizer/dashboard");
          } else {
            router.replace("/participant/dashboard");
          }
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black shadow-2xl">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Login to HACKPORT
      </h2>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <Label className="mb-2 block" htmlFor="email">
          Email Address
        </Label>
        <Input
          id="email"
          {...register("email", { required: "Email is required" })}
          placeholder="hackport@fc.com"
          type="email"
          className="mb-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        {/* Password Input */}
        <Label className="mb-2 block" htmlFor="password">
          Password
        </Label>
        <Input
          id="password"
          {...register("password", { required: "Password is required" })}
          placeholder="••••••••"
          type="password"
          className="mb-2"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {/* Submit Button */}
        <button
          className="bg-gradient-to-br from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-md transition-all hover:opacity-90 mt-4"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        {/* Sign Up Link */}
        <div className="text-xs text-gray-600 text-center mt-2">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 underline">
            Sign Up
          </Link>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        {/* OAuth Login Buttons */}
        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={() => signIn("github")}
            className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-zinc-900 w-full h-10 rounded-md shadow-md transition-all hover:opacity-90"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Login with GitHub
            </span>
          </button>

          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-zinc-900 w-full h-10 rounded-md shadow-md transition-all hover:opacity-90"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Login with Google
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
