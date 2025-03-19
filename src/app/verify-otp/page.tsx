"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch parameters from URL
  const email = searchParams.get("email") || "";
  const roleFromURL = searchParams.get("role") || "";
  const firstname = searchParams.get("firstname") || "";
  const lastname = searchParams.get("lastname") || "";
  const password = searchParams.get("password") || ""; // Ensure password is captured

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes countdown

  useEffect(() => {
    console.log("🔍 Debug: Page Loaded");
    console.log("✅ URL Params:", { email, roleFromURL, firstname, lastname, password });

    if (!email || !password || !roleFromURL || !firstname || !lastname) {
      toast.error("Invalid access to OTP verification page. Missing data.");
      console.error("❌ Missing Data:", { email, roleFromURL, firstname, lastname, password });
      router.push("/signup");
    }

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("OTP expired! Redirecting to signup...");
          console.error("❌ OTP Expired - Redirecting to Signup");
          router.push("/signup");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, password, roleFromURL, firstname, lastname, router]);

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

    const requestData = {
      email,
      otp,
      password,
      firstname,
      lastname,
      role: roleFromURL,
    };

    console.log("🚀 Sending Data to API:", requestData);

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verifyotp", requestData);

      console.log("✅ API Response:", res.data);

      if (res.status === 201) {
        const userRole = res.data.role || roleFromURL; // Use API role or fallback to URL role
        toast.success("OTP verified! Redirecting...");

        console.log("🔄 Redirecting based on role:", userRole);

        // Redirect based on user role
        setTimeout(() => {
          router.push(userRole === "organizer" ? "/hackathon" : "/main");
        }, 2000);
      }
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
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
