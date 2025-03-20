"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Hackathon {
  id: string;
  image: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  prizePool: string;
  organizerId: string;
  link: string;
}

// Fetch hackathon data dynamically
const fetchHackathon = async (name: string): Promise<Hackathon | null> => {
  try {
    const response = await fetch(`/api/auth/hackathon-cards`);
    if (!response.ok) throw new Error("Failed to fetch hackathons");

    const hackathons: Hackathon[] = await response.json();
    return hackathons.find((h) => h.name === name) || null;
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    return null;
  }
};

const HackathonDetail = () => {
  const { hackathonName } = useParams();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hackathonName) return;

    const getHackathon = async () => {
      setLoading(true);
      const data = await fetchHackathon(decodeURIComponent(hackathonName as string));
      setHackathon(data);
      setLoading(false);
    };

    getHackathon();
  }, [hackathonName]);

  if (loading) return <p className="text-white text-lg">Loading hackathon details...</p>;
  if (!hackathon) return <p className="text-red-500 text-lg">Hackathon not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-white mt-15">
      <h1 className="text-3xl font-bold">{hackathon.name}</h1>
      <Image
        src={hackathon.image}
        alt={hackathon.name}
        width={600}
        height={400}
        className="rounded-lg border border-gray-600 shadow-xl my-4"
      />
      <p className="text-gray-400">{hackathon.description}</p>
      <p className="mt-2">📍 Location: <span className="font-bold">{hackathon.location}</span></p>
      <p>🏆 Prize Pool: <span className="font-bold">{hackathon.prizePool}</span></p>
      <p>📅 Start Date: <span className="font-bold">{hackathon.startDate}</span></p>
      <p>📅 End Date: <span className="font-bold">{hackathon.endDate}</span></p>
      <a href={hackathon.link} target="_blank" className="mt-4 inline-block bg-blue-600 px-4 py-2 rounded-md text-white">
        Visit Hackathon
      </a>
    </div>
  );
};

export default HackathonDetail;
