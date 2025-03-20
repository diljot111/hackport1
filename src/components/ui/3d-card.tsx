"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PopupCard } from "@/component/popupcard";
import { useRouter } from "next/navigation";


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

    const hackathons: Hackathon[] = await response.json();
    return hackathons;
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return [];
  }
};

// 🎯 Countdown Timer Component (Dynamic)
const CountdownTimer = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const expiryTime = endTime + 24 * 60 * 60 * 1000; // 24 hours after end date

    if (expiryTime <= now) return { label: "Expired", timeLeft: null, bgColor: "bg-gray-800" };

    // Show countdown to start if hackathon hasn't started yet
    if (now < startTime) {
      return {
        label: "Starts In",
        timeLeft: startTime - now,
        bgColor: "bg-green-600", // Green background for "Starts In"
      };
    }

    return {
      label: "Ends In",
      timeLeft: endTime - now,
      bgColor: "bg-red-600", // Red background for "Ends In"
    };
  };

  const [timer, setTimer] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  if (!timer.timeLeft) {
    return <p className="text-red-500 font-bold">{timer.label}</p>;
  }

  // Convert timeLeft from milliseconds to days, hours, minutes, and seconds
  const days = Math.floor(timer.timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timer.timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timer.timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timer.timeLeft / 1000) % 60);

   


  return (
    <div className={`text-white p-2 rounded-md text-center text-sm font-semibold ${timer.bgColor}`}>
      <p>{timer.label}</p>
      <p className="text-lg font-bold">
        {days}d : {hours}h : {minutes}m : {seconds}s
      </p>
    </div>
  );
};
// 🎯 3D Card Component with Hover Effect
const CardContainer = ({
  hackathon,
  onClick,
  isExpired,
}: {
  hackathon: Hackathon;
  onClick: () => void;
  isExpired: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="py-10 flex items-center justify-center" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative cursor-pointer transition-transform duration-300 ease-in-out transform-gpu hover:scale-105 hover:rotate-y-6"
        whileHover={{ scale: 1.05, rotateY: 6 }}
        transition={{ duration: 0.3 }}
        onClick={() => router.push(`/main/${encodeURIComponent(hackathon.name)}`)} // Navigate on click
      >
        {/* Expired Banner */}
        {isExpired && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-md">
            Expired
          </div>
        )}

        <motion.div
          initial={{ scale: 0.9, rotateY: -10 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gray-900 shadow-2xl rounded-lg p-6 w-80"
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
          <div className="mt-4">
            <CountdownTimer startDate={hackathon.startDate} endDate={hackathon.endDate} />
          </div>
        </motion.div>
      </motion.div>
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

      const now = new Date().getTime();

      // Filter hackathons that have expired for more than 24 hours
      const validHackathons = data.filter((hackathon) => {
        const endTime = new Date(hackathon.endDate).getTime();
        const expiryTime = endTime + 24 * 60 * 60 * 1000;
        return expiryTime > now; // Keep only if within 24 hours
      });

      setHackathons(validHackathons);
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
        hackathons.map((hackathon) => {
          const endDate = new Date(hackathon.endDate);
          const now = new Date();
          const isExpired = now.getTime() > endDate.getTime();

          return (
            <CardContainer
              key={hackathon.id}
              hackathon={hackathon}
              onClick={() => setSelectedHackathon(hackathon)}
              isExpired={isExpired}
            />
          );
        })
      )}

      {/* Popup Modal */}
      <PopupCard hackathon={selectedHackathon} onClose={() => setSelectedHackathon(null)} />
    </div>
  );
};
