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
  const { hackathonId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userRes = await axios.get("/api/auth/user");
        setUser(userRes.data);

        if (!hackathonId) {
            console.error("hackathonId is missing");
            return;
          }
          const hackRes = await axios.get(`/api/auth/hackathon/${hackathonId}`);
          setHackathon(hackRes.data);
          
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hackathonId]);

  const handleRegister = async () => {
    if (!user || !hackathon) return;

    try {
      await axios.post("/api/auth/hackathon/register", {
        userId: user.id,
        hackathonId: hackathon.id,
      });

      alert("You are successfully registered!");
      router.push("/main"); // Redirect after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Try again!");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user || !hackathon) return <p>Error fetching data.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto text-white mt-15">
      <h1 className="text-3xl font-bold">Register for {hackathon.name}</h1>
      <p className="text-gray-400 mt-2">Confirm your registration below:</p>

      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
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
