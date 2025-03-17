"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes countdown

  useEffect(() => {
    if (!email) {
      toast.error("Invalid access to OTP verification page.");
      router.push("/signup");
    }

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("OTP expired! Redirecting to signup...");
          router.push("/signup");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verifyotp", {
        email,
        otp,
      });

      if (res.status === 201) {
        toast.success("OTP verified! Redirecting...");
        setTimeout(() => router.push("/main"), 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Verify OTP</h2>
        <p className="text-center text-gray-600 mt-2">Enter the OTP sent to <b>{email}</b></p>

        <div className="flex justify-center items-center my-4">
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-semibold">
            OTP expires in {formatTime(timeLeft)}
          </span>
        </div>

        <div className="my-6">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest text-black shadow-md"
          />
        </div>

        <button
          onClick={handleVerify}
          className={`w-full h-12 text-white font-semibold rounded-lg transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
