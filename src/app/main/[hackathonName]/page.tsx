"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface Participant {
  id: string;
  name: string;
  email: string;
}

// Fetch a specific hackathon by name
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

// Fetch participants of a specific hackathon
const fetchParticipants = async (hackathonId: string): Promise<Participant[]> => {
  try {
    const response = await fetch(`/api/auth/hackathon/${hackathonId}`);
    if (!response.ok) throw new Error("Failed to fetch participants");

    const data = await response.json();
    return data.participants || [];
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
};

const HackathonDetail = () => {
  const { hackathonName } = useParams();
  const router = useRouter();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hackathonName) return;

    const getHackathonData = async () => {
      setLoading(true);
      setError(null);

      try {
        const decodedName = decodeURIComponent(hackathonName as string);
        const hackathonData = await fetchHackathon(decodedName);
        setHackathon(hackathonData);

        if (hackathonData) {
          const participantData = await fetchParticipants(hackathonData.id);
          setParticipants(participantData);
        }
      } catch (err) {
        setError("Failed to load hackathon details.");
      } finally {
        setLoading(false);
      }
    };

    getHackathonData();
  }, [hackathonName]);

  if (loading)
    return <p className="text-white text-lg animate-pulse">Loading hackathon details...</p>;

  if (error || !hackathon)
    return <p className="text-red-500 text-lg">⚠️ {error || "Hackathon not found."}</p>;

  const handleRegister = () => {
    router.push(`/main/${encodeURIComponent(hackathon.name)}/register/${hackathon.id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white mt-12">
      <h1 className="text-3xl font-bold">{hackathon.name}</h1>

      <Image
        src={hackathon.image}
        alt={hackathon.name}
        width={600}
        height={400}
        className="rounded-lg border border-gray-600 shadow-xl my-4"
      />

      <p className="text-gray-400">{hackathon.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <p>📍 <span className="font-bold">{hackathon.location}</span></p>
        <p>🏆 <span className="font-bold">{hackathon.prizePool}</span></p>
        <p>📅 <span className="font-bold">{hackathon.startDate}</span></p>
        <p>📅 <span className="font-bold">{hackathon.endDate}</span></p>
      </div>

      <div className="flex gap-4 mt-6">
        <a
          href={hackathon.link}
          target="_blank"
          className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition"
        >
          Visit Hackathon
        </a>
        <button
          onClick={handleRegister}
          className="bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-700 transition"
        >
          Register Now
        </button>
      </div>

      {/* Participants Table */}
      <h2 className="text-2xl font-bold mt-8">Participants</h2>
      {participants.length > 0 ? (
        <table className="w-full mt-4 border border-gray-600 text-center">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 border border-gray-500">Name</th>
              <th className="p-3 border border-gray-500">Email</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id} className="border border-gray-600 hover:bg-gray-800">
                <td className="p-3 border border-gray-500">{participant.name}</td>
                <td className="p-3 border border-gray-500">{participant.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 mt-4">No participants registered yet.</p>
      )}
    </div>
  );
};

export default HackathonDetail;
