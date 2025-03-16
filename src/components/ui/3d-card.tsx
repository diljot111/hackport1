"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

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

export const HackathonCards = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
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
          <CardContainer key={hackathon.id}>
            <CardBody hackathon={hackathon} />
          </CardContainer>
        ))
      )}
    </div>
  );
};

// 🎯 3D Card Wrapper with Hover Effect
export const CardContainer = ({ children }: { children?: React.ReactNode }) => {
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
      >
        {children}
      </div>
    </div>
  );
};

export const CardBody = ({ hackathon }: { hackathon: Hackathon }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, rotateY: -15 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gray-900 shadow-2xl rounded-lg p-6 w-80 transform"
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
        <p className="text-gray-400">{hackathon.description}</p>
        <p className="mt-2 text-sm text-gray-500">
          📅 {hackathon.startDate} - {hackathon.endDate}
        </p>
        <p className="text-sm text-gray-500">📍 {hackathon.location || "Online"}</p>
        <p className="text-sm text-gray-500">🏆 Prize: {hackathon.prizePool}</p>
        <p className="text-sm text-gray-500">👤 Organizer ID: {hackathon.organizerId}</p>
      </div>
      <div className="mt-4 flex justify-center">
        <a
          href={hackathon.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition"
        >
          Register Now
        </a>
      </div>
    </motion.div>
  );
};
