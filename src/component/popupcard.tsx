"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

// Props for Popup Card
interface PopupProps {
  hackathon: Hackathon | null;
  onClose: () => void;
}

// 🔥 Full-Screen Popup for Hackathon Details
export const PopupCard = ({ hackathon, onClose }: PopupProps) => {
  if (!hackathon) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-lg relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
            onClick={onClose}
          >
            ✖
          </button>

          <Image
            src={hackathon.image}
            alt={hackathon.name}
            width={500}
            height={300}
            className="rounded-lg border border-gray-600 shadow-lg"
          />
          <div className="mt-4 text-white">
            <h2 className="text-2xl font-bold">{hackathon.name}</h2>
            <p className="text-gray-400">{hackathon.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              📅 {hackathon.startDate} - {hackathon.endDate}
            </p>
            <p className="text-sm text-gray-500">📍 {hackathon.location || "Online"}</p>
            <p className="text-sm text-gray-500">🏆 Prize: {hackathon.prizePool}</p>
            <p className="text-sm text-gray-500">👤 Organizer ID: {hackathon.organizerId}</p>
          </div>

          <div className="mt-4 flex justify-center">
            <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition">
              Register Now
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
