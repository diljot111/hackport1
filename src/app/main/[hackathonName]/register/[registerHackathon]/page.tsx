"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Hackathon {
  id: string;
  name: string;
  description: string;
}

const RegisterPage = () => {
  const { registerHackathon } = useParams(); // ✅ Get the correct hackathon ID
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userRes = await axios.get("/api/auth/user");
        setUser(userRes.data);

        if (!registerHackathon) {
          setError("Hackathon ID is missing");
          return;
        }

        // Fetch hackathon details
        const hackRes = await axios.get(`/api/auth/hackathon/${registerHackathon}`);
        setHackathon(hackRes.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [registerHackathon]);

  const handleRegister = async () => {
    if (!user || !hackathon) {
      alert("User or hackathon data is missing!");
      console.error("Missing user or hackathon data:", { user, hackathon });
      return;
    }
  
    console.log("Sending registration request:", {
      userId: user.id,
      hackathonId: hackathon.id,
    });
  
    try {
      const response = await axios.post("/api/auth/hackathon/participant", {
        userId: user.id,
        hackathonId: hackathon.id,
      });
  
      console.log("Registration response:", response.data);
  
      alert("You are successfully registered!");
      router.push("/main");
    } catch (err: any) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Registration failed. Try again!");
    }
  };
  
  if (loading) return <p className="text-white text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto text-white mt-15">
      <h1 className="text-3xl font-bold">
        Register for {hackathon?.name}
      </h1>
      <p className="text-gray-400 mt-2">Confirm your registration below:</p>

      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <p><strong>Name:</strong> {user?.firstname} {user?.lastname}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <button
        onClick={handleRegister}
        className="mt-4 bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition"
      >
        Confirm Registration
      </button>
    </div>
  );
};

export default RegisterPage;
