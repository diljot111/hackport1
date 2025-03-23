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

const fetchParticipants = async (hackathonId: string): Promise<Participant[]> => {
  try {
    const response = await fetch(`/api/auth/hackathon/${hackathonId}`);
    if (!response.ok) throw new Error("Failed to fetch participants");
    return await response.json();
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

  useEffect(() => {
    if (!hackathonName) return;

    const getHackathon = async () => {
      setLoading(true);
      const data = await fetchHackathon(decodeURIComponent(hackathonName as string));
      setHackathon(data);
      if (data) {
        const users = await fetchParticipants(data.id);
        setParticipants(users);
      }
      setLoading(false);
    };

    getHackathon();
  }, [hackathonName]);

  if (loading) return <p className="text-white text-lg">Loading hackathon details...</p>;
  if (!hackathon) return <p className="text-red-500 text-lg">Hackathon not found.</p>;

  const handleRegister = () => {
    if (hackathon) {
      router.push(`/main/${encodeURIComponent(hackathon.name)}/register/${hackathon.id}`);
    }
  };

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
      <button
        onClick={handleRegister}
        className="mt-4 ml-4 bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-700 transition"
      >
        Register Now
      </button>

      {/* Participants Table */}
      <h2 className="text-2xl font-bold mt-8">Participants</h2>
      {participants.length > 0 ? (
        <table className="w-full mt-4 border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-gray-500">Name</th>
              <th className="p-2 border border-gray-500">Email</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id} className="border border-gray-600">
                <td className="p-2 border border-gray-500">{participant.name}</td>
                <td className="p-2 border border-gray-500">{participant.email}</td>
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