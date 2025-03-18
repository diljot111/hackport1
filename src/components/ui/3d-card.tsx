"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PopupCard } from "@/component/popupcard";

// Define Hackathon Type
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

// Fetch Hackathon Data from API
const fetchHackathons = async (): Promise<Hackathon[]> => {
  try {
    const response = await fetch("/api/auth/hackathon-cards", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return [];
  }
};

// 🎯 3D Card Component with Hover Effect
const CardContainer = ({ hackathon, onClick }: { hackathon: Hackathon; onClick: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <div className="py-10 flex items-center justify-center" style={{ perspective: "1000px" }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="transition-transform duration-200 ease-linear"
        style={{ transformStyle: "preserve-3d" }}
        onClick={onClick} // Handle click to open popup
      >
        <motion.div
          initial={{ scale: 0.9, rotateY: -15 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gray-900 shadow-2xl rounded-lg p-6 w-80 transform cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Image
            src={hackathon.image}
            alt={hackathon.name}
            width={350}
            height={250}
            className="rounded-lg border border-gray-600 shadow-xl h-[250px] object-cover"
          />
          <div className="mt-4 text-white">
            <h3 className="text-xl font-bold">{hackathon.name}</h3>
            <p className="text-gray-400">{hackathon.description.slice(0, 60)}...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 🎯 Main Component - Displays Hackathons & Popup
export const HackathonCards = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchHackathons();
      setHackathons(data);
      setLoading(false);
    };

    getData();
    const interval = setInterval(getData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 py-10">
      {loading ? (
        <p className="text-white text-lg">Loading hackathons...</p>
      ) : hackathons.length === 0 ? (
        <p className="text-gray-400">No hackathons available.</p>
      ) : (
        hackathons.map((hackathon) => (
          <CardContainer key={hackathon.id} hackathon={hackathon} onClick={() => setSelectedHackathon(hackathon)} />
        ))
      )}

      {/* Popup Modal */}
      <PopupCard hackathon={selectedHackathon} onClose={() => setSelectedHackathon(null)} />
    </div>
  );
};
