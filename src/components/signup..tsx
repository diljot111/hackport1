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
  const [role, setRole] = useState("participant");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handle profile picture selection & upload to Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true); // Show loading while uploading

    // Preview Image Locally
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "profilePic");

  
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      
      setProfilePic(res.data.secure_url); // 🔹 Save Cloudinary URL
      toast.success("Profile picture uploaded!");
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error.response?.data || error.message);
      toast.error("Failed to upload profile picture. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      step: "send_otp",
      role: role,
      profilePic: profilePic, // 🔹 Send Cloudinary URL instead of Base64
    };

    if (!profilePic) {
      toast.error("Please upload a profile picture before signing up.");
      setLoading(false);
      return;
    }

    if (formData.get("password") !== formData.get("retypepassword")) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/signup", userData);
      if (res.status === 200) {
        toast.success("OTP sent to your email!");
        setTimeout(() => {
          const redirectUrl = userData.role === "participant" ? "/main" : "/hackathon";
          router.push(
            `/verify-otp?email=${userData.email}&role=${userData.role}&firstname=${userData.firstname}&lastname=${userData.lastname}&password=${encodeURIComponent(userData.password)}&redirect=${redirectUrl}`
          );
        }, 2000);
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
        <LabelInputContainer className="mb-4">
          <Label htmlFor="firstname">First name</Label>
          <Input id="firstname" name="firstname" placeholder="Tyler" type="text" required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="lastname">Last name</Label>
          <Input id="lastname" name="lastname" placeholder="Durden" type="text" required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" placeholder="hackport@fc.com" type="email" required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4 text-black">
          <Label className="text-black" htmlFor="role">Select Role</Label>
          <select
            id="role"
            name="role"
            className="w-full p-2 border rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option className="text-black" value="participant">Participant</option>
            <option className="text-black" value="organizer">Organizer</option>
          </select>
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="profilePic" className="text-black">Profile Picture</Label>
          <input 
            type="file" 
            id="profilePic" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="w-full p-2 border rounded-md text-black"
            disabled={uploading}
          />
          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
          {preview && (
            <img src={preview} alt="Profile Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
          )}
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
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-br from-black to-neutral-600 text-white"
          }`}
          type="submit"
          disabled={loading || uploading}
        >
          {loading ? "Signing up..." : "Sign up →"}
        </button>

        <div className="text-xs text-gray-600 text-center mt-2">
          Already have an account? {" "}
          <Link href="/login">
            <u>
              <span className="text-blue-600">Sign In</span>
            </u>
          </Link>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
